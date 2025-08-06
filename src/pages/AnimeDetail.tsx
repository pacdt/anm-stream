// import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAnime } from '@/hooks/useAnime'
import { useIsFavorite, useAddToFavorites, useRemoveFromFavorites } from '@/hooks/useFavorites'
import { useEpisodes } from '@/hooks/useEpisodes'
import { useAnimeProgress } from '@/hooks/useHistory'
import { useAuth } from '@/hooks/useAuth'
import { Loading, LoadingError } from '@/components'
import { 
  Play, 
  Heart, 
  Star, 
  Calendar, 
  Clock, 
  Tag,
  ChevronLeft,
  Share2
} from 'lucide-react'

export function AnimeDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  // const [selectedSeason, setSelectedSeason] = useState(1)
  
  const animeQuery = useAnime(Number(id))
  const episodesQuery = useEpisodes(Number(id))
  const progressQuery = useAnimeProgress(Number(id))
  const isFavoriteQuery = useIsFavorite(Number(id))
  
  const addToFavoritesMutation = useAddToFavorites()
  const removeFromFavoritesMutation = useRemoveFromFavorites()

  const anime = animeQuery.data?.data
  const episodes = episodesQuery.data?.episodes || []
  const progress = progressQuery.data
  const isFavorite = isFavoriteQuery.data || false

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated || !anime) return
    
    try {
      if (isFavorite) {
        await removeFromFavoritesMutation.mutateAsync(anime.id)
      } else {
        await addToFavoritesMutation.mutateAsync({
          animeId: anime.id,
          animeName: anime.nome,
          animeImage: anime.imagem_original
        })
      }
    } catch (error) {
      console.error('Erro ao alterar favorito:', error)
    }
  }

  const handleWatchEpisode = (episodeNumber: number) => {
    navigate(`/watch/${id}/${episodeNumber}`)
  }

  const handleShare = async () => {
    if (navigator.share && anime) {
      try {
        await navigator.share({
          title: anime.nome,
          text: `Assista ${anime.nome} no AnimeStream`,
          url: window.location.href
        })
      } catch (error) {
        // Fallback para copiar URL
        navigator.clipboard.writeText(window.location.href)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (animeQuery.isLoading) {
    return <Loading />
  }

  if (animeQuery.isError || !anime) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingError 
          message="Erro ao carregar anime" 
          onRetry={() => animeQuery.refetch()}
        />
      </div>
    )
  }

  const lastWatchedEpisode = progress && progress.length > 0 ? Math.max(...progress.map(p => p.episode_number)) : 0
  const nextEpisode = lastWatchedEpisode > 0 ? lastWatchedEpisode + 1 : 1
  const watchedEpisodes = progress?.length || 0
  const totalEpisodes = anime?.total_episodios || 0
  const completionPercentage = totalEpisodes > 0 ? (watchedEpisodes / totalEpisodes) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Voltar
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative">
        {/* Background Image */}
        <div className="absolute inset-0 h-96 md:h-[500px]">
          <img
            src={anime.imagem_original}
            alt={anime.nome}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 pt-20 pb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Poster */}
            <div className="flex-shrink-0">
              <img
                src={anime.imagem_original}
                alt={anime.nome}
                className="w-48 md:w-64 rounded-lg shadow-2xl"
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{anime.nome}</h1>
              
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-300">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{typeof anime.rating === 'string' ? anime.rating : Number(anime.rating).toFixed(1)}/10</span>
                </div>
                {anime.year && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{anime.year}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{totalEpisodes} episódios</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <span className="capitalize">{anime.secao}</span>
                </div>
              </div>

              {/* Genres */}
              {anime.genres && anime.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {anime.genres.map((genre) => (
                    <span
                      key={genre}
                      className="bg-gray-800/80 px-3 py-1 rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              {/* {anime.sinopse && (
                <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-3xl">
                  {anime.sinopse}
                </p>
              )} */}

              {/* Progress Bar (if authenticated and has progress) */}
              {isAuthenticated && progress && progress.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Progresso: {watchedEpisodes}/{totalEpisodes} episódios</span>
                    <span>{Math.round(completionPercentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {/* Watch Button */}
                <button
                  onClick={() => handleWatchEpisode(nextEpisode || 1)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Play className="w-5 h-5" />
                  {nextEpisode ? `Continuar Ep. ${nextEpisode}` : 'Assistir'}
                </button>

                {/* Favorite Button */}
                {isAuthenticated && (
                  <button
                    onClick={handleFavoriteToggle}
                    disabled={addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                      isFavorite
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 text-white'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                    {isFavorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                  </button>
                )}

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  Compartilhar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Episódios</h2>
        </div>

        {/* Episodes List */}
        {episodesQuery.isLoading ? (
          <Loading />
        ) : episodesQuery.isError ? (
          <LoadingError 
            message="Erro ao carregar episódios" 
            onRetry={() => episodesQuery.refetch()}
          />
        ) : episodes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Nenhum episódio disponível</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {episodes.map((episode) => {
              const isWatched = progress?.some(p => p.episode_number === episode.episode_number && p.is_completed)
              const isCurrent = episode.episode_number === nextEpisode
              
              return (
                <div
                  key={episode.episode_number}
                  className={`bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer ${
                    isCurrent ? 'ring-2 ring-red-600' : ''
                  }`}
                  onClick={() => handleWatchEpisode(episode.episode_number)}
                >
                  <div className="relative">
                    <img
                      src={anime.imagem_original}
                      alt={`Episódio ${episode.episode_number}`}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                    {isWatched && (
                      <div className="absolute top-2 right-2 bg-green-600 rounded-full p-1">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                    {isCurrent && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                        Próximo
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-medium mb-1">
                      Episódio {episode.episode_number}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {anime.nome}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>


    </div>
  )
}