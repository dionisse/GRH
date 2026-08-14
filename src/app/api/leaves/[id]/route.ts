import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, approvedBy, rejectionReason } = body;

    const { data: leave, error: leaveError } = await supabase
      .from("leave_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (leaveError || !leave) {
      return NextResponse.json(
        { error: "Leave request not found" },
        { status: 404 }
      );
    }

    const { data: updated, error: updateError } = await supabase
      .from("leave_requests")
      .update({
        status,
        approved_by: approvedBy || null,
        approved_at: status === "approved" ? new Date().toISOString() : null,
        rejection_reason: rejectionReason || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw new Error(updateError.message);

    if (status === "approved") {
      const currentYear = new Date().getFullYear();
      const { data: balance } = await supabase
        .from("leave_balances")
        .select("*")
        .eq("employee_id", leave.employee_id)
        .eq("year", currentYear)
        .eq("type", leave.type)
        .single();

      if (balance) {
        const takenNum = parseFloat(balance.taken) + parseFloat(leave.days);
        const pendingNum = Math.max(0, parseFloat(balance.pending) - parseFloat(leave.days));
        const remainingNum = parseFloat(balance.entitled) - takenNum;

        await supabase
          .from("leave_balances")
          .update({
            taken: takenNum.toString(),
            pending: pendingNum.toString(),
            remaining: remainingNum.toString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", balance.id);
      }
    }

    return NextResponse.json({ leave: updated });
  } catch (error) {
    console.error("Error updating leave:", error);
    return NextResponse.json(
      { error: "Failed to update leave request" },
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
      .from("leave_requests")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cancelling leave:", error);
    return NextResponse.json(
      { error: "Failed to cancel leave request" },
      { status: 500 }
    );
  }
}
