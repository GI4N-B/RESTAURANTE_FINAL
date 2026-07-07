"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useRecentOrders } from "@/features/dashboard/api/dashboard-queries"
import { useSessionStore } from "@/features/auth/store/session-store"

const statusStyles: Record<string, string> = {
  preparing: "bg-primary/15 text-primary",
  served: "bg-secondary text-foreground",
  paid: "bg-secondary text-muted-foreground",
  cancelled: "bg-destructive/15 text-destructive",
}

const statusLabel: Record<string, string> = {
  preparing: "Preparing",
  served: "Served",
  paid: "Paid",
  cancelled: "Cancelled",
}

export function RecentOrders() {
  const { location_ids } = useSessionStore();
  const locationId = location_ids?.[0];
  const { data: orders, isLoading } = useRecentOrders(locationId || '');

  if (isLoading) {
    return (
      <Card className="gap-0 overflow-hidden animate-pulse">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
          <div className="flex flex-col gap-1">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-64 bg-gray-100"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gap-0 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-base">Live orders</CardTitle>
          <CardDescription>Real-time tickets from the floor and kitchen</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          View all
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="pl-6">Order</TableHead>
              <TableHead>Table</TableHead>
              <TableHead className="hidden sm:table-cell">Server</TableHead>
              <TableHead className="hidden md:table-cell">Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden pr-6 text-right lg:table-cell">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id} className="border-border">
                <TableCell className="pl-6 font-medium text-foreground">{order.id}</TableCell>
                <TableCell className="text-foreground">{order.table}</TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">{order.server}</TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">{order.items}</TableCell>
                <TableCell className="font-medium text-foreground">{order.total}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                      statusStyles[order.status],
                    )}
                  >
                    {statusLabel[order.status]}
                  </span>
                </TableCell>
                <TableCell className="hidden pr-6 text-right text-muted-foreground lg:table-cell">
                  {order.time}
                </TableCell>
              </TableRow>
            ))}
            {(!orders || orders.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No recent orders
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
