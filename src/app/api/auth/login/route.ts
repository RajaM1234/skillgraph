import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/auth";
import driver from "@/lib/cognodb";

export async function POST(request: NextRequest) {
  const session = driver.session();

  try {
    const body = await request.json();

    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password are required",
        },
        { status: 400 },
      );
    }

    const result = await session.run(
      `
      MATCH (u:User {email: $email})
      RETURN
        u.id AS id,
        u.name AS name,
        u.email AS email,
        u.passwordHash AS passwordHash
      LIMIT 1
      `,
      { email },
    );

    if (result.records.length === 0) {
      return NextResponse.json(
        {
          error: "Invalid email or password",
        },
        { status: 401 },
      );
    }

    const record = result.records[0];

    const passwordHash = record.get("passwordHash");

    const validPassword = await bcrypt.compare(password, passwordHash);

    if (!validPassword) {
      return NextResponse.json(
        {
          error: "Invalid email or password",
        },
        { status: 401 },
      );
    }

    const user = {
      id: record.get("id"),
      name: record.get("name"),
      email: record.get("email"),
    };

    const token = createToken(user);

    const response = NextResponse.json({
      success: true,
      user,
    });

    response.cookies.set("skillgraph_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        error: "Failed to login",
      },
      { status: 500 },
    );
  } finally {
    await session.close();
  }
}
