import crypto from 'crypto';

const HASH_ALGORITHM = 'sha256';
const ITERATIONS = 100000;
const SALT_LENGTH = 32;
const KEY_LENGTH = 64;

export function hashPin(pin: string, salt?: Buffer): { hash: string; salt: string } {
  const saltBuffer = salt || crypto.randomBytes(SALT_LENGTH);
  const hash = crypto.pbkdf2Sync(pin, saltBuffer, ITERATIONS, KEY_LENGTH, HASH_ALGORITHM);
  return {
    hash: hash.toString('hex'),
    salt: saltBuffer.toString('hex'),
  };
}

export function verifyPin(pin: string, storedHash: string, salt: string): boolean {
  const saltBuffer = Buffer.from(salt, 'hex');
  const { hash } = hashPin(pin, saltBuffer);
  return hash === storedHash;
}

export function generateSecurePin(): string {
  return crypto.randomInt(1000, 9999).toString().padStart(4, '0');
}
