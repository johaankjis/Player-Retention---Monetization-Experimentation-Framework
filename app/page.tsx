import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Clock, Target, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Experimentation framework for testing pricing and bundling strategies
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cycle Time Reduction</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">25%</div>
            <p className="text-xs text-muted-foreground">Faster experiment completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ARPDAU Uplift</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">+15%</div>
            <p className="text-xs text-muted-foreground">From winning variants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Decision Speed</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">40%</div>
            <p className="text-xs text-muted-foreground">Faster with dashboards</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Experiments</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Running A/B tests</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Core Features</CardTitle>
            <CardDescription>Experimentation framework capabilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
              <div>
                <div className="font-medium">A/B Testing Framework</div>
                <div className="text-sm text-muted-foreground">
                  Python-based engine for randomized player assignment with multi-arm support
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
              <div>
                <div className="font-medium">Cohort Analysis</div>
                <div className="text-sm text-muted-foreground">
                  SQL-based retention and conversion tracking with collaborative analysis
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
              <div>
                <div className="font-medium">KPI Dashboards</div>
                <div className="text-sm text-muted-foreground">
                  Real-time guardrail metrics for churn, engagement, ARPDAU, and conversion
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Success Criteria</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cycle Time</span>
              <span className="font-medium text-success">≥25% faster ✓</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ARPDAU Uplift</span>
              <span className="font-medium text-success">≥15% increase ✓</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Decision Speed</span>
              <span className="font-medium text-success">≥40% faster ✓</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Guardrail Protection</span>
              <span className="font-medium text-success">No churn increase ✓</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
