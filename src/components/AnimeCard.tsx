import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Play, Star, Clock } from 'lucide-react'
import { Anime } from '@/types'
import { useAddToFavorites, useRemoveFromFavorites, useIsFavorite, useAnimeWatchStatus } from '@/hooks/useAnimes'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

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
    sm: 'w-28 h-40 sm:w-32 sm:h-48',
    md: 'w-32 h-48 sm:w-40 sm:h-60',
    lg: 'w-40 h-60 sm:w-48 sm:h-72'
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
                    : anime.rating
                }
              </span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-lg mb-2 line-clamp-1">{anime.nome}</h3>
          
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
            {anime.year && <span>{anime.year}</span>}
            {anime.episodes_count && (
              <>
                <span>•</span>
                <span>{anime.episodes_count} episódios</span>
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
        'group relative block rounded-lg overflow-hidden bg-gray-900 transition-all duration-300 hover:scale-105 hover:shadow-xl',
        sizeClasses[size],
        className
      )}
    >
      {/* Imagem do anime */}
      <div className="relative w-full h-4/5"> {/* Reduzir altura da imagem para 80% */}
        <img
          src={anime.imagem_original || '/placeholder-anime.jpg'}
          alt={anime.nome}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-anime.jpg';
          }}
        />
        
        {/* Overlay gradiente sempre visível na parte inferior */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        
        {/* Overlay gradiente no hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Botão de play ou continuar */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {isAuthenticated && watchStatus && watchStatus.last_position_seconds > 0 ? (
            <Link
              to={`/anime/${anime.id}/episodio/${watchStatus.episode_number}`}
              className="bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2 transform scale-75 group-hover:scale-100 transition-all duration-300 flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Play className="w-4 h-4 text-white fill-current" />
              <span className="text-white text-sm font-medium">Continuar Ep. {watchStatus.episode_number}</span>
            </Link>
          ) : (
            <div className="bg-red-600 rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <Play className="w-6 h-6 text-white fill-current" />
            </div>
          )}
        </div>
        
        {/* Botão de favorito */}
        {showFavoriteButton && isAuthenticated && (
          <button
            onClick={handleFavoriteClick}
            className={cn(
              'absolute top-2 right-2 p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100',
              isFavorite
                ? 'bg-red-600 text-white'
                : 'bg-black/50 text-white hover:bg-red-600'
            )}
            disabled={addToFavorites.isPending || removeFromFavorites.isPending}
          >
            <Heart
              className={cn(
                'w-4 h-4 transition-all duration-300',
                isFavorite && 'fill-current'
              )}
            />
          </button>
        )}
        
        {/* Rating e Faixa Etária */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          {anime.rating && (
            <div className="bg-black/70 rounded px-2 py-1 flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-white text-xs font-medium">
                {typeof anime.rating === 'number' 
                  ? anime.rating.toFixed(1) 
                  : typeof anime.rating === 'string' && !isNaN(Number(anime.rating))
                    ? Number(anime.rating).toFixed(1)
                    : anime.rating
                }
              </span>
            </div>
          )}
          
          {anime.classificacao_etaria && (
            <div className="bg-red-600 rounded px-2 py-1">
              <span className="text-white text-xs font-bold">
                {anime.classificacao_etaria}
              </span>
            </div>
          )}
        </div>
        

      </div>
      
      {/* Informações sempre visíveis */}
      <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 text-white">
        <h3 className={cn(
          'font-semibold mb-1 line-clamp-2',
          textSizeClasses[size]
        )}>
          {anime.nome}
        </h3>
        
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-300">
          <span>{anime.year}</span>
          {anime.total_episodios && (
            <span>{anime.total_episodios} eps</span>
          )}
        </div>
        
        {/* Barra de progresso se houver */}
        {showProgress && progress > 0 && (
          <div className="w-full bg-gray-600 rounded-full h-1 mt-2">
            <div
              className="bg-red-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </div>
      
      {/* Informações extras no hover */}
      <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {anime.genres && anime.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-12 sm:mt-16">
            {anime.genres.slice(0, 2).map((genre, index) => (
              <span
                key={index}
                className="bg-gray-700 text-white text-xs px-2 py-1 rounded"
              >
                {genre}
              </span>
            ))}
            {anime.genres.length > 2 && (
              <span className="text-gray-400 text-xs">+{anime.genres.length - 2}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}