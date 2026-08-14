import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { evaluations, employees, users, objectives } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// Get evaluations
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const organizationId = searchParams.get("organizationId");
    const employeeId = searchParams.get("employeeId");

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID required" },
        { status: 400 }
      );
    }

    const result = await db
      .select({
        evaluation: evaluations,
        employee: employees,
        user: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          avatar: users.avatar,
        },
      })
      .from(evaluations)
      .innerJoin(employees, eq(evaluations.employeeId, employees.id))
      .innerJoin(users, eq(employees.userId, users.id))
      .where(eq(employees.organizationId, organizationId))
      .orderBy(desc(evaluations.createdAt));

    const formattedResult = result.map((row) => ({
      ...row.evaluation,
      employee: {
        ...row.employee,
        user: row.user,
      },
    }));

    return NextResponse.json({ evaluations: formattedResult });
  } catch (error) {
    console.error("Error fetching evaluations:", error);
    return NextResponse.json(
      { error: "Failed to fetch evaluations" },
      { status: 500 }
    );
  }
}

// Create evaluation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employeeId, evaluatorId, period, scheduledDate, goals } = body;

    const [evaluation] = await db
      .insert(evaluations)
      .values({
        employeeId,
        evaluatorId,
        period,
        scheduledDate,
        goals,
        status: "draft",
      })
      .returning();

    return NextResponse.json({ evaluation });
  } catch (error) {
    console.error("Error creating evaluation:", error);
    return NextResponse.json(
      { error: "Failed to create evaluation" },
      { status: 500 }
    );
  }
}
