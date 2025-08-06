import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAnime } from '@/hooks/useAnimes'
import { useEpisodes, useEpisodeStream } from '@/hooks/useEpisodes'
import { VideoPlayer } from '@/components/VideoPlayer'
import { Loading, LoadingError } from '@/components'
import { ChevronLeft, List, X } from 'lucide-react'
import { Episode, VideoQualityOption } from '@/types'
import { processEpisodeStreamData } from '@/lib/api'

export function Player() {
  const { animeId, episodeNumber } = useParams<{ animeId: string; episodeNumber: string }>()
  const navigate = useNavigate()
  const [showEpisodeList, setShowEpisodeList] = useState(false)
  const [selectedSource, setSelectedSource] = useState<VideoQualityOption | null>(null)
  
  const episodeNum = parseInt(episodeNumber || '1')
  const animeIdNum = parseInt(animeId || '0')
  
  const animeQuery = useAnime(animeIdNum)
  const episodesQuery = useEpisodes(animeIdNum)
  const streamQuery = useEpisodeStream(animeIdNum, episodeNum)
  
  const anime = animeQuery.data
  const episodes = episodesQuery.data?.episodes || []
  const streamData = streamQuery.data
  
  // Processar dados de stream para obter opções de qualidade
  const videoSources: VideoQualityOption[] = streamData ? processEpisodeStreamData(streamData) : []
  
  // Debug logs
  console.log('🎬 Player Debug Info:')
  console.log('  - Anime Query:', { loading: animeQuery.isLoading, error: animeQuery.error, data: !!animeQuery.data })
  console.log('  - Episodes Query:', { loading: episodesQuery.isLoading, error: episodesQuery.error, data: episodesQuery.data?.episodes?.length })
  console.log('  - Stream Query:', { loading: streamQuery.isLoading, error: streamQuery.error, data: !!streamQuery.data })
  console.log('  - Video Sources:', videoSources.length, videoSources)
  console.log('  - Selected Source:', selectedSource)
  console.log('  - Current Episode:', episodeNum)
  console.log('  - Anime ID:', animeIdNum)
  
  const currentEpisode = episodes.find(ep => ep.episode_number === episodeNum)
  const nextEpisode = episodes.find(ep => ep.episode_number === episodeNum + 1)
  const previousEpisode = episodes.find(ep => ep.episode_number === episodeNum - 1)
  
  // Selecionar fonte padrão se não houver uma selecionada
  useEffect(() => {
    if (videoSources.length > 0 && !selectedSource) {
      // Priorizar fontes não alternativas primeiro
      const primarySource = videoSources.find(source => !source.isAlternative) || videoSources[0]
      setSelectedSource(primarySource)
    }
  }, [videoSources, selectedSource])

  // Auto-hide episode list on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setShowEpisodeList(false)
      }
    }
    
    window.addEventListener('resize', handleResize)
    handleResize()
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Escape':
          if (showEpisodeList) {
            setShowEpisodeList(false)
          } else {
            navigate(`/anime/${animeId}`)
          }
          break
        case 'KeyL':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            setShowEpisodeList(!showEpisodeList)
          }
          break
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showEpisodeList, navigate, animeId])

  const handleEpisodeChange = (episode: Episode) => {
    navigate(`/watch/${animeId}/${episode.episode_number}`)
    setShowEpisodeList(false)
  }

  const handleNext = () => {
    if (nextEpisode) {
      navigate(`/watch/${animeId}/${nextEpisode.episode_number}`)
    }
  }

  const handlePrevious = () => {
    if (previousEpisode) {
      navigate(`/watch/${animeId}/${previousEpisode.episode_number}`)
    }
  }
  
  const handleSourceChange = (source: VideoQualityOption) => {
    setSelectedSource(source)
  }

  const handleEpisodeEnd = () => {
    // Auto-play next episode after 10 seconds
    if (nextEpisode) {
      const timer = setTimeout(() => {
        handleNext()
      }, 10000)
      
      // Show countdown or notification here
      return () => clearTimeout(timer)
    }
  }

  if (animeQuery.isLoading || episodesQuery.isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (animeQuery.isError || !anime) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingError 
          message="Erro ao carregar anime" 
          onRetry={() => animeQuery.refetch()}
        />
      </div>
    )
  }

  if (episodesQuery.isError) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingError 
          message="Erro ao carregar episódios" 
          onRetry={() => episodesQuery.refetch()}
        />
      </div>
    )
  }

  if (!currentEpisode) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Episódio não encontrado</h2>
          <p className="text-gray-400 mb-6">O episódio {episodeNum} não está disponível.</p>
          <button
            onClick={() => navigate(`/anime/${animeId}`)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Voltar aos episódios
          </button>
        </div>
      </div>
    )
  }

  if (streamQuery.isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <Loading />
          <p className="mt-4 text-gray-400">Carregando player...</p>
        </div>
      </div>
    )
  }

  if (streamQuery.isError || !streamData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Erro ao carregar vídeo</h2>
          <p className="text-gray-400 mb-6">Não foi possível carregar o episódio.</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => streamQuery.refetch()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Tentar novamente
            </button>
            <button
              onClick={() => navigate(`/anime/${animeId}`)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Main Player Area */}
      <div className={`flex-1 transition-all duration-300 ${
        showEpisodeList ? 'mr-80' : ''
      }`}>
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-40 p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/anime/${animeId}`)}
                className="p-2 text-white hover:bg-white/20 rounded transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="text-white">
                <h1 className="text-lg font-medium">{anime?.data?.nome}</h1>
                <p className="text-sm text-gray-300">
                  Episódio {episodeNum}
                </p>
                {selectedSource && (
                  <p className="text-xs text-gray-400">
                    Fonte: {selectedSource.label}
                    {selectedSource.isAlternative && ' (Alternativa)'}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Source Selector */}
              {videoSources.length > 1 && (
                <div className="relative">
                  <select
                    value={selectedSource?.src || ''}
                    onChange={(e) => {
                      const source = videoSources.find(s => s.src === e.target.value)
                      if (source) handleSourceChange(source)
                    }}
                    className="bg-black/50 text-white text-sm px-3 py-1 rounded border border-gray-600 focus:border-red-500 outline-none"
                  >
                    {videoSources.map((source, index) => (
                      <option key={index} value={source.src}>
                        {source.label}{source.isAlternative ? ' (Alt)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <button
                onClick={() => setShowEpisodeList(!showEpisodeList)}
                className="p-2 text-white hover:bg-white/20 rounded transition-colors"
              >
                <List className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Video Player */}
        <div className="h-screen">
          {selectedSource ? (
            <VideoPlayer
              animeId={animeId!}
              episodeNumber={episodeNum}
              currentSource={selectedSource}
              availableSources={videoSources}
              onSourceChange={handleSourceChange}
              onNext={nextEpisode ? handleNext : undefined}
              onPrevious={previousEpisode ? handlePrevious : undefined}
              onEpisodeEnd={handleEpisodeEnd}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-black">
              <div className="text-center text-white">
                <Loading />
                <p className="mt-4 text-gray-400">Carregando fontes de vídeo...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Episode List Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-gray-900 transform transition-transform duration-300 z-50 ${
        showEpisodeList ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-medium">Episódios</h2>
            <button
              onClick={() => setShowEpisodeList(false)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="text-gray-400 text-sm">
            Total: {episodesQuery.data?.total_episodes || episodes.length} episódios
            {episodes.length > 0 && (
              <span className="text-green-400 ml-2">({episodes.length} carregados)</span>
            )}
          </div>
        </div>

        {/* Episodes List */}
        <div className="flex-1 overflow-y-auto">
          {/* Lista de episódios */}
          {episodes ? (
            episodes.length > 0 ? (
              episodes.map((episode: Episode) => {
                const isCurrent = episode.episode_number === episodeNum
                const isWatched = false // TODO: Get from progress data
                
                return (
                  <div
                    key={episode.episode_number}
                    onClick={() => handleEpisodeChange(episode)}
                    className={`p-4 border-b border-gray-800 cursor-pointer transition-colors ${
                      isCurrent 
                        ? 'bg-red-600/20 border-red-600/50' 
                        : 'hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Thumbnail */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={anime?.data?.imagem_original || '/placeholder-episode.jpg'}
                          alt={`Episódio ${episode.episode_number}`}
                          className="w-16 h-9 object-cover rounded bg-gray-700"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = '/placeholder-episode.jpg'
                          }}
                        />
                        {isCurrent && (
                          <div className="absolute inset-0 bg-red-600/30 rounded flex items-center justify-center">
                            <div className="w-2 h-2 bg-red-600 rounded-full" />
                          </div>
                        )}
                        {isWatched && (
                          <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
                        )}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium text-sm mb-1 ${
                          isCurrent ? 'text-red-400' : 'text-white'
                        }`}>
                          Episódio {episode.episode_number}
                        </h3>
                        <p className="text-gray-400 text-xs">
                          {anime?.data?.nome}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-400">
                <p>Lista de episódios vazia (total: {episodes.length})</p>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-400">
              <p>Episódios não carregados ainda</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex gap-2">
            <button
              onClick={handlePrevious}
              disabled={!previousEpisode}
              className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white py-2 px-4 rounded text-sm transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={handleNext}
              disabled={!nextEpisode}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-800 disabled:text-gray-500 text-white py-2 px-4 rounded text-sm transition-colors"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {showEpisodeList && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setShowEpisodeList(false)}
        />
      )}
    </div>
  )
}