"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { ArrowLeft, Play, Pause, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react"
import type { ExperimentResult } from "@/lib/types"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default function ExperimentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [data, setData] = useState<ExperimentResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/experiments/${id}`)
      .then((res) => res.json())
      .then((result) => {
        setData(result)
        setLoading(false)
      })
      .catch((error) => {
        console.error("[v0] Error fetching experiment:", error)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-muted-foreground">Loading experiment data...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-muted-foreground">Experiment not found</div>
      </div>
    )
  }

  const { experiment, variantMetrics, timeSeriesData } = data

  // Transform time series data for charts
  const chartData = timeSeriesData.arpdau.reduce(
    (acc, item) => {
      const existing = acc.find((d) => d.date === item.timestamp)
      if (existing) {
        existing[`variant${item.variant}`] = item.value
      } else {
        acc.push({
          date: item.timestamp,
          [`variant${item.variant}`]: item.value,
        })
      }
      return acc
    },
    [] as Array<Record<string, string | number>>,
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">{experiment.name}</h1>
            <StatusBadge status={experiment.status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{experiment.description}</p>
        </div>
        <div className="flex gap-2">
          {experiment.status === "running" && (
            <Button variant="outline" className="gap-2 bg-transparent">
              <Pause className="h-4 w-4" />
              Pause
            </Button>
          )}
          {experiment.status === "paused" && (
            <Button className="gap-2">
              <Play className="h-4 w-4" />
              Resume
            </Button>
          )}
          {experiment.status === "running" && (
            <Button className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Complete
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {variantMetrics.map((metric) => (
          <Card key={metric.variant}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Variant {metric.variant}</span>
                {metric.variant !== "A" && (
                  <span
                    className={`flex items-center gap-1 text-sm font-normal ${
                      metric.uplift > 0 ? "text-success" : "text-destructive"
                    }`}
                  >
                    {metric.uplift > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {metric.uplift > 0 ? "+" : ""}
                    {metric.uplift.toFixed(1)}%
                  </span>
                )}
              </CardTitle>
              <CardDescription>{metric.sampleSize.toLocaleString()} players</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-2xl font-bold">${metric.arpdau.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">ARPDAU</div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="font-medium">{(metric.conversionRate * 100).toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">Conversion</div>
                </div>
                <div>
                  <div className="font-medium">{(metric.retentionDay7 * 100).toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">D7 Retention</div>
                </div>
                <div>
                  <div className="font-medium">{(metric.churnRate * 100).toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">Churn Rate</div>
                </div>
                <div>
                  <div className="font-medium">{metric.engagementMinutes.toFixed(0)}m</div>
                  <div className="text-xs text-muted-foreground">Engagement</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ARPDAU Over Time</CardTitle>
          <CardDescription>Average revenue per daily active user by variant</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              {experiment.variants.map((variant, index) => (
                <Line
                  key={variant}
                  type="monotone"
                  dataKey={`variant${variant}`}
                  stroke={`hsl(var(--chart-${index + 1}))`}
                  name={`Variant ${variant}`}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Experiment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Experiment ID</span>
              <span className="font-mono">{experiment.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Start Date</span>
              <span>{new Date(experiment.startDate).toLocaleDateString()}</span>
            </div>
            {experiment.endDate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">End Date</span>
                <span>{new Date(experiment.endDate).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Sample Size</span>
              <span>{experiment.sampleSize.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span>{new Date(experiment.createdAt).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guardrail Metrics</CardTitle>
            <CardDescription>Ensuring experiments don't harm player experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {variantMetrics.map((metric) => (
              <div key={metric.variant} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Variant {metric.variant} Churn</span>
                <span
                  className={`font-medium ${metric.churnRate < 0.1 ? "text-success" : metric.churnRate < 0.15 ? "text-warning" : "text-destructive"}`}
                >
                  {(metric.churnRate * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
