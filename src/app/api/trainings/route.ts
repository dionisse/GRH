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
      .from("trainings")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return NextResponse.json({ trainings: data || [] });
  } catch (error) {
    console.error("Error fetching trainings:", error);
    return NextResponse.json(
      { error: "Failed to fetch trainings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { organizationId, title, description, provider, duration, cost, category, isExternal } = body;

    const { data, error } = await supabase
      .from("trainings")
      .insert({
        organization_id: organizationId,
        title,
        description,
        provider,
        duration,
        cost,
        category,
        is_external: isExternal || false,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ training: data });
  } catch (error) {
    console.error("Error creating training:", error);
    return NextResponse.json(
      { error: "Failed to create training" },
      { status: 500 }
    );
  }
}
