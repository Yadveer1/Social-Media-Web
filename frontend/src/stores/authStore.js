import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TOKEN_KEY } from '@/utils/constants';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      
      setAuth: (token, user) => {
        localStorage.setItem(TOKEN_KEY, token);
        set({ 
          token, 
          user, 
          isAuthenticated: true 
        });
      },
      
      logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        set({ 
          token: null, 
          user: null, 
          isAuthenticated: false 
        });
      },
      
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData }
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
