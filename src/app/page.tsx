import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { StatCards } from "@/components/dashboard/stat-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { PeakHours } from "@/components/dashboard/peak-hours"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { TopDishes } from "@/components/dashboard/top-dishes"
import { FloorStatus } from "@/components/dashboard/floor-status"
import { Reservations } from "@/components/dashboard/reservations"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Page() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
            {/* Page header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div className="flex flex-col gap-1.5">
                <p className="text-sm text-muted-foreground">Saturday, June 13 · Dinner service</p>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
                  Good evening, Jordan
                </h1>
              </div>
              <Tabs defaultValue="today">
                <TabsList className="bg-card">
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <StatCards />

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <RevenueChart />
              </div>
              <PeakHours />
            </div>

            {/* Orders + side column */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="flex flex-col gap-6 lg:col-span-2">
                <RecentOrders />
                <FloorStatus />
              </div>
              <div className="flex flex-col gap-6">
                <TopDishes />
                <Reservations />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
