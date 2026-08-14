import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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

    const { data, error } = await supabase
      .from("evaluations")
      .select(`
        *,
        employees!inner(
          *,
          users!inner(id, first_name, last_name, avatar)
        )
      `)
      .eq("employees.organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    const formatted = (data || []).map((row: any) => ({
      ...row,
      employee: {
        ...row.employees,
        user: row.employees.users,
      },
    }));

    return NextResponse.json({ evaluations: formatted });
  } catch (error) {
    console.error("Error fetching evaluations:", error);
    return NextResponse.json(
      { error: "Failed to fetch evaluations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employeeId, evaluatorId, period, scheduledDate, goals } = body;

    const { data, error } = await supabase
      .from("evaluations")
      .insert({
        employee_id: employeeId,
        evaluator_id: evaluatorId,
        period,
        scheduled_date: scheduledDate,
        goals,
        status: "draft",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ evaluation: data });
  } catch (error) {
    console.error("Error creating evaluation:", error);
    return NextResponse.json(
      { error: "Failed to create evaluation" },
      { status: 500 }
    );
  }
}
