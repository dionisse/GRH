import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { employees, users, departments, positions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";

// Get all employees
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
          category: positions.category,
        },
      })
      .from(employees)
      .innerJoin(users, eq(employees.userId, users.id))
      .leftJoin(departments, eq(employees.departmentId, departments.id))
      .leftJoin(positions, eq(employees.positionId, positions.id))
      .where(eq(employees.organizationId, organizationId))
      .orderBy(desc(employees.createdAt));

    const formattedResult = result.map((row) => ({
      ...row.employee,
      user: row.user,
      department: row.department,
      position: row.position,
    }));

    return NextResponse.json({ employees: formattedResult });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

// Create employee
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      organizationId,
      email,
      firstName,
      lastName,
      departmentId,
      positionId,
      contractType,
      professionalCategory,
      hireDate,
      baseSalary,
      transportAllowance,
      phone,
      address,
      city,
      birthDate,
      birthPlace,
      gender,
      maritalStatus,
      numberOfChildren,
      cnssNumber,
      cniNumber,
    } = body;

    // Generate matricule
    const employeeCount = await db
      .select()
      .from(employees)
      .where(eq(employees.organizationId, organizationId));
    const matricule = `MAT${String(employeeCount.length + 1).padStart(5, "0")}`;

    // Create user account
    const passwordHash = await bcrypt.hash("Bienvenue123!", 10);
    const [user] = await db
      .insert(users)
      .values({
        organizationId,
        email,
        passwordHash,
        firstName,
        lastName,
        role: "employee",
      })
      .returning();

    // Calculate probation end date (3 months for regular employees, 6 months for managers)
    const hireDateObj = new Date(hireDate);
    const probationMonths = professionalCategory?.startsWith("C") ? 6 : 3;
    const probationEndDate = new Date(hireDateObj);
    probationEndDate.setMonth(probationEndDate.getMonth() + probationMonths);

    // Create employee record
    const [employee] = await db
      .insert(employees)
      .values({
        userId: user.id,
        organizationId,
        matricule,
        departmentId: departmentId || null,
        positionId: positionId || null,
        contractType,
        professionalCategory: professionalCategory || null,
        hireDate,
        contractStartDate: hireDate,
        probationEndDate: probationEndDate.toISOString().split("T")[0],
        baseSalary: baseSalary || null,
        transportAllowance: transportAllowance || "0",
        phone,
        address,
        city,
        birthDate,
        birthPlace,
        gender,
        maritalStatus,
        numberOfChildren: numberOfChildren || 0,
        cnssNumber,
        cniNumber,
        status: "active",
        nationality: "Béninoise",
      })
      .returning();

    return NextResponse.json({ employee, user });
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    );
  }
}
