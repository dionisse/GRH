import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { trainings, employeeTrainings, employees, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// Get trainings
export async function GET(request: NextRequest) {
  try {
    if (!db) return NextResponse.json({ trainings: [] });
    const searchParams = request.nextUrl.searchParams;
    const organizationId = searchParams.get("organizationId");

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID required" },
        { status: 400 }
      );
    }

    const result = await db
      .select()
      .from(trainings)
      .where(eq(trainings.organizationId, organizationId))
      .orderBy(desc(trainings.createdAt));

    return NextResponse.json({ trainings: result });
  } catch (error) {
    console.error("Error fetching trainings:", error);
    return NextResponse.json(
      { error: "Failed to fetch trainings" },
      { status: 500 }
    );
  }
}

// Create training
export async function POST(request: NextRequest) {
  try {
    if (!db) return NextResponse.json({ error: "Base de données non configurée" }, { status: 503 });
    const body = await request.json();
    const { organizationId, title, description, provider, duration, cost, category, isExternal } = body;

    const [training] = await db
      .insert(trainings)
      .values({
        organizationId,
        title,
        description,
        provider,
        duration,
        cost,
        category,
        isExternal: isExternal || false,
      })
      .returning();

    return NextResponse.json({ training });
  } catch (error) {
    console.error("Error creating training:", error);
    return NextResponse.json(
      { error: "Failed to create training" },
      { status: 500 }
    );
  }
}
