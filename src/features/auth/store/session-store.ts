import { create } from 'zustand';
import { UserProfile } from '@/features/users/types';

export interface SessionState {
  user: UserProfile | null;
  company_id: string | null;
  location_ids: string[];
  isLoading: boolean;
  error: string | null;

  setUser: (user: UserProfile | null) => void;
  setCompanyId: (id: string | null) => void;
  setLocationIds: (ids: string[]) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  company_id: null,
  location_ids: [],
  isLoading: true,
  error: null,

  setUser: (user) => set({ user }),
  setCompanyId: (id) => set({ company_id: id }),
  setLocationIds: (ids) => set({ location_ids: ids }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      user: null,
      company_id: null,
      location_ids: [],
      isLoading: false,
      error: null,
    }),
}));
