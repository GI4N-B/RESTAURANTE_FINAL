"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useTopDishes } from "@/features/dashboard/api/dashboard-queries"
import { useSessionStore } from "@/features/auth/store/session-store"

export function TopDishes() {
  const { location_ids } = useSessionStore();
  const locationId = location_ids?.[0];
  const { data: dishes, isLoading } = useTopDishes(locationId || '');

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-6 items-center justify-center rounded-md bg-gray-200"></div>
                  <div className="flex flex-col leading-tight">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
              <div className="h-1.5 bg-gray-200 rounded"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top performers</CardTitle>
        <CardDescription>Best-selling dishes today</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {dishes?.map((dish, i) => (
          <div key={dish.name} className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex size-6 items-center justify-center rounded-md bg-secondary text-xs font-semibold text-muted-foreground">
                  {i + 1}
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-medium text-foreground">{dish.name}</span>
                  <span className="text-xs text-muted-foreground">{dish.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{dish.sold}</span>
                <span
                  className={cn(
                    "text-xs font-medium",
                    dish.trend.startsWith("-") ? "text-destructive" : "text-primary",
                  )}
                >
                  {dish.trend}
                </span>
              </div>
            </div>
            <Progress value={dish.share} className="h-1.5" />
          </div>
        ))}
        {(!dishes || dishes.length === 0) && (
          <div className="text-center py-8 text-muted-foreground">
            No top dishes data available
          </div>
        )}
      </CardContent>
    </Card>
  )
}
