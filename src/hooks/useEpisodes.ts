import { useQuery, useMutation } from '@tanstack/react-query'
import { EpisodeService } from '@/lib/api'
import { SupabaseService } from '@/lib/supabaseService'

// Hook para listar episódios de um anime
export const useEpisodes = (animeId: number) => {
  return useQuery({
    queryKey: ['episodes', animeId],
    queryFn: () => EpisodeService.getEpisodes(animeId),
    enabled: !!animeId,
    staleTime: 10 * 60 * 1000, // 10 minutos
    cacheTime: 30 * 60 * 1000, // 30 minutos
  })
}

// Hook para obter dados de streaming de um episódio
export const useEpisodeStream = (animeId: number, episodeNumber: number) => {
  return useQuery({
    queryKey: ['episode-stream', animeId, episodeNumber],
    queryFn: () => EpisodeService.getEpisodeStream(animeId, episodeNumber),
    enabled: !!animeId && !!episodeNumber,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 15 * 60 * 1000, // 15 minutos
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

// Hook para progresso de todos os episódios de um anime
export const useAnimeProgress = (animeId: number) => {
  return useQuery({
    queryKey: ['anime-progress', animeId],
    queryFn: () => SupabaseService.getAnimeProgress(animeId),
    enabled: !!animeId,
    staleTime: 1 * 60 * 1000, // 1 minuto
  })
}

// Hook customizado para gerenciar o estado do episódio atual
export const useCurrentEpisode = (animeId: number, episodeNumber: number) => {
  const { data: episodes, isLoading: episodesLoading } = useEpisodes(animeId)
  const { data: streamData, isLoading: streamLoading, error: streamError } = useEpisodeStream(animeId, episodeNumber)
  const { data: progress } = useEpisodeProgress(animeId, episodeNumber)
  
  const currentEpisode = episodes?.episodes?.find(ep => ep.episode_number === episodeNumber)
  const nextEpisode = episodes?.episodes?.find(ep => ep.episode_number === episodeNumber + 1)
  const previousEpisode = episodes?.episodes?.find(ep => ep.episode_number === episodeNumber - 1)
  
  return {
    currentEpisode,
    nextEpisode,
    previousEpisode,
    streamData,
    progress,
    totalEpisodes: episodes?.total_episodes || 0,
    isLoading: episodesLoading || streamLoading,
    error: streamError,
    hasNext: !!nextEpisode,
    hasPrevious: !!previousEpisode,
  }
}

// Hook para progresso de um episódio específico (reutilizado do useAnimes)
export const useEpisodeProgress = (animeId: number, episodeNumber: number) => {
  return useQuery({
    queryKey: ['episode-progress', animeId, episodeNumber],
    queryFn: () => SupabaseService.getEpisodeProgress(animeId, episodeNumber),
    enabled: !!animeId && !!episodeNumber,
    staleTime: 30 * 1000, // 30 segundos
  })
}