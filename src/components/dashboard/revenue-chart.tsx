"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { revenueSeries } from "@/lib/dashboard-data"

const config = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  covers: { label: "Covers", color: "var(--chart-3)" },
} satisfies ChartConfig

export function RevenueChart() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base">Revenue this week</CardTitle>
          <CardDescription>Net sales and covers across the last 7 service days</CardDescription>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-semibold tracking-tight text-foreground">$107,270</span>
          <span className="text-xs font-medium text-primary">+14.2% WoW</span>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[260px] w-full">
          <AreaChart data={revenueSeries} margin={{ left: 4, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-revenue)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-revenue)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              className="text-xs"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={44}
              tickFormatter={(v) => `$${v / 1000}k`}
              className="text-xs"
            />
            <ChartTooltip
              cursor={{ stroke: "var(--border)" }}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="revenue"
              type="monotone"
              stroke="var(--color-revenue)"
              strokeWidth={2.5}
              fill="url(#fillRevenue)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
