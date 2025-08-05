import { create } from 'zustand'
import { User } from '@supabase/supabase-js'
import { SupabaseService } from '@/lib/supabaseService'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
  
  // Actions
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (newPassword: string) => Promise<void>
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  
  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null })
      const { user } = await SupabaseService.signIn(email, password)
      set({ user, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
  
  signUp: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null })
      const { user } = await SupabaseService.signUp(email, password)
      set({ user, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
  
  signOut: async () => {
    try {
      set({ loading: true, error: null })
      await SupabaseService.signOut()
      set({ user: null, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
  
  resetPassword: async (email: string) => {
    try {
      set({ loading: true, error: null })
      await SupabaseService.resetPassword(email)
      set({ loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
  
  updatePassword: async (newPassword: string) => {
    try {
      set({ loading: true, error: null })
      await SupabaseService.updatePassword(newPassword)
      set({ loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
      throw error
    }
  },
  
  setUser: (user: User | null) => set({ user }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null })
}))