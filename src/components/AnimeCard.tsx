import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Play, Star, Clock } from 'lucide-react'
import { Anime } from '@/types'
import { useAddToFavorites, useRemoveFromFavorites, useIsFavorite, useAnimeWatchStatus } from '@/hooks/useAnimes'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { ImageWithFallback } from './ImageWithFallback'

interface AnimeCardProps {
  anime: Anime
  showProgress?: boolean
  progress?: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'vertical' | 'horizontal'
  showFavoriteButton?: boolean
}

export const AnimeCard: React.FC<AnimeCardProps> = ({
  anime,
  showProgress = false,
  progress = 0,
  className,
  size = 'md',
  variant = 'vertical',
  showFavoriteButton = true
}) => {
  const { isAuthenticated } = useAuth()
  const { data: isFavorite } = useIsFavorite(anime.id)
  const { data: watchStatus } = useAnimeWatchStatus(anime.id)
  const addToFavorites = useAddToFavorites()
  const removeFromFavorites = useRemoveFromFavorites()

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) return
    
    try {
      if (isFavorite) {
        await removeFromFavorites.mutateAsync(anime.id)
      } else {
        await addToFavorites.mutateAsync({
          animeId: anime.id,
          animeName: anime.nome,
          animeImage: anime.imagem_original
        })
      }
    } catch (error) {
      console.error('Erro ao atualizar favoritos:', error)
    }
  }

  const sizeClasses = {
    sm: 'w-40 h-60 sm:w-48 sm:h-72',
    md: 'w-48 h-72 sm:w-56 sm:h-80 md:w-60 md:h-84', 
    lg: 'w-56 h-80 sm:w-64 sm:h-96 md:w-72 md:h-[28rem]'
  }

  const textSizeClasses = {
    sm: 'text-xs sm:text-sm',
    md: 'text-sm sm:text-base',
    lg: 'text-base sm:text-lg'
  }

  if (variant === 'horizontal') {
    return (
      <Link
        to={`/anime/${anime.id}`}
        className={cn(
          'group flex items-center gap-4 p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all duration-300',
          className
        )}
      >
        {/* Poster */}
        <div className="relative flex-shrink-0 w-20 h-28 rounded-lg overflow-hidden">
          <img
            src={anime.imagem_original || '/placeholder-anime.jpg'}
            alt={anime.nome}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-anime.jpg';
            }}
          />
          {anime.rating && (
            <div className="absolute top-1 left-1 bg-black/70 rounded px-1 py-0.5 flex items-center gap-1">
              <Star className="w-2 h-2 text-yellow-400 fill-current" />
              <span className="text-white text-xs">
                {typeof anime.rating === 'number' 
                  ? anime.rating.toFixed(1) 
                  : typeof anime.rating === 'string' && !isNaN(Number(anime.rating))
                    ? Number(anime.rating).toFixed(1)
                    : String(anime.rating)
                }
              </span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-lg mb-2">{anime.nome}</h3>
          
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            {anime.year && <span>{anime.year}</span>}
            {anime.total_episodios && (
              <>
                <span>•</span>
                <span>{anime.total_episodios} episódios</span>
              </>
            )}
          </div>
          
          {anime.genres && anime.genres.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {anime.genres.slice(0, 3).map((genre, index) => (
                <span key={index} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                  {genre}
                </span>
              ))}
            </div>
          )}
          
          {showProgress && progress > 0 && (
            <div className="w-full bg-gray-600 rounded-full h-1 mb-2">
              <div
                className="bg-red-600 h-1 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          {showFavoriteButton && isAuthenticated && (
            <button
              onClick={handleFavoriteClick}
              className={cn(
                'p-2 rounded-full transition-all duration-300',
                isFavorite
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-red-600 hover:text-white'
              )}
              disabled={addToFavorites.isPending || removeFromFavorites.isPending}
            >
              <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
            </button>
          )}
          <div className="bg-red-600 rounded-full p-2">
            <Play className="w-4 h-4 text-white fill-current" />
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/anime/${anime.id}`}
      className={cn(
        'group relative block rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700/50 shadow-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:border-red-500/40 hover:shadow-red-500/25 hover:bg-gradient-to-br hover:from-gray-800 hover:via-gray-700 hover:to-gray-900',
        sizeClasses[size],
        className
      )}
    >
      {/* Imagem do anime */}
      <div className="relative w-full h-3/4 overflow-hidden">
        <ImageWithFallback
          src={anime.imagem_original || anime.image || ''}
          fallbackSrc="/placeholder-anime.svg"
          alt={anime.nome}
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110 group-hover:contrast-105"
        />
        
        {/* Overlay gradiente sempre visível na parte inferior */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
        
        {/* Overlay gradiente no hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out" />
        
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1200 ease-out opacity-0 group-hover:opacity-100" />
        
        {/* Efeito de brilho sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-transparent to-blue-500/0 group-hover:from-red-500/5 group-hover:to-blue-500/5 transition-all duration-700 ease-out" />
        
        {/* Botão de play ou continuar */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
          {isAuthenticated && watchStatus && watchStatus.last_position_seconds > 0 ? (
              <Link
                to={`/anime/${anime.id}/episodio/${watchStatus.episode_number}`}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-lg sm:rounded-xl px-3 py-2 sm:px-6 sm:py-3 transform scale-75 group-hover:scale-100 sm:group-hover:scale-110 transition-all duration-300 ease-out flex items-center gap-2 sm:gap-3 shadow-xl backdrop-blur-sm border border-blue-500/40 hover:shadow-blue-500/30 translate-y-2 group-hover:translate-y-0"
                onClick={(e) => e.stopPropagation()}
              >
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-sm" />
                <div className="flex flex-col items-start">
                  <span className="text-white text-xs sm:text-sm font-bold drop-shadow-sm">Continuar</span>
                  <span className="text-blue-100 text-xs drop-shadow-sm hidden sm:block">Ep. {watchStatus.episode_number}</span>
                </div>
              </Link>
            ) : (
              <div className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-full p-3 sm:p-4 transform scale-75 group-hover:scale-100 sm:group-hover:scale-110 transition-all duration-300 ease-out shadow-xl backdrop-blur-sm border border-red-500/40 hover:shadow-red-500/30 translate-y-2 group-hover:translate-y-0">
                <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-current drop-shadow-sm" />
              </div>
            )}
        </div>
        
        {/* Botão de favorito */}
        <button
          onClick={handleFavoriteClick}
          className={cn(
            'absolute top-2 right-2 sm:top-3 sm:right-3 p-2 sm:p-3 rounded-full transition-all duration-300 ease-out opacity-0 group-hover:opacity-100 backdrop-blur-sm border shadow-xl transform hover:scale-110 sm:hover:scale-125 hover:rotate-12',
            isFavorite
              ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white border-red-500/40 shadow-red-500/30 scale-105 sm:scale-110'
              : 'bg-black/40 text-white hover:bg-gradient-to-r hover:from-red-600 hover:to-pink-600 border-white/20 hover:border-red-500/30 hover:scale-105 sm:hover:scale-110 shadow-gray-500/20'
          )}
          disabled={addToFavorites.isPending || removeFromFavorites.isPending}
        >
          <Heart
            className={cn(
              'w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ease-out drop-shadow-sm',
              isFavorite && 'fill-current scale-105 sm:scale-110'
            )}
          />
        </button>
        
        {/* Rating e Faixa Etária */}
        <div className="absolute top-2 left-2 right-2 sm:top-3 sm:left-3 sm:right-3 flex justify-between items-start">
          {anime.rating && (
            <div className="bg-gradient-to-r from-yellow-500/90 to-orange-500/90 backdrop-blur-sm rounded-md sm:rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 flex items-center gap-1 sm:gap-2 border border-yellow-400/30 shadow-lg">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white fill-current drop-shadow-sm" />
              <span className="text-white text-xs sm:text-sm font-bold drop-shadow-sm">
                {typeof anime.rating === 'number' 
                  ? anime.rating.toFixed(1) 
                  : typeof anime.rating === 'string' && !isNaN(Number(anime.rating))
                    ? Number(anime.rating).toFixed(1)
                    : String(anime.rating)
                }
              </span>
            </div>
          )}
          
          {anime.classificacao_etaria && (
            <div className="bg-gradient-to-r from-red-600 to-red-700 backdrop-blur-sm rounded-md sm:rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 border border-red-500/30 shadow-lg">
              <span className="text-white text-xs sm:text-sm font-bold drop-shadow-sm">
                {anime.classificacao_etaria}
              </span>
            </div>
          )}
        </div>
        

      </div>
      
      {/* Informações sempre visíveis */}
      <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4">
        <div className="bg-gradient-to-t from-black/95 via-black/80 to-transparent backdrop-blur-sm rounded-t-lg p-2 sm:p-3 -m-2 sm:-m-3">
          <h3 className={cn(
            'font-bold mb-1 sm:mb-2 text-white drop-shadow-lg line-clamp-2 leading-tight',
            textSizeClasses[size]
          )}>
            {anime.nome}
          </h3>
          
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-200 mb-1 sm:mb-2">
            <span className="flex items-center gap-1">
              <div className="w-1 h-1 bg-red-500 rounded-full"></div>
              {anime.year}
            </span>
            {anime.total_episodios && (
              <span className="bg-gray-700/80 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-xs font-medium">
                {anime.total_episodios} eps
              </span>
            )}
          </div>
          
          {/* Barra de progresso se houver */}
          {showProgress && progress > 0 && (
            <div className="w-full bg-gray-700/50 rounded-full h-1 sm:h-1.5 mt-2 sm:mt-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-500 to-red-600 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Informações extras no hover */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm">
        {anime.genres && anime.genres.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-16 sm:mt-20">
            {anime.genres.slice(0, 3).map((genre, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-gray-700/90 to-gray-800/90 text-white text-xs px-3 py-1.5 rounded-full border border-gray-600/50 backdrop-blur-sm font-medium shadow-sm"
              >
                {genre}
              </span>
            ))}
            {anime.genres.length > 3 && (
              <span className="text-gray-300 text-xs font-medium bg-gray-800/50 px-2 py-1 rounded-full">+{anime.genres.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}