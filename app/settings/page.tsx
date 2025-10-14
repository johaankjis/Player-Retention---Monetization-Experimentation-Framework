import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SettingsIcon, Database, Zap, Shield } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Configure your experimentation framework</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle>Data Warehouse</CardTitle>
            </div>
            <CardDescription>Configure your SQL database connection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="db-host">Database Host</Label>
              <Input id="db-host" placeholder="postgres.example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="db-name">Database Name</Label>
              <Input id="db-name" placeholder="experimentation" />
            </div>
            <Button className="w-full">Test Connection</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle>Experiment Engine</CardTitle>
            </div>
            <CardDescription>Python-based A/B testing configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sample-size">Default Sample Size</Label>
              <Input id="sample-size" type="number" placeholder="10000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confidence">Confidence Level</Label>
              <Input id="confidence" placeholder="95%" />
            </div>
            <Button className="w-full">Save Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Guardrail Thresholds</CardTitle>
            </div>
            <CardDescription>Set limits to protect player experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="max-churn">Max Churn Rate (%)</Label>
              <Input id="max-churn" type="number" placeholder="10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min-engagement">Min Engagement (minutes)</Label>
              <Input id="min-engagement" type="number" placeholder="30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min-retention">Min D7 Retention (%)</Label>
              <Input id="min-retention" type="number" placeholder="35" />
            </div>
            <Button className="w-full">Update Guardrails</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-primary" />
              <CardTitle>Integration</CardTitle>
            </div>
            <CardDescription>Connect external tools and services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sheets-url">Google Sheets URL</Label>
              <Input id="sheets-url" placeholder="https://docs.google.com/spreadsheets/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bi-tool">BI Dashboard Tool</Label>
              <Input id="bi-tool" placeholder="Power BI / Tableau" />
            </div>
            <Button className="w-full">Connect Services</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
