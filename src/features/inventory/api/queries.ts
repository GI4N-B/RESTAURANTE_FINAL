import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { InventoryItem, InventoryMovement } from '../types';
import { registerMovementAction, registerTransferAction } from './server-actions';

export const useInventoryStock = (locationId: string) => {
  return useQuery({
    queryKey: ['inventory', locationId],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('inventory_stock')
        .select('*, product:pos_products(name, sku, category)')
        .eq('location_id', locationId)
        .order('current_stock', { ascending: true });
      if (error) throw error;
      return data as InventoryItem[];
    }
  });
};

export const useKardex = (inventoryId: string | null) => {
  return useQuery({
    queryKey: ['kardex', inventoryId],
    enabled: !!inventoryId,
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('inventory_movements')
        .select('*, user:user_profiles(full_name)')
        .eq('inventory_id', inventoryId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as (InventoryMovement & { user: { full_name: string } })[];
    }
  });
};

export const useInventoryMutations = () => {
  const queryClient = useQueryClient();

  const processMovement = useMutation({
    mutationFn: registerMovementAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['kardex'] });
    }
  });

  const processTransfer = useMutation({
    mutationFn: registerTransferAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    }
  });

  return { processMovement, processTransfer };
};