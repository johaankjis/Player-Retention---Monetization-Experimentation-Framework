"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Download, Search } from "lucide-react"
import type { Cohort, Experiment } from "@/lib/types"

export default function CohortsPage() {
  const [experiments, setExperiments] = useState<Experiment[]>([])
  const [selectedExperiment, setSelectedExperiment] = useState<string>("")
  const [cohorts, setCohorts] = useState<Cohort[]>([])
  const [filteredCohorts, setFilteredCohorts] = useState<Cohort[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [variantFilter, setVariantFilter] = useState<string>("all")

  useEffect(() => {
    fetch("/api/experiments")
      .then((res) => res.json())
      .then((exps) => {
        setExperiments(exps)
        const runningExp = exps.find((e: Experiment) => e.status === "running")
        if (runningExp) {
          setSelectedExperiment(runningExp.id)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error("[v0] Error fetching experiments:", error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (selectedExperiment) {
      fetch(`/api/cohorts/${selectedExperiment}`)
        .then((res) => res.json())
        .then((data) => {
          setCohorts(data)
          setFilteredCohorts(data)
        })
        .catch((error) => {
          console.error("[v0] Error fetching cohorts:", error)
        })
    }
  }, [selectedExperiment])

  useEffect(() => {
    let filtered = cohorts

    if (variantFilter !== "all") {
      filtered = filtered.filter((c) => c.variant === variantFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter((c) => c.playerId.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    setFilteredCohorts(filtered)
  }, [searchTerm, variantFilter, cohorts])

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-muted-foreground">Loading cohorts...</div>
      </div>
    )
  }

  const selectedExp = experiments.find((e) => e.id === selectedExperiment)

  // Calculate cohort statistics
  const totalCohorts = filteredCohorts.length
  const converters = filteredCohorts.filter((c) => c.conversionStatus).length
  const retainedDay7 = filteredCohorts.filter((c) => c.retentionDay7).length
  const avgSpend = filteredCohorts.reduce((sum, c) => sum + c.totalSpend, 0) / totalCohorts || 0
  const avgEngagement = filteredCohorts.reduce((sum, c) => sum + c.playtimeMinutes, 0) / totalCohorts || 0

  // Group by variant for comparison
  const variantStats = selectedExp?.variants.map((variant) => {
    const variantCohorts = cohorts.filter((c) => c.variant === variant)
    const variantConverters = variantCohorts.filter((c) => c.conversionStatus).length
    const variantRetained = variantCohorts.filter((c) => c.retentionDay7).length
    const variantAvgSpend = variantCohorts.reduce((sum, c) => sum + c.totalSpend, 0) / variantCohorts.length || 0
    const variantAvgEngagement =
      variantCohorts.reduce((sum, c) => sum + c.playtimeMinutes, 0) / variantCohorts.length || 0

    return {
      variant,
      count: variantCohorts.length,
      conversionRate: variantConverters / variantCohorts.length,
      retentionRate: variantRetained / variantCohorts.length,
      avgSpend: variantAvgSpend,
      avgEngagement: variantAvgEngagement,
    }
  })

  const handleExport = () => {
    const csv = [
      ["Player ID", "Variant", "Assigned At", "D1 Retention", "D7 Retention", "Converted", "Total Spend", "Sessions"],
      ...filteredCohorts.map((c) => [
        c.playerId,
        c.variant,
        c.assignedAt,
        c.retentionDay1 ? "Yes" : "No",
        c.retentionDay7 ? "Yes" : "No",
        c.conversionStatus ? "Yes" : "No",
        c.totalSpend.toFixed(2),
        c.sessionCount,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `cohorts-${selectedExperiment}-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Cohort Analysis</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            SQL-based retention and conversion tracking for experiment cohorts
          </p>
        </div>
        <Button onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      <div className="flex gap-4">
        <Select value={selectedExperiment} onValueChange={setSelectedExperiment}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select experiment" />
          </SelectTrigger>
          <SelectContent>
            {experiments.map((exp) => (
              <SelectItem key={exp.id} value={exp.id}>
                {exp.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={variantFilter} onValueChange={setVariantFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter variant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Variants</SelectItem>
            {selectedExp?.variants.map((variant) => (
              <SelectItem key={variant} value={variant}>
                Variant {variant}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by player ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCohorts.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Converters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{converters.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{((converters / totalCohorts) * 100).toFixed(1)}% rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">D7 Retained</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{retainedDay7.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{((retainedDay7 / totalCohorts) * 100).toFixed(1)}% rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgSpend.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per player</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgEngagement.toFixed(0)}m</div>
            <p className="text-xs text-muted-foreground">Playtime</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Variant Comparison</CardTitle>
          <CardDescription>Performance metrics by experiment variant</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {variantStats?.map((stat) => (
              <div key={stat.variant} className="rounded-lg border border-border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">Variant {stat.variant}</h3>
                    <Badge variant="outline">{stat.count.toLocaleString()} players</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">${stat.avgSpend.toFixed(2)} avg spend</div>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Conversion Rate</div>
                    <div className="mt-1 text-lg font-semibold">{(stat.conversionRate * 100).toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">D7 Retention</div>
                    <div className="mt-1 text-lg font-semibold">{(stat.retentionRate * 100).toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Avg Engagement</div>
                    <div className="mt-1 text-lg font-semibold">{stat.avgEngagement.toFixed(0)}m</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Total Revenue</div>
                    <div className="mt-1 text-lg font-semibold">${(stat.avgSpend * stat.count).toFixed(0)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cohort Data</CardTitle>
          <CardDescription>
            Showing {filteredCohorts.length} of {cohorts.length} players
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left font-medium text-muted-foreground">Player ID</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Variant</th>
                  <th className="pb-3 text-left font-medium text-muted-foreground">Assigned</th>
                  <th className="pb-3 text-center font-medium text-muted-foreground">D1</th>
                  <th className="pb-3 text-center font-medium text-muted-foreground">D7</th>
                  <th className="pb-3 text-center font-medium text-muted-foreground">Converted</th>
                  <th className="pb-3 text-right font-medium text-muted-foreground">Spend</th>
                  <th className="pb-3 text-right font-medium text-muted-foreground">Sessions</th>
                  <th className="pb-3 text-right font-medium text-muted-foreground">Playtime</th>
                </tr>
              </thead>
              <tbody>
                {filteredCohorts.slice(0, 50).map((cohort) => (
                  <tr key={cohort.id} className="border-b border-border/50">
                    <td className="py-3 font-mono text-xs">{cohort.playerId}</td>
                    <td className="py-3">
                      <Badge variant="outline">Variant {cohort.variant}</Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">{new Date(cohort.assignedAt).toLocaleDateString()}</td>
                    <td className="py-3 text-center">
                      {cohort.retentionDay1 ? (
                        <span className="text-success">✓</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-3 text-center">
                      {cohort.retentionDay7 ? (
                        <span className="text-success">✓</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-3 text-center">
                      {cohort.conversionStatus ? (
                        <span className="text-success">✓</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-3 text-right font-medium">${cohort.totalSpend.toFixed(2)}</td>
                    <td className="py-3 text-right">{cohort.sessionCount}</td>
                    <td className="py-3 text-right">{cohort.playtimeMinutes}m</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCohorts.length > 50 && (
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Showing first 50 of {filteredCohorts.length} players. Export to CSV for full data.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
