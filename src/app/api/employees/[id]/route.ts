import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("employees")
      .select(`
        *,
        users!inner(id, email, first_name, last_name, avatar),
        departments(id, name),
        positions(id, title)
      `)
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    const { data: history } = await supabase
      .from("career_history")
      .select("*")
      .eq("employee_id", id);

    return NextResponse.json({
      employee: {
        ...data,
        user: data.users,
        department: data.departments,
        position: data.positions,
        careerHistory: history || [],
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
      .from("employees")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ employee: data });
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from("employees")
      .update({
        status: "terminated",
        termination_date: new Date().toISOString().split("T")[0],
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}
