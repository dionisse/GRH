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
      .from("departments")
      .select(`
        *,
        manager:users(id, first_name, last_name)
      `)
      .eq("organization_id", organizationId)
      .order("name");

    if (error) throw new Error(error.message);

    const deptWithCounts = await Promise.all(
      (data || []).map(async (dept: any) => {
        const { count } = await supabase
          .from("employees")
          .select("*", { count: "exact", head: true })
          .eq("department_id", dept.id);

        return {
          ...dept,
          employeeCount: count || 0,
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { organizationId, name, description, managerId, parentId } = body;

    const { data, error } = await supabase
      .from("departments")
      .insert({
        organization_id: organizationId,
        name,
        description,
        manager_id: managerId || null,
        parent_id: parentId || null,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ department: data });
  } catch (error) {
    console.error("Error creating department:", error);
    return NextResponse.json(
      { error: "Failed to create department" },
      { status: 500 }
    );
  }
}
