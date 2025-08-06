import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SupabaseService } from '@/lib/supabaseService'
import { WatchHistoryItem, HistoryResponse } from '@/types'

interface HistoryParams {
  userId: string
  search?: string
  dateRange?: 'today' | 'week' | 'month' | 'all'
  page?: number
  limit?: number
}

// Hook para buscar histórico com filtros
export const useWatchHistory = (params: {
  period?: 'today' | 'week' | 'month' | 'all'
  search?: string
  page?: number
  limit?: number
} = {}): { data?: HistoryResponse; isLoading: boolean; error: any } => {
  return useQuery({
    queryKey: ['watch-history', params],
    queryFn: async (): Promise<HistoryResponse> => {
      const history = await SupabaseService.getWatchHistory()
      
      // Aplicar filtros
      let filteredHistory = history
      
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

// Hook para progresso de um episódio específico
export const useEpisodeProgress = (animeId: number, episodeNumber: number) => {
  return useQuery({
    queryKey: ['episode-progress', animeId, episodeNumber],
    queryFn: () => SupabaseService.getEpisodeProgress(animeId, episodeNumber),
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