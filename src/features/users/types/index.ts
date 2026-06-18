export type Role = 'SUPERADMIN' | 'ADMIN' | 'MANAGER' | 'WAITER' | 'CHEF';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';

export interface Permission {
  action: string; // ej: 'create:order', 'delete:user'
  resource: string;
}

export interface UserProfile {
  id: string; // Referencia a auth.users
  email: string;
  full_name: string;
  role: Role;
  status: UserStatus;
  company_id: string; // ABAC: A qué empresa pertenece
  location_id: string | null; // ABAC: A qué sede pertenece
  permissions: string[]; // RBAC overrides: Permisos específicos granulares
  pin_hash?: string;
  created_at: string;
}