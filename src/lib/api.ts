import axios from 'axios'
import { Anime, Episode, EpisodeStreamResponse, ApiResponse } from '@/types'

// Dados mock para fallback quando a API estiver indisponível
const mockAnimes: Anime[] = [
  {
    id: 1,
    title: 'Anime em Manutenção',
    synopsis: 'O serviço está temporariamente indisponível. Tente novamente em alguns minutos.',
    image: 'https://via.placeholder.com/300x400/4A90E2/FFFFFF?text=Em+Manutenção',
    rating: 0,
    year: new Date().getFullYear(),
    status: 'Em manutenção',
    genres: ['Sistema'],
    episodes_count: 0,
    duration: '0 min',
    studio: 'Sistema',
    age_rating: 'L'
  }
]

const createMockResponse = (data: any[] = mockAnimes, page: number = 1, limit: number = 20): ApiResponse<any[]> => ({
  message: 'Serviço temporariamente indisponível',
  data,
  pagination: {
    current_page: page,
    per_page: limit,
    total_items: data.length,
    total_pages: Math.ceil(data.length / limit),
    has_next: false,
    has_prev: false
  }
})

// Configuração base da API
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://152.67.40.213:3000/api',
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
    
    // Tratamento específico para erros de rede
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      console.warn('🚨 [API] Erro de conectividade detectado. API pode estar indisponível.')
      
      // Criar erro customizado com informações úteis
      const customError = new Error('Serviço temporariamente indisponível. Tente novamente em alguns minutos.')
      customError.name = 'NetworkError'
      customError.originalError = error
      
      return Promise.reject(customError)
    }
    
    // Tratamento para erros de CORS
    if (error.message?.includes('CORS') || error.code === 'ERR_BLOCKED_BY_CLIENT') {
      console.warn('🚨 [API] Erro de CORS detectado.')
      
      const customError = new Error('Erro de conectividade. Verifique sua conexão com a internet.')
      customError.name = 'CORSError'
      customError.originalError = error
      
      return Promise.reject(customError)
    }
    
    return Promise.reject(error)
  }
)

// Serviços da API de Animes
export class AnimeService {
  // Listar animes com paginação
  static async getAnimes(page: number = 1, limit: number = 20): Promise<ApiResponse<Anime[]>> {
    try {
      const response = await apiClient.get('/animes', {
        params: { page, limit }
      })
      return response.data
    } catch (error: any) {
      console.warn(`⚠️ [API] Erro ao buscar animes, usando fallback:`, error.message)
      
      // Se for erro de rede, retornar dados mock
      if (error.name === 'NetworkError' || error.code === 'ERR_NETWORK') {
        return createMockResponse(mockAnimes, page, limit)
      }
      
      throw error
    }
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
    try {
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
    } catch (error: any) {
      console.warn(`⚠️ [API] Erro ao buscar seção ${section}, usando fallback:`, error.message)
      
      // Se for erro de rede, retornar dados mock
      if (error.name === 'NetworkError' || error.code === 'ERR_NETWORK') {
        return createMockResponse(mockAnimes, page, limit)
      }
      
      throw error
    }
  }

  // Buscar top animes por rating
  static async getTopAnimes(limit: number = 20): Promise<ApiResponse<Anime[]>> {
    try {
      console.log(`🏆 [API] Chamando /animes/top/${limit}`)
      
      const response = await apiClient.get(`/animes/top/${limit}`)
      
      console.log(`📡 [API] Resposta HTTP status: ${response.status}`)
      console.log(`📦 [API] Top animes recebidos:`, response.data)
      
      return response.data
    } catch (error: any) {
      console.warn(`⚠️ [API] Erro ao buscar top animes, usando fallback:`, error.message)
      
      // Se for erro de rede, retornar dados mock
      if (error.name === 'NetworkError' || error.code === 'ERR_NETWORK') {
        return createMockResponse(mockAnimes, 1, limit)
      }
      
      throw error
    }
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
  static async searchAnimes(query: string, page: number = 1, limit: number = 20): Promise<ApiResponse<Anime[]>> {
    const response = await apiClient.get(`/animes/search/${encodeURIComponent(query)}`, {
      params: { page, limit }
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

  // Buscar animes relacionados
  static async getRelatedAnimes(animeId: number, limit: number = 12): Promise<ApiResponse<Anime[]>> {
    try {
      const response = await apiClient.get(`/animes/${animeId}/related`, {
        params: { limit }
      })
      return response.data
    } catch (error) {
      // Fallback: retornar animes populares se não houver endpoint específico
      console.warn('Endpoint de animes relacionados não disponível, usando fallback')
      return this.getPopularAnimes(limit)
    }
  }

  // Buscar animes populares
  static async getPopularAnimes(limit: number = 20): Promise<ApiResponse<Anime[]>> {
    try {
      const response = await apiClient.get('/animes/popular', {
        params: { limit }
      })
      return response.data
    } catch (error) {
      // Fallback: usar seção home
      console.warn('Endpoint de animes populares não disponível, usando seção home')
      return this.getAnimesBySection('home', 1, limit)
    }
  }

  // Buscar animes em destaque
  static async getFeaturedAnimes(limit: number = 10): Promise<ApiResponse<Anime[]>> {
    try {
      const response = await apiClient.get('/animes/featured', {
        params: { limit }
      })
      return response.data
    } catch (error) {
      // Fallback: usar top animes
      console.warn('Endpoint de animes em destaque não disponível, usando top animes')
      return this.getTopAnimes(limit)
    }
  }

  // Buscar animes recentes
  static async getRecentAnimes(limit: number = 20): Promise<ApiResponse<Anime[]>> {
    try {
      const response = await apiClient.get('/animes/recent', {
        params: { limit }
      })
      return response.data
    } catch (error) {
      // Fallback: usar seção lançamentos
      console.warn('Endpoint de animes recentes não disponível, usando lançamentos')
      return this.getAnimesBySection('lancamentos', 1, limit)
    }
  }

  // Buscar animes por gênero
  static async getAnimesByGenre(genre: string, page: number = 1, limit: number = 20): Promise<ApiResponse<Anime[]>> {
    try {
      const response = await apiClient.get(`/animes/genre/${encodeURIComponent(genre)}`, {
        params: { page, limit }
      })
      return response.data
    } catch (error) {
      console.warn('Endpoint de animes por gênero não disponível')
      // Retornar resposta vazia em caso de erro
      return {
        message: 'Gênero não encontrado',
        data: [],
        pagination: {
          current_page: page,
          per_page: limit,
          total_items: 0,
          total_pages: 0,
          has_next: false,
          has_prev: false
        }
      }
    }
  }

  // Buscar estatísticas de um anime
  static async getAnimeStats(animeId: number): Promise<any> {
    try {
      const response = await apiClient.get(`/animes/${animeId}/stats`)
      return response.data
    } catch (error) {
      console.warn('Endpoint de estatísticas não disponível')
      // Retornar estatísticas mock
      return {
        message: 'Estatísticas não disponíveis',
        data: {
          views: 0,
          favorites: 0,
          rating: 0,
          reviews: 0
        }
      }
    }
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
  const baseURL = import.meta.env.VITE_API_URL || 'https://152.67.40.213:3000/api'
  
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