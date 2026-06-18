'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { AuthResponse, Provider } from '../types';

export async function loginWithEmail(formData: FormData): Promise<AuthResponse> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { success: false, error: error.message };

  // Verificación simulada y preparada estructuralmente para 2FA (TOTP)
  const { data: factors, error: mfaError } = await supabase.auth.mfa.listFactors();
  if (!mfaError && factors && factors.totp.length > 0) {
    return { success: true, twoFactorRequired: true };
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function loginWithMagicLink(formData: FormData): Promise<AuthResponse> {
  const email = formData.get('email') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function loginWithPIN(pin: string, email: string): Promise<AuthResponse> {
  const supabase = await createClient();
  
  // En un esquema SaaS de restaurantes, validamos el PIN asociado al empleado
  // utilizando una query segura en una tabla dedicada o metadatos de usuario estructurados.
  const { data: userProfile, error: profileError } = await supabase
    .from('staff_profiles')
    .select('user_id, encrypted_pin')
    .eq('email', email)
    .single();

  if (profileError || !userProfile) {
    return { success: false, error: 'Credenciales de terminal inválidas.' };
  }

  // Enfoque funcional utilizando Supabase OTP vía formato específico si se desea firmar la sesión,
  // o haciendo uso de un inicio de sesión controlado por el servidor (Custom Token Generation / Admin Sign In link).
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: `PIN_SECRET_SALT_${pin}` // Mapeo determinista estructurado para autenticación local en tablets POS
  });

  if (error) return { success: false, error: 'PIN incorrecto.' };

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function signUpWithEmail(formData: FormData): Promise<AuthResponse> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const restaurantName = formData.get('restaurantName') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      data: {
        restaurant_name: restaurantName,
        role: 'admin',
      },
    },
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function signInWithOAuth(provider: Provider) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider === 'azure' ? 'azure' : 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      queryParams: provider === 'azure' ? { tenant: 'common' } : undefined,
    },
  });

  if (error) return redirect('/login?error=oauth-failed');
  if (data.url) return redirect(data.url);
}

export async function resetPasswordRequest(formData: FormData): Promise<AuthResponse> {
  const email = formData.get('email') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updatePassword(formData: FormData): Promise<AuthResponse> {
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function verify2FA(code: string, factorId: string): Promise<AuthResponse> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.mfa.challengeAndVerify({
    code,
    factorId,
  });

  if (error) return { success: false, error: error.message };
  
  revalidatePath('/', 'layout');
  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  return redirect('/login');
}