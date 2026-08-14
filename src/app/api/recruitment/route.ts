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
      .from("job_postings")
      .select(`
        *,
        positions(id, title)
      `)
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    const jobsWithCounts = await Promise.all(
      (data || []).map(async (job: any) => {
        const { count } = await supabase
          .from("candidates")
          .select("*", { count: "exact", head: true })
          .eq("job_posting_id", job.id);

        return {
          ...job,
          position: job.positions,
          candidateCount: count || 0,
        };
      })
    );

    return NextResponse.json({ jobPostings: jobsWithCounts });
  } catch (error) {
    console.error("Error fetching job postings:", error);
    return NextResponse.json(
      { error: "Failed to fetch job postings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      organizationId,
      positionId,
      title,
      description,
      requirements,
      benefits,
      location,
      salaryMin,
      salaryMax,
      contractType,
      closingDate,
      createdBy,
    } = body;

    const { data, error } = await supabase
      .from("job_postings")
      .insert({
        organization_id: organizationId,
        position_id: positionId || null,
        title,
        description,
        requirements,
        benefits,
        location,
        salary_min: salaryMin,
        salary_max: salaryMax,
        contract_type: contractType,
        closing_date: closingDate,
        created_by: createdBy,
        status: "open",
        published_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ jobPosting: data });
  } catch (error) {
    console.error("Error creating job posting:", error);
    return NextResponse.json(
      { error: "Failed to create job posting" },
      { status: 500 }
    );
  }
}
