import React, { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useInfiniteAnimes, useSearchAnimes } from '@/hooks/useAnimes'
import { AnimeCard, Loading, LoadingError } from '@/components'
import { Search, Filter, Grid, List, ChevronDown } from 'lucide-react'
// Tipos locais para filtros
type AnimeGenre = 'Action' | 'Adventure' | 'Comedy' | 'Drama' | 'Fantasy' | 'Horror' | 'Mystery' | 'Romance' | 'Sci-Fi' | 'Slice of Life' | 'Sports' | 'Supernatural'
type AnimeStatus = 'Completed' | 'Ongoing' | 'Upcoming'
type AnimeType = 'TV' | 'Movie' | 'OVA' | 'Special'
import { debounce } from '@/lib/utils'

const GENRES: AnimeGenre[] = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
  'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural'
]

const STATUSES: AnimeStatus[] = ['Completed', 'Ongoing', 'Upcoming']
const TYPES: AnimeType[] = ['TV', 'Movie', 'OVA', 'Special']
const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i)
const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularidade' },
  { value: 'rating', label: 'Avaliação' },
  { value: 'year', label: 'Ano' },
  { value: 'title', label: 'Título' }
]

export function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  
  // Filtros
  const [selectedGenres, setSelectedGenres] = useState<AnimeGenre[]>(
    searchParams.get('genres')?.split(',') as AnimeGenre[] || []
  )
  const [selectedStatus, setSelectedStatus] = useState<AnimeStatus | ''>(
    (searchParams.get('status') as AnimeStatus) || ''
  )
  const [selectedType, setSelectedType] = useState<AnimeType | ''>(
    (searchParams.get('type') as AnimeType) || ''
  )
  const [selectedYear, setSelectedYear] = useState<number | ''>(
    searchParams.get('year') ? parseInt(searchParams.get('year')!) : ''
  )
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popularity')

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((term: string) => {
      if (term) {
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev)
          newParams.set('search', term)
          return newParams
        })
      } else {
        setSearchParams(prev => {
          const newParams = new URLSearchParams(prev)
          newParams.delete('search')
          return newParams
        })
      }
    }, 500),
    [setSearchParams]
  )

  // Queries
  const searchQuery = useSearchAnimes(searchTerm, {
    enabled: !!searchTerm.trim()
  })

  const catalogQuery = useInfiniteAnimes({
    genres: selectedGenres,
    status: selectedStatus || undefined,
    type: selectedType || undefined,
    year: selectedYear || undefined,
    sort: sortBy
  }, {
    enabled: !searchTerm.trim()
  })

  const isLoading = searchTerm ? searchQuery.isLoading : catalogQuery.isLoading
  const isError = searchTerm ? searchQuery.isError : catalogQuery.isError
  const error = searchTerm ? searchQuery.error : catalogQuery.error
  const animes = searchTerm 
    ? searchQuery.data || []
    : catalogQuery.data?.pages.flatMap(page => page.data) || []

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    debouncedSearch(value)
  }

  const handleGenreToggle = (genre: AnimeGenre) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre]
    
    setSelectedGenres(newGenres)
    updateFilters({ genres: newGenres })
  }

  const updateFilters = (filters: Record<string, any>) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev)
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && (Array.isArray(value) ? value.length > 0 : true)) {
          if (Array.isArray(value)) {
            newParams.set(key, value.join(','))
          } else {
            newParams.set(key, value.toString())
          }
        } else {
          newParams.delete(key)
        }
      })
      
      return newParams
    })
  }

  const clearFilters = () => {
    setSelectedGenres([])
    setSelectedStatus('')
    setSelectedType('')
    setSelectedYear('')
    setSortBy('popularity')
    setSearchTerm('')
    setSearchParams({})
  }

  const loadMore = () => {
    if (!searchTerm && catalogQuery.hasNextPage && !catalogQuery.isFetchingNextPage) {
      catalogQuery.fetchNextPage()
    }
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingError 
          message="Erro ao carregar catálogo" 
          onRetry={() => searchTerm ? searchQuery.refetch() : catalogQuery.refetch()}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Catálogo de Animes</h1>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar animes..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtros
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {(selectedGenres.length > 0 || selectedStatus || selectedType || selectedYear) && (
              <button
                onClick={clearFilters}
                className="text-red-500 hover:text-red-400 text-sm"
              >
                Limpar filtros
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                updateFilters({ sort: e.target.value })
              }}
              className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View Mode */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Genres */}
            <div>
              <h3 className="text-white font-medium mb-3">Gêneros</h3>
              <div className="flex flex-wrap gap-2">
                {GENRES.map(genre => (
                  <button
                    key={genre}
                    onClick={() => handleGenreToggle(genre)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedGenres.includes(genre)
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="text-white font-medium mb-3">Status</h3>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value as AnimeStatus)
                  updateFilters({ status: e.target.value })
                }}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-red-500 focus:outline-none"
              >
                <option value="">Todos</option>
                {STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <h3 className="text-white font-medium mb-3">Tipo</h3>
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value as AnimeType)
                  updateFilters({ type: e.target.value })
                }}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-red-500 focus:outline-none"
              >
                <option value="">Todos</option>
                {TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div>
              <h3 className="text-white font-medium mb-3">Ano</h3>
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value ? parseInt(e.target.value) : '')
                  updateFilters({ year: e.target.value })
                }}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-red-500 focus:outline-none"
              >
                <option value="">Todos</option>
                {YEARS.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <Loading />
      ) : animes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Nenhum anime encontrado</p>
          {searchTerm && (
            <p className="text-gray-500 mt-2">Tente ajustar sua busca ou filtros</p>
          )}
        </div>
      ) : (
        <>
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-400">
              {searchTerm ? `${animes.length} resultados para "${searchTerm}"` : `${animes.length} animes encontrados`}
            </p>
          </div>

          {/* Anime Grid/List */}
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6'
            : 'space-y-4'
          }>
            {animes.map((anime) => (
              <AnimeCard 
                key={anime.id} 
                anime={anime} 
                variant={viewMode === 'list' ? 'horizontal' : 'vertical'}
              />
            ))}
          </div>

          {/* Load More */}
          {!searchTerm && catalogQuery.hasNextPage && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                disabled={catalogQuery.isFetchingNextPage}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {catalogQuery.isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}