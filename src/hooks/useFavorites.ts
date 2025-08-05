import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SupabaseService } from '@/lib/supabaseService'
import { Anime, FavoritesResponse } from '@/types'

interface FavoritesParams {
  userId: string
  genre?: AnimeGenre
  status?: AnimeStatus
  type?: AnimeType
  search?: string
  page?: number
  limit?: number
}

// Hook para buscar favoritos com filtros
export const useFavorites = (params: {
  search?: string
  genre?: string
  status?: string
  type?: string
  page?: number
  limit?: number
}): { data?: FavoritesResponse; isLoading: boolean; error: any } => {
  return useQuery({
    queryKey: ['favorites', params],
    queryFn: async (): Promise<FavoritesResponse> => {
      // Simular busca de favoritos
      const favorites = await SupabaseService.getFavorites()
      
      // Aplicar filtros localmente (em produção seria no backend)
      let filteredFavorites = favorites
      
      if (params.search) {
        filteredFavorites = filteredFavorites.filter(fav => 
          fav.anime_name.toLowerCase().includes(params.search!.toLowerCase())
        )
      }
      
      // Simular paginação
      const page = params.page || 1
      const limit = params.limit || 20
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedFavorites = filteredFavorites.slice(startIndex, endIndex)
      
      // Converter para formato de anime
      const animes: Anime[] = paginatedFavorites.map(fav => ({
        id: fav.anime_id,
        nome: fav.anime_name,
        name: fav.anime_name,
        image: fav.anime_image || '',
        imagem_original: fav.anime_image || '',
        link: '',
        rating: '0',
        classificacao_etaria: '',
        secao: 'dublados' as const,
        total_episodios: 0,
        episodes_count: 0
      }))
      
      return {
        animes,
        totalPages: Math.ceil(filteredFavorites.length / limit),
        currentPage: page,
        totalItems: filteredFavorites.length,
        hasNext: endIndex < filteredFavorites.length,
        hasPrev: page > 1
      }
    },
    staleTime: 2 * 60 * 1000
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

// Mutation para alternar favorito
export const useToggleFavorite = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ animeId, animeName, animeImage, isFavorite }: { 
      animeId: number
      animeName: string
      animeImage?: string
      isFavorite: boolean 
    }) => {
      if (isFavorite) {
        return SupabaseService.removeFromFavorites(animeId)
      } else {
        return SupabaseService.addToFavorites(animeId, animeName, animeImage)
      }
    },
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      queryClient.invalidateQueries({ queryKey: ['is-favorite', variables.animeId] })
    },
  })
}