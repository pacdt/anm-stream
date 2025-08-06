import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SupabaseService } from '@/lib/supabaseService'
import { localStorageService } from '@/lib/localStorageService'
import { useAuth } from '@/hooks/useAuth'
import { WatchHistoryItem, HistoryResponse } from '@/types'

// Hook para buscar histórico com filtros (híbrido: Supabase + localStorage)
export const useWatchHistory = (params: {
  period?: 'today' | 'week' | 'month' | 'all'
  search?: string
  page?: number
  limit?: number
} = {}) => {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['watch-history', params, user?.id],
    queryFn: async (): Promise<HistoryResponse> => {
      let supabaseHistory: WatchHistoryItem[] = []
      let localHistory: WatchHistoryItem[] = []
      
      // Tentar buscar do Supabase primeiro
      try {
        supabaseHistory = await SupabaseService.getWatchHistory()
        console.log('useWatchHistory - Dados do Supabase:', supabaseHistory.length, 'itens')
      } catch (error) {
        console.warn('useWatchHistory - Erro ao buscar do Supabase:', error)
      }
      
      // Buscar do localStorage como fallback
      if (user?.id) {
        const localItems = localStorageService.getWatchHistory(user.id)
        console.log('useWatchHistory - Dados do localStorage:', localItems.length, 'itens')
        
        // Converter formato do localStorage para WatchHistoryItem
        localHistory = localItems.map(item => ({
          id: `${item.userId}-${item.animeId}-${item.episodeNumber}`,
          user_id: item.userId,
          anime_id: parseInt(item.animeId),
          anime_name: item.animeName,
          episode_number: item.episodeNumber,
          progress_seconds: item.currentTime,
          total_duration_seconds: item.duration,
          last_position_seconds: item.currentTime,
          is_completed: (item.currentTime / item.duration) >= 0.9,
          last_watched_at: item.lastWatchedAt,
          last_watched: item.lastWatchedAt
        }))
      }
      
      // Combinar dados do Supabase e localStorage, priorizando Supabase
      const combinedHistory = new Map<string, WatchHistoryItem>()
      
      // Adicionar dados do localStorage primeiro
      localHistory.forEach(item => {
        const key = `${item.anime_id}-${item.episode_number}`
        combinedHistory.set(key, item)
      })
      
      // Sobrescrever com dados do Supabase (mais confiáveis)
      supabaseHistory.forEach(item => {
        const key = `${item.anime_id}-${item.episode_number}`
        combinedHistory.set(key, item)
      })
      
      let filteredHistory = Array.from(combinedHistory.values())
      console.log('useWatchHistory - Histórico combinado:', filteredHistory.length, 'itens')
      
      // Aplicar filtros
      // Filtro de busca
      if (params.search) {
        const searchLower = params.search.toLowerCase()
        filteredHistory = filteredHistory.filter(item => 
          item.anime_name.toLowerCase().includes(searchLower)
        )
      }
      
      // Filtro de período
      if (params.period && params.period !== 'all') {
        const now = new Date()
        filteredHistory = filteredHistory.filter(item => {
          const itemDate = new Date(item.last_watched_at || item.last_watched)
          
          switch (params.period) {
            case 'today':
              return itemDate.toDateString() === now.toDateString()
            case 'week':
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
              return itemDate >= weekAgo
            case 'month':
              const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
              return itemDate >= monthAgo
            default:
              return true
          }
        })
      }
      
      // Ordenar por data mais recente
      filteredHistory.sort((a, b) => 
        new Date(b.last_watched_at || b.last_watched).getTime() - 
        new Date(a.last_watched_at || a.last_watched).getTime()
      )
      
      // Paginação
      const page = params.page || 1
      const limit = params.limit || 20
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedHistory = filteredHistory.slice(startIndex, endIndex)
      
      return {
        entries: paginatedHistory,
        total: filteredHistory.length,
        totalPages: Math.ceil(filteredHistory.length / limit),
        currentPage: page,
        hasNext: endIndex < filteredHistory.length,
        hasPrev: page > 1
      }
    },
    staleTime: 1 * 60 * 1000
  })
}

// Hook para progresso de um episódio específico (híbrido)
export const useEpisodeProgress = (animeId: number, episodeNumber: number) => {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['episode-progress', animeId, episodeNumber, user?.id],
    queryFn: async () => {
      // Tentar buscar do Supabase primeiro
      try {
        const supabaseProgress = await SupabaseService.getEpisodeProgress(animeId, episodeNumber)
        if (supabaseProgress) {
          return supabaseProgress
        }
      } catch (error) {
        console.warn('useEpisodeProgress - Erro ao buscar do Supabase:', error)
      }
      
      // Fallback para localStorage
      if (user?.id) {
        const localProgress = localStorageService.getEpisodeProgress(user.id, animeId.toString(), episodeNumber)
        if (localProgress) {
          return {
            progress_seconds: localProgress.currentTime,
            total_duration_seconds: localProgress.duration
          }
        }
      }
      
      return null
    },
    enabled: !!animeId && !!episodeNumber,
    staleTime: 30 * 1000, // 30 segundos
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

// Mutation para atualizar progresso de visualização
export const useUpdateWatchProgress = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({
      animeId,
      animeName,
      episodeNumber,
      progressSeconds,
      totalDurationSeconds
    }: {
      animeId: number
      animeName: string
      episodeNumber: number
      progressSeconds: number
      totalDurationSeconds?: number
    }) => SupabaseService.updateWatchProgress(
      animeId,
      animeName,
      episodeNumber,
      progressSeconds,
      totalDurationSeconds
    ),
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['watch-history'] })
      queryClient.invalidateQueries({ 
        queryKey: ['episode-progress', variables.animeId, variables.episodeNumber] 
      })
      queryClient.invalidateQueries({ 
        queryKey: ['anime-progress', variables.animeId] 
      })
    },
  })
}

// Mutation para limpar histórico
export const useClearHistory = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId }: { userId: string }) => SupabaseService.clearWatchHistory(userId),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['watch-history'] })
    },
  })
}

// Mutation para remover item específico do histórico
export const useRemoveFromHistory = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ animeId, episodeNumber }: { animeId: number, episodeNumber: number }) => 
      SupabaseService.removeFromHistory(animeId, episodeNumber),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['watch-history'] })
    },
  })
}