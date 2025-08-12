// Utilitário para forçar sincronização do localStorage para Supabase

import { localStorageService } from '@/lib/localStorageService'
import { SupabaseService } from '@/lib/supabaseService'
import { supabase } from '@/lib/supabase'

export const forceSyncLocalStorageToSupabase = async () => {
  try {
    console.log('🔄 Iniciando sincronização forçada do localStorage para Supabase...')
    
    // Verificar se o usuário está autenticado
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      console.error('❌ Usuário não autenticado')
      return { success: false, error: 'Usuário não autenticado' }
    }
    
    const userId = session.user.id
    console.log('👤 Usuário autenticado:', userId)
    
    // Buscar dados do localStorage
    const localHistory = localStorageService.getWatchHistory()
    console.log('📦 Dados no localStorage:', localHistory.length, 'itens')
    
    if (localHistory.length === 0) {
      console.log('ℹ️ Nenhum dado no localStorage para sincronizar')
      return { success: true, synced: 0 }
    }
    
    let syncedCount = 0
    let errorCount = 0
    
    // Sincronizar cada item do histórico
    for (const item of localHistory) {
      try {
        console.log(`🔄 Sincronizando: ${item.animeName} - Episódio ${item.episodeNumber}`)
        
        // Preparar dados para o Supabase
        const watchData = {
          user_id: userId,
          anime_id: parseInt(item.animeId),
          anime_name: item.animeName,
          episode_number: item.episodeNumber,
          progress_seconds: item.progressSeconds || 0,
          total_duration_seconds: item.totalDuration || 0,
          last_position_seconds: item.lastPositionSeconds || item.progressSeconds || 0,
          is_completed: item.isCompleted || false,
          last_watched_at: item.lastWatchedAt || new Date().toISOString()
        }
        
        // Verificar se já existe no Supabase
        const { data: existing } = await supabase
          .from('watch_history')
          .select('id')
          .eq('user_id', userId)
          .eq('anime_id', parseInt(item.animeId))
          .eq('episode_number', item.episodeNumber)
          .single()
        
        if (existing) {
          // Atualizar registro existente
          const { error } = await supabase
            .from('watch_history')
            .update(watchData)
            .eq('id', existing.id)
          
          if (error) {
            console.error('❌ Erro ao atualizar:', error)
            errorCount++
          } else {
            console.log('✅ Atualizado com sucesso')
            syncedCount++
            // Marcar como sincronizado no localStorage
            localStorageService.markAsSynced(userId, item.animeId, item.episodeNumber)
          }
        } else {
          // Criar novo registro
          const { error } = await supabase
            .from('watch_history')
            .insert(watchData)
          
          if (error) {
            console.error('❌ Erro ao inserir:', error)
            errorCount++
          } else {
            console.log('✅ Inserido com sucesso')
            syncedCount++
            // Marcar como sincronizado no localStorage
            localStorageService.markAsSynced(userId, item.animeId, item.episodeNumber)
          }
        }
        
      } catch (error) {
        console.error('❌ Erro ao sincronizar item:', error)
        errorCount++
      }
    }
    
    console.log(`🎉 Sincronização concluída: ${syncedCount} itens sincronizados, ${errorCount} erros`)
    
    return {
      success: true,
      synced: syncedCount,
      errors: errorCount,
      total: localHistory.length
    }
    
  } catch (error) {
    console.error('❌ Erro na sincronização forçada:', error)
    return { success: false, error: error.message }
  }
}

// Função para verificar dados no Supabase
export const checkSupabaseData = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      return { error: 'Usuário não autenticado' }
    }
    
    const userId = session.user.id
    
    const { data: watchHistory, error } = await supabase
      .from('watch_history')
      .select('*')
      .eq('user_id', userId)
    
    if (error) {
      console.error('Erro ao buscar dados do Supabase:', error)
      return { error: error.message }
    }
    
    console.log('📊 Dados no Supabase:', watchHistory?.length || 0, 'itens')
    console.log('Detalhes:', watchHistory)
    
    return {
      success: true,
      count: watchHistory?.length || 0,
      data: watchHistory
    }
    
  } catch (error) {
    console.error('Erro ao verificar dados do Supabase:', error)
    return { error: error.message }
  }
}

// Função para verificar dados no localStorage
export const checkLocalStorageData = () => {
  try {
    const localHistory = localStorageService.getWatchHistory()
    const syncQueue = localStorageService.getSyncQueue()
    
    console.log('📦 Dados no localStorage:')
    console.log('- Histórico:', localHistory.length, 'itens')
    console.log('- Fila de sincronização:', syncQueue.length, 'itens')
    console.log('- Itens não sincronizados:', localHistory.filter(item => !item.synced).length)
    
    return {
      history: localHistory,
      syncQueue: syncQueue,
      unsyncedCount: localHistory.filter(item => !item.synced).length
    }
    
  } catch (error) {
    console.error('Erro ao verificar localStorage:', error)
    return { error: error.message }
  }
}