import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { floorTables } from "@/lib/dashboard-data"

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
  const occupied = floorTables.filter((t) => t.status === "occupied").length
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base">Floor status</CardTitle>
          <CardDescription>Main dining room · 12 tables</CardDescription>
        </div>
        <div className="flex flex-col items-end leading-tight">
          <span className="text-lg font-semibold text-foreground">
            {Math.round((occupied / floorTables.length) * 100)}%
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
