import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { UserProfile } from '../types';

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  searchQuery?: string;
  locationId?: string;
}

export interface UsersResponse {
  users: UserProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useUsers = (companyId: string, params?: UsersQueryParams) => {
  const { page = 1, limit = 20, searchQuery = '', locationId } = params || {};

  return useQuery({
    queryKey: ['users', companyId, { page, limit, searchQuery, locationId }],
    queryFn: async () => {
      const supabase = createClient();

      // Base query - excluir soft-deleted
      let query = supabase
        .from('user_profiles')
        .select('*', { count: 'exact' })
        .eq('company_id', companyId)
        .is('deleted_at', null);

      // Filtro por ubicación
      if (locationId) {
        query = query.eq('location_id', locationId);
      }

      // Búsqueda por nombre o email
      if (searchQuery.trim()) {
        query = query.or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
      }

      // Paginación
      const offset = (page - 1) * limit;
      query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        users: (data || []) as UserProfile[],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      } as UsersResponse;
    },
    staleTime: 30000, // 30 segundos
  });
};

export const useUserSearch = (companyId: string, searchQuery: string, locationId?: string) => {
  return useUsers(companyId, { searchQuery, locationId, limit: 50 });
};
