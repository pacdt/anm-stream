import React, { useRef, useEffect, useState, useMemo } from 'react'
import { VideoQualityOption } from '@/types'

interface VideoPlayerProps {
  animeId: string
  episodeNumber: number
  currentSource: VideoQualityOption
  availableSources: VideoQualityOption[]
  onSourceChange: (source: VideoQualityOption) => void
  error?: string | null
}

export function VideoPlayer({ 
  animeId, 
  episodeNumber, 
  currentSource,
  availableSources,
  onSourceChange,
  error
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Usar sempre a URL original sem conversões
  const getVideoUrl = useMemo(() => {
    if (!currentSource?.src) {
      return null
    }
    const url = currentSource.src
    console.log('VideoPlayer - Usando URL original:', url)
    return url
  }, [currentSource?.src])
  
  const [iframeError, setIframeError] = useState<string | null>(null)

  const handleIframeError = () => {
    console.error('VideoPlayer - Iframe failed to load')
    setIframeError('Não foi possível carregar o vídeo')
  }

  // Progress e sync removidos - não aplicáveis ao iframe
  // O iframe gerencia sua própria reprodução e progresso

  // Volume e playback rate removidos - não aplicáveis ao iframe

  // Reset error when source changes
  useEffect(() => {
    setIframeError(null)
  }, [currentSource?.src])

  if (!getVideoUrl || error) {
    return (
      <div className="relative w-full h-full bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-lg mb-2">
            {error ? 'Vídeo não disponível' : 'Nenhuma fonte de vídeo disponível'}
          </div>
          <div className="text-sm text-gray-400">Episódio {episodeNumber}</div>
          {error && (
            <div className="text-xs text-red-400 mt-2 max-w-md">
              {error.includes('CORS') ? 'Fonte de vídeo não suportada' : error}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full bg-black">
      {/* Error message */}
      {iframeError ? (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-lg mb-2">{iframeError}</div>
            <div className="text-sm text-gray-400">Episódio {episodeNumber}</div>
          </div>
        </div>
      ) : (
        /* Iframe for video playback */
        <iframe
          src={getVideoUrl}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onError={handleIframeError}
          title={`Episódio ${episodeNumber}`}
        />
      )}
    </div>
  )
}