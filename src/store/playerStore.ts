import { create } from 'zustand'
import { VideoQualityOption } from '@/types'

interface PlayerState {
  // Estado do player
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  isFullscreen: boolean
  playbackRate: number
  
  // Qualidade de vídeo
  availableQualities: VideoQualityOption[]
  currentQuality: VideoQualityOption | null
  
  // Episódio atual
  currentAnimeId: number | null
  currentEpisode: number | null
  animeName: string | null
  
  // Estados de carregamento
  isLoading: boolean
  isBuffering: boolean
  error: string | null
  
  // Controles
  showControls: boolean
  controlsTimeout: NodeJS.Timeout | null
  
  // Actions
  setPlaying: (playing: boolean) => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  setVolume: (volume: number) => void
  setMuted: (muted: boolean) => void
  setFullscreen: (fullscreen: boolean) => void
  setPlaybackRate: (rate: number) => void
  
  setAvailableQualities: (qualities: VideoQualityOption[]) => void
  setCurrentQuality: (quality: VideoQualityOption) => void
  
  setCurrentEpisode: (animeId: number, episode: number, animeName: string) => void
  
  setLoading: (loading: boolean) => void
  setBuffering: (buffering: boolean) => void
  setError: (error: string | null) => void
  
  setShowControls: (show: boolean) => void
  setControlsTimeout: (timeout: NodeJS.Timeout | null) => void
  
  // Utility actions
  togglePlay: () => void
  toggleMute: () => void
  toggleFullscreen: () => void
  seekTo: (time: number) => void
  reset: () => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  // Estado inicial
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  isFullscreen: false,
  playbackRate: 1,
  
  availableQualities: [],
  currentQuality: null,
  
  currentAnimeId: null,
  currentEpisode: null,
  animeName: null,
  
  isLoading: false,
  isBuffering: false,
  error: null,
  
  showControls: true,
  controlsTimeout: null,
  
  // Actions
  setPlaying: (playing: boolean) => set({ isPlaying: playing }),
  setCurrentTime: (time: number) => set({ currentTime: time }),
  setDuration: (duration: number) => set({ duration }),
  setVolume: (volume: number) => set({ volume }),
  setMuted: (muted: boolean) => set({ isMuted: muted }),
  setFullscreen: (fullscreen: boolean) => set({ isFullscreen: fullscreen }),
  setPlaybackRate: (rate: number) => set({ playbackRate: rate }),
  
  setAvailableQualities: (qualities: VideoQualityOption[]) => set({ availableQualities: qualities }),
  setCurrentQuality: (quality: VideoQualityOption) => set({ currentQuality: quality }),
  
  setCurrentEpisode: (animeId: number, episode: number, animeName: string) => 
    set({ currentAnimeId: animeId, currentEpisode: episode, animeName }),
  
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setBuffering: (buffering: boolean) => set({ isBuffering: buffering }),
  setError: (error: string | null) => set({ error }),
  
  setShowControls: (show: boolean) => set({ showControls: show }),
  setControlsTimeout: (timeout: NodeJS.Timeout | null) => {
    const { controlsTimeout } = get()
    if (controlsTimeout) {
      clearTimeout(controlsTimeout)
    }
    set({ controlsTimeout: timeout })
  },
  
  // Utility actions
  togglePlay: () => {
    const { isPlaying } = get()
    set({ isPlaying: !isPlaying })
  },
  
  toggleMute: () => {
    const { isMuted } = get()
    set({ isMuted: !isMuted })
  },
  
  toggleFullscreen: () => {
    const { isFullscreen } = get()
    set({ isFullscreen: !isFullscreen })
  },
  
  seekTo: (time: number) => {
    set({ currentTime: time })
  },
  
  reset: () => {
    const { controlsTimeout } = get()
    if (controlsTimeout) {
      clearTimeout(controlsTimeout)
    }
    
    set({
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 1,
      isMuted: false,
      isFullscreen: false,
      playbackRate: 1,
      availableQualities: [],
      currentQuality: null,
      currentAnimeId: null,
      currentEpisode: null,
      animeName: null,
      isLoading: false,
      isBuffering: false,
      error: null,
      showControls: true,
      controlsTimeout: null
    })
  }
}))