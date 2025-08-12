import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { ButtonLoading } from '@/components/Loading'
import { cn, isValidEmail } from '@/lib/utils'

export const Login: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, isLoading, error, clearError, enterAsGuest } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  
  // URL de redirecionamento após login
  const from = location.state?.from || '/'

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.email) {
      errors.email = 'Email é obrigatório'
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Email inválido'
    }
    
    if (!formData.password) {
      errors.password = 'Senha é obrigatória'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    if (!validateForm()) return
    
    try {
      await signIn(formData.email, formData.password)
      navigate(from, { replace: true })
    } catch (error) {
      // Erro já é tratado pelo hook useAuth
      console.error('Erro no login:', error)
    }
  }
  
  const handleGuestMode = () => {
    enterAsGuest()
    navigate(from, { replace: true })
  }
  
  // Verificar se é erro de conectividade
  const isConnectivityError = error && (
    error.includes('indisponível') || 
    error.includes('Timeout') || 
    error.includes('conectividade') ||
    error.includes('Visitante')
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Limpar erro de validação quando usuário começar a digitar
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }))
    }
    
    // Limpar erro geral
    if (error) {
      clearError()
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <span className="text-white font-bold text-2xl">
              AnimeStream
            </span>
          </Link>
          <p className="text-gray-400 mt-2">Entre na sua conta</p>
        </div>

        {/* Form */}
        <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
              {isConnectivityError && (
                <button
                  onClick={handleGuestMode}
                  className="w-full mt-3 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-500 transition-colors duration-300 text-sm"
                >
                  Continuar como Visitante
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={cn(
                    'w-full px-4 py-3 pl-12 bg-gray-700 text-white rounded-lg border transition-colors duration-300 focus:outline-none',
                    validationErrors.email
                      ? 'border-red-500 focus:border-red-400'
                      : 'border-gray-600 focus:border-red-500'
                  )}
                  placeholder="seu@email.com"
                  disabled={isLoading}
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-400">{validationErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={cn(
                    'w-full px-4 py-3 pl-12 pr-12 bg-gray-700 text-white rounded-lg border transition-colors duration-300 focus:outline-none',
                    validationErrors.password
                      ? 'border-red-500 focus:border-red-400'
                      : 'border-gray-600 focus:border-red-500'
                  )}
                  placeholder="Sua senha"
                  disabled={isLoading}
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-400">{validationErrors.password}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-red-400 hover:text-red-300 transition-colors duration-300"
              >
                Esqueceu a senha?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <ButtonLoading />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="px-4 text-gray-400 text-sm">ou</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-400">
              Não tem uma conta?{' '}
              <Link
                to="/register"
                className="text-red-400 hover:text-red-300 transition-colors duration-300 font-medium"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
          >
            ← Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  )
}