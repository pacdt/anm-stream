import React, { useRef, useEffect, useState, useCallback } from 'react'
import { usePlayerStore } from '@/store/playerStore'
import { useUpdateWatchProgress } from '@/hooks/useAnimes'
import { useAuth } from '@/hooks/useAuth'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Settings,
  SkipBack,
  SkipForward,
  RotateCcw,
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
  
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isFullscreen,
    playbackRate,
    currentQuality,
    availableQualities,
    isLoading,
    isBuffering,
    error,
    showControls,
    controlsTimeout,
    setPlaying,
    setCurrentTime,
    setDuration,
    setVolume,
    setMuted,
    setFullscreen,
    setPlaybackRate,
    setCurrentQuality,
    setAvailableQualities,
    setLoading,
    setBuffering,
    setError,
    setShowControls,
    setControlsTimeout,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    seekTo,
    reset
  } = usePlayerStore()

  const [showSettings, setShowSettings] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [lastProgressUpdate, setLastProgressUpdate] = useState(0)
  
  const updateProgressMutation = useUpdateWatchProgress()

  // Initialize available qualities
  useEffect(() => {
    console.log('VideoPlayer - Available sources received:', availableSources)
    console.log('VideoPlayer - Available sources length:', availableSources.length)
    console.log('VideoPlayer - Current source:', currentSource)
    console.log('VideoPlayer - Current source URL:', currentSource.src)
    console.log('VideoPlayer - URL type check:', typeof currentSource.src)
    console.log('VideoPlayer - URL validity check:', currentSource.src && currentSource.src.length > 0)
    
    const qualities = availableSources.map(source => source.label)
    setAvailableQualities(qualities)
    setCurrentQuality(currentSource.label)
  }, [availableSources, currentSource, setAvailableQualities, setCurrentQuality])

  // Video event handlers
  const handleLoadStart = () => {
    console.log('VideoPlayer - Load start for URL:', videoRef.current?.src)
    console.log('VideoPlayer - Current source object:', currentSource)
    setLoading(true)
    setError(null)
  }
  const handleCanPlay = () => setLoading(false)
  const handleWaiting = () => setBuffering(true)
  const handlePlaying = () => setBuffering(false)
  const handleError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget
    const error = video.error
    
    console.log('VideoPlayer - Error occurred:', error)
    console.log('VideoPlayer - Current video src:', video.src)
    console.log('VideoPlayer - Video readyState:', video.readyState)
    console.log('VideoPlayer - Video networkState:', video.networkState)
    
    if (error) {
      console.log('VideoPlayer - Error code:', error.code)
      console.log('VideoPlayer - Error message:', error.message)
      
      let errorMessage = 'Erro ao carregar o vídeo'
      let shouldTryNextSource = false
      
      switch (error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          errorMessage = 'Reprodução abortada'
          console.log('VideoPlayer - Error: MEDIA_ERR_ABORTED')
          break
        case MediaError.MEDIA_ERR_NETWORK:
          errorMessage = 'Erro de rede'
          console.log('VideoPlayer - Error: MEDIA_ERR_NETWORK')
          shouldTryNextSource = true
          break
        case MediaError.MEDIA_ERR_DECODE:
          errorMessage = 'Erro de decodificação'
          console.log('VideoPlayer - Error: MEDIA_ERR_DECODE')
          shouldTryNextSource = true
          break
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = 'Formato não suportado'
          console.log('VideoPlayer - Error: MEDIA_ERR_SRC_NOT_SUPPORTED')
          console.log('VideoPlayer - Unsupported source URL:', video.src)
          shouldTryNextSource = true
          break
      }
      
      // Verificar se é uma URL com token que falhou
      if (shouldTryNextSource && video.src.includes('blogger.com') && video.src.includes('token=')) {
        console.log('⚠️ [VideoPlayer] URL com token falhou, tentando fallback para dados mock');
        // Disparar evento personalizado para solicitar dados mock
        window.dispatchEvent(new CustomEvent('requestMockFallback', {
          detail: { animeId, episodeNumber, reason: 'token_failed' }
        }));
        setError('Carregando fonte alternativa...');
        return;
      }
      
      // Tentar próxima qualidade disponível se o erro permite
      if (shouldTryNextSource && availableSources.length > 1) {
        const currentIndex = availableSources.findIndex(source => source.src === currentSource.src)
        const nextIndex = currentIndex + 1
        
        if (nextIndex < availableSources.length) {
          const nextSource = availableSources[nextIndex]
          console.log(`🔄 [VideoPlayer] Tentando próxima qualidade: ${nextSource.label}`)
          onSourceChange(nextSource)
          return // Não definir erro ainda, tentar próxima fonte
        }
      }
      
      setError(errorMessage)
    }
    
    setLoading(false)
    setBuffering(false)
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
      
      // Apply saved progress if available
      if (savedProgress && savedProgress.progress_seconds > 0) {
        const progressTime = Math.min(savedProgress.progress_seconds, videoRef.current.duration)
        videoRef.current.currentTime = progressTime
        setCurrentTime(progressTime)
        console.log('VideoPlayer - Applied saved progress:', progressTime, 'seconds')
      }
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current && !isDragging) {
      const time = videoRef.current.currentTime
      setCurrentTime(time)
      
      // Update progress in database every 10 seconds
      if (isAuthenticated && time - lastProgressUpdate > 10) {
        updateProgressMutation.mutate({
          animeId,
          episodeNumber,
          currentTime: time,
          duration: videoRef.current.duration
        })
        setLastProgressUpdate(time)
      }
    }
  }

  const handleEnded = () => {
    setPlaying(false)
    
    // Mark episode as completed
    if (isAuthenticated) {
      updateProgressMutation.mutate({
        animeId,
        episodeNumber,
        currentTime: duration,
        duration,
        completed: true
      })
    }
    
    onEpisodeEnd?.()
  }

  // Apply saved progress when episode changes
  useEffect(() => {
    if (videoRef.current && savedProgress && savedProgress.progress_seconds > 0) {
      const progressTime = Math.min(savedProgress.progress_seconds, videoRef.current.duration || 0)
      if (videoRef.current.duration > 0) {
        videoRef.current.currentTime = progressTime
        setCurrentTime(progressTime)
        console.log('VideoPlayer - Applied saved progress on episode change:', progressTime, 'seconds')
      }
    }
  }, [episodeNumber, savedProgress, setCurrentTime])

  // Sync video element with store
  useEffect(() => {
    if (!videoRef.current) return
    
    if (isPlaying) {
      videoRef.current.play().catch(console.error)
    } else {
      videoRef.current.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate
    }
  }, [playbackRate])

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement)
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [setFullscreen])

  // Controls auto-hide
  useEffect(() => {
    if (controlsTimeout) {
      clearTimeout(controlsTimeout)
    }
    
    if (showControls) {
      const timeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false)
        }
      }, 3000)
      setControlsTimeout(timeout)
    }
    
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout)
      }
    }
  }, [showControls, isPlaying, setShowControls, setControlsTimeout])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return
      
      switch (e.code) {
        case 'Space':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowLeft':
          e.preventDefault()
          seekTo(Math.max(0, currentTime - 10))
          break
        case 'ArrowRight':
          e.preventDefault()
          seekTo(Math.min(duration, currentTime + 10))
          break
        case 'ArrowUp':
          e.preventDefault()
          setVolume(Math.min(1, volume + 0.1))
          break
        case 'ArrowDown':
          e.preventDefault()
          setVolume(Math.max(0, volume - 0.1))
          break
        case 'KeyM':
          e.preventDefault()
          toggleMute()
          break
        case 'KeyF':
          e.preventDefault()
          toggleFullscreen(containerRef.current!)
          break
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [currentTime, duration, volume, togglePlay, seekTo, setVolume, toggleMute, toggleFullscreen])

  // Progress bar handling
  const handleProgressClick = (e: React.MouseEvent) => {
    if (!progressRef.current || !duration) return
    
    const rect = progressRef.current.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const time = percent * duration
    seekTo(time)
  }

  const handleProgressDrag = useCallback((e: MouseEvent) => {
    if (!progressRef.current || !duration || !isDragging) return
    
    const rect = progressRef.current.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const time = percent * duration
    setCurrentTime(time)
    
    if (videoRef.current) {
      videoRef.current.currentTime = time
    }
  }, [duration, isDragging, setCurrentTime])

  const handleProgressDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleProgressDrag)
      document.addEventListener('mouseup', handleProgressDragEnd)
    }
    
    return () => {
      document.removeEventListener('mousemove', handleProgressDrag)
      document.removeEventListener('mouseup', handleProgressDragEnd)
    }
  }, [isDragging, handleProgressDrag, handleProgressDragEnd])

  // Source change
  const handleSourceChange = (sourceLabel: string) => {
    const newSource = availableSources.find(source => source.label === sourceLabel)
    if (newSource && newSource !== currentSource) {
      const currentTimeBackup = currentTime
      onSourceChange(newSource)
      
      // Restore time after source change
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = currentTimeBackup
          if (isPlaying) {
            videoRef.current.play()
          }
        }
      }, 100)
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

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0
  const bufferedPercentage = videoRef.current?.buffered.length > 0 
    ? (videoRef.current.buffered.end(0) / duration) * 100 
    : 0

  return (
    <div 
      ref={containerRef}
      className={`relative bg-black group ${isFullscreen ? 'fixed inset-0 z-50' : 'aspect-video'}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
      tabIndex={0}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full"
        src={currentSource.src}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
        onError={handleError}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onClick={togglePlay}
      />

      {/* Loading Overlay */}
      {(isLoading || isBuffering) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center text-white">
            <p className="text-lg mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null)
                if (videoRef.current) {
                  videoRef.current.load()
                }
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
        showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
        
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
                  {/* Playback Speed */}
                  <div>
                    <h4 className="text-white text-sm font-medium mb-2">Velocidade</h4>
                    <div className="space-y-1">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => setPlaybackRate(speed)}
                          className={`block w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                            playbackRate === speed
                              ? 'bg-red-600 text-white'
                              : 'text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Center Play Button */}
        {!isPlaying && !isLoading && !isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="bg-red-600 hover:bg-red-700 rounded-full p-4 transition-colors"
            >
              <Play className="w-8 h-8 text-white" />
            </button>
          </div>
        )}
        
        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div 
            ref={progressRef}
            className="w-full h-1 bg-white/30 rounded-full mb-3 cursor-pointer group/progress relative"
            onClick={handleProgressClick}
            onMouseDown={() => setIsDragging(true)}
          >
            {/* Buffered */}
            <div 
              className="absolute top-0 left-0 h-full bg-white/40 rounded-full"
              style={{ width: `${bufferedPercentage}%` }}
            />
            {/* Progress */}
            <div 
              className="absolute top-0 left-0 h-full bg-red-600 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
            {/* Thumb */}
            <div 
              className="absolute w-3 h-3 bg-red-600 rounded-full top-1/2 -translate-y-1/2 opacity-0 group-hover/progress:opacity-100 transition-opacity shadow-lg"
              style={{ left: `${progressPercentage}%`, transform: 'translateX(-50%) translateY(-50%)' }}
            />
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Previous Episode - Hidden on small screens */}
              {onPrevious && (
                <button
                  onClick={onPrevious}
                  className="hidden sm:flex p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                  title="Episódio anterior"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
              )}
              
              {/* Rewind */}
              <button
                onClick={() => seekTo(Math.max(0, currentTime - 10))}
                className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                title="Voltar 10s"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="p-3 text-white hover:bg-white/20 rounded-full transition-colors"
                title={isPlaying ? "Pausar" : "Reproduzir"}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              
              {/* Forward */}
              <button
                onClick={() => seekTo(Math.min(duration, currentTime + 10))}
                className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                title="Avançar 10s"
              >
                <SkipForward className="w-4 h-4" />
              </button>
              
              {/* Next Episode - Hidden on small screens */}
              {onNext && (
                <button
                  onClick={onNext}
                  className="hidden sm:flex p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                  title="Próximo episódio"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              )}
              
              {/* Volume - Hidden on very small screens */}
              <div className="hidden md:flex items-center gap-2 ml-2">
                <button
                  onClick={toggleMute}
                  className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                  title={isMuted ? "Ativar som" : "Silenciar"}
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const newVolume = parseFloat(e.target.value)
                    setVolume(newVolume)
                    if (newVolume > 0 && isMuted) {
                      setMuted(false)
                    }
                  }}
                  className="w-12 lg:w-16 h-1 accent-red-600 bg-white/30 rounded-full"
                  title="Volume"
                />
              </div>
              
              {/* Volume button only for mobile */}
              <button
                onClick={toggleMute}
                className="md:hidden p-2 text-white hover:bg-white/20 rounded-full transition-colors"
                title={isMuted ? "Ativar som" : "Silenciar"}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              
              {/* Time - Responsive text size */}
              <div className="text-white text-xs sm:text-sm font-mono ml-1 sm:ml-2 min-w-max">
                <span className="hidden sm:inline">{formatDuration(currentTime)} / {formatDuration(duration)}</span>
                <span className="sm:hidden">{formatDuration(currentTime)}</span>
              </div>
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