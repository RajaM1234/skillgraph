import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import driver from "@/lib/cognodb";
import { verifyToken } from "@/lib/auth";

type SkillMatch = {
  name: string;
  score: number;
  matchType: "direct" | "related";
};

function toNumber(value: unknown): number {
  if (typeof value === "number") {
    return value;
  }

  if (
    value &&
    typeof value === "object" &&
    "toNumber" in value &&
    typeof (value as { toNumber: unknown }).toNumber === "function"
  ) {
    return (value as { toNumber: () => number }).toNumber();
  }

  return Number(value);
}

export async function POST(request: NextRequest) {
  const session = driver.session();

  try {
    // -----------------------------------------
    // 1. CHECK LOGIN
    // -----------------------------------------

    const cookieStore = await cookies();

    const token = cookieStore.get("skillgraph_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          error: "Please login first",
        },
        { status: 401 },
      );
    }

    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid or expired session",
        },
        { status: 401 },
      );
    }

    // -----------------------------------------
    // 2. READ SELECTED SKILLS
    // -----------------------------------------

    const body = await request.json();

    const skills = Array.isArray(body.skills)
      ? body.skills
      : Array.isArray(body.selectedSkills)
        ? body.selectedSkills
        : [];

    if (skills.length === 0) {
      return NextResponse.json(
        {
          error: "Please select at least one skill",
        },
        { status: 400 },
      );
    }

    // -----------------------------------------
    // 3. FIND CAREER RECOMMENDATIONS
    // -----------------------------------------

    const result = await session.run(
      `
      MATCH (job:JobRole)-[:REQUIRES]->(required:Skill)

      WITH
        job,
        collect(DISTINCT required) AS requiredSkills

      UNWIND requiredSkills AS requiredSkill

      OPTIONAL MATCH (userSkill:Skill)
      WHERE userSkill.name IN $skills

      OPTIONAL MATCH path =
        (userSkill)-[:RELATED_TO*1..2]-(requiredSkill)

      WITH
        job,
        requiredSkills,
        requiredSkill,
        max(
          CASE
            WHEN requiredSkill.name IN $skills
              THEN 1.0

            WHEN path IS NOT NULL
              THEN 0.5

            ELSE 0.0
          END
        ) AS skillScore

      WITH
        job,
        requiredSkills,

        collect({
          name: requiredSkill.name,
          score: skillScore
        }) AS skillMatches,

        sum(skillScore) AS totalScore,

        size(requiredSkills) AS requiredCount

      WITH
        job,
        requiredSkills,
        skillMatches,
        totalScore,
        requiredCount,

        CASE
          WHEN requiredCount = 0
            THEN 0
          ELSE
            toInteger(
              (totalScore / toFloat(requiredCount)) * 100
            )
        END AS matchPercentage

      RETURN
        job.name AS role,
        [skill IN requiredSkills | skill.name] AS requiredSkills,
        skillMatches,
        totalScore,
        requiredCount,
        matchPercentage

      ORDER BY matchPercentage DESC, totalScore DESC
      `,
      {
        skills,
      },
    );

    // -----------------------------------------
    // 4. FORMAT RECOMMENDATIONS
    // -----------------------------------------

    const recommendations = result.records.map((record) => {
      const requiredSkills = record.get("requiredSkills") || [];

      const skillMatches = record.get("skillMatches") || [];

      const matchedSkills: SkillMatch[] = [];
      const relatedSkills: SkillMatch[] = [];
      const missingSkills: string[] = [];

      for (const match of skillMatches) {
        const name = match.name;

        const score = toNumber(match.score);

        if (score >= 1) {
          matchedSkills.push({
            name,
            score,
            matchType: "direct",
          });
        } else if (score > 0) {
          relatedSkills.push({
            name,
            score,
            matchType: "related",
          });
        } else {
          missingSkills.push(name);
        }
      }

      return {
        role: record.get("role"),

        matchedSkills: matchedSkills.map((skill) => skill.name),

        relatedSkills: relatedSkills.map((skill) => skill.name),

        missingSkills,

        requiredSkills,

        matchedCount: matchedSkills.length,

        relatedCount: relatedSkills.length,

        requiredCount: toNumber(record.get("requiredCount")),

        matchPercentage: toNumber(record.get("matchPercentage")),
      };
    });

    // -----------------------------------------
    // 5. REMOVE COMPLETELY UNRELATED CAREERS
    // -----------------------------------------

    const filteredRecommendations = recommendations.filter(
      (recommendation) =>
        recommendation.matchedCount > 0 || recommendation.relatedCount > 0,
    );

    // -----------------------------------------
    // 6. SAVE SEARCH HISTORY
    // -----------------------------------------

    const searchId = randomUUID();

    await session.run(
      `
      MATCH (u:User {email: $email})

      CREATE (search:Search {
        id: $searchId,
        skills: $skills,
        createdAt: $createdAt
      })

      CREATE (u)-[:MADE_SEARCH]->(search)

      WITH search

      UNWIND $recommendations AS recommendation

      MATCH (job:JobRole {
        name: recommendation.role
      })

      CREATE (search)-[
        r:RECOMMENDED {
          matchPercentage:
            recommendation.matchPercentage
        }
      ]->(job)

      RETURN search
      `,
      {
        email: user.email,
        searchId,
        skills,
        createdAt: new Date().toISOString(),

        recommendations: filteredRecommendations.map((recommendation) => ({
          role: recommendation.role,
          matchPercentage: recommendation.matchPercentage,
        })),
      },
    );

    // -----------------------------------------
    // 7. RETURN RESULTS TO DASHBOARD
    // -----------------------------------------

    return NextResponse.json({
      success: true,
      recommendations: filteredRecommendations,
    });
  } catch (error) {
    console.error("Recommendation error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate recommendations",
      },
      {
        status: 500,
      },
    );
  } finally {
    await session.close();
  }
}
