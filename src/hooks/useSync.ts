// Hook para gerenciar sincronização automática entre localStorage e Supabase

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { syncService } from '@/lib/syncService'

export interface SyncStatus {
  isSyncing: boolean
  pendingItems: number
  retryItems: number
  isAutoSyncActive: boolean
  lastSyncAt?: Date
  syncErrors: string[]
}

export const useSync = () => {
  const { isAuthenticated, user } = useAuth()
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isSyncing: false,
    pendingItems: 0,
    retryItems: 0,
    isAutoSyncActive: false,
    syncErrors: []
  })

  // Atualizar status da sincronização
  const updateSyncStatus = () => {
    const status = syncService.getSyncStatus()
    setSyncStatus(prev => ({
      ...prev,
      ...status,
      lastSyncAt: prev.lastSyncAt
    }))
  }

  // Iniciar sincronização automática quando usuário estiver autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('useSync - Iniciando sincronização automática para usuário:', user.id)
      
      // Iniciar sincronização automática
      syncService.startAutoSync()
      
      // Atualizar status inicial
      updateSyncStatus()
      
      // Atualizar status periodicamente
      const statusInterval = setInterval(updateSyncStatus, 5000) // A cada 5 segundos
      
      return () => {
        clearInterval(statusInterval)
      }
    } else {
      console.log('useSync - Parando sincronização automática (usuário não autenticado)')
      
      // Parar sincronização quando usuário não estiver autenticado
      syncService.stopAutoSync()
      
      // Resetar status
      setSyncStatus({
        isSyncing: false,
        pendingItems: 0,
        retryItems: 0,
        isAutoSyncActive: false,
        syncErrors: []
      })
    }
  }, [isAuthenticated, user])

  // Sincronizar manualmente
  const syncNow = async (): Promise<boolean> => {
    try {
      setSyncStatus(prev => ({ ...prev, isSyncing: true, syncErrors: [] }))
      
      await syncService.syncPendingItems()
      
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncAt: new Date()
      }))
      
      updateSyncStatus()
      return true
    } catch (error) {
      console.error('useSync - Erro na sincronização manual:', error)
      
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        syncErrors: [...prev.syncErrors, error instanceof Error ? error.message : 'Erro desconhecido']
      }))
      
      return false
    }
  }

  // Forçar sincronização de todos os itens
  const forceSyncAll = async (): Promise<boolean> => {
    try {
      setSyncStatus(prev => ({ ...prev, isSyncing: true, syncErrors: [] }))
      
      await syncService.forceSyncAll()
      
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncAt: new Date()
      }))
      
      updateSyncStatus()
      return true
    } catch (error) {
      console.error('useSync - Erro na sincronização forçada:', error)
      
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        syncErrors: [...prev.syncErrors, error instanceof Error ? error.message : 'Erro desconhecido']
      }))
      
      return false
    }
  }

  // Sincronizar item específico
  const syncItem = async (animeId: string, episodeNumber: number): Promise<boolean> => {
    if (!user?.id) {
      console.warn('useSync - Usuário não autenticado para sincronização de item específico')
      return false
    }

    try {
      return await syncService.syncItemNow(user.id, animeId, episodeNumber)
    } catch (error) {
      console.error('useSync - Erro ao sincronizar item específico:', error)
      return false
    }
  }

  // Limpar dados de retry
  const clearRetryData = () => {
    syncService.clearRetryData()
    updateSyncStatus()
  }

  // Verificar se há itens pendentes
  const hasPendingItems = syncStatus.pendingItems > 0

  // Verificar se há erros de retry
  const hasRetryErrors = syncStatus.retryItems > 0

  return {
    syncStatus,
    syncNow,
    forceSyncAll,
    syncItem,
    clearRetryData,
    hasPendingItems,
    hasRetryErrors,
    updateSyncStatus
  }
}

export default useSync