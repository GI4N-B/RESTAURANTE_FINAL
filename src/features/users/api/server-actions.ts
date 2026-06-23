'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { UserFormData } from '../validations/user-schemas';
import { UserProfile } from '../types';
import { hashPin, generateSecurePin } from '@/lib/crypto';

async function verifyAccess(targetCompanyId: string, targetLocationId?: string | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autorizado');

  const { data: currentUserProfile } = await supabase
    .from('user_profiles')
    .select('role, company_id, location_id, permissions')
    .eq('id', user.id)
    .single();

  if (!currentUserProfile) throw new Error('Perfil no encontrado');

  // RBAC + ABAC Validation
  if (currentUserProfile.role === 'SUPERADMIN') return true;

  if (currentUserProfile.company_id !== targetCompanyId) {
    throw new Error('No tienes permiso para acceder a esta empresa');
  }

  if (currentUserProfile.role === 'MANAGER' && currentUserProfile.location_id !== targetLocationId) {
    throw new Error('No tienes permiso para acceder a esta sede');
  }

  if (currentUserProfile.role === 'WAITER') {
    throw new Error('Los meseros no pueden crear usuarios');
  }

  return true;
}

export async function createUserAction(data: UserFormData) {
  await verifyAccess(data.company_id, data.location_id);
  const adminClient = createAdminClient();

  // Generar PIN aleatorio y seguro si no se proporciona
  const pinToUse = data.pin || generateSecurePin();
  const { hash: pinHash, salt: pinSalt } = hashPin(pinToUse);

  // Generar contraseña segura y aleatoria
  const tempPassword = generateSecurePin() + 'Temp!' + Math.random().toString(36).slice(2);

  // 1. Crear usuario en Supabase Auth
  const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
    email: data.email,
    password: tempPassword,
    email_confirm: true,
  });

  if (authError) throw new Error(`Error al crear usuario: ${authError.message}`);

  // 2. Crear perfil con PIN hashed seguro
  const { error: profileError } = await adminClient
    .from('user_profiles')
    .insert({
      id: authUser.user.id,
      email: data.email,
      full_name: data.full_name,
      role: data.role,
      company_id: data.company_id,
      location_id: data.location_id,
      permissions: data.permissions || [],
      status: 'ACTIVE',
      pin_hash: pinHash,
      pin_salt: pinSalt,
    });

  if (profileError) {
    await adminClient.auth.admin.deleteUser(authUser.user.id);
    throw new Error(`Error al crear perfil: ${profileError.message}`);
  }

  return {
    success: true,
    pin: pinToUse,
    temporaryPassword: tempPassword,
  };
}

export async function updateUserAction(id: string, data: Partial<UserFormData>) {
  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  if (data.company_id) await verifyAccess(data.company_id, data.location_id);
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from('user_profiles')
    .update({
      full_name: data.full_name,
      role: data.role,
      company_id: data.company_id,
      location_id: data.location_id,
      permissions: data.permissions,
      updated_at: new Date().toISOString(),
      updated_by: currentUser?.id,
    })
    .eq('id', id);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function suspendUserAction(id: string, suspend: boolean) {
  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  const adminClient = createAdminClient();

  await adminClient.auth.admin.updateUserById(id, {
    ban_duration: suspend ? '876000h' : 'none',
  });

  await adminClient
    .from('user_profiles')
    .update({
      status: suspend ? 'SUSPENDED' : 'ACTIVE',
      updated_at: new Date().toISOString(),
      updated_by: currentUser?.id,
    })
    .eq('id', id);

  return { success: true };
}

export async function deleteUserAction(id: string) {
  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  const adminClient = createAdminClient();

  // Soft delete: marcar como eliminado sin borrar la fila
  const { error: softDeleteError } = await adminClient
    .from('user_profiles')
    .update({
      deleted_at: new Date().toISOString(),
      deleted_by: currentUser?.id,
      status: 'INACTIVE',
    })
    .eq('id', id);

  if (softDeleteError) throw new Error(softDeleteError.message);

  // Opcionalmente: ban de la cuenta de auth
  await adminClient.auth.admin.updateUserById(id, {
    ban_duration: '876000h',
  });

  return { success: true };
}

export async function resetPasswordAction(id: string, newPassword: string) {
  const supabase = await createClient();
  const { data: { user: currentUser } } = await supabase.auth.getUser();

  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.updateUserById(id, {
    password: newPassword,
  });
  if (error) throw new Error(error.message);

  // Auditar cambio de contraseña
  await adminClient
    .from('user_profiles')
    .update({
      updated_at: new Date().toISOString(),
      updated_by: currentUser?.id,
    })
    .eq('id', id);

  return { success: true };
}

export async function changePinAction(id: string, newPin: string) {
  // Validar formato PIN
  if (!newPin || !/^\d{4}$/.test(newPin)) {
    throw new Error('PIN debe ser 4 dígitos');
  }

  const adminClient = createAdminClient();
  const { hash: pinHash, salt: pinSalt } = hashPin(newPin);

  const { error } = await adminClient
    .from('user_profiles')
    .update({
      pin_hash: pinHash,
      pin_salt: pinSalt,
    })
    .eq('id', id);

  if (error) throw new Error(error.message);
  return { success: true };
}