import { supabase, /* isSupabaseConfigured, */ checkSupabaseAvailable, checkSupabaseConnectivity } from './supabase'
import { UserFavorite, WatchHistoryItem } from '@/types'

// Função utilitária para tratar erros 406 (Not Acceptable) de forma silenciosa
function handleSupabaseError(error: any, fallbackValue: any = null, context: string = '') {
  if (error) {
    // Erro 406 (Not Acceptable) - retornar fallback silenciosamente
    if (error.code === '406' || error.message?.includes('406') || error.message?.includes('Not Acceptable')) {
      console.debug(`[Supabase] Erro 406 ignorado em ${context}:`, error.message)
      return fallbackValue
    }
    
    // Outros erros - propagar normalmente
    throw error
  }
  return null
}

// Sistema de throttling para evitar muitas requisições simultâneas
class RequestThrottler {
  private static instance: RequestThrottler
  private requestQueue: Array<() => Promise<any>> = []
  private isProcessing = false
  private readonly maxConcurrent = 3
  private readonly delayBetweenRequests = 100 // ms

  static getInstance(): RequestThrottler {
    if (!RequestThrottler.instance) {
      RequestThrottler.instance = new RequestThrottler()
    }
    return RequestThrottler.instance
  }

  async execute<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await this.executeWithRetry(request)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
      this.processQueue()
    })
  }

  private async executeWithRetry<T>(request: () => Promise<T>, maxRetries = 3): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await request()
      } catch (error: any) {
        if (attempt === maxRetries) throw error
        
        // Se for erro de recursos insuficientes, aguardar mais tempo
        if (error.message?.includes('insufficient_resources') || error.code === 'PGRST301') {
          await new Promise(resolve => setTimeout(resolve, attempt * 1000))
          continue
        }
        
        throw error
      }
    }
    throw new Error('Max retries exceeded')
  }

  private async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) return
    
    this.isProcessing = true
    
    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift()
      if (request) {
        try {
          await request()
        } catch (error) {
          console.error('Erro na fila de requisições:', error)
        }
        
        // Delay entre requisições
        if (this.requestQueue.length > 0) {
          await new Promise(resolve => setTimeout(resolve, this.delayBetweenRequests))
        }
      }
    }
    
    this.isProcessing = false
  }
}

const throttler = RequestThrottler.getInstance()

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
    
    // Tratar erro 406 silenciosamente
    const errorResult = handleSupabaseError(error, [], 'getFavorites')
    if (errorResult !== null) return errorResult
    
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
    
    // Tratar erro 406 silenciosamente, além do erro PGRST116 (not found)
    if (error && error.code !== 'PGRST116') {
      const errorResult = handleSupabaseError(error, false, 'isFavorite')
      if (errorResult !== null) return errorResult
    }
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
    
    return throttler.execute(async () => {
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
          progress_seconds: Math.floor(progressSeconds),
          total_duration_seconds: Math.floor(totalDurationSeconds || 0),
          last_position_seconds: Math.floor(progressSeconds),
          last_watched_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,anime_id,episode_number'
        })
      
      if (error) throw error
      return data
    })
  }
  
  static async getWatchHistory(): Promise<WatchHistoryItem[]> {
    if (!checkSupabaseAvailable() || !supabase) {
      return []
    }
    
    return throttler.execute(async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return []
      const user = session.user
      
      const { data, error } = await supabase
        .from('watch_history')
        .select('*')
        .eq('user_id', user.id)
        .order('last_watched_at', { ascending: false })
      
      // Tratar erro 406 silenciosamente
      const errorResult = handleSupabaseError(error, [], 'getWatchHistory')
      if (errorResult !== null) return errorResult
      
      return data || []
    })
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
    userId?: string;
    animeId: number;
    animeName: string;
    episodeNumber: number;
    currentTimeSeconds: number;
    totalDurationSeconds: number;
    isCompleted?: boolean;
    lastWatchedAt?: string;
  }) {
    if (!checkSupabaseAvailable() || !supabase) {
      console.log('Progresso não salvo - modo visitante')
      return null
    }
    
    return throttler.execute(async () => {
      let targetUserId = params.userId
      
      // Se não foi fornecido userId, usar o da sessão atual
      if (!targetUserId) {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) throw new Error('Usuário não autenticado')
        targetUserId = session.user.id
      }
      
      const { data, error } = await supabase
        .from('watch_history')
        .upsert({
          user_id: targetUserId,
          anime_id: params.animeId,
          anime_name: params.animeName,
          episode_number: params.episodeNumber,
          progress_seconds: Math.floor(params.currentTimeSeconds),
          total_duration_seconds: Math.floor(params.totalDurationSeconds),
          last_position_seconds: Math.floor(params.currentTimeSeconds),
          is_completed: params.isCompleted || false,
          last_watched_at: params.lastWatchedAt || new Date().toISOString()
        }, {
          onConflict: 'user_id,anime_id,episode_number'
        })
      
      if (error) throw error
      return data
    })
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
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        // Mensagens de erro mais específicas
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email ou senha incorretos')
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Email não confirmado. Verifique sua caixa de entrada.')
        } else if (error.message.includes('Too many requests')) {
          throw new Error('Muitas tentativas de login. Tente novamente em alguns minutos.')
        } else {
          throw new Error(`Erro no login: ${error.message}`)
        }
      }
      
      return data
    } catch (error: any) {
      throw error
    }
  }
  
  static async signOut() {
    if (!checkSupabaseAvailable() || !supabase) {
      console.log('Logout não necessário - modo visitante')
      return
    }
    
    try {
      // Usar logout local ao invés de global para evitar ERR_ABORTED
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      if (error) {
        console.warn('Erro no logout:', error.message)
        // Em caso de erro, limpar sessão localmente
        await supabase.auth.signOut({ scope: 'local' })
      }
    } catch (error: any) {
      console.warn('Erro no logout, limpando sessão local:', error.message)
      // Fallback: tentar limpar apenas localmente
      try {
        await supabase.auth.signOut({ scope: 'local' })
      } catch (fallbackError) {
        console.error('Erro crítico no logout:', fallbackError)
      }
    }
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

  // Métodos adicionais para histórico
  static async clearWatchHistory(userId: string) {
    if (!checkSupabaseAvailable() || !supabase) {
      throw new Error('Funcionalidade requer autenticação - faça login')
    }
    
    const { error } = await supabase
      .from('watch_history')
      .delete()
      .eq('user_id', userId)
    
    if (error) throw error
  }

  static async removeFromHistory(animeId: number, episodeNumber: number) {
    if (!checkSupabaseAvailable() || !supabase) {
      throw new Error('Funcionalidade requer autenticação - faça login')
    }
    
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) throw new Error('Usuário não autenticado')
    
    const { error } = await supabase
      .from('watch_history')
      .delete()
      .eq('user_id', session.user.id)
      .eq('anime_id', animeId)
      .eq('episode_number', episodeNumber)
    
    if (error) throw error
  }

  // Upload de avatar
  static async uploadAvatar(userId: string, file: File) {
    if (!checkSupabaseAvailable() || !supabase) {
      throw new Error('Upload não disponível - Supabase não configurado')
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Math.random()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    return { url: data.publicUrl }
  }

  // Deletar conta do usuário
  static async deleteUserAccount(userId: string) {
    if (!checkSupabaseAvailable() || !supabase) {
      throw new Error('Funcionalidade não disponível - Supabase não configurado')
    }

    // Deletar dados relacionados primeiro
    await Promise.all([
      supabase.from('user_favorites').delete().eq('user_id', userId),
      supabase.from('watch_history').delete().eq('user_id', userId),
      supabase.from('user_profiles').delete().eq('user_id', userId)
    ])

    // Note: Deletar o usuário da auth requer privilégios de admin
    // Por enquanto, apenas limpar os dados relacionados
    return { success: true }
  }

  // Obter preferências do usuário
  static async getUserPreferences(userId: string) {
    if (!checkSupabaseAvailable() || !supabase) {
      return null
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('favorite_genres')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data?.favorite_genres || []
  }

  // Atualizar preferências do usuário
   static async updateUserPreferences(userId: string, preferences: any) {
     if (!checkSupabaseAvailable() || !supabase) {
       throw new Error('Funcionalidade não disponível - Supabase não configurado')
     }
 
     const { data, error } = await supabase
       .from('user_profiles')
       .update({ favorite_genres: preferences.favoriteGenres })
       .eq('user_id', userId)
 
     if (error) throw error
     return data
   }

   // Obter estatísticas do usuário
   static async getUserStats(userId: string) {
     if (!checkSupabaseAvailable() || !supabase) {
       return {
         totalWatched: 0,
         totalFavorites: 0,
         totalWatchTime: 0
       }
     }

     try {
       const [watchHistory, favorites] = await Promise.all([
         supabase.from('watch_history').select('*').eq('user_id', userId),
         supabase.from('user_favorites').select('*').eq('user_id', userId)
       ])

       // Tratar erros 406 silenciosamente
       let watchData = watchHistory.data || []
       let favoritesData = favorites.data || []
       
       if (watchHistory.error) {
         const errorResult = handleSupabaseError(watchHistory.error, [], 'getUserStats-watchHistory')
         if (errorResult !== null) watchData = errorResult
       }
       
       if (favorites.error) {
         const errorResult = handleSupabaseError(favorites.error, [], 'getUserStats-favorites')
         if (errorResult !== null) favoritesData = errorResult
       }

       const totalWatched = watchData.length || 0
       const totalFavorites = favoritesData.length || 0
       const totalWatchTime = watchData.reduce((acc, item) => acc + (item.progress_seconds || 0), 0) || 0

       return {
         totalWatched,
         totalFavorites,
         totalWatchTime
       }
     } catch (error) {
       // Em caso de erro geral, retornar valores padrão
       console.debug('[Supabase] Erro em getUserStats, retornando valores padrão:', error)
       return {
         totalWatched: 0,
         totalFavorites: 0,
         totalWatchTime: 0
       }
     }
   }
}

// Exportar instância do serviço
export const supabaseService = SupabaseService
export default SupabaseService