"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useReservations } from "@/features/dashboard/api/dashboard-queries"
import { useSessionStore } from "@/features/auth/store/session-store"

export function Reservations() {
  const { location_ids } = useSessionStore();
  const locationId = location_ids?.[0];
  const { data: reservationsData, isLoading } = useReservations(locationId || '');

  if (isLoading) {
    return (
      <Card className="gap-0 animate-pulse">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </CardHeader>
        <CardContent className="flex flex-col">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center gap-3 border-border py-3 border-b">
              <div className="size-9 rounded-full bg-gray-200"></div>
              <div className="flex min-w-0 flex-1 flex-col leading-tight">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-5 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
      </CardContent>
    </Card>
    );
  }

  const reservations = reservationsData || [];

  return (
    <Card className="gap-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base">Upcoming reservations</CardTitle>
          <CardDescription>Tonight · {reservations.length} reservations</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          Manage
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col">
        {reservations.map((r, i) => (
          <div
            key={r.id || r.name}
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
        {reservations.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No upcoming reservations
          </div>
        )}
      </CardContent>
    </Card>
  )
}
