import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { SupabaseService } from '@/lib/supabaseService'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useQueryClient } from '@tanstack/react-query'

export const useAuth = () => {
  const {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    setUser,
    setLoading,
    setError,
    clearError,
  } = useAuthStore()
  
  const queryClient = useQueryClient()

  // Verificação simples de autenticação na inicialização
  useEffect(() => {
    const initAuth = async () => {
      // Se Supabase não estiver configurado, ativar modo visitante
      if (!isSupabaseConfigured || !supabase) {
        console.log('🔧 Supabase não configurado - modo visitante ativo')
        setUser(null)
        setLoading(false)
        return
      }

      try {
        // Verificação simples de sessão
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          console.log('✅ Usuário logado encontrado')
          setUser(session.user)
        } else {
          console.log('👤 Nenhuma sessão ativa - modo visitante')
          setUser(null)
        }
      } catch (error) {
        console.log('⚠️ Erro na verificação - modo visitante ativo')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    // Configurar listener de mudanças de auth
    let subscription: any = null
    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = SupabaseService.onAuthStateChange((event, session) => {
          console.log('🔐 Auth state change:', event)
          if (event === 'SIGNED_IN' && session?.user) {
            setUser(session.user)
          } else if (event === 'SIGNED_OUT') {
            setUser(null)
            queryClient.clear()
          }
        })
        subscription = data.subscription
      } catch (error) {
        console.warn('⚠️ Erro ao configurar listener de auth')
      }
    }

    initAuth()

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  // Função de login
  const handleSignIn = async (email: string, password: string) => {
    try {
      clearError()
      await signIn(email, password)
    } catch (error: any) {
      console.error('Erro no login:', error.message)
      throw error
    }
  }
  
  // Função para entrar como visitante
  const enterAsGuest = () => {
    console.log('👤 Entrando como visitante')
    setUser(null)
    setLoading(false)
    clearError()
  }

  // Função de cadastro
  const handleSignUp = async (email: string, password: string, displayName: string = 'Usuário') => {
    try {
      clearError()
      await signUp(email, password, displayName)
    } catch (error: any) {
      console.error('Erro no cadastro:', error.message)
      throw error
    }
  }

  // Função de logout
  const handleSignOut = async () => {
    try {
      clearError()
      await signOut()
      queryClient.clear()
    } catch (error: any) {
      console.error('Erro no logout:', error.message)
      throw error
    }
  }

  // Função de redefinição de senha
  const handleResetPassword = async (email: string) => {
    try {
      clearError()
      await resetPassword(email)
    } catch (error: any) {
      console.error('Erro ao redefinir senha:', error.message)
      throw error
    }
  }

  // Função de atualização de senha
  const handleUpdatePassword = async (newPassword: string) => {
    try {
      clearError()
      await updatePassword(newPassword)
    } catch (error: any) {
      console.error('Erro ao atualizar senha:', error.message)
      throw error
    }
  }

  return {
    user,
    isLoading: loading,
    error,
    isAuthenticated: !!user,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    updatePassword: handleUpdatePassword,
    enterAsGuest,
    clearError,
  }
}