import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { SupabaseService } from '@/lib/supabaseService'

interface UpdateProfileParams {
  userId: string
  displayName?: string
  bio?: string
  location?: string
  birthDate?: string
  favoriteGenres?: string[]
  avatarUrl?: string
}

// Hook para buscar perfil do usuário com estatísticas
export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      const [profile, stats] = await Promise.all([
        SupabaseService.getUserProfile(userId),
        SupabaseService.getUserStats(userId)
      ])
      
      return {
        ...profile,
        stats: {
          totalWatched: stats.totalWatched,
          totalEpisodes: stats.totalWatched, // Por enquanto, usar o mesmo valor
          totalHours: Math.round(stats.totalWatchTime / 3600), // Converter segundos para horas
          totalFavorites: stats.totalFavorites
        }
      }
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutos para atualizar mais frequentemente
  })
}

// Hook para estatísticas do usuário
export const useUserStats = (userId: string) => {
  return useQuery({
    queryKey: ['user-stats', userId],
    queryFn: () => SupabaseService.getUserStats(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  })
}

// Mutation para atualizar perfil
export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (params: UpdateProfileParams) => SupabaseService.updateUserProfile(params),
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['user-profile', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['user-stats', variables.userId] })
    },
  })
}

// Mutation para upload de avatar
export const useUploadAvatar = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, file }: { userId: string, file: File }) => 
      SupabaseService.uploadAvatar(userId, file),
    onSuccess: (_data, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['user-profile', variables.userId] })
    },
  })
}

// Mutation para deletar conta
export const useDeleteAccount = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (userId: string) => SupabaseService.deleteUserAccount(userId),
    onSuccess: () => {
      // Limpar todas as queries do usuário
      queryClient.clear()
    },
  })
}

// Hook para preferências do usuário
export const useUserPreferences = (userId: string) => {
  return useQuery({
    queryKey: ['user-preferences', userId],
    queryFn: () => SupabaseService.getUserPreferences(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutos
  })
}

// Mutation para atualizar preferências
export const useUpdatePreferences = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, preferences }: { userId: string, preferences: any }) => 
      SupabaseService.updateUserPreferences(userId, preferences),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences', variables.userId] })
    },
  })
}