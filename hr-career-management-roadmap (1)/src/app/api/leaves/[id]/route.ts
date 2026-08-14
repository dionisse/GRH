import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leaveRequests, leaveBalances } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// Update leave request (approve/reject)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, approvedBy, rejectionReason } = body;

    const [leave] = await db
      .select()
      .from(leaveRequests)
      .where(eq(leaveRequests.id, id))
      .limit(1);

    if (!leave) {
      return NextResponse.json(
        { error: "Leave request not found" },
        { status: 404 }
      );
    }

    const [updated] = await db
      .update(leaveRequests)
      .set({
        status,
        approvedBy: approvedBy || null,
        approvedAt: status === "approved" ? new Date() : null,
        rejectionReason: rejectionReason || null,
        updatedAt: new Date(),
      })
      .where(eq(leaveRequests.id, id))
      .returning();

    // Update balance if approved
    if (status === "approved") {
      const currentYear = new Date().getFullYear();
      const [balance] = await db
        .select()
        .from(leaveBalances)
        .where(
          and(
            eq(leaveBalances.employeeId, leave.employeeId),
            eq(leaveBalances.year, currentYear),
            eq(leaveBalances.type, leave.type)
          )
        )
        .limit(1);

      if (balance) {
        const takenNum = parseFloat(balance.taken) + parseFloat(leave.days);
        const pendingNum = Math.max(0, parseFloat(balance.pending) - parseFloat(leave.days));
        const remainingNum = parseFloat(balance.entitled) - takenNum;
        
        await db
          .update(leaveBalances)
          .set({
            taken: takenNum.toString(),
            pending: pendingNum.toString(),
            remaining: remainingNum.toString(),
            updatedAt: new Date(),
          })
          .where(eq(leaveBalances.id, balance.id));
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

// Delete/Cancel leave request
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db
      .update(leaveRequests)
      .set({
        status: "cancelled",
        updatedAt: new Date(),
      })
      .where(eq(leaveRequests.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cancelling leave:", error);
    return NextResponse.json(
      { error: "Failed to cancel leave request" },
      { status: 500 }
    );
  }
}
