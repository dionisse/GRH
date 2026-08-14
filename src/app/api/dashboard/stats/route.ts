import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const organizationId = searchParams.get("organizationId");

    let orgId = organizationId;

    if (!orgId) {
      const { data: firstOrg } = await supabase
        .from("organizations")
        .select("id")
        .limit(1)
        .single();
      if (!firstOrg) {
        return NextResponse.json({ stats: { totalEmployees: 0, totalDepartments: 0, pendingLeaves: 0, activeEvaluations: 0, totalTrainings: 0, openPositions: 0, newCandidates: 0, onLeave: 0 } });
      }
      orgId = firstOrg.id;
    }

    const { count: totalEmployees } = await supabase
      .from("employees")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", orgId)
      .eq("status", "active");

    const { count: totalDepartments } = await supabase
      .from("departments")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", orgId);

    const { count: pendingLeaves } = await supabase
      .from("leave_requests")
      .select("*, employees!inner(organization_id)", { count: "exact", head: true })
      .eq("employees.organization_id", orgId)
      .eq("status", "pending");

    const { count: activeEvaluations } = await supabase
      .from("evaluations")
      .select("*, employees!inner(organization_id)", { count: "exact", head: true })
      .eq("employees.organization_id", orgId)
      .eq("status", "in_progress");

    const { count: totalTrainings } = await supabase
      .from("trainings")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", orgId);

    const { count: openPositions } = await supabase
      .from("job_postings")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", orgId)
      .eq("status", "open");

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: newCandidates } = await supabase
      .from("candidates")
      .select("*, job_postings!inner(organization_id)", { count: "exact", head: true })
      .eq("job_postings.organization_id", orgId)
      .gte("applied_at", startOfMonth.toISOString());

    const today = new Date().toISOString().split("T")[0];
    const { count: onLeave } = await supabase
      .from("leave_requests")
      .select("*, employees!inner(organization_id)", { count: "exact", head: true })
      .eq("employees.organization_id", orgId)
      .eq("status", "approved")
      .lte("start_date", today)
      .gte("end_date", today);

    return NextResponse.json({
      stats: {
        totalEmployees: totalEmployees || 0,
        totalDepartments: totalDepartments || 0,
        pendingLeaves: pendingLeaves || 0,
        activeEvaluations: activeEvaluations || 0,
        totalTrainings: totalTrainings || 0,
        openPositions: openPositions || 0,
        newCandidates: newCandidates || 0,
        onLeave: onLeave || 0,
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
