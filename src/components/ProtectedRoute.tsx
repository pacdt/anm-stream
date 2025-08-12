import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Loading } from '@/components/Loading'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/login'
}) => {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  console.log('🛡️ [ProtectedRoute] Estado atual:', {
    pathname: location.pathname,
    requireAuth,
    isAuthenticated,
    isLoading,
    redirectTo
  })

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    console.log('⏳ [ProtectedRoute] Mostrando loading - verificando autenticação...')
    return <Loading fullScreen text="Verificando autenticação..." />
  }

  // Se requer autenticação e usuário não está logado
  if (requireAuth && !isAuthenticated) {
    console.log(`🔒 [ProtectedRoute] Redirecionando para ${redirectTo} - autenticação necessária`)
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    )
  }

  // Se não requer autenticação e usuário está logado (ex: páginas de login)
  if (!requireAuth && isAuthenticated) {
    const from = location.state?.from || '/'
    console.log(`🏠 [ProtectedRoute] Usuário logado, redirecionando para ${from}`)
    return <Navigate to={from} replace />
  }

  console.log('✅ [ProtectedRoute] Renderizando children - acesso permitido')
  return <>{children}</>
}