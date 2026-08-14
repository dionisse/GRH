import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { employees, departments, leaveRequests, evaluations, trainings, jobPostings, candidates } from "@/db/schema";
import { eq, count, and, gte, lte } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    if (!db) return NextResponse.json({ stats: { totalEmployees: 0, totalDepartments: 0, pendingLeaves: 0, activeEvaluations: 0, totalTrainings: 0, openPositions: 0, newCandidates: 0, onLeave: 0 } });
    const searchParams = request.nextUrl.searchParams;
    const organizationId = searchParams.get("organizationId");

    if (!organizationId) {
      return NextResponse.json(
        { error: "Organization ID required" },
        { status: 400 }
      );
    }

    // Total employees
    const [employeeCount] = await db
      .select({ count: count() })
      .from(employees)
      .where(and(
        eq(employees.organizationId, organizationId),
        eq(employees.status, "active")
      ));

    // Total departments
    const [departmentCount] = await db
      .select({ count: count() })
      .from(departments)
      .where(eq(departments.organizationId, organizationId));

    // Pending leave requests
    const [pendingLeaves] = await db
      .select({ count: count() })
      .from(leaveRequests)
      .innerJoin(employees, eq(leaveRequests.employeeId, employees.id))
      .where(and(
        eq(employees.organizationId, organizationId),
        eq(leaveRequests.status, "pending")
      ));

    // Active evaluations
    const [activeEvaluations] = await db
      .select({ count: count() })
      .from(evaluations)
      .innerJoin(employees, eq(evaluations.employeeId, employees.id))
      .where(and(
        eq(employees.organizationId, organizationId),
        eq(evaluations.status, "in_progress")
      ));

    // Active trainings
    const [activeTrainings] = await db
      .select({ count: count() })
      .from(trainings)
      .where(eq(trainings.organizationId, organizationId));

    // Open positions
    const [openPositions] = await db
      .select({ count: count() })
      .from(jobPostings)
      .where(and(
        eq(jobPostings.organizationId, organizationId),
        eq(jobPostings.status, "open")
      ));

    // New candidates this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [newCandidates] = await db
      .select({ count: count() })
      .from(candidates)
      .innerJoin(jobPostings, eq(candidates.jobPostingId, jobPostings.id))
      .where(and(
        eq(jobPostings.organizationId, organizationId),
        gte(candidates.appliedAt, startOfMonth)
      ));

    // Employees on leave
    const today = new Date().toISOString().split("T")[0];
    const [onLeave] = await db
      .select({ count: count() })
      .from(leaveRequests)
      .innerJoin(employees, eq(leaveRequests.employeeId, employees.id))
      .where(and(
        eq(employees.organizationId, organizationId),
        eq(leaveRequests.status, "approved"),
        lte(leaveRequests.startDate, today),
        gte(leaveRequests.endDate, today)
      ));

    return NextResponse.json({
      stats: {
        totalEmployees: employeeCount?.count || 0,
        totalDepartments: departmentCount?.count || 0,
        pendingLeaves: pendingLeaves?.count || 0,
        activeEvaluations: activeEvaluations?.count || 0,
        totalTrainings: activeTrainings?.count || 0,
        openPositions: openPositions?.count || 0,
        newCandidates: newCandidates?.count || 0,
        onLeave: onLeave?.count || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
