import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, organizations } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

// Login
export async function POST(request: NextRequest) {
  try {
    if (!db) return NextResponse.json({ error: "Base de données non configurée" }, { status: 503 });
    const body = await request.json();
    const { email, password, action } = body;

    if (action === "register") {
      // Registration
      const { firstName, lastName, organizationName } = body;

      // Check if user exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser.length > 0) {
        return NextResponse.json(
          { error: "Un compte avec cet email existe déjà" },
          { status: 400 }
        );
      }

      // Create organization
      const [org] = await db
        .insert(organizations)
        .values({
          name: organizationName || `${firstName} ${lastName} Org`,
        })
        .returning();

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const [user] = await db
        .insert(users)
        .values({
          organizationId: org.id,
          email,
          passwordHash,
          firstName,
          lastName,
          role: "admin",
        })
        .returning();

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          organizationId: user.organizationId,
        },
      });
    } else {
      // Login
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!user) {
        return NextResponse.json(
          { error: "Email ou mot de passe incorrect" },
          { status: 401 }
        );
      }

      const validPassword = await bcrypt.compare(password, user.passwordHash);
      if (!validPassword) {
        return NextResponse.json(
          { error: "Email ou mot de passe incorrect" },
          { status: 401 }
        );
      }

      // Update last login
      await db
        .update(users)
        .set({ lastLogin: new Date() })
        .where(eq(users.id, user.id));

      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          organizationId: user.organizationId,
        },
      });
    }
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
