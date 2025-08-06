// Serviço para sincronização entre localStorage e Supabase

import { localStorageService, LocalWatchHistoryItem } from './localStorageService'
import { supabaseService } from './supabaseService'

class SyncService {
  private syncInterval: NodeJS.Timeout | null = null
  private isSyncing = false
  private readonly SYNC_INTERVAL_MS = 60000 // 1 minuto
  private readonly MAX_RETRY_ATTEMPTS = 3
  private retryAttempts = new Map<string, number>()

  // Iniciar sincronização automática
  startAutoSync(): void {
    if (this.syncInterval) {
      this.stopAutoSync()
    }

    this.syncInterval = setInterval(() => {
      this.syncPendingItems()
    }, this.SYNC_INTERVAL_MS)

    // Sincronizar imediatamente
    this.syncPendingItems()
  }

  // Parar sincronização automática
  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }

  // Sincronizar itens pendentes
  async syncPendingItems(): Promise<void> {
    if (this.isSyncing) {
      console.log('SyncService - Sincronização já em andamento, pulando...')
      return
    }

    this.isSyncing = true
    console.log('SyncService - Iniciando sincronização...')

    try {
      const syncQueue = localStorageService.getSyncQueue()
      console.log(`SyncService - ${syncQueue.length} itens na fila de sincronização`)

      for (const item of syncQueue) {
        await this.syncSingleItem(item)
      }

      console.log('SyncService - Sincronização concluída')
    } catch (error) {
      console.error('SyncService - Erro durante sincronização:', error)
    } finally {
      this.isSyncing = false
    }
  }

  // Sincronizar um item específico
  private async syncSingleItem(item: LocalWatchHistoryItem): Promise<void> {
    const itemKey = `${item.userId}-${item.animeId}-${item.episodeNumber}`
    const currentRetries = this.retryAttempts.get(itemKey) || 0

    if (currentRetries >= this.MAX_RETRY_ATTEMPTS) {
      console.log(`SyncService - Item ${itemKey} excedeu tentativas máximas, removendo da fila`)
      localStorageService.markAsSynced(item.userId, item.animeId, item.episodeNumber)
      this.retryAttempts.delete(itemKey)
      return
    }

    try {
      console.log(`SyncService - Sincronizando item: ${itemKey}`)
      
      // Calcular se o episódio foi completado (assistido mais de 90%)
      const progressPercentage = (item.currentTime / item.duration) * 100
      const isCompleted = progressPercentage >= 90

      await supabaseService.updateDetailedWatchProgress({
        userId: item.userId,
        animeId: parseInt(item.animeId),
        animeName: item.animeName,
        episodeNumber: item.episodeNumber,
        currentTimeSeconds: item.currentTime,
        totalDurationSeconds: item.duration,
        isCompleted,
        lastWatchedAt: item.lastWatchedAt
      })

      // Marcar como sincronizado
      localStorageService.markAsSynced(item.userId, item.animeId, item.episodeNumber)
      this.retryAttempts.delete(itemKey)
      
      console.log(`SyncService - Item ${itemKey} sincronizado com sucesso`)
    } catch (error) {
      console.error(`SyncService - Erro ao sincronizar item ${itemKey}:`, error)
      
      // Incrementar tentativas
      this.retryAttempts.set(itemKey, currentRetries + 1)
      
      // Se for erro de rede, aguardar antes da próxima tentativa
      if (this.isNetworkError(error)) {
        console.log(`SyncService - Erro de rede detectado, tentativa ${currentRetries + 1}/${this.MAX_RETRY_ATTEMPTS}`)
      }
    }
  }

  // Verificar se é erro de rede
  private isNetworkError(error: any): boolean {
    return (
      error?.message?.includes('fetch') ||
      error?.message?.includes('network') ||
      error?.message?.includes('ERR_NETWORK') ||
      error?.message?.includes('ERR_INSUFFICIENT_RESOURCES') ||
      error?.code === 'NETWORK_ERROR'
    )
  }

  // Sincronizar item específico imediatamente
  async syncItemNow(userId: string, animeId: string, episodeNumber: number): Promise<boolean> {
    try {
      const item = localStorageService.getEpisodeProgress(userId, animeId, episodeNumber)
      if (!item) {
        console.log('SyncService - Item não encontrado no localStorage')
        return false
      }

      await this.syncSingleItem(item)
      return true
    } catch (error) {
      console.error('SyncService - Erro ao sincronizar item específico:', error)
      return false
    }
  }

  // Forçar sincronização de todos os itens
  async forceSyncAll(): Promise<void> {
    console.log('SyncService - Forçando sincronização de todos os itens...')
    
    // Limpar tentativas anteriores
    this.retryAttempts.clear()
    
    await this.syncPendingItems()
  }

  // Verificar status da sincronização
  getSyncStatus(): {
    isSyncing: boolean
    pendingItems: number
    retryItems: number
    isAutoSyncActive: boolean
  } {
    const syncQueue = localStorageService.getSyncQueue()
    
    return {
      isSyncing: this.isSyncing,
      pendingItems: syncQueue.length,
      retryItems: this.retryAttempts.size,
      isAutoSyncActive: this.syncInterval !== null
    }
  }

  // Limpar dados de retry
  clearRetryData(): void {
    this.retryAttempts.clear()
  }
}

export const syncService = new SyncService()
export default syncService