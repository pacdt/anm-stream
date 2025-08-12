import React, { useEffect, useRef, useState } from 'react'
import {
  MediaPlayer,
  MediaOutlet
} from '@vidstack/react'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  RotateCcw,
  Settings,
  Loader2
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { usePlayerStore } from '../store/playerStore'
import { useUpdateWatchProgress } from '../hooks/useHistory'
import { localStorageService } from '../lib/localStorageService'

interface VideoSource {
  src: string
  label: string
  isAlternative?: boolean
}

interface VideoPlayerProps {
  animeId: string
  episodeNumber: number
  currentSource: VideoSource
  availableSources: VideoSource[]
  savedProgress?: {
    currentTime?: number
    duration?: number
    progress_seconds?: number
  }
  onSourceChange: (source: VideoSource) => void
  onNext?: () => void
  onPrevious?: () => void
  onEpisodeEnd?: () => void
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  animeId,
  episodeNumber,
  currentSource,
  availableSources,
  savedProgress,
  onSourceChange,
  onNext,
  onPrevious,
  onEpisodeEnd
}) => {
  const { user, isAuthenticated } = useAuth()
  const playerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const {
    isPlaying,
    volume,
    isMuted,
    playbackRate,
    currentTime,
    duration,
    isFullscreen,
    setPlaying,
    setVolume,
    setMuted,
    setPlaybackRate,
    setCurrentTime,
    setDuration,
    setFullscreen,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    seekTo,
    reset
  } = usePlayerStore()

  const [showSettings, setShowSettings] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false)
  const [isLoading, setLoading] = useState(true)
  const [isBuffering, setBuffering] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const updateProgressMutation = useUpdateWatchProgress()
  const [lastAutoSave, setLastAutoSave] = useState(0)
  
  // Player states
  const [canPlay, setCanPlay] = useState(false)
  const [playerPlaying, setPlayerPlaying] = useState(false)
  const [playerPaused, setPlayerPaused] = useState(false)
  const [playerEnded, setPlayerEnded] = useState(false)
  const [playerWaiting, setPlayerWaiting] = useState(false)
  
  // Log do progresso recebido via props
  useEffect(() => {
    if (savedProgress) {
      console.log('VideoPlayer - Progresso recebido via props:', {
        currentTime: savedProgress.currentTime,
        duration: savedProgress.duration,
        progress_seconds: savedProgress.progress_seconds
      })
    }
  }, [savedProgress])

  // Sync player states with store
  useEffect(() => {
    setPlaying(playerPlaying)
  }, [playerPlaying, setPlaying])

  // Carregar progresso salvo quando o vídeo estiver pronto
  useEffect(() => {
    if (savedProgress && canPlay && !hasLoadedProgress && playerRef.current) {
      const savedTime = savedProgress.progress_seconds || savedProgress.currentTime || 0
      console.log('VideoPlayer - Carregando progresso salvo:', savedTime, 'segundos')
      
      if (savedTime > 0) {
        try {
          playerRef.current.currentTime = savedTime
          setHasLoadedProgress(true)
          console.log('VideoPlayer - Progresso carregado com sucesso:', savedTime)
        } catch (error) {
          console.error('VideoPlayer - Erro ao definir currentTime:', error)
          setHasLoadedProgress(true)
        }
      } else {
        setHasLoadedProgress(true)
        console.log('VideoPlayer - Nenhum progresso para carregar (tempo = 0)')
      }
    }
  }, [savedProgress, canPlay, hasLoadedProgress, setCurrentTime])

  // Reset hasLoadedProgress when episode changes
  useEffect(() => {
    setHasLoadedProgress(false)
    setCanPlay(false)
    setPlayerPlaying(false)
    setPlayerPaused(false)
    setPlayerEnded(false)
    setPlayerWaiting(false)
  }, [animeId, episodeNumber])

  // Handle loading states
  useEffect(() => {
    if (canPlay) {
      setLoading(false)
    }
  }, [canPlay])

  useEffect(() => {
    setBuffering(playerWaiting)
  }, [playerWaiting])

  // Handle pause for progress saving
  useEffect(() => {
    if (playerPaused && !playerEnded && isAuthenticated && user?.id && playerRef.current) {
      const currentTimeValue = playerRef.current.currentTime
      const durationValue = playerRef.current.duration
      
      if (currentTimeValue > 0) {
        // Salvar primeiro no localStorage
        localStorageService.saveWatchProgress({
          userId: user.id,
          animeId,
          episodeNumber,
          currentTime: currentTimeValue,
          duration: durationValue,
          lastWatchedAt: new Date().toISOString(),
          animeName: `Anime ${animeId}`
        })
        
        // Tentar sincronizar com Supabase
        updateProgressMutation.mutate({
          animeId: parseInt(animeId),
          animeName: `Anime ${animeId}`,
          episodeNumber,
          currentTimeSeconds: currentTimeValue,
          totalDurationSeconds: durationValue,
          isCompleted: false
        })
      }
    }
  }, [playerPaused, playerEnded, isAuthenticated, user, animeId, episodeNumber, updateProgressMutation])

  // Handle episode end
  useEffect(() => {
    if (playerEnded && isAuthenticated && user?.id && playerRef.current) {
      console.log('VideoPlayer - Episode ended')
      
      // Mark episode as completed
      localStorageService.saveWatchProgress({
        userId: user.id,
        animeId,
        episodeNumber,
        currentTime: playerRef.current.duration,
        duration: playerRef.current.duration,
        lastWatchedAt: new Date().toISOString(),
        animeName: `Anime ${animeId}`
      })
      
      // Tentar sincronizar com Supabase
      updateProgressMutation.mutate({
        animeId: parseInt(animeId),
        animeName: `Anime ${animeId}`,
        episodeNumber,
        currentTimeSeconds: playerRef.current.duration,
        totalDurationSeconds: playerRef.current.duration,
        isCompleted: true
      })
      
      onEpisodeEnd?.()
    }
  }, [playerEnded, isAuthenticated, user, animeId, episodeNumber, updateProgressMutation, onEpisodeEnd])

  // Auto-save progress
  useEffect(() => {
    if (isAuthenticated && currentTime - lastAutoSave > 30 && playerRef.current) {
      const time = currentTime
      
      // Salvar primeiro no localStorage
      if (user?.id) {
        localStorageService.saveWatchProgress({
          userId: user.id,
          animeId,
          episodeNumber,
          currentTime: time,
          duration: playerRef.current.duration,
          lastWatchedAt: new Date().toISOString(),
          animeName: `Anime ${animeId}`
        })
      }
      
      // Tentar sincronizar com Supabase em background
      if (user?.id) {
        updateProgressMutation.mutate({
          animeId: parseInt(animeId),
          animeName: `Anime ${animeId}`,
          episodeNumber,
          currentTimeSeconds: time,
          totalDurationSeconds: playerRef.current.duration,
          isCompleted: false
        })
      }
      setLastAutoSave(time)
    }
  }, [currentTime, lastAutoSave, isAuthenticated, user, animeId, episodeNumber, updateProgressMutation])

  // Sync player controls with store
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.playbackRate = playbackRate
    }
  }, [playbackRate])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!playerRef.current) return
      
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
          toggleFullscreen()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [togglePlay, seekTo, currentTime, duration, setVolume, volume, toggleMute, toggleFullscreen])

  // Handle source change
  const handleSourceChange = (sourceLabel: string) => {
    const newSource = availableSources.find(s => s.label === sourceLabel)
    if (newSource && newSource.src !== currentSource.src) {
      const currentTimeBackup = currentTime
      onSourceChange(newSource)
      
      // Restore time after source change
      setTimeout(() => {
        if (playerRef.current) {
          playerRef.current.currentTime = currentTimeBackup
          if (isPlaying) {
            playerRef.current.play()
          }
        }
      }, 100)
    }
  }

  // Mouse movement for controls
  const handleMouseMove = () => {
    setShowControls(true)
  }

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement)
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [setFullscreen])

  // Auto-hide controls
  useEffect(() => {
    if (showControls && isPlaying) {
      const timer = setTimeout(() => {
        setShowControls(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showControls, isPlaying])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div 
      ref={containerRef}
      className={`relative bg-black group ${isFullscreen ? 'fixed inset-0 z-50' : 'aspect-video'}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
      tabIndex={0}
    >
      {/* Vidstack Media Player */}
      <MediaPlayer
        ref={playerRef}
        className="w-full h-full"
        src={currentSource.src}
        volume={isMuted ? 0 : volume}
        playbackRate={playbackRate}
        onLoadStart={() => {
          console.log('VideoPlayer - Load start')
          setLoading(true)
          setError(null)
        }}
        onCanPlay={() => {
          console.log('VideoPlayer - Can play')
          setLoading(false)
          setCanPlay(true)
        }}
        onWaiting={() => {
          console.log('VideoPlayer - Waiting/Buffering')
          setPlayerWaiting(true)
          setBuffering(true)
        }}
        onPlaying={() => {
          console.log('VideoPlayer - Playing')
          setPlayerWaiting(false)
          setBuffering(false)
          setPlayerPlaying(true)
          setPlayerPaused(false)
        }}
        onPause={() => {
          console.log('VideoPlayer - Paused')
          setPlayerPlaying(false)
          setPlayerPaused(true)
        }}
        onEnded={() => {
          console.log('VideoPlayer - Ended')
          setPlayerPlaying(false)
          setPlayerEnded(true)
        }}
        onTimeUpdate={() => {
          if (playerRef.current && !isDragging) {
            const time = playerRef.current.currentTime
            setCurrentTime(time)
          }
        }}
        onLoadedMetadata={() => {
          if (playerRef.current) {
            const durationValue = playerRef.current.duration
            console.log('VideoPlayer - Metadata loaded, duration:', durationValue)
            setDuration(durationValue)
          }
        }}
        onError={(error) => {
          console.log('VideoPlayer - Error occurred:', error)
          setError('Erro ao carregar o vídeo')
          setLoading(false)
          setBuffering(false)
        }}
      >
        <MediaOutlet />
      </MediaPlayer>

      {/* Loading Overlay */}
      {(isLoading || isBuffering) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-center text-white">
            <p className="text-lg mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null)
                if (playerRef.current) {
                  playerRef.current.load()
                }
              }}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      {/* Custom Controls Overlay */}
      <div className={`absolute inset-0 transition-opacity duration-300 z-20 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
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
                  {/* Sources */}
                  {availableSources.length > 1 && (
                    <div className="mb-4">
                      <h4 className="text-white text-sm font-medium mb-2">Fonte</h4>
                      <div className="space-y-1">
                        {availableSources.map((source, index) => (
                          <button
                            key={index}
                            onClick={() => handleSourceChange(source.label)}
                            className={`block w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                              currentSource.label === source.label
                                ? 'bg-red-600 text-white'
                                : 'text-gray-300 hover:bg-white/20'
                            }`}
                          >
                            {source.label}
                            {source.isAlternative && (
                              <span className="text-xs text-gray-400 ml-1">(Alt)</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
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
            className="w-full h-0.5 bg-white/30 rounded-full mb-6 cursor-pointer group/progress"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const percent = (e.clientX - rect.left) / rect.width
              const newTime = percent * duration
              seekTo(newTime)
            }}
          >
            {/* Progress */}
            <div 
              className="absolute h-0.5 bg-red-600 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
            {/* Thumb */}
            <div 
              className="absolute w-2 h-2 bg-red-600 rounded-full -mt-0.5 opacity-0 group-hover/progress:opacity-100 transition-opacity"
              style={{ left: `${progressPercentage}%`, transform: 'translateX(-50%)' }}
            />
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Previous Episode */}
              {onPrevious && (
                <button
                  onClick={onPrevious}
                  className="p-2 text-white hover:bg-white/20 rounded transition-colors"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
              )}
              
              {/* Rewind */}
              <button
                onClick={() => seekTo(Math.max(0, currentTime - 10))}
                className="p-2 text-white hover:bg-white/20 rounded transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="p-2 text-white hover:bg-white/20 rounded transition-colors"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              
              {/* Forward */}
              <button
                onClick={() => seekTo(Math.min(duration, currentTime + 10))}
                className="p-2 text-white hover:bg-white/20 rounded transition-colors"
              >
                <SkipForward className="w-5 h-5" />
              </button>
              
              {/* Next Episode */}
              {onNext && (
                <button
                  onClick={onNext}
                  className="p-2 text-white hover:bg-white/20 rounded transition-colors"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              )}
              
              {/* Volume */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-2 text-white hover:bg-white/20 rounded transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
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
                  className="w-20 accent-red-600"
                />
              </div>
              
              {/* Time */}
              <div className="text-white text-sm">
                {formatDuration(currentTime)} / {formatDuration(duration)}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Fullscreen */}
              <button
                onClick={() => {
                  if (containerRef.current) {
                    if (isFullscreen) {
                      document.exitFullscreen()
                    } else {
                      containerRef.current.requestFullscreen()
                    }
                  }
                }}
                className="p-2 text-white hover:bg-white/20 rounded transition-colors"
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}