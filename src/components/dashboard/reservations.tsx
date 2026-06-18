import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { reservations } from "@/lib/dashboard-data"

export function Reservations() {
  return (
    <Card className="gap-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base">Upcoming reservations</CardTitle>
          <CardDescription>Tonight · 4 of 9 remaining</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          Manage
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col">
        {reservations.map((r, i) => (
          <div
            key={r.name}
            className="flex items-center gap-3 border-border py-3 [&:not(:last-child)]:border-b"
          >
            <Avatar className="size-9">
              <AvatarFallback className="bg-secondary text-xs font-semibold text-foreground">
                {r.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="truncate text-sm font-medium text-foreground">{r.name}</span>
              <span className="truncate text-xs text-muted-foreground">
                Party of {r.party} · {r.note}
              </span>
            </div>
            <span className="shrink-0 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-foreground">
              {r.time}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
