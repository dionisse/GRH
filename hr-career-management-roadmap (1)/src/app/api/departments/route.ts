import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { departments, employees, users } from "@/db/schema";
import { eq, count, desc } from "drizzle-orm";

// Get all departments
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const organizationId = searchParams.get("organizationId");

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID required" },
        { status: 400 }
      );
    }

    const result = await db
      .select({
        department: departments,
        manager: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
        },
      })
      .from(departments)
      .leftJoin(users, eq(departments.managerId, users.id))
      .where(eq(departments.organizationId, organizationId))
      .orderBy(departments.name);

    // Get employee count for each department
    const deptWithCounts = await Promise.all(
      result.map(async (row) => {
        const [countResult] = await db
          .select({ count: count() })
          .from(employees)
          .where(eq(employees.departmentId, row.department.id));

        return {
          ...row.department,
          manager: row.manager,
          employeeCount: countResult?.count || 0,
        };
      })
    );

    return NextResponse.json({ departments: deptWithCounts });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}

// Create department
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { organizationId, name, description, managerId, parentId } = body;

    const [department] = await db
      .insert(departments)
      .values({
        organizationId,
        name,
        description,
        managerId: managerId || null,
        parentId: parentId || null,
      })
      .returning();

    return NextResponse.json({ department });
  } catch (error) {
    console.error("Error creating department:", error);
    return NextResponse.json(
      { error: "Failed to create department" },
      { status: 500 }
    );
  }
}
