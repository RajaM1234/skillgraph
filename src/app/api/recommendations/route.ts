import { NextRequest, NextResponse } from "next/server";
import driver from "@/lib/cognodb";

type SkillMatch = {
  name: string;
  score: number;
  matchType: "direct" | "related";
};

export async function POST(request: NextRequest) {
  const session = driver.session();

  try {
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
        { status: 400 }
      );
    }

    /*
     * Find every career and compare its required skills
     * against the user's selected skills.
     *
     * Direct skill match:
     *   weight = 1.0
     *
     * Related skill match:
     *   weight = 0.5
     *
     * This means having the exact skill is more valuable
     * than simply having a related skill.
     */

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
        $skills AS selectedSkills,
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
        selectedSkills,

        collect({
          name: requiredSkill.name,
          score: skillScore
        }) AS skillMatches,

        sum(skillScore) AS totalScore,

        size(requiredSkills) AS requiredCount

      WITH
        job,
        requiredSkills,
        selectedSkills,
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
      }
    );

    const recommendations = result.records.map((record) => {
      const requiredSkills =
        record.get("requiredSkills") || [];

      const skillMatches =
        record.get("skillMatches") || [];

      const matchedSkills: SkillMatch[] = [];

      const relatedSkills: SkillMatch[] = [];

      const missingSkills: string[] = [];

      for (const match of skillMatches) {
        const name = match.name;

        const score =
          typeof match.score === "number"
            ? match.score
            : match.score.toNumber();

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

      const matchedCountValue =
        matchedSkills.length;

      const requiredCountValue =
        typeof record.get("requiredCount") === "number"
          ? record.get("requiredCount")
          : record.get("requiredCount").toNumber();

      const matchPercentageValue =
        typeof record.get("matchPercentage") === "number"
          ? record.get("matchPercentage")
          : record.get("matchPercentage").toNumber();

      return {
        role: record.get("role"),

        matchedSkills: matchedSkills.map(
          (skill) => skill.name
        ),

        relatedSkills: relatedSkills.map(
          (skill) => skill.name
        ),

        missingSkills,

        requiredSkills,

        matchedCount: matchedCountValue,

        relatedCount: relatedSkills.length,

        requiredCount: requiredCountValue,

        matchPercentage: matchPercentageValue,
      };
    });

    /*
     * Remove careers with absolutely no connection
     * to the user's selected skills.
     */
    const filteredRecommendations =
      recommendations.filter(
        (recommendation) =>
          recommendation.matchedCount > 0 ||
          recommendation.relatedCount > 0
      );

    return NextResponse.json({
      recommendations: filteredRecommendations,
    });
  } catch (error) {
    console.error(
      "Recommendation error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to generate recommendations",
      },
      {
        status: 500,
      }
    );
  } finally {
    await session.close();
  }
}