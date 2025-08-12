import axios from 'axios'
import { Anime, Episode, EpisodeStreamResponse, ApiResponse } from '@/types'

// Função para retry automático
const retryRequest = async (requestFn: () => Promise<any>, maxRetries: number = 3, delay: number = 1000): Promise<any> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn()
    } catch (error: any) {
      console.warn(`🔄 [API] Tentativa ${attempt}/${maxRetries} falhou:`, error.message)
      
      // Se for o último retry ou erro não relacionado a conectividade, rejeitar
      if (attempt === maxRetries || 
          (error.code !== 'ECONNABORTED' && error.code !== 'ERR_NETWORK' && error.code !== 'ECONNREFUSED')) {
        throw error
      }
      
      // Aguardar antes do próximo retry com backoff exponencial
      const waitTime = delay * Math.pow(2, attempt - 1)
      console.log(`⏳ [API] Aguardando ${waitTime}ms antes da próxima tentativa...`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }
}

// Tipo customizado para Error com originalError
interface CustomError extends Error {
  originalError?: any;
}

// Dados mock para fallback quando a API estiver indisponível
const mockAnimes: Anime[] = [
  {
    id: 1,
    nome: 'Anime em Manutenção',
    name: 'Anime em Manutenção',
    link: '/anime/manutencao',
    rating: 0,
    classificacao_etaria: 'L',
    imagem_original: 'https://picsum.photos/300/400?random=1',
    image: 'https://picsum.photos/300/400?random=1',
    secao: 'lancamentos' as const,
    total_episodios: 0,
    episodes_count: 0,
    year: new Date().getFullYear(),
    genres: ['Sistema']
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

// Função para detectar o ambiente e retornar a URL base apropriada
const getApiBaseUrl = (): string => {
  // Usar sempre a API externa do Render para evitar erros de conectividade
  return 'https://anime-api-netf.onrender.com/api'
}

// Configuração base da API
const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 30000, // Aumentado para 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptors para tratamento de erros
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log mais detalhado para debug
    console.error('🚨 [API] Erro detectado:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      code: error.code,
      message: error.message
    })
    
    // Tratamento específico para erros de rede e timeout
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED') {
      console.warn('🚨 [API] Erro de conectividade ou timeout detectado. API pode estar indisponível.')
      
      const customError = new Error('Serviço temporariamente indisponível. Tente novamente em alguns minutos.') as CustomError
      customError.name = 'NetworkError'
      customError.originalError = error
      
      return Promise.reject(customError)
    }
    
    // Tratamento para erros de CORS
    if (error.message?.includes('CORS') || error.code === 'ERR_BLOCKED_BY_CLIENT') {
      console.warn('🚨 [API] Erro de CORS detectado.')
      
      const customError = new Error('Erro de conectividade. Verifique sua conexão com a internet.') as CustomError
      customError.name = 'CORSError'
      customError.originalError = error
      
      return Promise.reject(customError)
    }
    
    // Tratamento para erros 500 (Internal Server Error)
    if (error.response?.status >= 500) {
      console.warn('🚨 [API] Erro interno do servidor detectado:', error.response.status)
      
      const customError = new Error('Erro interno do servidor. Tentando novamente...') as CustomError
      customError.name = 'ServerError'
      customError.originalError = error
      
      return Promise.reject(customError)
    }
    
    // Tratamento para erros 404 (Not Found)
    if (error.response?.status === 404) {
      console.warn('🚨 [API] Recurso não encontrado:', error.config?.url)
      
      const customError = new Error('Conteúdo não encontrado.') as CustomError
      customError.name = 'NotFoundError'
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
      
      // Sempre retornar dados mock em caso de qualquer erro
      return createMockResponse(mockAnimes, page, limit)
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
      
      // Sempre retornar dados mock em caso de qualquer erro
      return createMockResponse(mockAnimes, page, limit)
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
      
      // Sempre retornar dados mock em caso de qualquer erro
      return createMockResponse(mockAnimes, 1, limit)
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

  // Buscar múltiplos animes por IDs
  static async getAnimesByIds(animeIds: number[]): Promise<Record<number, Anime>> {
    try {
      if (animeIds.length === 0) {
        return {}
      }

      console.log(`🔍 [API] Buscando informações para ${animeIds.length} animes:`, animeIds)
      
      // Buscar cada anime individualmente e criar um mapa
      const animePromises = animeIds.map(async (id) => {
        try {
          const response = await this.getAnimeById(id)
          return { id, anime: response.data }
        } catch (error) {
          console.warn(`⚠️ [API] Erro ao buscar anime ${id}:`, error)
          // Retornar anime mock em caso de erro
          return {
            id,
            anime: {
              id,
              nome: `Anime ${id}`,
              name: `Anime ${id}`,
              link: `/anime/${id}`,
              rating: 0,
              classificacao_etaria: 'L',
              imagem_original: 'https://picsum.photos/300/400?random=' + id,
              image: 'https://picsum.photos/300/400?random=' + id,
              secao: 'lancamentos' as const,
              total_episodios: 0,
              episodes_count: 0,
              year: new Date().getFullYear(),
              genres: ['Desconhecido']
            }
          }
        }
      })

      const results = await Promise.all(animePromises)
      
      // Converter array para objeto com ID como chave
      const animeMap: Record<number, Anime> = {}
      results.forEach(({ id, anime }) => {
        animeMap[id] = anime
      })

      console.log(`✅ [API] Informações de ${Object.keys(animeMap).length} animes carregadas`)
      return animeMap
    } catch (error) {
      console.error('❌ [API] Erro ao buscar animes por IDs:', error)
      return {}
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
    console.log(`🎬 [API] Buscando stream para anime ${animeId}, episódio ${episodeNumber}`)
    
    // Primeiro, tentar o endpoint de external-stream
    try {
      console.log(`🔄 [API] Tentando endpoint external-stream para anime ${animeId}, episódio ${episodeNumber}`)
      const response = await apiClient.get(`/episodes/${animeId}/${episodeNumber}/external-stream`)
      console.log(`✅ [API] Stream encontrado via external-stream para anime ${animeId}, episódio ${episodeNumber}`)
      return response.data
    } catch (error: any) {
      console.warn(`⚠️ [API] Falha no endpoint external-stream para anime ${animeId}, episódio ${episodeNumber}:`, error.message)
      
      // Se for erro 500, tentar fallback para endpoint básico
      if (error.response?.status >= 500) {
        console.log(`🔄 [API] Tentando fallback para endpoint básico para anime ${animeId}, episódio ${episodeNumber}`)
        try {
          const fallbackResponse = await apiClient.get(`/episodes/${animeId}/${episodeNumber}/`)
          console.log(`✅ [API] Dados do episódio encontrados via endpoint básico para anime ${animeId}, episódio ${episodeNumber}`)
          
          // Processar resposta do endpoint básico para formato de stream
          const episodeData = fallbackResponse.data
          if (episodeData && episodeData.data) {
            // Criar resposta no formato esperado pelo processEpisodeStreamData
            const streamResponse = {
              message: 'Stream encontrado via fallback',
              data: {
                token: episodeData.data.video_url || null,
                stream_data: episodeData.data.streams || []
              }
            }
            console.log(`🎯 [API] Stream processado via fallback:`, streamResponse)
            return streamResponse
          } else {
            throw new Error('Dados do episódio não encontrados no endpoint básico.')
          }
        } catch (fallbackError: any) {
          console.error(`❌ [API] Fallback também falhou para anime ${animeId}, episódio ${episodeNumber}:`, fallbackError.message)
          throw new Error('Episódio temporariamente indisponível. Tente novamente em alguns minutos.')
        }
      }
      
      // Se for erro 404, episódio não existe
      if (error.response?.status === 404) {
        throw new Error('Episódio não encontrado.')
      }
      
      // Para outros erros de conectividade
      if (error.name === 'NetworkError') {
        throw new Error('Erro de conexão. Verifique sua internet e tente novamente.')
      }
      
      // Para outros erros, manter mensagem original
      throw error
    }
  }
}

// Função utilitária para processar dados de stream da API externa
export const processEpisodeStreamData = (streamResponse: any) => {
  console.log('🎬 [STREAM DEBUG] Dados recebidos da API externa:', JSON.stringify(streamResponse, null, 2))
  
  const options = []
  // Usar a mesma lógica de detecção de ambiente do apiClient
  const baseURL = getApiBaseUrl()
  
  // Função para criar URL do proxy usando a API externa
  const createProxyUrl = (originalUrl: string) => {
    // Remove espaços em branco e cria URL do proxy
    const cleanedUrl = originalUrl.trim()
    // Construir URL do proxy usando a baseURL configurada
    const proxyUrl = `${baseURL}/video-proxy?url=${encodeURIComponent(cleanedUrl)}`
    console.log('🔄 [PROXY DEBUG] URL original:', cleanedUrl.substring(0, 100) + '...')
    console.log('🔄 [PROXY DEBUG] URL do proxy:', proxyUrl)
    console.log('🔄 [PROXY DEBUG] BaseURL usada:', baseURL)
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