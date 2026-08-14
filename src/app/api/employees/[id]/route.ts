import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { employees, users, departments, positions, careerHistory } from "@/db/schema";
import { eq } from "drizzle-orm";

// Get single employee
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await db
      .select({
        employee: employees,
        user: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          avatar: users.avatar,
        },
        department: {
          id: departments.id,
          name: departments.name,
        },
        position: {
          id: positions.id,
          title: positions.title,
        },
      })
      .from(employees)
      .innerJoin(users, eq(employees.userId, users.id))
      .leftJoin(departments, eq(employees.departmentId, departments.id))
      .leftJoin(positions, eq(employees.positionId, positions.id))
      .where(eq(employees.id, id))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Get career history
    const history = await db
      .select()
      .from(careerHistory)
      .where(eq(careerHistory.employeeId, id));

    return NextResponse.json({
      employee: {
        ...result[0].employee,
        user: result[0].user,
        department: result[0].department,
        position: result[0].position,
        careerHistory: history,
      },
    });
  } catch (error) {
    console.error("Error fetching employee:", error);
    return NextResponse.json(
      { error: "Failed to fetch employee" },
      { status: 500 }
    );
  }
}

// Update employee
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const [updated] = await db
      .update(employees)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(employees.id, id))
      .returning();

    return NextResponse.json({ employee: updated });
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }
}

// Delete employee
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Soft delete - set status to terminated
    await db
      .update(employees)
      .set({
        status: "terminated",
        terminationDate: new Date().toISOString().split("T")[0],
        updatedAt: new Date(),
      })
      .where(eq(employees.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}
