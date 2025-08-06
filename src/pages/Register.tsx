import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, User as UserIcon } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'
import { ButtonLoading } from '@/components/Loading'
import { cn, isValidEmail, isValidPassword } from '@/lib/utils'
import { toast } from 'sonner'

export const Register: React.FC = () => {
  const navigate = useNavigate()
  const { isLoading, error, clearError } = useAuth()
  const { signUp: authStoreSignUp } = useAuthStore()
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isSuccess] = useState(false)

  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.displayName.trim()) {
      errors.displayName = 'Nome é obrigatório'
    } else if (formData.displayName.trim().length < 2) {
      errors.displayName = 'Nome deve ter pelo menos 2 caracteres'
    }
    
    if (!formData.email) {
      errors.email = 'Email é obrigatório'
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Email inválido'
    }
    
    if (!formData.password) {
      errors.password = 'Senha é obrigatória'
    } else if (!isValidPassword(formData.password)) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres'
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Confirmação de senha é obrigatória'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Senhas não coincidem'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    if (!validateForm()) return
    
    try {
      await authStoreSignUp(formData.email, formData.password, formData.displayName.trim())
      toast.success('Cadastro realizado com sucesso!')
      navigate('/')
    } catch (error: any) {
      console.error('Erro no cadastro:', error)
      toast.error(error.message || 'Erro ao realizar cadastro. Tente novamente.')
    }
  }

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

  // Mostrar tela de sucesso
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Conta Criada com Sucesso!
            </h2>
            <p className="text-gray-300 mb-6">
              Verifique seu email para confirmar sua conta e começar a usar o AnimeStream.
            </p>
            <div className="text-sm text-gray-400">
              Redirecionando para o login...
            </div>
          </div>
        </div>
      </div>
    )
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
          <p className="text-gray-400 mt-2">Crie sua conta</p>
        </div>

        {/* Form */}
        <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Display Name */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-2">
                Nome
              </label>
              <div className="relative">
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className={cn(
                    'w-full px-4 py-3 pl-12 bg-gray-700 text-white rounded-lg border transition-colors duration-300 focus:outline-none',
                    validationErrors.displayName
                      ? 'border-red-500 focus:border-red-400'
                      : 'border-gray-600 focus:border-red-500'
                  )}
                  placeholder="Seu nome ou nick"
                  disabled={isLoading}
                />
                <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {validationErrors.displayName && (
                <p className="mt-1 text-sm text-red-400">{validationErrors.displayName}</p>
              )}
            </div>

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
                  placeholder="Mínimo 6 caracteres"
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirmar Senha
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={cn(
                    'w-full px-4 py-3 pl-12 pr-12 bg-gray-700 text-white rounded-lg border transition-colors duration-300 focus:outline-none',
                    validationErrors.confirmPassword
                      ? 'border-red-500 focus:border-red-400'
                      : 'border-gray-600 focus:border-red-500'
                  )}
                  placeholder="Confirme sua senha"
                  disabled={isLoading}
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{validationErrors.confirmPassword}</p>
              )}
            </div>

            {/* Terms */}
            <div className="text-sm text-gray-400">
              Ao criar uma conta, você concorda com nossos{' '}
              <Link to="/terms" className="text-red-400 hover:text-red-300 transition-colors duration-300">
                Termos de Uso
              </Link>{' '}
              e{' '}
              <Link to="/privacy" className="text-red-400 hover:text-red-300 transition-colors duration-300">
                Política de Privacidade
              </Link>
              .
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
                  Criando conta...
                </>
              ) : (
                'Criar Conta'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-600"></div>
            <span className="px-4 text-gray-400 text-sm">ou</span>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-gray-400">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="text-red-400 hover:text-red-300 transition-colors duration-300 font-medium"
              >
                Entrar
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