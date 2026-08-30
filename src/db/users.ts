import { eq } from "drizzle-orm";
import { db } from "./client";
import { users } from "./schema";

export function getUserByEmail(email: string) {
  return db.select().from(users).where(eq(users.email, email.toLowerCase())).get();
}

export function getUserById(id: string) {
  return db.select().from(users).where(eq(users.id, id)).get();
}

export function createUser(input: {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "ADMIN" | "CUSTOMER";
}) {
  return db
    .insert(users)
    .values({ ...input, email: input.email.toLowerCase() })
    .returning()
    .get();
}
