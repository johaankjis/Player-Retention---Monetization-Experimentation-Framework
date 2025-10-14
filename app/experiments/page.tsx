import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { Plus, TrendingUp, Clock, Users } from "lucide-react"
import { mockExperiments } from "@/lib/mock-data"

export default function ExperimentsPage() {
  const runningCount = mockExperiments.filter((e) => e.status === "running").length
  const completedCount = mockExperiments.filter((e) => e.status === "completed").length
  const totalSampleSize = mockExperiments
    .filter((e) => e.status === "running")
    .reduce((sum, e) => sum + e.sampleSize, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Experiments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and monitor your A/B tests for pricing and bundling strategies
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Experiment
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running Experiments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{runningCount}</div>
            <p className="text-xs text-muted-foreground">Active A/B tests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">Finished experiments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sample Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSampleSize.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Players in active tests</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {mockExperiments.map((experiment) => (
          <Link key={experiment.id} href={`/experiments/${experiment.id}`}>
            <Card className="transition-colors hover:bg-card/80">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{experiment.name}</CardTitle>
                      <StatusBadge status={experiment.status} />
                    </div>
                    <CardDescription>{experiment.description}</CardDescription>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <p>Started {new Date(experiment.startDate).toLocaleDateString()}</p>
                    {experiment.endDate && <p>Ended {new Date(experiment.endDate).toLocaleDateString()}</p>}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-muted-foreground">Variants:</span>{" "}
                    <span className="font-medium">{experiment.variants.join(", ")}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sample Size:</span>{" "}
                    <span className="font-medium">{experiment.sampleSize.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ID:</span>{" "}
                    <span className="font-mono text-xs">{experiment.id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
