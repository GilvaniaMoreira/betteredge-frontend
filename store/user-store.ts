import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types/auth'

interface UserState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  clearUser: () => void
  setAuthenticated: (authenticated: boolean) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        isLoading: false 
      }),

      setLoading: (isLoading) => set({ isLoading }),

      clearUser: () => set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      }),

      setAuthenticated: (isAuthenticated) => set({ 
        isAuthenticated,
        isLoading: false 
      }),
    }),
    {
      name: 'user-storage', // nome único para o localStorage
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }), // apenas user e isAuthenticated são persistidos
    }
  )
)
