import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/auth";
import driver from "@/lib/cognodb";

export async function POST(request: NextRequest) {
  const session = driver.session();

  try {
    const body = await request.json();

    const name = typeof body.name === "string" ? body.name.trim() : "";

    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    const password = typeof body.password === "string" ? body.password : "";

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          error: "Name, email and password are required",
        },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          error: "Password must be at least 6 characters",
        },
        { status: 400 },
      );
    }

    const existing = await session.run(
      `
      MATCH (u:User {email: $email})
      RETURN u
      LIMIT 1
      `,
      { email },
    );

    if (existing.records.length > 0) {
      return NextResponse.json(
        {
          error: "User already exists",
        },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userId = crypto.randomUUID();

    const result = await session.run(
      `
      CREATE (u:User {
        id: $id,
        name: $name,
        email: $email,
        passwordHash: $passwordHash
      })
      RETURN
        u.id AS id,
        u.name AS name,
        u.email AS email
      `,
      {
        id: userId,
        name,
        email,
        passwordHash,
      },
    );

    const record = result.records[0];

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
    console.error("Registration error:", error);

    return NextResponse.json(
      {
        error: "Failed to create account",
      },
      { status: 500 },
    );
  } finally {
    await session.close();
  }
}
