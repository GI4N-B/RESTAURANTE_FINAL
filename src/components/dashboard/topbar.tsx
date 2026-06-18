"use client"

import { Search, Bell, Plus, ChevronDown, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-6">
      <div className="flex flex-1 items-center gap-3">
        <div className="lg:hidden">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            M
          </div>
        </div>
        <div className="relative hidden max-w-sm flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search orders, tables, dishes…"
            className="h-9 border-border bg-card pl-9 text-sm"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:block">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground sm:flex">
          <Circle className="size-2 fill-primary text-primary" />
          Service · Open
        </span>

        <Button variant="outline" size="sm" className="hidden h-9 gap-1.5 border-border bg-card sm:flex">
          Today
          <ChevronDown data-icon="inline-end" />
        </Button>

        <Button variant="outline" size="icon" className="relative size-9 border-border bg-card">
          <Bell />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
          <span className="sr-only">Notifications</span>
        </Button>

        <Button size="sm" className="h-9 gap-1.5 font-semibold">
          <Plus data-icon="inline-start" />
          <span className="hidden sm:inline">New order</span>
        </Button>

        <Avatar className="size-9 md:hidden">
          <AvatarFallback className="bg-secondary text-xs font-semibold">JR</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
