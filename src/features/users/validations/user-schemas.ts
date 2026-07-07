import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email('Correo inválido').toLowerCase(),
  full_name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').trim(),
  role: z.enum(['SUPERADMIN', 'ADMIN', 'MANAGER', 'WAITER', 'CHEF']),
  company_id: z.string().uuid('ID de empresa inválido'),
  location_id: z.string().uuid('ID de sede inválido').nullable(),
  password: z.string().min(8, 'Mínimo 8 caracteres').optional(),
  pin: z.string().regex(/^\d{4}$/, 'El PIN debe ser exactamente 4 dígitos').optional(),
  permissions: z.array(z.string()),
});

export type UserFormData = z.infer<typeof userSchema>;

export const changePasswordSchema = z.object({
  newPassword: z.string().min(8, 'Mínimo 8 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export const changePinSchema = z.object({
  newPin: z.string().regex(/^\d{4}$/, 'El PIN debe ser exactamente 4 dígitos'),
});