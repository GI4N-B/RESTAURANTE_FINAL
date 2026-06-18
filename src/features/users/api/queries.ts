import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { UserProfile } from '../types';

export const useUsers = (companyId: string, locationId?: string) => {
  return useQuery({
    queryKey: ['users', companyId, locationId],
    queryFn: async () => {
      const supabase = createClient();
      let query = supabase.from('user_profiles').select('*').eq('company_id', companyId);
      
      if (locationId) {
        query = query.eq('location_id', locationId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as UserProfile[];
    },
  });
};