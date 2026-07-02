import { create } from 'zustand';
import type { User } from '../types/user';

interface AuthState {
  token: string | null;
  user: User | null;

  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;

  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('token'),

  user: null,

  login: (token, user) => {
    localStorage.setItem('token', token);

    set({
      token,
      user,
    });
  },

  logout: () => {
    localStorage.removeItem('token');

    set({
      token: null,
      user: null,
    });
  },

  setUser: (user) => {
    set({ user });
  },

  isAuthenticated: () => !!get().token,
}));
