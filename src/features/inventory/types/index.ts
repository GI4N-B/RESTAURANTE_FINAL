export type MovementType = 
  | 'PURCHASE'     // Compra a proveedor (+)
  | 'SALE'         // Venta en POS (-)
  | 'TRANSFER_IN'  // Recepción de otra sede (+)
  | 'TRANSFER_OUT' // Envío a otra sede (-)
  | 'PRODUCTION'   // Elaboración de recetas (+/-)
  | 'WASTE'        // Mermas y desperdicios (-)
  | 'ADJUSTMENT';  // Ajuste manual por auditoría (+/-)

export interface InventoryItem {
  id: string;
  product_id: string; // Relación con pos_products
  location_id: string;
  current_stock: number;
  min_stock_alert: number;
  unit_cost: number;
  last_updated: string;
  product: {
    name: string;
    sku: string;
    category: string;
  };
}

export interface InventoryMovement {
  id: string;
  inventory_id: string;
  location_id: string;
  movement_type: MovementType;
  quantity: number; // Positivo para entradas, Negativo para salidas
  previous_stock: number;
  new_stock: number;
  reference_id?: string; // ID de orden de compra, ticket de POS o transferencia
  notes: string;
  created_by: string; // ID del usuario
  created_at: string;
}