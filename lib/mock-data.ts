import type { Experiment, Cohort, KPIMetrics, ExperimentVariant } from "./types"

// Generate mock experiments
export const mockExperiments: Experiment[] = [
  {
    id: "exp-001",
    name: "Premium Bundle Pricing Test",
    description: "Testing $9.99 vs $14.99 vs $19.99 pricing for premium bundle",
    status: "running",
    variants: ["A", "B", "C"],
    startDate: "2025-01-01",
    endDate: null,
    sampleSize: 15000,
    createdAt: "2024-12-28",
    updatedAt: "2025-01-01",
  },
  {
    id: "exp-002",
    name: "Starter Pack Bundle Size",
    description: "Testing different bundle sizes: 100 coins vs 250 coins vs 500 coins",
    status: "running",
    variants: ["A", "B", "C"],
    startDate: "2025-01-05",
    endDate: null,
    sampleSize: 12000,
    createdAt: "2025-01-02",
    updatedAt: "2025-01-05",
  },
  {
    id: "exp-003",
    name: "Daily Deal Frequency",
    description: "Testing daily deals shown once vs twice vs three times per day",
    status: "completed",
    variants: ["A", "B", "C"],
    startDate: "2024-12-15",
    endDate: "2025-01-10",
    sampleSize: 20000,
    createdAt: "2024-12-10",
    updatedAt: "2025-01-10",
  },
  {
    id: "exp-004",
    name: "VIP Subscription Tiers",
    description: "Testing 2-tier vs 3-tier vs 4-tier VIP subscription model",
    status: "paused",
    variants: ["A", "B", "C"],
    startDate: "2024-12-20",
    endDate: null,
    sampleSize: 8000,
    createdAt: "2024-12-15",
    updatedAt: "2025-01-08",
  },
  {
    id: "exp-005",
    name: "First Purchase Discount",
    description: "Testing 20% vs 30% vs 50% discount on first purchase",
    status: "draft",
    variants: ["A", "B", "C"],
    startDate: "2025-01-20",
    endDate: null,
    sampleSize: 10000,
    createdAt: "2025-01-12",
    updatedAt: "2025-01-12",
  },
]

// Generate mock cohort data
function generateMockCohorts(experimentId: string, variants: ExperimentVariant[], sampleSize: number): Cohort[] {
  const cohorts: Cohort[] = []
  const playersPerVariant = Math.floor(sampleSize / variants.length)

  variants.forEach((variant, variantIndex) => {
    for (let i = 0; i < playersPerVariant; i++) {
      const baseConversion = 0.05 + variantIndex * 0.02 // Variant B and C perform better
      const baseRetention = 0.4 + variantIndex * 0.05

      cohorts.push({
        id: `cohort-${experimentId}-${variant}-${i}`,
        experimentId,
        variant,
        playerId: `player-${experimentId}-${variant}-${i}`,
        assignedAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
        retentionDay1: Math.random() > 0.3,
        retentionDay7: Math.random() > 1 - baseRetention,
        retentionDay30: Math.random() > 0.7,
        conversionStatus: Math.random() < baseConversion,
        totalSpend: Math.random() < baseConversion ? Math.random() * 50 + 5 : 0,
        sessionCount: Math.floor(Math.random() * 20) + 1,
        playtimeMinutes: Math.floor(Math.random() * 300) + 30,
      })
    }
  })

  return cohorts
}

// Generate all cohorts for all experiments
export const mockCohorts: Cohort[] = mockExperiments.flatMap((exp) =>
  generateMockCohorts(exp.id, exp.variants, exp.sampleSize),
)

// Generate mock KPI metrics with time series data
function generateMockKPIMetrics(experimentId: string, variants: ExperimentVariant[]): KPIMetrics[] {
  const metrics: KPIMetrics[] = []
  const days = 14 // Last 14 days of data

  for (let day = 0; day < days; day++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - day))
    const dateStr = date.toISOString().split("T")[0]

    variants.forEach((variant, index) => {
      // Variant B and C perform better
      const variantMultiplier = 1 + index * 0.15
      const randomVariation = 0.9 + Math.random() * 0.2

      metrics.push({
        experimentId,
        variant,
        date: dateStr,
        arpdau: 0.45 * variantMultiplier * randomVariation,
        churnRate: (0.08 / variantMultiplier) * randomVariation,
        engagementMinutes: 45 * variantMultiplier * randomVariation,
        conversionRate: 0.05 * variantMultiplier * randomVariation,
        retentionDay7: 0.42 * variantMultiplier * randomVariation,
        sampleSize: Math.floor(5000 / variants.length),
      })
    })
  }

  return metrics
}

// Generate all KPI metrics
export const mockKPIMetrics: KPIMetrics[] = mockExperiments
  .filter((exp) => exp.status === "running" || exp.status === "completed")
  .flatMap((exp) => generateMockKPIMetrics(exp.id, exp.variants))

// Helper function to calculate aggregate metrics
export function calculateAggregateMetrics(experimentId: string, variant: ExperimentVariant) {
  const cohorts = mockCohorts.filter((c) => c.experimentId === experimentId && c.variant === variant)
  const metrics = mockKPIMetrics.filter((m) => m.experimentId === experimentId && m.variant === variant)

  if (cohorts.length === 0 || metrics.length === 0) {
    return null
  }

  const totalSpend = cohorts.reduce((sum, c) => sum + c.totalSpend, 0)
  const conversions = cohorts.filter((c) => c.conversionStatus).length
  const retainedDay7 = cohorts.filter((c) => c.retentionDay7).length
  const avgEngagement = cohorts.reduce((sum, c) => sum + c.playtimeMinutes, 0) / cohorts.length

  return {
    arpdau: totalSpend / cohorts.length,
    conversionRate: conversions / cohorts.length,
    retentionDay7: retainedDay7 / cohorts.length,
    churnRate: 1 - retainedDay7 / cohorts.length,
    engagementMinutes: avgEngagement,
    sampleSize: cohorts.length,
  }
}
