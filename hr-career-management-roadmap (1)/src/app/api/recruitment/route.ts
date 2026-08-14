import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { jobPostings, candidates, positions } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";

// Get job postings
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

    const result = await db
      .select({
        jobPosting: jobPostings,
        position: {
          id: positions.id,
          title: positions.title,
        },
      })
      .from(jobPostings)
      .leftJoin(positions, eq(jobPostings.positionId, positions.id))
      .where(eq(jobPostings.organizationId, organizationId))
      .orderBy(desc(jobPostings.createdAt));

    // Get candidate count for each job posting
    const jobsWithCounts = await Promise.all(
      result.map(async (row) => {
        const [countResult] = await db
          .select({ count: count() })
          .from(candidates)
          .where(eq(candidates.jobPostingId, row.jobPosting.id));

        return {
          ...row.jobPosting,
          position: row.position,
          candidateCount: countResult?.count || 0,
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

// Create job posting
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

    const [jobPosting] = await db
      .insert(jobPostings)
      .values({
        organizationId,
        positionId: positionId || null,
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
        status: "open",
        publishedAt: new Date(),
      })
      .returning();

    return NextResponse.json({ jobPosting });
  } catch (error) {
    console.error("Error creating job posting:", error);
    return NextResponse.json(
      { error: "Failed to create job posting" },
      { status: 500 }
    );
  }
}
