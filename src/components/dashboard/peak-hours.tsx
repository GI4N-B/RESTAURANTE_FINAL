"use client"

import { Bar, BarChart, XAxis, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { peakHours } from "@/lib/dashboard-data"

const config = {
  orders: { label: "Orders", color: "var(--chart-1)" },
} satisfies ChartConfig

const peak = Math.max(...peakHours.map((p) => p.orders))

export function PeakHours() {
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
          <span className="font-medium text-foreground">7:00 PM – 8:00 PM</span>
        </div>
      </CardContent>
    </Card>
  )
}
