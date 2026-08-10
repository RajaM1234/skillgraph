import driver from "@/lib/cognodb";

export async function GET() {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (s:Skill)
      RETURN s.name AS name
      ORDER BY s.name
    `);

    const skills = result.records.map((record) => record.get("name"));

    return Response.json({
      success: true,
      skills,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: "Failed to fetch skills",
      },
      { status: 500 },
    );
  } finally {
    await session.close();
  }
}
