import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { topDishes } from "@/lib/dashboard-data"

export function TopDishes() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top performers</CardTitle>
        <CardDescription>Best-selling dishes today</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {topDishes.map((dish, i) => (
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
      </CardContent>
    </Card>
  )
}
