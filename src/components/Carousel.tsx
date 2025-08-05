import React, { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimeCard } from './AnimeCard'
import { Anime } from '@/types'

interface CarouselProps {
  title: string
  animes: Anime[]
  isLoading?: boolean
  showProgress?: boolean
  progressData?: Record<number, number>
  className?: string
  cardSize?: 'sm' | 'md' | 'lg'
}

export const Carousel: React.FC<CarouselProps> = ({
  title,
  animes,
  isLoading = false,
  showProgress = false,
  progressData = {},
  className,
  cardSize = 'md'
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)

  // Verificar se pode fazer scroll
  const checkScrollability = () => {
    if (!scrollContainerRef.current) return
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
  }

  useEffect(() => {
    checkScrollability()
    
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollability)
      return () => container.removeEventListener('scroll', checkScrollability)
    }
  }, [animes])

  // Função para fazer scroll
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current || isScrolling) return
    
    setIsScrolling(true)
    const container = scrollContainerRef.current
    const cardWidth = cardSize === 'sm' ? 128 : cardSize === 'md' ? 160 : 192
    const gap = 16
    const scrollAmount = (cardWidth + gap) * 3 // Scroll 3 cards at a time
    
    const targetScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount
    
    container.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth'
    })
    
    // Reset scrolling state after animation
    setTimeout(() => setIsScrolling(false), 300)
  }

  // Skeleton loader
  const SkeletonCard = () => (
    <div className={cn(
      'flex-shrink-0 bg-gray-800 rounded-lg animate-pulse',
      cardSize === 'sm' ? 'w-32 h-48' : cardSize === 'md' ? 'w-40 h-60' : 'w-48 h-72'
    )}>
      <div className="w-full h-full bg-gray-700 rounded-lg" />
    </div>
  )

  return (
    <div className={cn('relative group', className)}>
      {/* Título */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">
          {title}
        </h2>
        
        {/* Controles de navegação */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft || isScrolling}
            className={cn(
              'p-2 rounded-full bg-black/50 text-white transition-all duration-300 hover:bg-black/70',
              (!canScrollLeft || isScrolling) && 'opacity-50 cursor-not-allowed'
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight || isScrolling}
            className={cn(
              'p-2 rounded-full bg-black/50 text-white transition-all duration-300 hover:bg-black/70',
              (!canScrollRight || isScrolling) && 'opacity-50 cursor-not-allowed'
            )}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Container do carousel */}
      <div className="relative">
        {/* Gradientes nas bordas */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none" />
        )}
        
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none" />
        )}
        
        {/* Lista de animes */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {isLoading ? (
            // Skeleton loading
            Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : animes.length > 0 ? (
            // Animes reais
            animes.map((anime) => (
              <AnimeCard
                key={anime.id}
                anime={anime}
                size={cardSize}
                showProgress={showProgress}
                progress={progressData[anime.id]}
                className="flex-shrink-0"
              />
            ))
          ) : (
            // Estado vazio
            <div className="flex items-center justify-center w-full h-48 text-gray-400">
              <p>Nenhum anime encontrado</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Botões de navegação para mobile */}
      <div className="md:hidden flex justify-center gap-2 mt-4">
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft || isScrolling}
          className={cn(
            'p-3 rounded-full bg-gray-800 text-white transition-all duration-300',
            (!canScrollLeft || isScrolling) && 'opacity-50 cursor-not-allowed'
          )}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight || isScrolling}
          className={cn(
            'p-3 rounded-full bg-gray-800 text-white transition-all duration-300',
            (!canScrollRight || isScrolling) && 'opacity-50 cursor-not-allowed'
          )}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

// Estilo CSS para esconder scrollbar
const style = document.createElement('style')
style.textContent = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`
document.head.appendChild(style)