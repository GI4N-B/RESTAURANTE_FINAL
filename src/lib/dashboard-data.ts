export const revenueSeries = [
  { day: "Mon", revenue: 8420, covers: 214 },
  { day: "Tue", revenue: 9210, covers: 241 },
  { day: "Wed", revenue: 11240, covers: 288 },
  { day: "Thu", revenue: 13880, covers: 331 },
  { day: "Fri", revenue: 21450, covers: 502 },
  { day: "Sat", revenue: 24310, covers: 561 },
  { day: "Sun", revenue: 18760, covers: 438 },
]

export const peakHours = [
  { hour: "11a", orders: 12 },
  { hour: "12p", orders: 48 },
  { hour: "1p", orders: 61 },
  { hour: "2p", orders: 34 },
  { hour: "5p", orders: 28 },
  { hour: "6p", orders: 72 },
  { hour: "7p", orders: 94 },
  { hour: "8p", orders: 88 },
  { hour: "9p", orders: 52 },
  { hour: "10p", orders: 21 },
]

export type OrderStatus = "preparing" | "served" | "paid" | "cancelled"

export const recentOrders: {
  id: string
  table: string
  server: string
  items: number
  total: string
  status: OrderStatus
  time: string
}[] = [
  { id: "#4821", table: "Table 12", server: "Mara L.", items: 4, total: "$184.50", status: "preparing", time: "2m ago" },
  { id: "#4820", table: "Bar 03", server: "Devin K.", items: 2, total: "$62.00", status: "served", time: "6m ago" },
  { id: "#4819", table: "Table 07", server: "Aria P.", items: 6, total: "$311.25", status: "paid", time: "11m ago" },
  { id: "#4818", table: "Patio 02", server: "Mara L.", items: 3, total: "$97.00", status: "served", time: "14m ago" },
  { id: "#4817", table: "Table 21", server: "Leo M.", items: 1, total: "$24.00", status: "cancelled", time: "18m ago" },
  { id: "#4816", table: "Table 05", server: "Aria P.", items: 5, total: "$248.75", status: "paid", time: "23m ago" },
]

export const topDishes = [
  { name: "Truffle Tagliatelle", category: "Primi", sold: 142, share: 92, trend: "+18%" },
  { name: "Dry-Aged Ribeye", category: "Mains", sold: 118, share: 78, trend: "+11%" },
  { name: "Burrata & Heirloom", category: "Antipasti", sold: 96, share: 64, trend: "+6%" },
  { name: "Saffron Risotto", category: "Primi", sold: 81, share: 54, trend: "-3%" },
  { name: "Basque Cheesecake", category: "Dolci", sold: 73, share: 48, trend: "+22%" },
]

export const floorTables = [
  { id: "T1", seats: 2, status: "occupied" },
  { id: "T2", seats: 4, status: "occupied" },
  { id: "T3", seats: 4, status: "available" },
  { id: "T4", seats: 2, status: "reserved" },
  { id: "T5", seats: 6, status: "occupied" },
  { id: "T6", seats: 2, status: "available" },
  { id: "T7", seats: 4, status: "occupied" },
  { id: "T8", seats: 8, status: "reserved" },
  { id: "T9", seats: 2, status: "available" },
  { id: "T10", seats: 4, status: "occupied" },
  { id: "T11", seats: 2, status: "cleaning" },
  { id: "T12", seats: 6, status: "occupied" },
] as const

export const reservations = [
  { name: "Eleanor Whitfield", party: 4, time: "7:00 PM", note: "Window booth", initials: "EW" },
  { name: "Marcus Chen", party: 2, time: "7:30 PM", note: "Anniversary", initials: "MC" },
  { name: "The Alvarez Party", party: 8, time: "8:00 PM", note: "Tasting menu", initials: "AP" },
  { name: "Priya Nair", party: 3, time: "8:15 PM", note: "Allergy: nuts", initials: "PN" },
]
