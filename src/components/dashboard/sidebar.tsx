"use client"

import { useState } from "react"
import {
  LayoutGrid,
  ReceiptText,
  UtensilsCrossed,
  CalendarClock,
  Users,
  LineChart,
  Boxes,
  Settings,
  LifeBuoy,
  ChefHat,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const nav = [
  { label: "Overview", icon: LayoutGrid, active: true },
  { label: "Orders", icon: ReceiptText, badge: "24" },
  { label: "Menu", icon: UtensilsCrossed },
  { label: "Reservations", icon: CalendarClock, badge: "9" },
  { label: "Floor", icon: Boxes },
  { label: "Staff", icon: Users },
  { label: "Analytics", icon: LineChart },
]

const secondary = [
  { label: "Settings", icon: Settings },
  { label: "Support", icon: LifeBuoy },
]

export function Sidebar() {
  const [active, setActive] = useState("Overview")

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ChefHat className="size-4" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-tight text-foreground">Mise</span>
          <span className="text-[11px] text-muted-foreground">Lumière · SoHo</span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Operations
        </p>
        {nav.map((item) => {
          const isActive = active === item.label
          return (
            <button
              key={item.label}
              onClick={() => setActive(item.label)}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "size-[18px] shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}

        <div className="my-3 h-px bg-border" />

        {secondary.map((item) => (
          <button
            key={item.label}
            onClick={() => setActive(item.label)}
            className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-foreground"
          >
            <item.icon className="size-[18px] shrink-0 text-muted-foreground group-hover:text-foreground" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <Avatar className="size-8">
            <AvatarFallback className="bg-secondary text-xs font-semibold text-foreground">
              JR
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-sm font-medium text-foreground">Jordan Reyes</span>
            <span className="truncate text-xs text-muted-foreground">General Manager</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
