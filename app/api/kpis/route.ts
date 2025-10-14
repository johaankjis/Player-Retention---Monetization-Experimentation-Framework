import { NextResponse } from "next/server"
import { mockKPIMetrics, mockExperiments } from "@/lib/mock-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const experimentId = searchParams.get("experimentId")

  if (experimentId) {
    const metrics = mockKPIMetrics.filter((m) => m.experimentId === experimentId)
    return NextResponse.json(metrics)
  }

  // Return overall KPIs across all running experiments
  const runningExperiments = mockExperiments.filter((e) => e.status === "running")
  const recentMetrics = mockKPIMetrics.filter((m) => runningExperiments.some((e) => e.id === m.experimentId))

  return NextResponse.json(recentMetrics)
}
