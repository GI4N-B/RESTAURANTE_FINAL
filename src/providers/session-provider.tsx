'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useSessionStore } from '@/features/auth/store/session-store';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setCompanyId, setLocationIds, setIsLoading, setError } = useSessionStore();

  useEffect(() => {
    const loadSession = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          setUser(null);
          setCompanyId(null);
          setLocationIds([]);
          setIsLoading(false);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          setError(profileError.message);
          setIsLoading(false);
          return;
        }

        setUser(profile);
        setCompanyId(profile?.company_id || null);
        // Load location_ids - if user has a specific location_id, use it; otherwise fetch all locations for the company
        if (profile?.location_id) {
          setLocationIds([profile.location_id]);
        } else if (profile?.company_id) {
          // Fetch all locations for the company
          const { data: locations } = await supabase
            .from('locations')
            .select('id')
            .eq('company_id', profile.company_id);
          setLocationIds(locations?.map(l => l.id) || []);
        } else {
          setLocationIds([]);
        }
        setIsLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error desconocido');
        setIsLoading(false);
      }
    };

    loadSession();
  }, [setUser, setCompanyId, setLocationIds, setIsLoading, setError]);

  return <>{children}</>;
}
