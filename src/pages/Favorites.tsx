import React, { useState } from 'react'
import { Heart, Grid, List, Filter, Search, X } from 'lucide-react'
import { AnimeCard } from '@/components'
// import { useAuth } from '@/hooks/useAuth'
import { useFavorites } from '@/hooks/useFavorites'
import { AnimeGenre, AnimeStatus, AnimeType } from '@/types'

interface FavoriteFilters {
  genre?: AnimeGenre
  status?: AnimeStatus
  type?: AnimeType
  search?: string
}

export const Favorites: React.FC = () => {
  // const { user } = useAuth()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FavoriteFilters>({})
  const [page, setPage] = useState(1)

  const {
    data: favoritesData,
    isLoading,
    error
  } = useFavorites({
    search: filters.search,
    genre: filters.genre,
    status: filters.status,
    type: filters.type,
    page,
    limit: 20
  })

  const handleFilterChange = (key: keyof FavoriteFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({})
    setPage(1)
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '')

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
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold">Meus Favoritos</h1>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Buscar nos favoritos..."
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
                {hasActiveFilters && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {Object.values(filters).filter(v => v !== undefined && v !== '').length}
                  </span>
                )}
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

              {favoritesData && (
                <span className="text-gray-400">
                  {favoritesData.pagination.total_items} favorito(s)
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-800 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Genre Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gênero
                </label>
                <select
                  value={filters.genre || ''}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Todos os gêneros</option>
                  <option value="action">Ação</option>
                  <option value="adventure">Aventura</option>
                  <option value="comedy">Comédia</option>
                  <option value="drama">Drama</option>
                  <option value="fantasy">Fantasia</option>
                  <option value="romance">Romance</option>
                  <option value="sci-fi">Ficção Científica</option>
                  <option value="thriller">Thriller</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Todos os status</option>
                  <option value="ongoing">Em Exibição</option>
                  <option value="completed">Completo</option>
                  <option value="upcoming">Em Breve</option>
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo
                </label>
                <select
                  value={filters.type || ''}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Todos os tipos</option>
                  <option value="tv">TV</option>
                  <option value="movie">Filme</option>
                  <option value="ova">OVA</option>
                  <option value="special">Especial</option>
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
            <p className="text-red-400 mb-4">Erro ao carregar favoritos</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {favoritesData && favoritesData.data.length === 0 && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {hasActiveFilters ? 'Nenhum favorito encontrado' : 'Você ainda não tem favoritos'}
            </h3>
            <p className="text-gray-500 mb-6">
              {hasActiveFilters
                ? 'Tente ajustar os filtros para encontrar seus animes favoritos'
                : 'Explore o catálogo e adicione animes aos seus favoritos'
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

        {favoritesData && favoritesData.data.length > 0 && (
          <>
            <div className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                : 'grid-cols-1'
            }`}>
              {favoritesData.data.map((anime) => (
                <AnimeCard
                  key={anime.id}
                  anime={anime}
                  variant={viewMode === 'list' ? 'horizontal' : 'vertical'}
                  showFavoriteButton={true}
                />
              ))}
            </div>

            {/* Pagination */}
            {favoritesData.pagination.total_pages > 1 && (
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
                    Página {page} de {favoritesData.pagination.total_pages}
                  </span>
                  
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === favoritesData.pagination.total_pages}
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
    </div>
  )
}