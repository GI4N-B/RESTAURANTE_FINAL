import { create } from 'zustand';
import { UserProfile } from '../types';

interface UserStore {
  selectedUser: UserProfile | null;
  isModalOpen: boolean;
  setSelectedUser: (user: UserProfile | null) => void;
  setModalOpen: (isOpen: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  selectedUser: null,
  isModalOpen: false,
  setSelectedUser: (user) => set({ selectedUser: user }),
  setModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
}));