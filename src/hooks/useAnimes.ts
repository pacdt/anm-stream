import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AnimeService } from '@/lib/api'
import { SupabaseService } from '@/lib/supabaseService'
import { Anime } from '@/types'

// Hook para listar animes com paginação
export const useAnimes = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['animes', page, limit],
    queryFn: () => AnimeService.getAnimes(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  })
}

// Hook para buscar anime por ID
export const useAnime = (id: number) => {
  return useQuery({
    queryKey: ['anime', id],
    queryFn: () => AnimeService.getAnimeById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutos
  })
}

// Hook para buscar animes com scroll infinito
export const useInfiniteAnimes = (limit: number = 20) => {
  return useInfiniteQuery({
    queryKey: ['animes-infinite', limit],
    queryFn: ({ pageParam = 1 }) => AnimeService.getAnimes(pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination?.has_next) {
        return lastPage.pagination.current_page + 1
      }
      return undefined
    },
    staleTime: 5 * 60 * 1000,
  })
}

// Hook para buscar animes por nome
export const useSearchAnimes = (query: string, page: number = 1) => {
  return useQuery({
    queryKey: ['search-animes', query, page],
    queryFn: () => AnimeService.searchAnimes(query, page),
    enabled: !!query && query.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutos
  })
}

// Hook para animes por seção
export const useAnimesBySection = (section: string, page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['animes-section', section, page, limit],
    queryFn: async () => {
      console.log(`🔍 [DEBUG] Buscando seção: ${section}, página: ${page}, limite: ${limit}`)
      
      try {
        let result
        // Usar endpoint especial para top-rated
        if (section === 'top-rated') {
          console.log(`🎯 [DEBUG] Usando endpoint /top/${limit} para top-rated`)
          result = await AnimeService.getTopAnimes(limit)
        } else {
          console.log(`📂 [DEBUG] Usando endpoint /section/${section} para seção`)
          result = await AnimeService.getAnimesBySection(section, page, limit)
        }
        
        console.log(`✅ [DEBUG] Resposta da API para seção ${section}:`, result)
        console.log(`📊 [DEBUG] Dados encontrados: ${result?.data?.length || 0} animes`)
        
        return result
      } catch (error) {
        console.error(`❌ [DEBUG] Erro ao buscar seção ${section}:`, error)
        throw error
      }
    },
    enabled: !!section,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook específico para top animes
export const useTopAnimes = (limit: number = 20) => {
  return useQuery({
    queryKey: ['top-animes', limit],
    queryFn: () => AnimeService.getTopAnimes(limit),
    staleTime: 10 * 60 * 1000, // 10 minutos
  })
}

// Hook para animes por rating
export const useAnimesByRating = (minRating: number, maxRating: number, page: number = 1) => {
  return useQuery({
    queryKey: ['animes-rating', minRating, maxRating, page],
    queryFn: () => AnimeService.getAnimesByRating(minRating, maxRating, page),
    enabled: minRating >= 0 && maxRating >= minRating,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook para animes por classificação etária
export const useAnimesByAgeRating = (ageRating: string, page: number = 1) => {
  return useQuery({
    queryKey: ['animes-age-rating', ageRating, page],
    queryFn: () => AnimeService.getAnimesByAgeRating(ageRating, page),
    enabled: !!ageRating,
    staleTime: 5 * 60 * 1000,
  })
}

// Hook para favoritos
export const useFavorites = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => SupabaseService.getFavorites(),
    staleTime: 1 * 60 * 1000, // 1 minuto
  })
}

// Hook para verificar se um anime é favorito
export const useIsFavorite = (animeId: number) => {
  return useQuery({
    queryKey: ['is-favorite', animeId],
    queryFn: () => SupabaseService.isFavorite(animeId),
    enabled: !!animeId,
    staleTime: 30 * 1000, // 30 segundos
  })
}

// Mutation para adicionar aos favoritos
export const useAddToFavorites = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ animeId, animeName, animeImage }: { animeId: number, animeName: string, animeImage?: string }) =>
      SupabaseService.addToFavorites(animeId, animeName, animeImage),
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      queryClient.invalidateQueries({ queryKey: ['is-favorite', variables.animeId] })
    },
  })
}

// Mutation para remover dos favoritos
export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (animeId: number) => SupabaseService.removeFromFavorites(animeId),
    onSuccess: (_, animeId) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      queryClient.invalidateQueries({ queryKey: ['is-favorite', animeId] })
    },
  })
}

// Hook para histórico de visualização
export const useWatchHistory = () => {
  return useQuery({
    queryKey: ['watch-history'],
    queryFn: () => SupabaseService.getWatchHistory(),
    staleTime: 1 * 60 * 1000, // 1 minuto
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
    },
  })
}