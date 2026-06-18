'use server';

import { createClient } from '@/lib/supabase/server';
import { MovementFormData, TransferFormData } from '../validations/inventory-schemas';

export async function registerMovementAction(data: MovementFormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autorizado');

  // Idealmente, esto llama a una función RPC de PostgreSQL (Stored Procedure) para garantizar ACID.
  // RPC: await supabase.rpc('process_inventory_movement', { ...payload })
  
  // Simulación del flujo seguro:
  // 1. Obtener stock actual con bloqueo (for update)
  const { data: currentItem, error: fetchError } = await supabase
    .from('inventory_stock')
    .select('current_stock, unit_cost')
    .eq('id', data.inventory_id)
    .single();

  if (fetchError || !currentItem) throw new Error('Item no encontrado');

  const previous_stock = currentItem.current_stock;
  const new_stock = previous_stock + data.quantity;

  if (new_stock < 0 && data.movement_type !== 'ADJUSTMENT') {
    throw new Error('Stock insuficiente para realizar este movimiento');
  }

  // 2. Insertar en Kardex
  const { error: movementError } = await supabase.from('inventory_movements').insert({
    inventory_id: data.inventory_id,
    location_id: data.location_id,
    movement_type: data.movement_type,
    quantity: data.quantity,
    previous_stock,
    new_stock,
    notes: data.notes,
    created_by: user.id
  });

  if (movementError) throw new Error(movementError.message);

  // 3. Actualizar Stock Maestro y Costo Promedio (si es compra)
  const updates: any = { current_stock: new_stock };
  if (data.movement_type === 'PURCHASE' && data.unit_cost) {
    // Cálculo simplificado de costo promedio ponderado
    const totalValue = (previous_stock * currentItem.unit_cost) + (data.quantity * data.unit_cost);
    updates.unit_cost = totalValue / new_stock;
  }

  const { error: stockUpdateError } = await supabase
    .from('inventory_stock')
    .update(updates)
    .eq('id', data.inventory_id);

  if (stockUpdateError) throw new Error(stockUpdateError.message);

  return { success: true, new_stock };
}

export async function registerTransferAction(data: TransferFormData) {
  // Transfiere stock entre dos sedes creando dos movimientos acoplados (OUT e IN).
  const supabase = await createClient();
  const { error } = await supabase.rpc('execute_inventory_transfer', data);
  if (error) throw new Error(error.message);
  return { success: true };
}