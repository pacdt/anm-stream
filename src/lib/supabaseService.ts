import { supabase, isSupabaseConfigured, checkSupabaseAvailable } from './supabase'
import { UserFavorite, WatchHistoryItem } from '@/types'

// Serviços do Supabase
export class SupabaseService {
  // Gerenciar favoritos
  static async addToFavorites(animeId: number, animeName: string, animeImage?: string) {
    if (!checkSupabaseAvailable() || !supabase) {
      throw new Error('Funcionalidade requer autenticação - faça login')
    }
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) throw new Error('Usuário não autenticado')
    const user = session.user
    
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
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) throw new Error('Usuário não autenticado')
    const user = session.user
    
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
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return []
    const user = session.user
    
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
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return false
    const user = session.user
    
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
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) throw new Error('Usuário não autenticado')
    const user = session.user
    
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
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return []
    const user = session.user
    
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

  // Obter último episódio assistido de um anime
  static async getLastWatchedEpisode(animeId: number): Promise<WatchHistoryItem | null> {
    if (!checkSupabaseAvailable() || !supabase) {
      return null
    }
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return null
    
    const { data, error } = await supabase
      .from('watch_history')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('anime_id', animeId)
      .order('last_watched_at', { ascending: false })
      .limit(1)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data
  }

  // Atualizar progresso detalhado de visualização
  static async updateDetailedWatchProgress(params: {
    animeId: number;
    animeName: string;
    episodeNumber: number;
    currentTimeSeconds: number;
    totalDurationSeconds: number;
    isCompleted?: boolean;
  }) {
    if (!checkSupabaseAvailable() || !supabase) {
      console.log('Progresso não salvo - modo visitante')
      return null
    }
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) throw new Error('Usuário não autenticado')
    
    const { data, error } = await supabase
      .from('watch_history')
      .upsert({
        user_id: session.user.id,
        anime_id: params.animeId,
        anime_name: params.animeName,
        episode_number: params.episodeNumber,
        progress_seconds: params.currentTimeSeconds,
        total_duration_seconds: params.totalDurationSeconds,
        last_position_seconds: params.currentTimeSeconds,
        is_completed: params.isCompleted || false,
        last_watched_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,anime_id,episode_number'
      })
    
    if (error) throw error
    return data
  }
  
  // Autenticação
  static async signUp(email: string, password: string, displayName: string) {
    if (!checkSupabaseAvailable() || !supabase) {
      throw new Error('Autenticação não disponível - Supabase não configurado')
    }
    
    // Cadastrar usuário sem confirmação de email
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // Desabilita redirecionamento por email
        data: {
          email_confirm: false // Força confirmação automática
        }
      }
    })
    
    if (error) throw error
    
    // Se o usuário foi criado mas não confirmado automaticamente, tentar confirmar
    if (data.user && !data.session && data.user.email_confirmed_at === null) {
      console.log('Usuário criado mas não confirmado automaticamente. Tentando login direto...')
      // Tentar fazer login imediatamente (alguns casos o Supabase permite)
      try {
        const loginResult = await supabase.auth.signInWithPassword({
          email,
          password
        })
        if (loginResult.data.session) {
          console.log('Login automático bem-sucedido após cadastro')
          // Usar os dados do login para criar o perfil
          await this.createUserProfileWithSession(loginResult.data.user.id, displayName)
          return loginResult.data
        }
      } catch (loginError) {
        console.error('Erro no login automático:', loginError)
        throw new Error('Usuário criado mas não foi possível fazer login automático. Verifique as configurações do Supabase.')
      }
    }
    
    // Se o usuário foi criado com sucesso e tem sessão, criar o perfil
    if (data.user && data.session) {
      try {
        // Aguardar um pouco para garantir que a sessão esteja estabelecida
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Criar perfil usando a sessão ativa
        await this.createUserProfileWithSession(data.user.id, displayName)
      } catch (profileError) {
        console.error('Erro ao criar perfil:', profileError)
        // Tentar novamente após um delay
        try {
          await new Promise(resolve => setTimeout(resolve, 500))
          await this.createUserProfileWithSession(data.user.id, displayName)
        } catch (retryError) {
          console.error('Erro ao criar perfil (retry):', retryError)
          // Não falhar o cadastro se houver erro no perfil
        }
      }
    }
    
    return data
  }
  
  // Criar perfil do usuário
  static async createUserProfile(userId: string, displayName: string) {
    if (!checkSupabaseAvailable() || !supabase) {
      throw new Error('Criação de perfil não disponível - Supabase não configurado')
    }
    
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        display_name: displayName
      })
    
    if (error) throw error
    return data
  }
  
  // Criar perfil do usuário com sessão ativa
  static async createUserProfileWithSession(userId: string, displayName: string) {
    if (!checkSupabaseAvailable() || !supabase) {
      throw new Error('Criação de perfil não disponível - Supabase não configurado')
    }
    
    // Verificar se há sessão ativa
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      throw new Error('Sessão não encontrada - usuário não autenticado')
    }
    
    // Verificar se o userId corresponde ao usuário da sessão
    if (session.user.id !== userId) {
      throw new Error('ID do usuário não corresponde à sessão ativa')
    }
    
    const { data, error } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        display_name: displayName
      })
    
    if (error) throw error
    return data
  }
  
  // Obter perfil do usuário
  static async getUserProfile(userId?: string) {
    if (!checkSupabaseAvailable() || !supabase) {
      return null
    }
    
    let targetUserId = userId
    if (!targetUserId) {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return null
      targetUserId = session.user.id
    }
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', targetUserId)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    
    // Converter campos snake_case para camelCase
    if (data) {
      return {
        id: data.id,
        userId: data.user_id,
        displayName: data.display_name,
        avatarUrl: data.avatar_url,
        bio: data.bio,
        location: data.location,
        birthDate: data.birth_date,
        favoriteGenres: data.favorite_genres || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    }
    
    return data
  }
  
  // Atualizar perfil do usuário
  static async updateUserProfile(params: {
    userId?: string;
    displayName?: string;
    bio?: string;
    location?: string;
    birthDate?: string;
    favoriteGenres?: string[];
    avatarUrl?: string;
  }) {
    if (!checkSupabaseAvailable() || !supabase) {
      throw new Error('Atualização de perfil não disponível - Supabase não configurado')
    }
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) throw new Error('Usuário não autenticado')
    
    // Converter campos camelCase para snake_case para o banco
    const updates: any = {}
    if (params.displayName !== undefined) updates.display_name = params.displayName
    if (params.bio !== undefined) updates.bio = params.bio
    if (params.location !== undefined) updates.location = params.location
    if (params.birthDate !== undefined) updates.birth_date = params.birthDate
    if (params.favoriteGenres !== undefined) updates.favorite_genres = params.favoriteGenres
    if (params.avatarUrl !== undefined) updates.avatar_url = params.avatarUrl
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', session.user.id)
    
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
    
    try {
      // Primeiro verificar se há sessão ativa
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        return null
      }
      
      return session.user
    } catch (error: any) {
      // Só lançar erro se não for relacionado à ausência de sessão
      if (!error.message?.includes('Auth session missing')) {
        throw error
      }
      return null
    }
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