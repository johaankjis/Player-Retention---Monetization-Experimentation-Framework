"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface KPIChartProps {
  title: string
  description?: string
  data: Array<Record<string, string | number>>
  dataKeys: Array<{ key: string; label: string; color: string }>
  type?: "line" | "area" | "bar"
  xAxisKey?: string
  height?: number
}

export function KPIChart({
  title,
  description,
  data,
  dataKeys,
  type = "line",
  xAxisKey = "date",
  height = 300,
}: KPIChartProps) {
  const ChartComponent = type === "area" ? AreaChart : type === "bar" ? BarChart : LineChart

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <ChartComponent data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey={xAxisKey} stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Legend />
            {type === "line" &&
              dataKeys.map((dk) => (
                <Line key={dk.key} type="monotone" dataKey={dk.key} stroke={dk.color} name={dk.label} strokeWidth={2} />
              ))}
            {type === "area" &&
              dataKeys.map((dk) => (
                <Area
                  key={dk.key}
                  type="monotone"
                  dataKey={dk.key}
                  stroke={dk.color}
                  fill={dk.color}
                  name={dk.label}
                  fillOpacity={0.3}
                />
              ))}
            {type === "bar" &&
              dataKeys.map((dk) => <Bar key={dk.key} dataKey={dk.key} fill={dk.color} name={dk.label} />)}
          </ChartComponent>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
