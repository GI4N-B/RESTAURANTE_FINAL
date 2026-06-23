'use client';

import { ArrowUpRight, ArrowDownRight, DollarSign, ReceiptText, Users, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const stats = [
  {
    label: "Net revenue",
    value: "$24,310",
    delta: "+12.8%",
    up: true,
    sub: "vs. last Saturday",
    icon: DollarSign,
    spark: [40, 52, 48, 61, 58, 72, 90],
  },
  {
    label: "Orders",
    value: "561",
    delta: "+8.2%",
    up: true,
    sub: "342 dine-in · 219 togo",
    icon: ReceiptText,
    spark: [30, 35, 33, 48, 55, 60, 71],
  },
  {
    label: "Avg. check",
    value: "$43.33",
    delta: "+4.1%",
    up: true,
    sub: "per cover",
    icon: Users,
    spark: [50, 48, 52, 51, 55, 57, 60],
  },
  {
    label: "Avg. ticket time",
    value: "14m 22s",
    delta: "-1m 06s",
    up: true,
    sub: "kitchen to table",
    icon: Clock,
    spark: [70, 64, 66, 58, 55, 50, 44],
  },
]

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const width = 72
  const height = 28
  const step = width / (data.length - 1)
  const points = data
    .map((d, i) => `${i * step},${height - ((d - min) / range) * height}`)
    .join(" ")
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export function StatCards() {
  return (
    <motion.div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          variants={itemVariants}
          className="h-full"
        >
          <Card className="gap-0 p-5 h-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground transition-all duration-200 group-hover:bg-secondary/80">
                  <stat.icon className="size-[18px]" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              </div>
              <Sparkline data={stat.spark} />
            </div>
            <div className="mt-4 flex items-end justify-between">
              <p className="text-3xl font-semibold tracking-tight text-foreground">{stat.value}</p>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold transition-colors duration-200",
                  stat.up
                    ? "bg-primary/15 text-primary"
                    : "bg-destructive/15 text-destructive",
                )}
              >
                {stat.up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                {stat.delta}
              </span>
              <span className="text-xs text-muted-foreground">{stat.sub}</span>
            </div>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}

