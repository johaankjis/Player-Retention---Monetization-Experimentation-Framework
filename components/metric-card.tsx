import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  format?: "number" | "currency" | "percentage" | "time"
}

export function MetricCard({ title, value, change, changeLabel, icon, format = "number" }: MetricCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === "string") return val

    switch (format) {
      case "currency":
        return `$${val.toFixed(2)}`
      case "percentage":
        return `${val.toFixed(1)}%`
      case "time":
        return `${val.toFixed(0)}m`
      default:
        return val.toLocaleString()
    }
  }

  const getTrendIcon = () => {
    if (change === undefined) return null
    if (change > 0) return <TrendingUp className="h-4 w-4" />
    if (change < 0) return <TrendingDown className="h-4 w-4" />
    return <Minus className="h-4 w-4" />
  }

  const getTrendColor = () => {
    if (change === undefined) return ""
    if (change > 0) return "text-success"
    if (change < 0) return "text-destructive"
    return "text-muted-foreground"
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        {change !== undefined && (
          <div className={cn("flex items-center gap-1 text-xs", getTrendColor())}>
            {getTrendIcon()}
            <span>
              {change > 0 ? "+" : ""}
              {change.toFixed(1)}% {changeLabel || "vs baseline"}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
