import React from 'react'
import { Link } from 'react-router-dom'
import { Play, TrendingUp, Star, Clock } from 'lucide-react'
import { useAnimesBySection } from '@/hooks/useAnimes'
import { useWatchHistory } from '@/hooks/useAnimes'
import { useAuth } from '@/hooks/useAuth'
import { Carousel, PageLoading, LoadingError } from '@/components'
import { cn } from '@/lib/utils'

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuth()
  
  // Buscar diferentes seções de animes
  const { data: latestAnimes, isLoading: latestLoading, error: latestError } = useAnimesBySection('latest', 1, 20)
  const { data: popularAnimes, isLoading: popularLoading, error: popularError } = useAnimesBySection('popular', 1, 20)
  const { data: topRatedAnimes, isLoading: topRatedLoading, error: topRatedError } = useAnimesBySection('top-rated', 1, 20)
  const { data: dubladosAnimes, isLoading: dubladosLoading, error: dubladosError } = useAnimesBySection('dublados', 1, 20)
  const { data: legendadosAnimes, isLoading: legendadosLoading, error: legendadosError } = useAnimesBySection('legendados', 1, 20)
  

  
  // Histórico do usuário (apenas se autenticado)
  const { data: watchHistory, isLoading: historyLoading } = useWatchHistory()
  
  // Anime em destaque (primeiro da lista de populares)
  const featuredAnime = popularAnimes?.data?.[0]
  
  // Calcular progresso dos animes no histórico
  const progressData = React.useMemo(() => {
    if (!watchHistory?.history) return {}
    
    return watchHistory.history.reduce((acc, item) => {
      const progress = item.total_duration_seconds 
        ? (item.progress_seconds / item.total_duration_seconds) * 100
        : 0
      acc[item.anime_id] = Math.min(progress, 100)
      return acc
    }, {} as Record<number, number>)
  }, [watchHistory])

  // Loading state
  if (latestLoading && popularLoading && topRatedLoading && dubladosLoading && legendadosLoading) {
    return <PageLoading text="Carregando página inicial..." />
  }

  // Error state
  if (latestError || popularError || topRatedError || dubladosError || legendadosError) {
    return (
      <LoadingError 
        message="Erro ao carregar conteúdo da página inicial"
        onRetry={() => window.location.reload()}
      />
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {featuredAnime && (
        <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={featuredAnime.image || '/placeholder-anime.jpg'}
              alt={featuredAnime.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4">
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Em Destaque
                </span>
                {featuredAnime.rating && (
                  <div className="flex items-center gap-1 bg-black/50 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white text-sm font-medium">
                      {featuredAnime.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {featuredAnime.name}
              </h1>

              {/* Description */}
              {featuredAnime.synopsis && (
                <p className="text-gray-200 text-lg mb-6 line-clamp-3">
                  {featuredAnime.synopsis}
                </p>
              )}

              {/* Meta Info */}
              <div className="flex items-center gap-4 mb-8 text-gray-300">
                {featuredAnime.year && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {featuredAnime.year}
                  </span>
                )}
                {featuredAnime.episodes_count && (
                  <span>{featuredAnime.episodes_count} episódios</span>
                )}
                {featuredAnime.genres && featuredAnime.genres.length > 0 && (
                  <span>{featuredAnime.genres.slice(0, 3).join(', ')}</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <Link
                  to={`/anime/${featuredAnime.id}`}
                  className="flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-300"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Assistir Agora
                </Link>
                
                <Link
                  to={`/anime/${featuredAnime.id}`}
                  className="flex items-center gap-2 bg-gray-800/80 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700/80 transition-colors duration-300"
                >
                  Mais Informações
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Continue Assistindo (apenas para usuários logados) */}
        {isAuthenticated && watchHistory?.history && watchHistory.history.length > 0 && (
          <Carousel
            title="Continue Assistindo"
            animes={watchHistory.history.map(item => ({
              id: item.anime_id,
              name: item.anime_name,
              image: '', // Será preenchido pela API se necessário
              episodes_count: 0,
              year: 0,
              rating: 0,
              synopsis: '',
              genres: []
            }))}
            showProgress
            progressData={progressData}
            isLoading={historyLoading}
            cardSize="md"
          />
        )}

        {/* Lançamentos */}
        <Carousel
          title="Últimos Lançamentos"
          animes={latestAnimes?.data || []}
          isLoading={latestLoading}
          cardSize="md"
        />

        {/* Populares */}
        <Carousel
          title="Populares da Semana"
          animes={popularAnimes?.data || []}
          isLoading={popularLoading}
          cardSize="md"
        />

        {/* Mais Votados */}
        <Carousel
          title="Mais Bem Avaliados"
          animes={topRatedAnimes?.data || []}
          isLoading={topRatedLoading}
          cardSize="md"
        />

        {/* Dublados */}
        <Carousel
          title="Animes Dublados"
          animes={dubladosAnimes?.data || []}
          isLoading={dubladosLoading}
          cardSize="md"
        />

        {/* Legendados */}
        <Carousel
          title="Animes Legendados"
          animes={legendadosAnimes?.data || []}
          isLoading={legendadosLoading}
          cardSize="md"
        />

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl p-8 md:p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <TrendingUp className="w-16 h-16 text-white mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Descubra Novos Animes
            </h2>
            <p className="text-red-100 text-lg mb-8">
              Explore nosso catálogo completo com milhares de títulos em alta qualidade.
              Encontre seu próximo anime favorito!
            </p>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Explorar Catálogo
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}