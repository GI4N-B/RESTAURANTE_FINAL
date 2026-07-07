"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useFloorStatus } from "@/features/dashboard/api/dashboard-queries"
import { useSessionStore } from "@/features/auth/store/session-store"

const statusStyles: Record<string, string> = {
  occupied: "border-primary/40 bg-primary/10 text-primary",
  available: "border-border bg-secondary text-muted-foreground",
  reserved: "border-foreground/20 bg-card text-foreground",
  cleaning: "border-dashed border-border bg-transparent text-muted-foreground",
}

const legend = [
  { label: "Occupied", className: "bg-primary" },
  { label: "Available", className: "bg-secondary border border-border" },
  { label: "Reserved", className: "bg-foreground/40" },
  { label: "Cleaning", className: "bg-transparent border border-dashed border-border" },
]

export function FloorStatus() {
  const { location_ids } = useSessionStore();
  const locationId = location_ids?.[0];
  const { data: tables, isLoading } = useFloorStatus(locationId || '');

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="flex flex-col gap-1">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="flex flex-col items-end leading-tight">
            <div className="h-5 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-20"></div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-2.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
              <div key={i} className="flex aspect-square flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-100 text-center">
                <span className="text-sm font-semibold text-gray-400">{i}</span>
                <span className="text-[10px] opacity-70 text-gray-400">4 top</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4">
            {legend.map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className={cn("size-2.5 rounded-full", l.className)} />
                <span className="text-xs text-muted-foreground">{l.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const floorTables = tables || [];
  const occupied = floorTables.filter((t) => t.status === "occupied").length

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base">Floor status</CardTitle>
          <CardDescription>Main dining room · {floorTables.length} tables</CardDescription>
        </div>
        <div className="flex flex-col items-end leading-tight">
          <span className="text-lg font-semibold text-foreground">
            {floorTables.length > 0 ? Math.round((occupied / floorTables.length) * 100) : 0}%
          </span>
          <span className="text-xs text-muted-foreground">seated</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-2.5">
          {floorTables.map((table) => (
            <div
              key={table.id}
              className={cn(
                "flex aspect-square flex-col items-center justify-center rounded-xl border text-center transition-colors",
                statusStyles[table.status],
              )}
            >
              <span className="text-sm font-semibold">{table.id}</span>
              <span className="text-[10px] opacity-70">{table.seats} top</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4">
          {legend.map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className={cn("size-2.5 rounded-full", l.className)} />
              <span className="text-xs text-muted-foreground">{l.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
