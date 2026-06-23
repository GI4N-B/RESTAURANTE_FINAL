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
  const { verifyPin } = await import('@/lib/crypto');
  const supabase = await createClient();

  // Validar formato PIN (4 dígitos)
  if (!pin || !/^\d{4}$/.test(pin)) {
    return { success: false, error: 'PIN debe ser 4 dígitos.' };
  }

  // 1. Buscar usuario en user_profiles
  const { data: userData, error: userError } = await supabase
    .from('user_profiles')
    .select('id, email, pin_hash, pin_salt')
    .eq('email', email)
    .single();

  if (userError || !userData) {
    return { success: false, error: 'Usuario no encontrado.' };
  }

  // 2. Validar PIN con hash seguro
  if (!userData.pin_hash || !userData.pin_salt) {
    return { success: false, error: 'Usuario no tiene PIN configurado.' };
  }

  const isValid = verifyPin(pin, userData.pin_hash, userData.pin_salt);
  if (!isValid) {
    return { success: false, error: 'PIN incorrecto.' };
  }

  // 3. Crear sesión segura: Usar admin API para generar tokens sin requerir contraseña
  const adminClient = await import('@/lib/supabase/admin').then(m => m.default);
  const { data: sessionData, error: sessionError } = await adminClient.auth.admin.createSession({
    user_id: userData.id,
  });

  if (sessionError || !sessionData) {
    return { success: false, error: 'Error al crear sesión.' };
  }

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