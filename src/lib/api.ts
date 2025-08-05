import axios from 'axios'
import { Anime, Episode, EpisodeStreamResponse, ApiResponse, PaginationInfo } from '@/types'

// Configuração base da API
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://152.67.40.213:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptors para tratamento de erros
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// Serviços da API de Animes
export class AnimeService {
  // Listar animes com paginação
  static async getAnimes(page: number = 1, limit: number = 20): Promise<ApiResponse<Anime[]>> {
    const response = await apiClient.get('/animes', {
      params: { page, limit }
    })
    return response.data
  }

  // Buscar anime por ID
  static async getAnimeById(id: number): Promise<ApiResponse<Anime>> {
    const response = await apiClient.get(`/animes/${id}`)
    return response.data
  }

  // Buscar animes por nome
  static async searchAnimesByName(query: string, page: number = 1): Promise<ApiResponse<Anime[]>> {
    const response = await apiClient.get(`/animes/search/${encodeURIComponent(query)}`, {
      params: { page }
    })
    return response.data
  }

  // Mapeamento de seções do frontend para seções válidas da API
  private static sectionMapping: Record<string, string> = {
    'latest': 'lancamentos',
    'popular': 'home',
    'dublados': 'dublados',
    'legendados': 'legendados'
  }

  // Filtrar animes por seção
  static async getAnimesBySection(section: string, page: number = 1, limit: number = 20): Promise<ApiResponse<Anime[]>> {
    // Mapear seção do frontend para seção válida da API
    const mappedSection = this.sectionMapping[section] || section
    
    console.log(`🌐 [API] Chamando /animes/section/${mappedSection} (original: ${section})`)
    console.log(`🔧 [API] Mapeamento de seções:`, this.sectionMapping)
    
    const response = await apiClient.get(`/animes/section/${mappedSection}`, {
      params: { page, limit }
    })
    
    console.log(`📡 [API] Resposta HTTP status: ${response.status}`)
    console.log(`📦 [API] Dados recebidos:`, response.data)
    
    return response.data
  }

  // Buscar top animes por rating
  static async getTopAnimes(limit: number = 20): Promise<ApiResponse<Anime[]>> {
    console.log(`🏆 [API] Chamando /animes/top/${limit}`)
    
    const response = await apiClient.get(`/animes/top/${limit}`)
    
    console.log(`📡 [API] Resposta HTTP status: ${response.status}`)
    console.log(`📦 [API] Top animes recebidos:`, response.data)
    
    return response.data
  }

  // Filtrar animes por rating
  static async getAnimesByRating(minRating: number, maxRating: number, page: number = 1): Promise<ApiResponse<Anime[]>> {
    const response = await apiClient.get('/animes/rating', {
      params: { min: minRating, max: maxRating, page }
    })
    return response.data
  }

  // Filtrar animes por classificação etária
  static async getAnimesByAgeRating(ageRating: string, page: number = 1): Promise<ApiResponse<Anime[]>> {
    const response = await apiClient.get(`/animes/age-rating/${ageRating}`, {
      params: { page }
    })
    return response.data
  }

  // Busca avançada de animes
  static async searchAnimes(params: any): Promise<ApiResponse<Anime[]>> {
    const response = await apiClient.get('/animes/search', {
      params
    })
    return response.data
  }

  // Catálogo de animes com filtros
  static async getCatalogAnimes(params: any): Promise<ApiResponse<Anime[]>> {
    const response = await apiClient.get('/animes/catalog', {
      params
    })
    return response.data
  }
}

// Serviços da API de Episódios
export class EpisodeService {
  // Listar episódios de um anime
  static async getEpisodes(animeId: number): Promise<{ episodes: Episode[], total_episodes: number }> {
    const response = await apiClient.get(`/episodes/${animeId}`)
    return response.data
  }

  // Obter dados de streaming de um episódio
  static async getEpisodeStream(animeId: number, episodeNumber: number): Promise<EpisodeStreamResponse> {
    const response = await apiClient.get(`/episodes/${animeId}/${episodeNumber}/external-stream`)
    return response.data
  }
}

// Função utilitária para processar dados de stream da API externa
export const processEpisodeStreamData = (streamResponse: any) => {
  console.log('🎬 [STREAM DEBUG] Dados recebidos da API externa:', JSON.stringify(streamResponse, null, 2))
  
  const options = []
  const baseURL = import.meta.env.VITE_API_URL || 'http://152.67.40.213:3000/api'
  
  // Função para criar URL do proxy usando a API externa
  const createProxyUrl = (originalUrl: string) => {
    // Remove espaços em branco e cria URL do proxy
    const cleanedUrl = originalUrl.trim()
    // Remove /api do final se existir para evitar duplicação
    const proxyBaseUrl = baseURL.replace(/\/api$/, '')
    const proxyUrl = `${proxyBaseUrl}/api/video-proxy?url=${encodeURIComponent(cleanedUrl)}`
    console.log('🔄 [PROXY DEBUG] URL original:', cleanedUrl.substring(0, 100) + '...')
    console.log('🔄 [PROXY DEBUG] URL do proxy:', proxyUrl)
    return proxyUrl
  }
  
  // Se existe token, adicionar como vídeo principal (primeira opção)
  if (streamResponse?.token) {
    console.log('🎯 [STREAM DEBUG] Token encontrado:', streamResponse.token)
    options.push({
      label: 'Principal',
      src: createProxyUrl(streamResponse.token),
      isAlternative: false
    })
  }
  
  // Verificar se existe o array 'stream_data' na resposta
  if (streamResponse?.stream_data && Array.isArray(streamResponse.stream_data)) {
    console.log('📺 [STREAM DEBUG] Stream data encontrado:', streamResponse.stream_data.length, 'streams')
    streamResponse.stream_data.forEach((stream: any, index: number) => {
      console.log(`🎥 [STREAM DEBUG] Stream ${index + 1}:`, { label: stream.label, src: stream.src?.substring(0, 100) + '...' })
      if (stream.label && stream.src) {
        options.push({
          label: stream.label,
          src: createProxyUrl(stream.src),
          isAlternative: false
        })
      }
    })
  }
  
  // Se não há token, mas há dados de stream, usar o primeiro como principal
  if (!streamResponse?.token && options.length === 0 && streamResponse?.stream_data && Array.isArray(streamResponse.stream_data)) {
    console.log('⚠️ [STREAM DEBUG] Sem token, usando primeiro stream como principal')
    const firstStream = streamResponse.stream_data[0]
    if (firstStream?.label && firstStream?.src) {
      options.push({
        label: firstStream.label,
        src: createProxyUrl(firstStream.src),
        isAlternative: false
      })
      
      // Adicionar o resto como alternativas
      streamResponse.stream_data.slice(1).forEach((stream: any) => {
        if (stream.label && stream.src) {
          options.push({
            label: stream.label,
            src: createProxyUrl(stream.src),
            isAlternative: true
          })
        }
      })
    }
  }
  
  console.log('✅ [STREAM DEBUG] Opções processadas:', options.map(opt => ({ label: opt.label, srcPreview: opt.src?.substring(0, 80) + '...' })))
  
  return options
}

// Interceptor para logging em desenvolvimento
if (import.meta.env.DEV) {
  apiClient.interceptors.request.use(
    (config) => {
      console.log('API Request:', config.method?.toUpperCase(), config.url)
      return config
    },
    (error) => {
      console.error('API Request Error:', error)
      return Promise.reject(error)
    }
  )
}