// Serviço para gerenciar histórico de visualização no localStorage

export interface LocalWatchHistoryItem {
  userId: string;
  animeId: string;
  episodeNumber: number;
  currentTime: number;
  duration: number;
  lastWatchedAt: string;
  animeName: string;
  episodeTitle?: string;
  thumbnail?: string;
  synced: boolean; // Indica se já foi sincronizado com Supabase
}

class LocalStorageService {
  private readonly WATCH_HISTORY_KEY = 'anm_watch_history';
  private readonly SYNC_QUEUE_KEY = 'anm_sync_queue';

  // Salvar item no histórico local
  saveWatchProgress(item: Omit<LocalWatchHistoryItem, 'synced'>): void {
    try {
      const history = this.getWatchHistory();
      const existingIndex = history.findIndex(
        h => h.userId === item.userId && 
             h.animeId === item.animeId && 
             h.episodeNumber === item.episodeNumber
      );

      const newItem: LocalWatchHistoryItem = {
        ...item,
        synced: false,
        lastWatchedAt: new Date().toISOString()
      };

      if (existingIndex >= 0) {
        history[existingIndex] = newItem;
      } else {
        history.unshift(newItem);
      }

      // Manter apenas os últimos 100 itens
      if (history.length > 100) {
        history.splice(100);
      }

      localStorage.setItem(this.WATCH_HISTORY_KEY, JSON.stringify(history));
      this.addToSyncQueue(newItem);
    } catch (error) {
      console.error('Erro ao salvar progresso no localStorage:', error);
    }
  }

  // Obter histórico local
  getWatchHistory(userId?: string): LocalWatchHistoryItem[] {
    try {
      const historyStr = localStorage.getItem(this.WATCH_HISTORY_KEY);
      if (!historyStr) return [];

      const history: LocalWatchHistoryItem[] = JSON.parse(historyStr);
      
      if (userId) {
        return history.filter(item => item.userId === userId);
      }
      
      return history;
    } catch (error) {
      console.error('Erro ao obter histórico do localStorage:', error);
      return [];
    }
  }

  // Obter progresso de um episódio específico
  getEpisodeProgress(userId: string, animeId: string, episodeNumber: number): LocalWatchHistoryItem | null {
    const history = this.getWatchHistory(userId);
    return history.find(
      item => item.animeId === animeId && item.episodeNumber === episodeNumber
    ) || null;
  }

  // Obter último episódio assistido de um anime
  getLastWatchedEpisode(userId: string, animeId: string): LocalWatchHistoryItem | null {
    const history = this.getWatchHistory(userId)
      .filter(item => item.animeId === animeId)
      .sort((a, b) => new Date(b.lastWatchedAt).getTime() - new Date(a.lastWatchedAt).getTime());
    
    return history[0] || null;
  }

  // Marcar item como sincronizado
  markAsSynced(userId: string, animeId: string, episodeNumber: number): void {
    try {
      const history = this.getWatchHistory();
      const itemIndex = history.findIndex(
        h => h.userId === userId && 
             h.animeId === animeId && 
             h.episodeNumber === episodeNumber
      );

      if (itemIndex >= 0) {
        history[itemIndex].synced = true;
        localStorage.setItem(this.WATCH_HISTORY_KEY, JSON.stringify(history));
        this.removeFromSyncQueue(userId, animeId, episodeNumber);
      }
    } catch (error) {
      console.error('Erro ao marcar como sincronizado:', error);
    }
  }

  // Adicionar à fila de sincronização
  private addToSyncQueue(item: LocalWatchHistoryItem): void {
    try {
      const queue = this.getSyncQueue();
      const existingIndex = queue.findIndex(
        q => q.userId === item.userId && 
             q.animeId === item.animeId && 
             q.episodeNumber === item.episodeNumber
      );

      if (existingIndex >= 0) {
        queue[existingIndex] = item;
      } else {
        queue.push(item);
      }

      localStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Erro ao adicionar à fila de sincronização:', error);
    }
  }

  // Obter fila de sincronização
  getSyncQueue(): LocalWatchHistoryItem[] {
    try {
      const queueStr = localStorage.getItem(this.SYNC_QUEUE_KEY);
      return queueStr ? JSON.parse(queueStr) : [];
    } catch (error) {
      console.error('Erro ao obter fila de sincronização:', error);
      return [];
    }
  }

  // Remover da fila de sincronização
  private removeFromSyncQueue(userId: string, animeId: string, episodeNumber: number): void {
    try {
      const queue = this.getSyncQueue();
      const filteredQueue = queue.filter(
        q => !(q.userId === userId && 
               q.animeId === animeId && 
               q.episodeNumber === episodeNumber)
      );
      localStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(filteredQueue));
    } catch (error) {
      console.error('Erro ao remover da fila de sincronização:', error);
    }
  }

  // Limpar histórico local
  clearHistory(): void {
    try {
      localStorage.removeItem(this.WATCH_HISTORY_KEY);
      localStorage.removeItem(this.SYNC_QUEUE_KEY);
    } catch (error) {
      console.error('Erro ao limpar histórico:', error);
    }
  }

  // Remover item específico do histórico
  removeFromHistory(userId: string, animeId: string, episodeNumber: number): void {
    try {
      const history = this.getWatchHistory();
      const filteredHistory = history.filter(
        h => !(h.userId === userId && 
               h.animeId === animeId && 
               h.episodeNumber === episodeNumber)
      );
      localStorage.setItem(this.WATCH_HISTORY_KEY, JSON.stringify(filteredHistory));
      this.removeFromSyncQueue(userId, animeId, episodeNumber);
    } catch (error) {
      console.error('Erro ao remover do histórico:', error);
    }
  }
}

export const localStorageService = new LocalStorageService();
export default localStorageService;