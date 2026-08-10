import driver from "@/lib/cognodb";

type Props = {
  params: Promise<{
    role: string;
  }>;
};

export async function GET(request: Request, { params }: Props) {
  const { role } = await params;

  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (s:Skill)-[:REQUIRED_FOR]->(j:JobRole)
      WHERE toLower(j.name) = toLower($role)
      RETURN s.name AS name
      ORDER BY s.name
      `,
      { role },
    );

    const skills = result.records.map((record) => record.get("name"));

    return Response.json({
      success: true,
      role,
      skills,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: "Failed to fetch required skills",
      },
      { status: 500 },
    );
  } finally {
    await session.close();
  }
}
