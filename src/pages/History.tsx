import React, { useState } from 'react'
import { Clock, Play, Trash2, Filter, Search, X, Calendar, RefreshCw, Database } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useWatchHistory, useClearHistory, useRemoveFromHistory, EnhancedWatchHistoryItem } from '@/hooks/useHistory'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'
import { forceSyncLocalStorageToSupabase, checkSupabaseData, checkLocalStorageData } from '@/utils/forceSyncLocalStorage'

interface HistoryFilters {
  search?: string
  dateRange?: 'today' | 'week' | 'month' | 'all'
}

export const History: React.FC = () => {
  const { user } = useAuth()
  const [filters, setFilters] = useState<HistoryFilters>({ dateRange: 'all' })
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const {
    data: historyData,
    isLoading,
    error,
    isFetching
  } = useWatchHistory({
    period: filters.dateRange,
    search: filters.search,
    page,
    limit: 20
  })

  const clearHistoryMutation = useClearHistory()
  const removeFromHistoryMutation = useRemoveFromHistory()

  const handleFilterChange = (key: keyof HistoryFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }))
    setPage(1)
  }

  // Funções de debug para sincronização
  const handleForceSync = async () => {
    try {
      toast.loading('Sincronizando dados...', { id: 'sync' })
      const result = await forceSyncLocalStorageToSupabase()
      
      if (result.success) {
        toast.success(`Sincronização concluída! ${result.synced} itens sincronizados`, { id: 'sync' })
        // Recarregar dados
        window.location.reload()
      } else {
        toast.error(`Erro na sincronização: ${result.error}`, { id: 'sync' })
      }
    } catch (error) {
      toast.error('Erro ao sincronizar dados', { id: 'sync' })
    }
  }

  const handleCheckData = async () => {
    console.log('=== DEBUG DADOS ===')
    
    // Verificar localStorage
    const localData = checkLocalStorageData()
    console.log('LocalStorage:', localData)
    
    // Verificar Supabase
    const supabaseData = await checkSupabaseData()
    console.log('Supabase:', supabaseData)
    
    toast.info('Dados verificados! Veja o console para detalhes')
  }

  const clearFilters = () => {
    setFilters({ dateRange: 'all' })
    setPage(1)
  }

  const handleClearHistory = async () => {
    try {
      await clearHistoryMutation.mutateAsync({ userId: user!.id })
      setShowClearConfirm(false)
      toast.success('Histórico limpo com sucesso!')
    } catch (error) {
      toast.error('Erro ao limpar histórico')
    }
  }

  const hasActiveFilters = filters.search || filters.dateRange !== 'all'

  // const getDateRangeLabel = (range: string) => {
  //   switch (range) {
  //     case 'today': return 'Hoje'
  //     case 'week': return 'Esta semana'
  //     case 'month': return 'Este mês'
  //     default: return 'Todo período'
  //   }
  // }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-500" />
              <h1 className="text-3xl font-bold">Histórico de Visualização</h1>
            </div>

            {historyData && historyData.total > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Limpar Histórico
              </button>
            )}
          </div>

          {/* Botões de Debug */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={handleForceSync}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Forçar Sincronização
            </button>
            <button
              onClick={handleCheckData}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
            >
              <Database className="w-4 h-4" />
              Verificar Dados
            </button>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Buscar no histórico..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showFilters || hasActiveFilters
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filtros
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Limpar Filtros
                </button>
              )}

              {historyData && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">
                    {historyData.total} item(s) no histórico
                  </span>
                  {isFetching && (
                    <div className="flex items-center gap-1 text-blue-400">
                      <div className="animate-spin rounded-full h-3 w-3 border border-blue-400 border-t-transparent"></div>
                      <span className="text-xs">Carregando informações...</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Período
                </label>
                <select
                  value={filters.dateRange || 'all'}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="all">Todo período</option>
                  <option value="today">Hoje</option>
                  <option value="week">Esta semana</option>
                  <option value="month">Este mês</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Erro ao carregar histórico</h2>
            <p className="text-red-400 mb-4">{error.message || 'Erro desconhecido'}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {historyData && historyData.entries.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {hasActiveFilters ? 'Nenhum item encontrado' : 'Seu histórico está vazio'}
            </h3>
            <p className="text-gray-500 mb-6">
              {hasActiveFilters
                ? 'Tente ajustar os filtros para encontrar itens no seu histórico'
                : 'Comece a assistir animes para ver seu histórico aqui'
              }
            </p>
            {!hasActiveFilters && (
              <button
                onClick={() => window.location.href = '/catalog'}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Explorar Catálogo
              </button>
            )}
          </div>
        )}

        {historyData && historyData.entries.length > 0 && (
          <>
            {/* History List */}
            <div className="space-y-6">
              {historyData.entries.map((entry: EnhancedWatchHistoryItem) => {
                // Calcular progresso corretamente usando episode_duration
                const episodeDuration = entry.episode_duration || entry.total_duration_seconds || (24 * 60) // 24 min fallback
                const lastPosition = entry.last_position_seconds || 0
                const progressPercentage = episodeDuration > 0 
                  ? Math.min((lastPosition / episodeDuration) * 100, 100)
                  : 0
                
                const watchedAt = entry.last_watched_at || entry.last_watched
                
                // Usar informações do anime da API se disponível
                const animeInfo = entry.anime_info
                const animeName = animeInfo?.nome || animeInfo?.name || entry.anime_name
                const animeImage = animeInfo?.imagem_original || animeInfo?.image || '/placeholder-anime.jpg'
                
                return (
                  <div key={`${entry.anime_id}-${entry.episode_number}-${watchedAt}`} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      {/* Anime Poster */}
                      <div className="flex-shrink-0">
                        <Link to={`/anime/${entry.anime_id}`}>
                          {!animeInfo && isFetching ? (
                            <div className="w-20 h-28 bg-gray-700 rounded-lg animate-pulse"></div>
                          ) : (
                            <div className="relative">
                              <img
                                src={animeImage}
                                alt={animeName}
                                className="w-20 h-28 object-cover rounded-lg hover:opacity-80 transition-opacity"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = '/placeholder-anime.jpg'
                                }}
                              />
                              {!animeInfo && !isFetching && (
                                <div className="absolute top-1 right-1 w-3 h-3 bg-yellow-500 rounded-full" title="Informações do anime não disponíveis"></div>
                              )}
                            </div>
                          )}
                        </Link>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            {!animeInfo && isFetching ? (
                              <div className="h-6 bg-gray-700 rounded animate-pulse w-48 mb-1"></div>
                            ) : (
                              <Link to={`/anime/${entry.anime_id}`}>
                                <h3 className="text-lg font-semibold text-white truncate hover:text-red-400 transition-colors">
                                  {animeName}
                                </h3>
                              </Link>
                            )}
                            <p className="text-gray-400">
                              Episódio {entry.episode_number}
                            </p>
                            {!animeInfo && isFetching ? (
                              <div className="flex gap-1 mt-1">
                                <div className="h-5 bg-gray-700 rounded animate-pulse w-16"></div>
                                <div className="h-5 bg-gray-700 rounded animate-pulse w-20"></div>
                                <div className="h-5 bg-gray-700 rounded animate-pulse w-14"></div>
                              </div>
                            ) : animeInfo?.genres && animeInfo.genres.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {animeInfo.genres.slice(0, 3).map((genre, index) => (
                                  <span key={index} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                                    {genre}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Calendar className="w-4 h-4" />
                              {formatDistanceToNow(new Date(watchedAt), {
                                addSuffix: true,
                                locale: ptBR
                              })}
                            </div>
                            <button
                              onClick={() => {
                                removeFromHistoryMutation.mutate(
                                { animeId: entry.anime_id, episodeNumber: entry.episode_number },
                                  {
                                    onSuccess: () => {
                                      toast.success('Item removido do histórico')
                                    },
                                    onError: () => {
                                      toast.error('Erro ao remover item do histórico')
                                    }
                                  }
                                )
                              }}
                              className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                              title="Remover do histórico"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
                            <span>Progresso</span>
                            <span>{Math.round(progressPercentage)}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                          {lastPosition > 0 && episodeDuration > 0 && (
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>{Math.floor(lastPosition / 60)}:{String(Math.floor(lastPosition % 60)).padStart(2, '0')}</span>
                              <span>{Math.floor(episodeDuration / 60)}:{String(Math.floor(episodeDuration % 60)).padStart(2, '0')}</span>
                            </div>
                          )}
                          {entry.is_completed && (
                            <div className="text-xs text-green-400 mt-1">
                              ✓ Episódio completo
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/watch/${entry.anime_id}/${entry.episode_number}${lastPosition > 0 ? `?t=${Math.floor(lastPosition)}` : ''}`}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <Play className="w-4 h-4" />
                            {progressPercentage < 90 ? 'Continuar' : 'Assistir Novamente'}
                          </Link>
                          <Link
                            to={`/anime/${entry.anime_id}`}
                            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            Ver Detalhes
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {historyData.total > 20 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                  >
                    Anterior
                  </button>
                  
                  <span className="px-4 py-2 text-gray-300">
                    Página {page} de {historyData.totalPages}
                  </span>
                  
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= historyData.totalPages}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Clear History Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Limpar Histórico</h3>
            <p className="text-gray-300 mb-6">
              Tem certeza que deseja limpar todo o seu histórico de visualização? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleClearHistory}
                disabled={clearHistoryMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {clearHistoryMutation.isPending ? 'Limpando...' : 'Sim, Limpar'}
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}