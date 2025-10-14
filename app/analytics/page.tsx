"use client"

import { useEffect, useState } from "react"
import { MetricCard } from "@/components/metric-card"
import { KPIChart } from "@/components/kpi-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, Users, TrendingUp, Clock, Target, AlertTriangle } from "lucide-react"
import type { KPIMetrics, Experiment } from "@/lib/types"

export default function AnalyticsPage() {
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [selectedExperiment, setSelectedExperiment] = useState<string>("all")
  const [kpiData, setKpiData] = useState<KPIMetrics[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetch("/api/experiments").then((res) => res.json()), fetch("/api/kpis").then((res) => res.json())])
      .then(([exps, kpis]) => {
        setExperiments(exps)
        setKpiData(kpis)
        setLoading(false)
      })
      .catch((error) => {
        console.error("[v0] Error fetching analytics data:", error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-muted-foreground">Loading analytics...</div>
      </div>
    )
  }

  // Filter data based on selected experiment
  const filteredData =
    selectedExperiment === "all" ? kpiData : kpiData.filter((k) => k.experimentId === selectedExperiment)

  // Calculate aggregate metrics
  const avgArpdau = filteredData.reduce((sum, k) => sum + k.arpdau, 0) / filteredData.length || 0
  const avgChurn = filteredData.reduce((sum, k) => sum + k.churnRate, 0) / filteredData.length || 0
  const avgConversion = filteredData.reduce((sum, k) => sum + k.conversionRate, 0) / filteredData.length || 0
  const avgEngagement = filteredData.reduce((sum, k) => sum + k.engagementMinutes, 0) / filteredData.length || 0
  const avgRetention = filteredData.reduce((sum, k) => sum + k.retentionDay7, 0) / filteredData.length || 0
  const totalSampleSize = filteredData.reduce((sum, k) => sum + k.sampleSize, 0)

  // Prepare time series data for charts
  const timeSeriesData = filteredData.reduce(
    (acc, item) => {
      const existing = acc.find((d) => d.date === item.date)
      if (existing) {
        existing[`arpdau_${item.variant}`] = item.arpdau
        existing[`churn_${item.variant}`] = item.churnRate * 100
        existing[`conversion_${item.variant}`] = item.conversionRate * 100
        existing[`engagement_${item.variant}`] = item.engagementMinutes
      } else {
        acc.push({
          date: item.date,
          [`arpdau_${item.variant}`]: item.arpdau,
          [`churn_${item.variant}`]: item.churnRate * 100,
          [`conversion_${item.variant}`]: item.conversionRate * 100,
          [`engagement_${item.variant}`]: item.engagementMinutes,
        })
      }
      return acc
    },
    [] as Array<Record<string, string | number>>,
  )

  // Get unique variants for the selected data
  const variants = Array.from(new Set(filteredData.map((k) => k.variant)))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time KPI tracking and experiment performance metrics
          </p>
        </div>
        <Select value={selectedExperiment} onValueChange={setSelectedExperiment}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select experiment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Experiments</SelectItem>
            {experiments
              .filter((e) => e.status === "running" || e.status === "completed")
              .map((exp) => (
                <SelectItem key={exp.id} value={exp.id}>
                  {exp.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Average ARPDAU"
          value={avgArpdau}
          format="currency"
          change={15.2}
          changeLabel="vs last period"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Conversion Rate"
          value={avgConversion * 100}
          format="percentage"
          change={8.5}
          changeLabel="vs baseline"
          icon={<Target className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Day 7 Retention"
          value={avgRetention * 100}
          format="percentage"
          change={5.3}
          changeLabel="vs baseline"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Churn Rate"
          value={avgChurn * 100}
          format="percentage"
          change={-3.2}
          changeLabel="vs baseline"
          icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Avg Engagement"
          value={avgEngagement}
          format="time"
          change={12.1}
          changeLabel="vs baseline"
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Total Sample Size"
          value={totalSampleSize}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <KPIChart
          title="ARPDAU Trends"
          description="Average revenue per daily active user over time"
          data={timeSeriesData}
          dataKeys={variants.map((v, i) => ({
            key: `arpdau_${v}`,
            label: `Variant ${v}`,
            color: `hsl(var(--chart-${i + 1}))`,
          }))}
          type="line"
        />
        <KPIChart
          title="Conversion Rate"
          description="Percentage of players making purchases"
          data={timeSeriesData}
          dataKeys={variants.map((v, i) => ({
            key: `conversion_${v}`,
            label: `Variant ${v}`,
            color: `hsl(var(--chart-${i + 1}))`,
          }))}
          type="area"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <KPIChart
          title="Engagement Minutes"
          description="Average daily playtime per user"
          data={timeSeriesData}
          dataKeys={variants.map((v, i) => ({
            key: `engagement_${v}`,
            label: `Variant ${v}`,
            color: `hsl(var(--chart-${i + 1}))`,
          }))}
          type="bar"
        />
        <KPIChart
          title="Churn Rate (Guardrail)"
          description="Percentage of players who stopped playing"
          data={timeSeriesData}
          dataKeys={variants.map((v, i) => ({
            key: `churn_${v}`,
            label: `Variant ${v}`,
            color: `hsl(var(--chart-${i + 1}))`,
          }))}
          type="line"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Guardrail Status</CardTitle>
          <CardDescription>Ensuring experiments don't negatively impact player experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <div className="font-medium">Churn Rate</div>
                <div className="text-sm text-muted-foreground">Must remain below 10%</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{(avgChurn * 100).toFixed(1)}%</div>
                <div
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    avgChurn < 0.1 ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                  }`}
                >
                  {avgChurn < 0.1 ? "Healthy" : "Warning"}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <div className="font-medium">Engagement</div>
                <div className="text-sm text-muted-foreground">Must remain above 30 minutes</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{avgEngagement.toFixed(0)}m</div>
                <div
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    avgEngagement > 30 ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                  }`}
                >
                  {avgEngagement > 30 ? "Healthy" : "Warning"}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <div className="font-medium">Day 7 Retention</div>
                <div className="text-sm text-muted-foreground">Must remain above 35%</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">{(avgRetention * 100).toFixed(1)}%</div>
                <div
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    avgRetention > 0.35 ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                  }`}
                >
                  {avgRetention > 0.35 ? "Healthy" : "Warning"}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
