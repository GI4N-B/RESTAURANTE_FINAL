export type AuthResponse = {
  success: boolean;
  error?: string;
  twoFactorRequired?: boolean;
};

export type Provider = 'google' | 'azure';