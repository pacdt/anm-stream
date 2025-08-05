import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  className?: string
  fullScreen?: boolean
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text,
  className,
  fullScreen = false
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  const content = (
    <div className={cn(
      'flex flex-col items-center justify-center gap-3',
      fullScreen && 'min-h-screen',
      className
    )}>
      <Loader2 className={cn(
        'animate-spin text-red-600',
        sizeClasses[size]
      )} />
      
      {text && (
        <p className={cn(
          'text-gray-300 font-medium',
          textSizeClasses[size]
        )}>
          {text}
        </p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        {content}
      </div>
    )
  }

  return content
}

// Componente para loading inline
export const InlineLoading: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex items-center justify-center p-4', className)}>
    <Loader2 className="w-6 h-6 animate-spin text-red-600" />
  </div>
)

// Componente para loading de botão
export const ButtonLoading: React.FC<{ className?: string }> = ({ className }) => (
  <Loader2 className={cn('w-4 h-4 animate-spin', className)} />
)

// Componente para skeleton de anime card
export const AnimeCardSkeleton: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-32 h-48',
    md: 'w-40 h-60',
    lg: 'w-48 h-72'
  }

  return (
    <div className={cn(
      'bg-gray-800 rounded-lg animate-pulse',
      sizeClasses[size]
    )}>
      <div className="w-full h-full bg-gray-700 rounded-lg" />
    </div>
  )
}

// Componente para skeleton de lista
export const ListSkeleton: React.FC<{ 
  count?: number
  className?: string 
}> = ({ count = 3, className }) => (
  <div className={cn('space-y-4', className)}>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-gray-800 rounded-lg p-4 animate-pulse">
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-gray-700 rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-700 rounded w-1/2" />
            <div className="h-3 bg-gray-700 rounded w-1/4" />
          </div>
        </div>
      </div>
    ))}
  </div>
)

// Componente para skeleton de texto
export const TextSkeleton: React.FC<{ 
  lines?: number
  className?: string 
}> = ({ lines = 3, className }) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, index) => (
      <div
        key={index}
        className={cn(
          'h-4 bg-gray-700 rounded animate-pulse',
          index === lines - 1 ? 'w-3/4' : 'w-full'
        )}
      />
    ))}
  </div>
)

// Componente para loading de página
export const PageLoading: React.FC<{ text?: string }> = ({ text = 'Carregando...' }) => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <Loading size="lg" text={text} />
  </div>
)

// Componente para erro de carregamento
export const LoadingError: React.FC<{ 
  message?: string
  onRetry?: () => void
}> = ({ 
  message = 'Erro ao carregar dados',
  onRetry 
}) => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
    <div className="text-center">
      <p className="text-red-400 text-lg font-medium mb-2">Ops! Algo deu errado</p>
      <p className="text-gray-400">{message}</p>
    </div>
    
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
      >
        Tentar novamente
      </button>
    )}
  </div>
)