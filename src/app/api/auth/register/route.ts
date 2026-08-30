import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createId } from "@/lib/id";
import { getUserByEmail, createUser } from "@/db/users";
import { hashPassword, signSession, SESSION_COOKIE, SESSION_COOKIE_OPTIONS } from "@/lib/auth";

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("A valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const { name, email, password } = parsed.data;

  const existing = getUserByEmail(email);
  if (existing) {
    return NextResponse.json(
      { error: "An account with that email already exists" },
      { status: 409 },
    );
  }

  // Public registration always creates a CUSTOMER account. Admin accounts
  // are provisioned via the seed script — see README "Auth & Admin Access".
  const user = createUser({
    id: createId("user"),
    name,
    email,
    passwordHash: await hashPassword(password),
    role: "CUSTOMER",
  });

  const token = await signSession({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role as "ADMIN" | "CUSTOMER",
  });

  const res = NextResponse.json({
    data: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
  res.cookies.set(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
  return res;
}
