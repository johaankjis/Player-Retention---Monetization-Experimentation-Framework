export type ExperimentStatus = "draft" | "running" | "paused" | "completed"
export type ExperimentVariant = "A" | "B" | "C" | "D"

export interface Experiment {
  id: string
  name: string
  description: string
  status: ExperimentStatus
  variants: ExperimentVariant[]
  startDate: string
  endDate: string | null
  sampleSize: number
  createdAt: string
  updatedAt: string
}

export interface Cohort {
  id: string
  experimentId: string
  variant: ExperimentVariant
  playerId: string
  assignedAt: string
  retentionDay1: boolean
  retentionDay7: boolean
  retentionDay30: boolean
  conversionStatus: boolean
  totalSpend: number
  sessionCount: number
  playtimeMinutes: number
}

export interface KPIMetrics {
  experimentId: string
  variant: ExperimentVariant
  date: string
  arpdau: number
  churnRate: number
  engagementMinutes: number
  conversionRate: number
  retentionDay7: number
  sampleSize: number
}

export interface TimeSeriesData {
  timestamp: string
  value: number
  variant?: ExperimentVariant
}

export interface ExperimentResult {
  experiment: Experiment
  variantMetrics: {
    variant: ExperimentVariant
    arpdau: number
    churnRate: number
    conversionRate: number
    retentionDay7: number
    engagementMinutes: number
    sampleSize: number
    uplift: number
  }[]
  timeSeriesData: {
    arpdau: TimeSeriesData[]
    churn: TimeSeriesData[]
    engagement: TimeSeriesData[]
    conversion: TimeSeriesData[]
  }
}
