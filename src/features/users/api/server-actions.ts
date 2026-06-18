'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server'; // Cliente del usuario actual
import { UserFormData } from '../validations/user-schemas';
import { UserProfile } from '../types';

// Middleware interno para verificar RBAC y ABAC
async function verifyAccess(targetCompanyId: string, targetLocationId?: string | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('No autorizado');

  const { data: currentUserProfile } = await supabase
    .from('user_profiles')
    .select('role, company_id, location_id')
    .eq('id', user.id)
    .single();

  if (!currentUserProfile) throw new Error('Perfil no encontrado');

  // RBAC + ABAC Validation
  if (currentUserProfile.role === 'SUPERADMIN') return true;

  if (currentUserProfile.company_id !== targetCompanyId) {
    throw new Error('Violación de ABAC: Empresa distinta');
  }

  if (currentUserProfile.role === 'MANAGER' && currentUserProfile.location_id !== targetLocationId) {
    throw new Error('Violación de ABAC: Sede distinta');
  }

  return true;
}

export async function createUserAction(data: UserFormData) {
  await verifyAccess(data.company_id, data.location_id);
  const adminAuthClient = createAdminClient();

  // 1. Crear en Supabase Auth
  const { data: authUser, error: authError } = await adminAuthClient.auth.admin.createUser({
    email: data.email,
    password: data.password || 'TempPass123!',
    email_confirm: true,
  });

  if (authError) throw new Error(authError.message);

  // 2. Crear el perfil con ABAC/RBAC en la tabla pública
  const { error: profileError } = await adminAuthClient.from('user_profiles').insert({
    id: authUser.user.id,
    email: data.email,
    full_name: data.full_name,
    role: data.role,
    company_id: data.company_id,
    location_id: data.location_id,
    permissions: data.permissions,
    status: 'ACTIVE',
    pin_hash: data.pin ? `hashed_${data.pin}` : null, // En un entorno real, usar bcrypt
  });

  if (profileError) {
    await adminAuthClient.auth.admin.deleteUser(authUser.user.id); // Rollback
    throw new Error(profileError.message);
  }
  return { success: true };
}

export async function updateUserAction(id: string, data: Partial<UserFormData>) {
  if (data.company_id) await verifyAccess(data.company_id, data.location_id);
  const adminAuthClient = createAdminClient();

  const { error } = await adminAuthClient.from('user_profiles').update({
    full_name: data.full_name,
    role: data.role,
    company_id: data.company_id,
    location_id: data.location_id,
    permissions: data.permissions,
  }).eq('id', id);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function suspendUserAction(id: string, suspend: boolean) {
  const adminAuthClient = createAdminClient();
  
  // Bloquear en Auth
  await adminAuthClient.auth.admin.updateUserById(id, { ban_duration: suspend ? '876000h' : 'none' });
  
  // Actualizar estado en Perfil
  await adminAuthClient.from('user_profiles').update({ 
    status: suspend ? 'SUSPENDED' : 'ACTIVE' 
  }).eq('id', id);

  return { success: true };
}

export async function deleteUserAction(id: string) {
  const adminAuthClient = createAdminClient();
  const { error } = await adminAuthClient.auth.admin.deleteUser(id);
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function resetPasswordAction(id: string, newPassword: string) {
  const adminAuthClient = createAdminClient();
  const { error } = await adminAuthClient.auth.admin.updateUserById(id, { password: newPassword });
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function changePinAction(id: string, newPin: string) {
  const adminAuthClient = createAdminClient();
  const { error } = await adminAuthClient.from('user_profiles')
    .update({ pin_hash: `hashed_${newPin}` }).eq('id', id);
  if (error) throw new Error(error.message);
  return { success: true };
}