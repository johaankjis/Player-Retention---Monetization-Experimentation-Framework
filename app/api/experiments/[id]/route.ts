import { NextResponse } from "next/server"
import { mockExperiments, mockKPIMetrics, calculateAggregateMetrics } from "@/lib/mock-data"
import type { ExperimentResult } from "@/lib/types"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const experiment = mockExperiments.find((exp) => exp.id === id)

  if (!experiment) {
    return NextResponse.json({ error: "Experiment not found" }, { status: 404 })
  }

  // Calculate aggregate metrics for each variant
  const variantMetrics = experiment.variants.map((variant) => {
    const metrics = calculateAggregateMetrics(experiment.id, variant)
    const baselineMetrics = calculateAggregateMetrics(experiment.id, "A")

    const uplift =
      baselineMetrics && metrics ? ((metrics.arpdau - baselineMetrics.arpdau) / baselineMetrics.arpdau) * 100 : 0

    return {
      variant,
      ...metrics!,
      uplift,
    }
  })

  // Get time series data
  const experimentMetrics = mockKPIMetrics.filter((m) => m.experimentId === experiment.id)

  const timeSeriesData = {
    arpdau: experimentMetrics.map((m) => ({
      timestamp: m.date,
      value: m.arpdau,
      variant: m.variant,
    })),
    churn: experimentMetrics.map((m) => ({
      timestamp: m.date,
      value: m.churnRate,
      variant: m.variant,
    })),
    engagement: experimentMetrics.map((m) => ({
      timestamp: m.date,
      value: m.engagementMinutes,
      variant: m.variant,
    })),
    conversion: experimentMetrics.map((m) => ({
      timestamp: m.date,
      value: m.conversionRate,
      variant: m.variant,
    })),
  }

  const result: ExperimentResult = {
    experiment,
    variantMetrics,
    timeSeriesData,
  }

  return NextResponse.json(result)
}
