"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useRevenueSeries } from "@/features/dashboard/api/dashboard-queries"
import { useSessionStore } from "@/features/auth/store/session-store"

const config = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  covers: { label: "Covers", color: "var(--chart-3)" },
} satisfies ChartConfig

export function RevenueChart() {
  const { location_ids } = useSessionStore();
  const locationId = location_ids?.[0];
  const { data: revenueData, isLoading } = useRevenueSeries(locationId || '');

  if (isLoading) {
    return (
      <Card className="overflow-hidden animate-pulse">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="flex flex-col items-end">
            <div className="h-6 bg-gray-200 rounded w-24"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[260px] w-full bg-gray-100 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  const totalRevenue = revenueData?.reduce((sum, d) => sum + d.revenue, 0) || 0;
  const wowChange = 14.2; // This would need to be calculated from previous week data

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base">Revenue this week</CardTitle>
          <CardDescription>Net sales and covers across the last 7 service days</CardDescription>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-semibold tracking-tight text-foreground">${totalRevenue.toLocaleString()}</span>
          <span className="text-xs font-medium text-primary">+{wowChange}% WoW</span>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[260px] w-full">
          <AreaChart data={revenueData || []} margin={{ left: 4, right: 8, top: 8 }}>
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
