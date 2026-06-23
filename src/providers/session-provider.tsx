'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useSessionStore } from '@/features/auth/store/session-store';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setCompanyId, setIsLoading, setError } = useSessionStore();

  useEffect(() => {
    const loadSession = async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          setUser(null);
          setCompanyId(null);
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
        setIsLoading(false);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error desconocido');
        setIsLoading(false);
      }
    };

    loadSession();
  }, [setUser, setCompanyId, setIsLoading, setError]);

  return <>{children}</>;
}
