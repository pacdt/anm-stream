import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AnimeService } from '@/lib/api'
import { AnimeGenre, AnimeStatus, AnimeType, Anime, AnimeSearchResponse, PaginatedResponse } from '@/types'

interface AnimeSearchParams {
  query?: string
  genre?: AnimeGenre
  status?: AnimeStatus
  type?: AnimeType
  year?: number
  rating?: number
  page?: number
  limit?: number
}

interface CatalogParams {
  genre?: AnimeGenre
  status?: AnimeStatus
  type?: AnimeType
  year?: number
  rating?: number
  sortBy?: 'title' | 'rating' | 'year' | 'popularity'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
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

// Hook para busca avançada de animes
export const useAnimeSearch = (params: AnimeSearchParams): { data?: AnimeSearchResponse; isLoading: boolean; error: any } => {
  return useQuery({
    queryKey: ['anime-search', params],
    queryFn: async (): Promise<AnimeSearchResponse> => {
      const response = await AnimeService.searchAnimes(params)
      return {
        animes: response.data.map(anime => ({
          ...anime,
          name: anime.nome,
          image: anime.imagem_original,
          episodes_count: anime.total_episodios
        })),
        totalPages: response.pagination?.total_pages || 1,
        currentPage: response.pagination?.current_page || 1,
        totalItems: response.pagination?.total_items || 0,
        hasNext: response.pagination?.has_next || false,
        hasPrev: response.pagination?.has_prev || false
      }
    },
    enabled: !!params.query && params.query.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutos
  })
}

// Hook para catálogo com filtros
export const useCatalogAnimes = (params: CatalogParams): { data?: PaginatedResponse<Anime>; isLoading: boolean; error: any } => {
  return useQuery({
    queryKey: ['catalog-animes', params],
    queryFn: async (): Promise<PaginatedResponse<Anime>> => {
      const response = await AnimeService.getCatalogAnimes(params)
      return {
        animes: response.data.map(anime => ({
          ...anime,
          name: anime.nome,
          image: anime.imagem_original,
          episodes_count: anime.total_episodios
        })),
        totalPages: response.pagination?.total_pages || 1,
        currentPage: response.pagination?.current_page || 1,
        totalItems: response.pagination?.total_items || 0,
        hasNext: response.pagination?.has_next || false,
        hasPrev: response.pagination?.has_prev || false
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

// Hook para animes relacionados
export const useRelatedAnimes = (animeId: number, limit: number = 6) => {
  return useQuery({
    queryKey: ['related-animes', animeId, limit],
    queryFn: () => AnimeService.getRelatedAnimes(animeId, limit),
    enabled: !!animeId,
    staleTime: 10 * 60 * 1000, // 10 minutos
  })
}

// Hook para animes populares
export const usePopularAnimes = (limit: number = 10) => {
  return useQuery({
    queryKey: ['popular-animes', limit],
    queryFn: () => AnimeService.getPopularAnimes(limit),
    staleTime: 30 * 60 * 1000, // 30 minutos
  })
}

// Hook para animes em destaque
export const useFeaturedAnimes = (limit: number = 5) => {
  return useQuery({
    queryKey: ['featured-animes', limit],
    queryFn: () => AnimeService.getFeaturedAnimes(limit),
    staleTime: 60 * 60 * 1000, // 1 hora
  })
}

// Hook para animes recentes
export const useRecentAnimes = (limit: number = 10) => {
  return useQuery({
    queryKey: ['recent-animes', limit],
    queryFn: () => AnimeService.getRecentAnimes(limit),
    staleTime: 10 * 60 * 1000, // 10 minutos
  })
}

// Hook para animes por gênero
export const useAnimesByGenre = (genre: AnimeGenre, page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['animes-by-genre', genre, page, limit],
    queryFn: () => AnimeService.getAnimesByGenre(genre, page, limit),
    enabled: !!genre,
    staleTime: 15 * 60 * 1000, // 15 minutos
  })
}

// Hook para estatísticas de um anime
export const useAnimeStats = (animeId: number) => {
  return useQuery({
    queryKey: ['anime-stats', animeId],
    queryFn: () => AnimeService.getAnimeStats(animeId),
    enabled: !!animeId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}