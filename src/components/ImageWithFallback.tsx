import React, { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  fallbackSrc?: string
  alt: string
  className?: string
  onLoadError?: () => void
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallbackSrc = '/placeholder-anime.svg',
  alt,
  className,
  onLoadError,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    if (!hasError && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
      setHasError(true)
      onLoadError?.()
    } else {
      setIsLoading(false)
    }
  }, [currentSrc, fallbackSrc, hasError, onLoadError])

  const handleLoad = useCallback(() => {
    setIsLoading(false)
  }, [])

  // Se a imagem falhou completamente, mostrar placeholder
  if (hasError && currentSrc === fallbackSrc) {
    return (
      <div 
        className={cn(
          'bg-gray-800 flex items-center justify-center text-gray-400',
          className
        )}
        {...props}
      >
        <div className="text-center p-4">
          <div className="text-2xl mb-2">🖼️</div>
          <div className="text-xs">Imagem não disponível</div>
        </div>
      </div>
    )
  }

  return (
    <>
      {isLoading && (
        <div 
          className={cn(
            'bg-gray-800 animate-pulse flex items-center justify-center',
            className
          )}
        >
          <div className="text-gray-400">Carregando...</div>
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={cn(
          className,
          isLoading && 'hidden'
        )}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
        {...props}
      />
    </>
  )
}

// Hook para gerenciar múltiplas imagens com fallback
export const useImageWithFallback = (initialSrc: string, fallbackSrc?: string) => {
  const [src, setSrc] = useState(initialSrc)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = useCallback(() => {
    if (!hasError && fallbackSrc && src !== fallbackSrc) {
      // Log apenas em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.debug(`🖼️ [HOOK] Erro na imagem, usando fallback: ${fallbackSrc}`)
      }
      setSrc(fallbackSrc)
      setHasError(true)
    } else {
      // Falha total - log apenas em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.debug(`❌ [HOOK] Falha total no carregamento da imagem`)
      }
      setIsLoading(false)
    }
  }, [src, fallbackSrc, hasError])

  const handleLoad = useCallback(() => {
    setIsLoading(false)
  }, [])

  const reset = useCallback(() => {
    setSrc(initialSrc)
    setHasError(false)
    setIsLoading(true)
  }, [initialSrc])

  return {
    src,
    hasError,
    isLoading,
    handleError,
    handleLoad,
    reset
  }
}