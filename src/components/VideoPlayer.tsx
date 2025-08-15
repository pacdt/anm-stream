import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import { usePlayerStore } from '@/store/playerStore'
import { useUpdateWatchProgress } from '@/hooks/useAnimes'
import { useAuth } from '@/hooks/useAuth'
import { 
  Maximize, 
  Minimize, 
  Settings, 
  SkipBack, 
  SkipForward, 
  Loader2 
} from 'lucide-react'
import { formatDuration } from '@/lib/utils'
import { VideoQualityOption } from '@/types'

interface VideoPlayerProps {
  animeId: string
  episodeNumber: number
  currentSource: VideoQualityOption
  availableSources: VideoQualityOption[]
  onSourceChange: (source: VideoQualityOption) => void
  onNext?: () => void
  onPrevious?: () => void
  onEpisodeEnd?: () => void
  savedProgress?: { progress_seconds: number; total_duration_seconds: number } | null
}

export function VideoPlayer({ 
  animeId, 
  episodeNumber, 
  currentSource,
  availableSources,
  onSourceChange,
  onNext, 
  onPrevious, 
  onEpisodeEnd,
  savedProgress
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const { isAuthenticated } = useAuth()
  
  // Get the primary episode URL (with token if available, or best quality)
  const primarySource = useMemo(() => {
    if (!availableSources || availableSources.length === 0) {
      return currentSource
    }
    
    // Priority 1: Look for sources with token (usually blogger.com URLs)
    const tokenSources = availableSources.filter(source => 
      source.src.includes('token=') || source.src.includes('blogger.com')
    )
    
    if (tokenSources.length > 0) {
      // If we have token sources, prefer the current quality or best available
      const selectedTokenSource = tokenSources.find(source => source.label === currentSource.label)
      if (selectedTokenSource) {
        return selectedTokenSource
      }
      
      // Fallback to best quality token source
      const qualityOrder = ['1080p', '720p', '480p', '360p']
      for (const quality of qualityOrder) {
        const source = tokenSources.find(s => s.label.includes(quality))
        if (source) {
          return source
        }
      }
      
      return tokenSources[0]
    }
    
    // Priority 2: No token sources, use current source or best quality available
    return currentSource
  }, [availableSources, currentSource])

  // Usar sempre a URL original sem conversões
  const getVideoUrl = useMemo(() => {
    const url = primarySource.src
    console.log('VideoPlayer - Usando URL original:', url)
    return url
  }, [primarySource.src])
  
  const {
    isFullscreen,
    error,
    showControls,
    controlsTimeout,
    setFullscreen,
    setError,
    setShowControls,
    setControlsTimeout,
    toggleFullscreen,
    reset
  } = usePlayerStore()

  const [showSettings, setShowSettings] = useState(false)
  // isDragging e lastProgressUpdate removidos - não aplicáveis ao iframe
  
  const updateProgressMutation = useUpdateWatchProgress()

  // Log inicial de fontes disponíveis - sem dependências para evitar loop
  useEffect(() => {
    if (availableSources.length > 0) {
      console.log('VideoPlayer - Sources initialized:', {
        total: availableSources.length,
        current: currentSource.label,
        primary: primarySource.label
      })
    }
  }, [availableSources.length]) // Apenas quando o número de fontes muda

  // Video event handlers simplificados para iframe
  const handleLoadStart = () => {
    console.log('VideoPlayer - Load start for iframe')
    console.log('VideoPlayer - Current source object:', currentSource)
    setError(null)
  }
  const handleCanPlay = () => {
    console.log('VideoPlayer - Iframe ready')
  }
  // handleWaiting e handlePlaying removidos - iframe gerencia buffering
  const handleError = (e: any) => {
    console.error('VideoPlayer - Iframe error occurred:', e)
    
    let errorMessage = 'Erro ao carregar o vídeo'
    let shouldTryNextSource = true
    
    // Para iframes, sempre tentamos fallback em caso de erro
    console.log('VideoPlayer - Iframe failed to load, trying fallback')
    
    // Verificar se é uma URL com token que falhou
    if (primarySource.src.includes('blogger.com') && primarySource.src.includes('token=')) {
      console.log('⚠️ [VideoPlayer] URL com token falhou, tentando fallback para dados mock');
      // Disparar evento personalizado para solicitar dados mock
      window.dispatchEvent(new CustomEvent('requestMockFallback', {
        detail: { animeId, episodeNumber, reason: 'iframe_cors_error' }
      }));
      setError('Carregando fonte alternativa...');
      return;
    }
    
    // Tentar próxima qualidade disponível
    if (shouldTryNextSource && availableSources.length > 1) {
      const currentIndex = availableSources.findIndex(source => source.src === primarySource.src)
      const nextIndex = currentIndex + 1
      
      if (nextIndex < availableSources.length) {
        const nextSource = availableSources[nextIndex]
        console.log(`🔄 [VideoPlayer] Tentando próxima qualidade: ${nextSource.label}`)
        onSourceChange(nextSource)
        return // Não definir erro ainda, tentar próxima fonte
      }
    }
    
    // Se não há mais fontes para tentar, solicitar dados mock
    console.log('⚠️ [VideoPlayer] Todas as fontes falharam, solicitando dados mock');
    window.dispatchEvent(new CustomEvent('requestMockFallback', {
      detail: { animeId, episodeNumber, reason: 'all_sources_failed' }
    }));
    setError('Carregando fonte alternativa...');
  }

  const handleLoadedMetadata = () => {
    // Metadata removida - iframe gerencia suas próprias informações
    console.log('VideoPlayer - Iframe carregado para episódio:', episodeNumber)
  }

  // handleTimeUpdate removido - iframe gerencia seu próprio progresso

  const handleEnded = () => {
    // Mark episode as completed - simplificado para iframe
    if (isAuthenticated) {
      updateProgressMutation.mutate({
        animeId,
        episodeNumber,
        currentTime: 0, // iframe não fornece tempo atual
        duration: 0, // iframe não fornece duração
        completed: true
      })
    }
    
    onEpisodeEnd?.()
  }

  // Progress e sync removidos - não aplicáveis ao iframe
  // O iframe gerencia sua própria reprodução e progresso

  // Volume e playback rate removidos - não aplicáveis ao iframe

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement)
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [setFullscreen])

  // Controls auto-hide simplificado para iframe
  useEffect(() => {
    if (controlsTimeout) {
      clearTimeout(controlsTimeout)
    }
    
    if (showControls) {
      const timeout = setTimeout(() => {
        setShowControls(false)
      }, 3000)
      setControlsTimeout(timeout)
    }
    
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout)
      }
    }
  }, [showControls])

  // Keyboard shortcuts simplificados para iframe
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return
      
      switch (e.code) {
        case 'KeyF':
          e.preventDefault()
          toggleFullscreen(containerRef.current!)
          break
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [toggleFullscreen])

  // Progress bar removido - não aplicável ao iframe
  // O iframe gerencia sua própria reprodução

  // Source change simplificado para iframe
  const handleSourceChange = (sourceLabel: string) => {
    const newSource = availableSources.find(source => source.label === sourceLabel)
    if (newSource && newSource !== currentSource) {
      onSourceChange(newSource)
    }
  }

  // Mouse movement for controls
  const handleMouseMove = () => {
    setShowControls(true)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])

  // Variáveis de progresso removidas - não aplicáveis ao iframe

  return (
    <div 
      ref={containerRef}
      className={`relative bg-black group ${isFullscreen ? 'fixed inset-0 z-50' : 'aspect-video'}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
      tabIndex={0}
    >
      {/* Video Iframe */}
      <iframe
        ref={videoRef}
        className="w-full h-full border-0"
        src={getVideoUrl}
        allowFullScreen
        allow="autoplay; fullscreen; picture-in-picture"
        sandbox="allow-scripts allow-forms"
        onLoad={handleCanPlay}
        onError={handleError}
      />

      {/* Loading overlay removido - não aplicável ao iframe */}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center text-white">
            <p className="text-lg mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null)
                // Iframe será recarregado automaticamente quando o erro for limpo
              }}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
        
        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
          <div className="text-white">
            <h3 className="text-lg font-medium">Episódio {episodeNumber}</h3>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Settings */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-white hover:bg-white/20 rounded transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              {/* Settings Menu */}
              {showSettings && (
                <div className="absolute top-full right-0 mt-2 bg-black/90 rounded-lg p-4 min-w-48">
                  {/* Configurações de velocidade removidas - não aplicáveis ao iframe */}
                  <div className="text-white text-sm">
                    <p>O iframe gerencia suas próprias configurações de reprodução.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Center Play Button */}
        {/* Botão de play removido - não necessário para iframe */}
        
        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Previous Episode */}
              {onPrevious && (
                <button
                  onClick={onPrevious}
                  className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                  title="Episódio anterior"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
              )}
              
              {/* Next Episode */}
              {onNext && (
                <button
                  onClick={onNext}
                  className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                  title="Próximo episódio"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Fullscreen */}
              <button
                onClick={() => toggleFullscreen(containerRef.current!)}
                className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                title={isFullscreen ? "Sair da tela cheia" : "Tela cheia"}
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}