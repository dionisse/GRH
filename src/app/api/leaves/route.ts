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
      .from("leave_requests")
      .select(`
        *,
        employees!inner(
          id, matricule,
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

    return NextResponse.json({ leaves: formatted });
  } catch (error) {
    console.error("Error fetching leaves:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaves" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employeeId, type, familyEvent, startDate, endDate, days, reason, medicalCertificate } = body;

    const { data, error } = await supabase
      .from("leave_requests")
      .insert({
        employee_id: employeeId,
        type,
        family_event: familyEvent || null,
        start_date: startDate,
        end_date: endDate,
        days,
        reason,
        medical_certificate: medicalCertificate || false,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    const currentYear = new Date().getFullYear();
    await supabase
      .from("leave_balances")
      .update({
        pending: days,
        updated_at: new Date().toISOString(),
      })
      .eq("employee_id", employeeId)
      .eq("year", currentYear)
      .eq("type", type);

    return NextResponse.json({ leave: data });
  } catch (error) {
    console.error("Error creating leave:", error);
    return NextResponse.json(
      { error: "Failed to create leave request" },
      { status: 500 }
    );
  }
}
