import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { SupabaseService } from '@/lib/supabaseService'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useQueryClient } from '@tanstack/react-query'

export const useAuth = () => {
  const {
    user,
    isLoading,
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

  // Monitorar mudanças de autenticação
  useEffect(() => {
    // Se o Supabase não estiver configurado, definir como modo visitante
    if (!isSupabaseConfigured || !supabase) {
      setUser(null)
      setLoading(false)
      console.log('Rodando em modo visitante - Supabase não configurado')
      return
    }

    const { data: { subscription } } = SupabaseService.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          created_at: session.user.created_at || new Date().toISOString(),
        })
        setLoading(false)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setLoading(false)
        // Limpar cache quando usuário faz logout
        queryClient.clear()
      }
    })

    // Verificar se há usuário logado na inicialização
    const checkUser = async () => {
      try {
        setLoading(true)
        const currentUser = await SupabaseService.getCurrentUser()
        if (currentUser) {
          setUser({
            id: currentUser.id,
            email: currentUser.email || '',
            created_at: currentUser.created_at || new Date().toISOString(),
          })
        }
      } catch (error) {
        console.error('Erro ao verificar usuário:', error)
        setError('Erro ao verificar autenticação')
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    return () => {
      subscription.unsubscribe()
    }
  }, [setUser, setLoading, setError, queryClient])

  // Função de login personalizada
  const handleSignIn = async (email: string, password: string) => {
    try {
      clearError()
      setLoading(true)
      await signIn(email, password)
    } catch (error: any) {
      setError(error.message || 'Erro ao fazer login')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Função de cadastro personalizada
  const handleSignUp = async (email: string, password: string) => {
    try {
      clearError()
      setLoading(true)
      await signUp(email, password)
    } catch (error: any) {
      setError(error.message || 'Erro ao criar conta')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Função de logout personalizada
  const handleSignOut = async () => {
    try {
      clearError()
      setLoading(true)
      await signOut()
      // Limpar cache após logout
      queryClient.clear()
    } catch (error: any) {
      setError(error.message || 'Erro ao fazer logout')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Função de redefinição de senha personalizada
  const handleResetPassword = async (email: string) => {
    try {
      clearError()
      setLoading(true)
      await resetPassword(email)
    } catch (error: any) {
      setError(error.message || 'Erro ao redefinir senha')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Função de atualização de senha personalizada
  const handleUpdatePassword = async (newPassword: string) => {
    try {
      clearError()
      setLoading(true)
      await updatePassword(newPassword)
    } catch (error: any) {
      setError(error.message || 'Erro ao atualizar senha')
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    updatePassword: handleUpdatePassword,
    clearError,
  }
}