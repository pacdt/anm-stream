import { supabase, isSupabaseConfigured, checkSupabaseAvailable } from './supabase'
import { UserFavorite, WatchHistoryItem } from '@/types'

// Serviços do Supabase
export class SupabaseService {
  // Gerenciar favoritos
  static async addToFavorites(animeId: number, animeName: string, animeImage?: string) {
    if (!checkSupabaseAvailable() || !supabase) {
      throw new Error('Funcionalidade requer autenticação - faça login')
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')
    
    const { data, error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: user.id,
        anime_id: animeId,
        anime_name: animeName,
        anime_image: animeImage
      })
    
    if (error) throw error
    return data
  }
  
  static async removeFromFavorites(animeId: number) {
    if (!checkSupabaseAvailable() || !supabase) {
      throw new Error('Funcionalidade requer autenticação - faça login')
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')
    
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('anime_id', animeId)
    
    if (error) throw error
  }
  
  static async getFavorites(): Promise<UserFavorite[]> {
    if (!checkSupabaseAvailable() || !supabase) {
      return []
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []
    
    const { data, error } = await supabase
      .from('user_favorites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }
  
  static async isFavorite(animeId: number): Promise<boolean> {
    if (!checkSupabaseAvailable() || !supabase) {
      return false
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false
    
    const { data, error } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('anime_id', animeId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return !!data
  }
  
  // Gerenciar histórico de visualização
  static async updateWatchProgress(
    animeId: number,
    animeName: string,
    episodeNumber: number,
    progressSeconds: number,
    totalDurationSeconds?: number
  ) {
    if (!checkSupabaseAvailable() || !supabase) {
      console.log('Progresso não salvo - modo visitante')
      return null
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Usuário não autenticado')
    
    const { data, error } = await supabase
      .from('watch_history')
      .upsert({
        user_id: user.id,
        anime_id: animeId,
        anime_name: animeName,
        episode_number: episodeNumber,
        progress_seconds: progressSeconds,
        total_duration_seconds: totalDurationSeconds
      })
    
    if (error) throw error
    return data
  }
  
  static async getWatchHistory(): Promise<WatchHistoryItem[]> {
    if (!checkSupabaseAvailable() || !supabase) {
      return []
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []
    
    const { data, error } = await supabase
      .from('watch_history')
      .select('*')
      .eq('user_id', user.id)
      .order('last_watched', { ascending: false })
    
    if (error) throw error
    return data || []
  }
  
  static async getEpisodeProgress(animeId: number, episodeNumber: number) {
    if (!checkSupabaseAvailable() || !supabase) {
      return null
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    
    const { data, error } = await supabase
      .from('watch_history')
      .select('progress_seconds, total_duration_seconds')
      .eq('user_id', user.id)
      .eq('anime_id', animeId)
      .eq('episode_number', episodeNumber)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }
  
  static async getAnimeProgress(animeId: number): Promise<WatchHistoryItem[]> {
    if (!checkSupabaseAvailable() || !supabase) {
      return []
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []
    
    const { data, error } = await supabase
      .from('watch_history')
      .select('*')
      .eq('user_id', user.id)
      .eq('anime_id', animeId)
      .order('episode_number', { ascending: true })
    
    if (error) throw error
    return data || []
  }
  
  // Autenticação
  static async signUp(email: string, password: string) {
    if (!checkSupabaseAvailable() || !supabase) {
      throw new Error('Autenticação não disponível - Supabase não configurado')
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    
    if (error) throw error
    return data
  }
  
  static async signIn(email: string, password: string) {
    if (!checkSupabaseAvailable() || !supabase) {
      throw new Error('Autenticação não disponível - Supabase não configurado')
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  }
  
  static async signOut() {
    if (!checkSupabaseAvailable() || !supabase) {
      console.log('Logout não necessário - modo visitante')
      return
    }
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }
  
  static async resetPassword(email: string) {
    if (!checkSupabaseAvailable() || !supabase) {
      throw new Error('Redefinição de senha não disponível - Supabase não configurado')
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  }
  
  static async updatePassword(newPassword: string) {
    if (!checkSupabaseAvailable() || !supabase) {
      throw new Error('Atualização de senha não disponível - Supabase não configurado')
    }
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    if (error) throw error
  }
  
  static async getCurrentUser() {
    if (!checkSupabaseAvailable() || !supabase) {
      return null
    }
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }

  static onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!checkSupabaseAvailable() || !supabase) {
      // Retornar um subscription mock para modo visitante
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      }
    }
    return supabase.auth.onAuthStateChange(callback)
  }
}