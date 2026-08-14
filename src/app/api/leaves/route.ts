import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leaveRequests, employees, users, leaveBalances } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

// Get leave requests
export async function GET(request: NextRequest) {
  try {
    if (!db) return NextResponse.json({ leaves: [] });
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
        leave: leaveRequests,
        employee: {
          id: employees.id,
          matricule: employees.matricule,
        },
        user: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          avatar: users.avatar,
        },
      })
      .from(leaveRequests)
      .innerJoin(employees, eq(leaveRequests.employeeId, employees.id))
      .innerJoin(users, eq(employees.userId, users.id))
      .where(eq(employees.organizationId, organizationId))
      .orderBy(desc(leaveRequests.createdAt));

    const formattedResult = result.map((row) => ({
      ...row.leave,
      employee: {
        ...row.employee,
        user: row.user,
      },
    }));

    return NextResponse.json({ leaves: formattedResult });
  } catch (error) {
    console.error("Error fetching leaves:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaves" },
      { status: 500 }
    );
  }
}

// Create leave request
export async function POST(request: NextRequest) {
  try {
    if (!db) return NextResponse.json({ error: "Base de données non configurée" }, { status: 503 });
    const body = await request.json();
    const { employeeId, type, familyEvent, startDate, endDate, days, reason, medicalCertificate } = body;

    const [leave] = await db
      .insert(leaveRequests)
      .values({
        employeeId,
        type,
        familyEvent: familyEvent || null,
        startDate,
        endDate,
        days,
        reason,
        medicalCertificate: medicalCertificate || false,
        status: "pending",
      })
      .returning();

    // Update pending balance
    const currentYear = new Date().getFullYear();
    await db
      .update(leaveBalances)
      .set({
        pending: days,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(leaveBalances.employeeId, employeeId),
          eq(leaveBalances.year, currentYear),
          eq(leaveBalances.type, type)
        )
      );

    return NextResponse.json({ leave });
  } catch (error) {
    console.error("Error creating leave:", error);
    return NextResponse.json(
      { error: "Failed to create leave request" },
      { status: 500 }
    );
  }
}
