import { describe, it, expect } from 'vitest';
import { userSchema, changePinSchema } from '@/features/users/validations/user-schemas';
import { movementSchema, transferSchema } from '@/features/inventory/validations/inventory-schemas';

describe('Zod Validations', () => {
  describe('User Schema', () => {
    it('debería validar usuario correcto', () => {
      const validUser = {
        email: 'user@example.com',
        full_name: 'Juan Pérez',
        role: 'WAITER',
        company_id: '123e4567-e89b-12d3-a456-426614174000',
        location_id: '223e4567-e89b-12d3-a456-426614174000',
        permissions: [],
      };

      const result = userSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it('debería rechazar email inválido', () => {
      const invalidUser = {
        email: 'not-an-email',
        full_name: 'Juan Pérez',
        role: 'ADMIN',
        company_id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it('debería convertir email a minúsculas', () => {
      const user = {
        email: 'USER@EXAMPLE.COM',
        full_name: 'Juan Pérez',
        role: 'ADMIN',
        company_id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const result = userSchema.safeParse(user);
      if (result.success) {
        expect(result.data.email).toBe('user@example.com');
      }
    });

    it('debería rechazar PIN con letras', () => {
      const user = {
        email: 'user@example.com',
        full_name: 'Juan Pérez',
        role: 'WAITER',
        company_id: '123e4567-e89b-12d3-a456-426614174000',
        pin: '12ab',
      };

      const result = userSchema.safeParse(user);
      expect(result.success).toBe(false);
    });

    it('debería aceptar PIN válido de 4 dígitos', () => {
      const user = {
        email: 'user@example.com',
        full_name: 'Juan Pérez',
        role: 'WAITER',
        company_id: '123e4567-e89b-12d3-a456-426614174000',
        pin: '1234',
      };

      const result = userSchema.safeParse(user);
      expect(result.success).toBe(true);
    });
  });

  describe('Change PIN Schema', () => {
    it('debería validar PIN válido', () => {
      const result = changePinSchema.safeParse({ newPin: '9999' });
      expect(result.success).toBe(true);
    });

    it('debería rechazar PIN corto', () => {
      const result = changePinSchema.safeParse({ newPin: '12' });
      expect(result.success).toBe(false);
    });

    it('debería rechazar PIN con caracteres no numéricos', () => {
      const result = changePinSchema.safeParse({ newPin: 'abcd' });
      expect(result.success).toBe(false);
    });
  });

  describe('Movement Schema', () => {
    it('debería validar movimiento correcto', () => {
      const movement = {
        inventory_id: '123e4567-e89b-12d3-a456-426614174000',
        location_id: '223e4567-e89b-12d3-a456-426614174000',
        movement_type: 'PURCHASE',
        quantity: 10,
        unit_cost: 5.5,
      };

      const result = movementSchema.safeParse(movement);
      expect(result.success).toBe(true);
    });

    it('debería rechazar cantidad cero', () => {
      const movement = {
        inventory_id: '123e4567-e89b-12d3-a456-426614174000',
        location_id: '223e4567-e89b-12d3-a456-426614174000',
        movement_type: 'WASTE',
        quantity: 0,
      };

      const result = movementSchema.safeParse(movement);
      expect(result.success).toBe(false);
    });
  });

  describe('Transfer Schema', () => {
    it('debería validar transferencia correcta', () => {
      const transfer = {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        source_location_id: '223e4567-e89b-12d3-a456-426614174000',
        target_location_id: '323e4567-e89b-12d3-a456-426614174000',
        quantity: 5,
      };

      const result = transferSchema.safeParse(transfer);
      expect(result.success).toBe(true);
    });

    it('debería rechazar si source_location === target_location', () => {
      const sameLocation = '223e4567-e89b-12d3-a456-426614174000';
      const transfer = {
        product_id: '123e4567-e89b-12d3-a456-426614174000',
        source_location_id: sameLocation,
        target_location_id: sameLocation,
        quantity: 5,
      };

      const result = transferSchema.safeParse(transfer);
      expect(result.success).toBe(false);
    });
  });
});
