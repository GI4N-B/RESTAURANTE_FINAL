import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { POSCategory, POSProduct, POSTicket, CartItem, PaymentMethod } from '../types';
import { useEffect } from 'react';

// 1. Queries (Lectura)
export const usePOSCatalog = () => {
  return useQuery({
    queryKey: ['pos-catalog'],
    queryFn: async () => {
      const supabase = createClient();
      const [categoriesRes, productsRes] = await Promise.all([
        supabase.from('pos_categories').select('*').order('sort_order'),
        supabase.from('pos_products').select('*').eq('is_active', true)
      ]);
      
      if (categoriesRes.error) throw categoriesRes.error;
      if (productsRes.error) throw productsRes.error;

      return {
        categories: categoriesRes.data as POSCategory[],
        products: productsRes.data as POSProduct[]
      };
    },
    staleTime: 1000 * 60 * 5, // Cachear catálogo por 5 minutos
  });
};

export const useProductModifiers = (productId: string | null) => {
  return useQuery({
    queryKey: ['modifiers', productId],
    enabled: !!productId,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('pos_product_modifiers')
        .select('*, modifier_groups(*, modifier_options(*))')
        .eq('product_id', productId);
      if (error) throw error;
      return data;
    }
  });
};

// 2. Mutations (Escritura - Checkout)
export const useCheckout = () => {
  const queryClient = useQueryClient();
  const supabase = createClient();

  return useMutation({
    mutationFn: async ({ cart, total, method }: { cart: CartItem[], total: number, method: PaymentMethod }) => {
      // 1. Crear la Orden
      const { data: order, error: orderError } = await supabase
        .from('pos_orders')
        .insert({ total, payment_method: method, status: 'PAID' })
        .select()
        .single();
      
      if (orderError) throw orderError;

      // 2. Insertar los items del ticket
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.unit_total,
        modifiers: item.modifiers,
        notes: item.notes
      }));

      const { error: itemsError } = await supabase.from('pos_order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      return order;
    },
    onSuccess: () => {
      // Invalidar historial para actualizar la UI instantáneamente
      queryClient.invalidateQueries({ queryKey: ['pos-history'] });
    }
  });
};

// 3. Realtime Hook (Historial de Tickets)
export const usePOSHistoryRealtime = () => {
  const queryClient = useQueryClient();
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase.channel('pos_orders_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pos_orders' }, (payload) => {
        // Actualizar el cache de React Query con el nuevo ticket en vivo
        queryClient.setQueryData(['pos-history'], (oldData: POSTicket[] | undefined) => {
          return [payload.new as POSTicket, ...(oldData || [])];
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient, supabase]);

  return useQuery({
    queryKey: ['pos-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pos_orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as POSTicket[];
    }
  });
};