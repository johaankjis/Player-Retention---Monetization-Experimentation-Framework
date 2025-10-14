import { NextResponse } from "next/server"
import { mockCohorts } from "@/lib/mock-data"

export async function GET(request: Request, { params }: { params: Promise<{ experimentId: string }> }) {
  const { experimentId } = await params
  const cohorts = mockCohorts.filter((c) => c.experimentId === experimentId)

  return NextResponse.json(cohorts)
}
