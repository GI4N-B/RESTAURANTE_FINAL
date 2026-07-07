import { z } from 'zod';

export const movementSchema = z.object({
  inventory_id: z.string().uuid('ID de inventario inválido'),
  location_id: z.string().uuid('ID de ubicación inválido'),
  movement_type: z.enum(['PURCHASE', 'WASTE', 'ADJUSTMENT', 'PRODUCTION', 'SALE', 'TRANSFER_OUT']).describe('Tipo de movimiento inválido'),
  quantity: z.number().int().refine((n) => n !== 0, {
    message: 'La cantidad debe ser diferente a cero',
  }),
  unit_cost: z.number().min(0, 'El costo debe ser positivo o cero').optional(),
  notes: z.string().max(500, 'Las notas no deben exceder 500 caracteres').optional(),
  reference_id: z.string().optional(),
});

export const transferSchema = z
  .object({
    product_id: z.string().uuid('ID de producto inválido'),
    source_location_id: z.string().uuid('ID de ubicación origen inválido'),
    target_location_id: z.string().uuid('ID de ubicación destino inválido'),
    quantity: z.number().int().min(1, 'La cantidad debe ser mayor a 0'),
    notes: z.string().max(500).optional(),
  })
  .refine(
    (data) => data.source_location_id !== data.target_location_id,
    {
      message: 'Las ubicaciones origen y destino deben ser diferentes',
      path: ['target_location_id'],
    }
  );

export const stockAlertSchema = z.object({
  inventory_id: z.string().uuid(),
  min_stock_alert: z.number().int().min(0, 'El mínimo debe ser >= 0'),
  max_stock_alert: z.number().int().min(0, 'El máximo debe ser >= 0'),
});

export type MovementFormData = z.infer<typeof movementSchema>;
export type TransferFormData = z.infer<typeof transferSchema>;
export type StockAlertData = z.infer<typeof stockAlertSchema>;
