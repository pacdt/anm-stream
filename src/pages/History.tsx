import React, { useState } from 'react'
import { Clock, Play, Trash2, Filter, Search, X, Calendar } from 'lucide-react'
import { AnimeCard } from '@/components'
import { useAuth } from '@/hooks/useAuth'
import { useWatchHistory, useClearHistory } from '@/hooks/useHistory'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'

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
    error
  } = useWatchHistory({
    userId: user?.id || '',
    ...filters,
    page,
    limit: 20
  })

  const clearHistoryMutation = useClearHistory()

  const handleFilterChange = (key: keyof HistoryFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }))
    setPage(1)
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

  const getDateRangeLabel = (range: string) => {
    switch (range) {
      case 'today': return 'Hoje'
      case 'week': return 'Esta semana'
      case 'month': return 'Este mês'
      default: return 'Todo período'
    }
  }

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
                <span className="text-gray-400">
                  {historyData.total} item(s) no histórico
                </span>
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
            <p className="text-red-400 mb-4">Erro ao carregar histórico</p>
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
              {historyData.entries.map((entry) => (
                <div key={`${entry.animeId}-${entry.episodeId}-${entry.watchedAt}`} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    {/* Anime Poster */}
                    <div className="flex-shrink-0">
                      <img
                        src={entry.anime.posterUrl}
                        alt={entry.anime.title}
                        className="w-20 h-28 object-cover rounded-lg"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-white truncate">
                            {entry.anime.title}
                          </h3>
                          <p className="text-gray-400">
                            Episódio {entry.episode.number}: {entry.episode.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="w-4 h-4" />
                          {formatDistanceToNow(new Date(entry.watchedAt), {
                            addSuffix: true,
                            locale: ptBR
                          })}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm text-gray-400 mb-1">
                          <span>Progresso</span>
                          <span>{Math.round(entry.progress * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${entry.progress * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => window.location.href = `/watch/${entry.animeId}/${entry.episodeId}`}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Play className="w-4 h-4" />
                          {entry.progress < 0.9 ? 'Continuar' : 'Assistir Novamente'}
                        </button>
                        <button
                          onClick={() => window.location.href = `/anime/${entry.animeId}`}
                          className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          Ver Detalhes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {historyData.totalPages > 1 && (
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
                    disabled={page === historyData.totalPages}
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