import driver from "@/lib/cognodb";

export async function GET() {
  const session = driver.session();

  try {
    const result = await session.run(
      "RETURN 'CognoDB connected successfully!' AS message",
    );

    return Response.json({
      success: true,
      message: result.records[0].get("message"),
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: "Could not connect to CognoDB",
      },
      { status: 500 },
    );
  } finally {
    await session.close();
  }
}
