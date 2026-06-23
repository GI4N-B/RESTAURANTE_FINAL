import { describe, it, expect } from 'vitest';
import { hashPin, verifyPin, generateSecurePin } from '@/lib/crypto';

describe('Crypto Utilities', () => {
  describe('PIN Hashing', () => {
    it('debería hashear un PIN correctamente', () => {
      const pin = '1234';
      const { hash, salt } = hashPin(pin);

      expect(hash).toBeDefined();
      expect(salt).toBeDefined();
      expect(hash.length).toBeGreaterThan(0);
      expect(salt.length).toBeGreaterThan(0);
    });

    it('debería generar diferentes hashes para el mismo PIN (diferentes salts)', () => {
      const pin = '5678';
      const hash1 = hashPin(pin);
      const hash2 = hashPin(pin);

      expect(hash1.hash).not.toBe(hash2.hash);
      expect(hash1.salt).not.toBe(hash2.salt);
    });

    it('debería verificar PIN correctamente', () => {
      const pin = '9999';
      const { hash, salt } = hashPin(pin);

      const isValid = verifyPin(pin, hash, salt);
      expect(isValid).toBe(true);
    });

    it('debería rechazar PIN incorrecto', () => {
      const correctPin = '1111';
      const wrongPin = '2222';
      const { hash, salt } = hashPin(correctPin);

      const isValid = verifyPin(wrongPin, hash, salt);
      expect(isValid).toBe(false);
    });

    it('debería generar PIN aleatorio válido', () => {
      const pin = generateSecurePin();

      expect(pin).toMatch(/^\d{4}$/);
      expect(pin.length).toBe(4);
    });
  });
});
