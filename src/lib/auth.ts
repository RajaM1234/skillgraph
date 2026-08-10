import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

function getJwtSecret(): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return JWT_SECRET;
}

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export function createToken(user: AuthUser): string {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  const options: SignOptions = {
    expiresIn: "7d",
  };

  return jwt.sign(payload, getJwtSecret(), options);
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, getJwtSecret());

    if (typeof decoded !== "object" || decoded === null) {
      return null;
    }

    const payload = decoded as JwtPayload & {
      id?: unknown;
      email?: unknown;
      name?: unknown;
    };

    if (
      typeof payload.id !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string"
    ) {
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
    };
  } catch {
    return null;
  }
}
