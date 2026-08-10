import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import driver from "@/lib/cognodb";

export async function GET() {
  const session = driver.session();

  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("skillgraph_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id?: string;
      email?: string;
      name?: string;
    };

    if (!decoded.email) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const result = await session.run(
      `
      MATCH (u:User {email: $email})
            -[:MADE_SEARCH]->(search:Search)

      OPTIONAL MATCH
        (search)-[r:RECOMMENDED]->(job:JobRole)

      RETURN
        search.id AS id,
        search.skills AS skills,
        search.createdAt AS createdAt,

        collect({
          role: job.name,
          matchPercentage: r.matchPercentage
        }) AS recommendations

      ORDER BY search.createdAt DESC
      `,
      {
        email: decoded.email,
      },
    );

    const history = result.records.map((record) => {
      const createdAt = record.get("createdAt");

      const recommendations = record.get("recommendations") || [];

      return {
        id: record.get("id"),

        skills: record.get("skills") || [],

        createdAt: createdAt?.toString?.() || String(createdAt),

        recommendations: recommendations
          .filter((item: { role?: string }) => item.role)
          .map(
            (item: {
              role: string;
              matchPercentage:
                | number
                | {
                    toNumber: () => number;
                  };
            }) => ({
              role: item.role,

              matchPercentage:
                typeof item.matchPercentage === "number"
                  ? item.matchPercentage
                  : item.matchPercentage.toNumber(),
            }),
          ),
      };
    });

    return NextResponse.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("History error:", error);

    return NextResponse.json(
      {
        error: "Failed to load recommendation history",
      },
      {
        status: 500,
      },
    );
  } finally {
    await session.close();
  }
}
