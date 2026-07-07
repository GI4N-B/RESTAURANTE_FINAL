import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export interface RevenueData {
  day: string;
  revenue: number;
  covers: number;
}

export interface PeakHourData {
  hour: string;
  orders: number;
}

export interface RecentOrder {
  id: string;
  table: string;
  server: string;
  items: number;
  total: string;
  status: 'preparing' | 'served' | 'paid' | 'cancelled';
  time: string;
}

export interface TopDish {
  name: string;
  category: string;
  sold: number;
  share: number;
  trend: string;
}

export interface FloorTable {
  id: string;
  seats: number;
  status: 'occupied' | 'available' | 'reserved' | 'cleaning';
}

export interface Reservation {
  id: string;
  name: string;
  party: number;
  time: string;
  note: string;
  initials: string;
}

export interface StatCardData {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  sub: string;
  icon: string;
}

// Get revenue series for the last 7 days
export const useRevenueSeries = (locationId: string) => {
  return useQuery({
    queryKey: ['dashboard-revenue', locationId],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('pos_orders')
        .select('total, created_at')
        .eq('location_id', locationId)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group by day
      const dayMap = new Map<string, { revenue: number; covers: number }>();
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      
      days.forEach(day => dayMap.set(day, { revenue: 0, covers: 0 }));

      data?.forEach(order => {
        const date = new Date(order.created_at);
        const dayName = days[date.getDay()];
        const current = dayMap.get(dayName) || { revenue: 0, covers: 0 };
        current.revenue += order.total;
        current.covers += 1;
        dayMap.set(dayName, current);
      });

      return Array.from(dayMap.entries()).map(([day, values]) => ({
        day,
        revenue: values.revenue,
        covers: values.covers
      })) as RevenueData[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get peak hours for today
export const usePeakHours = (locationId: string) => {
  return useQuery({
    queryKey: ['dashboard-peak-hours', locationId],
    queryFn: async () => {
      const supabase = createClient();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from('pos_orders')
        .select('created_at')
        .eq('location_id', locationId)
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group by hour
      const hourMap = new Map<string, number>();
      const hours = ['11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p'];
      
      hours.forEach(hour => hourMap.set(hour, 0));

      data?.forEach(order => {
        const date = new Date(order.created_at);
        const hour = date.getHours();
        let hourKey = '';
        
        if (hour === 11) hourKey = '11a';
        else if (hour === 12) hourKey = '12p';
        else if (hour >= 13 && hour <= 22) hourKey = `${hour - 12}p`;
        
        if (hourKey && hourMap.has(hourKey)) {
          hourMap.set(hourKey, (hourMap.get(hourKey) || 0) + 1);
        }
      });

      return Array.from(hourMap.entries()).map(([hour, orders]) => ({
        hour,
        orders
      })) as PeakHourData[];
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Get recent orders
export const useRecentOrders = (locationId: string, limit = 10) => {
  return useQuery({
    queryKey: ['dashboard-recent-orders', locationId, limit],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('pos_orders')
        .select(`
          id,
          ticket_number,
          total,
          status,
          created_at,
          tables!inner(number),
          user_profiles!inner(full_name)
        `)
        .eq('location_id', locationId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data?.map(order => {
        const table = Array.isArray(order.tables) ? order.tables[0] : order.tables;
        const server = Array.isArray(order.user_profiles) ? order.user_profiles[0] : order.user_profiles;
        return {
          id: order.ticket_number || order.id.slice(0, 8),
          table: table ? `Table ${table.number}` : 'N/A',
          server: server?.full_name || 'Unknown',
          items: 1, // Would need to join order_items for real count
          total: `$${order.total.toFixed(2)}`,
          status: order.status.toLowerCase() as 'preparing' | 'served' | 'paid' | 'cancelled',
          time: formatTimeAgo(new Date(order.created_at))
        };
      }) as RecentOrder[];
    },
    staleTime: 1000 * 30, // 30 seconds
  });
};

// Get top dishes
export const useTopDishes = (locationId: string, limit = 5) => {
  return useQuery({
    queryKey: ['dashboard-top-dishes', locationId, limit],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          quantity,
          product:menu_items!inner(name, category)
        `)
        .eq('location_id', locationId)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      // Aggregate by product
      const dishMap = new Map<string, { name: string; category: string; sold: number }>();
      
      data?.forEach(item => {
        const product = Array.isArray(item.product) ? item.product[0] : item.product;
        const key = product?.name || 'Unknown';
        const current = dishMap.get(key) || { name: key, category: product?.category || '', sold: 0 };
        current.sold += item.quantity;
        dishMap.set(key, current);
      });

      const sorted = Array.from(dishMap.values())
        .sort((a, b) => b.sold - a.sold)
        .slice(0, limit);

      const totalSold = sorted.reduce((sum, d) => sum + d.sold, 0);

      return sorted.map(dish => ({
        name: dish.name,
        category: dish.category,
        sold: dish.sold,
        share: totalSold > 0 ? Math.round((dish.sold / totalSold) * 100) : 0,
        trend: '+0%' // Would need historical comparison
      })) as TopDish[];
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Get floor status
export const useFloorStatus = (locationId: string) => {
  return useQuery({
    queryKey: ['dashboard-floor-status', locationId],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('tables')
        .select('id, seats, status')
        .eq('location_id', locationId)
        .order('id');

      if (error) throw error;

      return data?.map(table => ({
        id: table.id,
        seats: table.seats,
        status: table.status as 'occupied' | 'available' | 'reserved' | 'cleaning'
      })) as FloorTable[];
    },
    staleTime: 1000 * 30,
  });
};

// Get reservations for today
export const useReservations = (locationId: string) => {
  return useQuery({
    queryKey: ['dashboard-reservations', locationId],
    queryFn: async () => {
      const supabase = createClient();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data, error } = await supabase
        .from('reservations')
        .select('name, party_size, time, notes')
        .eq('location_id', locationId)
        .gte('time', today.toISOString())
        .lt('time', tomorrow.toISOString())
        .order('time');

      if (error) throw error;

      return data?.map(res => ({
        name: res.name,
        party: res.party_size,
        time: new Date(res.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        note: res.notes || '',
        initials: res.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
      })) as Reservation[];
    },
    staleTime: 1000 * 60,
  });
};

// Get stat cards data
export const useStatCards = (locationId: string) => {
  return useQuery({
    queryKey: ['dashboard-stat-cards', locationId],
    queryFn: async () => {
      const supabase = createClient();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Today's stats
      const { data: todayOrders } = await supabase
        .from('pos_orders')
        .select('total')
        .eq('location_id', locationId)
        .gte('created_at', today.toISOString());

      // Yesterday's stats for comparison
      const { data: yesterdayOrders } = await supabase
        .from('pos_orders')
        .select('total')
        .eq('location_id', locationId)
        .gte('created_at', yesterday.toISOString())
        .lt('created_at', today.toISOString());

      const todayRevenue = todayOrders?.reduce((sum, o) => sum + o.total, 0) || 0;
      const todayCount = todayOrders?.length || 0;
      const yesterdayRevenue = yesterdayOrders?.reduce((sum, o) => sum + o.total, 0) || 0;
      const yesterdayCount = yesterdayOrders?.length || 0;

      const revenueDelta = yesterdayRevenue > 0 
        ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue * 100).toFixed(1)
        : '0';
      const ordersDelta = yesterdayCount > 0
        ? ((todayCount - yesterdayCount) / yesterdayCount * 100).toFixed(1)
        : '0';

      return [
        {
          label: "Net revenue",
          value: `$${todayRevenue.toLocaleString()}`,
          delta: `${parseFloat(revenueDelta) >= 0 ? '+' : ''}${revenueDelta}%`,
          up: parseFloat(revenueDelta) >= 0,
          sub: "vs. yesterday",
          icon: 'DollarSign',
        },
        {
          label: "Orders",
          value: todayCount.toString(),
          delta: `${parseFloat(ordersDelta) >= 0 ? '+' : ''}${ordersDelta}%`,
          up: parseFloat(ordersDelta) >= 0,
          sub: "today",
          icon: 'ReceiptText',
        },
        {
          label: "Avg. check",
          value: todayCount > 0 ? `$${(todayRevenue / todayCount).toFixed(2)}` : '$0.00',
          delta: '+0%',
          up: true,
          sub: "per cover",
          icon: 'Users',
        },
        {
          label: "Avg. ticket time",
          value: "14m 22s",
          delta: "-1m 06s",
          up: true,
          sub: "kitchen to table",
          icon: 'Clock',
        },
      ] as StatCardData[];
    },
    staleTime: 1000 * 60,
  });
};

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}