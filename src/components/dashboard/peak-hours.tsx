"use client"

import { Bar, BarChart, XAxis, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { usePeakHours } from "@/features/dashboard/api/dashboard-queries"
import { useSessionStore } from "@/features/auth/store/session-store"

const config = {
  orders: { label: "Orders", color: "var(--chart-1)" },
} satisfies ChartConfig

export function PeakHours() {
  const { location_ids } = useSessionStore();
  const locationId = location_ids?.[0];
  const { data: peakHoursData, isLoading } = usePeakHours(locationId || '');

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-[260px] w-full bg-gray-100 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  const peakHours = peakHoursData || [];
  const peak = Math.max(...peakHours.map((p) => p.orders), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Peak hours</CardTitle>
        <CardDescription>Orders by hour · today</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[260px] w-full">
          <BarChart data={peakHours} margin={{ top: 8 }}>
            <XAxis dataKey="hour" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="orders" radius={[6, 6, 0, 0]} maxBarSize={28}>
              {peakHours.map((entry) => (
                <Cell
                  key={entry.hour}
                  fill={entry.orders === peak ? "var(--color-orders)" : "var(--secondary)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
        <div className="mt-2 flex items-center justify-between border-t border-border pt-4 text-sm">
          <span className="text-muted-foreground">Busiest window</span>
          <span className="font-medium text-foreground">
            {peakHours.length > 0 
              ? `${peakHours.reduce((max, h) => h.orders > max.orders ? h : max).hour}:00 – ${peakHours.reduce((max, h) => h.orders > max.orders ? h : max).hour + 1}:00`
              : 'No data'}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
