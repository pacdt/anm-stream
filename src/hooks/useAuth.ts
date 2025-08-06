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
        setUser(session.user)
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
        
        // Primeiro verificar se há uma sessão ativa
        const { data: { session }, error: sessionError } = await supabase!.auth.getSession()
        
        if (sessionError) {
          console.warn('Erro ao verificar sessão:', sessionError.message)
          setUser(null)
          return
        }
        
        if (session?.user) {
          // Se há sessão, obter dados do usuário
          setUser(session.user)
        } else {
          // Sem sessão ativa - modo visitante
          setUser(null)
        }
      } catch (error: any) {
        // Só logar erros que não sejam relacionados à ausência de sessão
        if (!error.message?.includes('Auth session missing')) {
          console.error('Erro ao verificar usuário:', error)
          setError('Erro ao verificar autenticação')
        }
        setUser(null)
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
  const handleSignUp = async (email: string, password: string, displayName: string = 'Usuário') => {
    try {
      clearError()
      setLoading(true)
      await signUp(email, password, displayName)
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
    isLoading: loading,
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