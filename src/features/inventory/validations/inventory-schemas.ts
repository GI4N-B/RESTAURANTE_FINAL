import { z } from 'zod';

export const movementSchema = z.object({
  inventory_id: z.string().uuid(),
  location_id: z.string().uuid(),
  movement_type: z.enum(['PURCHASE', 'WASTE', 'ADJUSTMENT', 'PRODUCTION']),
  quantity: z.number().refine((val) => val !== 0, { message: 'La cantidad no puede ser cero' }),
  unit_cost: z.number().min(0).optional(),
  notes: z.string().min(3, 'Debe incluir una justificación o nota'),
});

export const transferSchema = z.object({
  product_id: z.string().uuid(),
  source_location_id: z.string().uuid(),
  target_location_id: z.string().uuid(),
  quantity: z.number().positive('La cantidad debe ser mayor a cero'),
  notes: z.string(),
});

export type MovementFormData = z.infer<typeof movementSchema>;
export type TransferFormData = z.infer<typeof transferSchema>;