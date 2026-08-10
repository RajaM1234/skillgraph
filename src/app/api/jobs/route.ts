import driver from "@/lib/cognodb";

export async function GET() {
  const session = driver.session();

  try {
    const result = await session.run(`
      MATCH (j:JobRole)
      RETURN j.name AS name
      ORDER BY j.name
    `);

    const jobs = result.records.map((record) => record.get("name"));

    return Response.json({
      success: true,
      jobs,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: "Failed to fetch job roles",
      },
      { status: 500 },
    );
  } finally {
    await session.close();
  }
}
