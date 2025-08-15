import { Anime, Episode, EpisodeStreamResponse, ApiResponse, VideoQualityOption } from '@/types'
import { StaticAnimeService, StaticEpisodeService } from './staticApi'

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

// Configurações antigas do axios removidas - usando API estática local

// Serviços da API de Animes (usando API estática)
export class AnimeService {
  // Listar animes com paginação
  static async getAnimes(page: number = 1, limit: number = 20): Promise<ApiResponse<Anime[]>> {
    try {
      console.log(`🌐 [STATIC API] Buscando animes - página ${page}, limite ${limit}`)
      return await StaticAnimeService.getAnimes(page, limit)
    } catch (error: any) {
      console.warn(`⚠️ [STATIC API] Erro ao buscar animes, usando fallback:`, error.message)
      
      // Sempre retornar dados mock em caso de qualquer erro
      return createMockResponse(mockAnimes, page, limit)
    }
  }

  // Buscar anime por ID
  static async getAnimeById(id: number): Promise<ApiResponse<Anime>> {
    try {
      console.log(`🌐 [STATIC API] Buscando anime por ID: ${id}`)
      return await StaticAnimeService.getAnimeById(id)
    } catch (error) {
      console.error('❌ [STATIC API] Erro ao buscar anime por ID:', error)
      
      // Fallback para dados mock
      const mockAnime = mockAnimes.find(anime => anime.id === id)
      if (mockAnime) {
        console.log('📦 [STATIC API] Usando dados mock para anime:', id)
        return {
          message: 'Dados mock utilizados',
          data: mockAnime,
          pagination: {
            current_page: 1,
            per_page: 1,
            total_items: 1,
            total_pages: 1,
            has_next: false,
            has_prev: false
          }
        }
      }
      
      throw error
    }
  }

  // Buscar animes por nome
  static async searchAnimesByName(name: string, page: number = 1, limit: number = 20): Promise<ApiResponse<Anime[]>> {
    try {
      console.log(`🌐 [STATIC API] Buscando animes por nome: ${name}`)
      return await StaticAnimeService.searchAnimesByName(name, page, limit)
    } catch (error: any) {
      console.warn(`⚠️ [STATIC API] Erro ao buscar animes por nome, usando fallback:`, error.message)
      
      // Filtrar dados mock por nome
      const filteredAnimes = mockAnimes.filter(anime => 
        anime.name.toLowerCase().includes(name.toLowerCase())
      )
      
      return createMockResponse(filteredAnimes, page, limit)
    }
  }

  // Filtrar animes por seção
  static async getAnimesBySection(section: string, page: number = 1, limit: number = 20): Promise<ApiResponse<Anime[]>> {
    try {
      console.log(`🌐 [STATIC API] Buscando animes por seção: ${section}`)
      return await StaticAnimeService.getAnimesBySection(section, page, limit)
    } catch (error: any) {
      console.warn(`⚠️ [STATIC API] Erro ao buscar animes por seção, usando fallback:`, error.message)
      
      // Sempre retornar dados mock em caso de qualquer erro
      return createMockResponse(mockAnimes, page, limit)
    }
  }

  // Buscar top animes por rating
  static async getTopAnimes(limit: number = 20): Promise<ApiResponse<Anime[]>> {
    try {
      console.log(`🌐 [STATIC API] Buscando top animes`)
      return await StaticAnimeService.getTopAnimes(1, limit)
    } catch (error: any) {
      console.warn(`⚠️ [STATIC API] Erro ao buscar top animes, usando fallback:`, error.message)
      
      // Ordenar dados mock por rating (descendente) e retornar os top
      const sortedAnimes = [...mockAnimes].sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
      
      return createMockResponse(sortedAnimes, 1, limit)
    }
  }

  // Filtrar animes por rating
  static async getAnimesByRating(minRating: number, maxRating: number, page: number = 1, limit: number = 20): Promise<ApiResponse<Anime[]>> {
    try {
      console.log(`🌐 [STATIC API] Buscando animes por rating: ${minRating}-${maxRating}`)
      return await StaticAnimeService.getAnimesByRating(minRating, maxRating, page, limit)
    } catch (error: any) {
      console.warn(`⚠️ [STATIC API] Erro ao buscar animes por rating, usando fallback:`, error.message)
      
      // Filtrar dados mock por rating
      const filteredAnimes = mockAnimes.filter(anime => {
        const rating = parseFloat(anime.rating)
        return rating >= minRating && rating <= maxRating
      })
      
      return createMockResponse(filteredAnimes, page, limit)
    }
  }

  // Filtrar animes por classificação etária
  static async getAnimesByAgeRating(ageRating: string, page: number = 1, limit: number = 20): Promise<ApiResponse<Anime[]>> {
    try {
      console.log(`🌐 [STATIC API] Buscando animes por classificação etária: ${ageRating}`)
      return await StaticAnimeService.getAnimesByAgeRating(ageRating, page, limit)
    } catch (error: any) {
      console.warn(`⚠️ [STATIC API] Erro ao buscar animes por classificação etária, usando fallback:`, error.message)
      
      // Filtrar dados mock por classificação etária
      const filteredAnimes = mockAnimes.filter(anime => 
        anime.classificacao_etaria?.toLowerCase() === ageRating.toLowerCase()
      )
      
      return createMockResponse(filteredAnimes, page, limit)
    }
  }

  // Busca avançada de animes
  static async searchAnimes(query: string, filters?: any, page: number = 1, limit: number = 20): Promise<ApiResponse<Anime[]>> {
    try {
      console.log(`🌐 [STATIC API] Busca avançada de animes: ${query}`)
      return await StaticAnimeService.searchAnimes(query, filters, page, limit)
    } catch (error: any) {
      console.warn(`⚠️ [STATIC API] Erro na busca avançada, usando fallback:`, error.message)
      
      // Busca simples nos dados mock
      const filteredAnimes = mockAnimes.filter(anime => 
        anime.name.toLowerCase().includes(query.toLowerCase())
      )
      
      return createMockResponse(filteredAnimes, page, limit)
    }
  }

  // Catálogo de animes com filtros
  static async getCatalogAnimes(page: number = 1, limit: number = 20): Promise<ApiResponse<Anime[]>> {
    try {
      console.log(`🌐 [STATIC API] Buscando catálogo de animes`)
      return await StaticAnimeService.getCatalogAnimes(page, limit)
    } catch (error: any) {
      console.warn(`⚠️ [STATIC API] Erro ao buscar catálogo, usando fallback:`, error.message)
      
      // Retornar todos os dados mock como catálogo
      return createMockResponse(mockAnimes, page, limit)
    }
  }

  // Buscar animes relacionados
  static async getRelatedAnimes(animeId: number, limit: number = 12): Promise<ApiResponse<Anime[]>> {
    try {
      console.log(`🌐 [STATIC API] Buscando animes relacionados para ID: ${animeId}`)
      return await StaticAnimeService.getRelatedAnimes(animeId, 1, limit)
    } catch (error: any) {
      console.warn(`⚠️ [STATIC API] Erro ao buscar animes relacionados, usando fallback:`, error.message)
      
      // Retornar animes aleatórios como relacionados
      const shuffledAnimes = [...mockAnimes].sort(() => 0.5 - Math.random())
      
      return createMockResponse(shuffledAnimes, 1, limit)
    }
  }

  // Buscar animes populares
  static async getPopularAnimes(limit: number = 20): Promise<ApiResponse<Anime[]>> {
    try {
      console.log(`🌐 [STATIC API] Buscando animes populares`)
      return await StaticAnimeService.getPopularAnimes(1, limit)
    } catch (error: any) {
      console.warn(`⚠️ [STATIC API] Erro ao buscar animes populares, usando fallback:`, error.message)
      
      // Retornar dados mock embaralhados como populares
      const shuffledAnimes = [...mockAnimes].sort(() => 0.5 - Math.random())
      
      return createMockResponse(shuffledAnimes, 1, limit)
    }
  }

  // Buscar animes em destaque
  static async getFeaturedAnimes(limit: number = 10): Promise<ApiResponse<Anime[]>> {
    try {
      console.log(`🌐 [STATIC API] Buscando animes em destaque`)
      return await StaticAnimeService.getFeaturedAnimes(1, limit)
    } catch (error: any) {
      console.warn(`⚠️ [STATIC API] Erro ao buscar animes em destaque, usando fallback:`, error.message)
      
      // Retornar animes com rating alto como destaque
      const featuredAnimes = mockAnimes.filter(anime => parseFloat(anime.rating) >= 8.0)
      
      return createMockResponse(featuredAnimes, 1, limit)
    }
  }

  // Buscar animes recentes
  static async getRecentAnimes(limit: number = 20): Promise<ApiResponse<Anime[]>> {
    try {
      console.log(`🌐 [STATIC API] Buscando animes recentes`)
      return await StaticAnimeService.getRecentAnimes(1, limit)
    } catch (error: any) {
      console.warn(`⚠️ [STATIC API] Erro ao buscar animes recentes, usando fallback:`, error.message)
      
      // Retornar dados mock como recentes (invertendo a ordem)
      const recentAnimes = [...mockAnimes].reverse()
      
      return createMockResponse(recentAnimes, 1, limit)
    }
  }

  // Buscar animes por gênero
  static async getAnimesByGenre(genre: string, page: number = 1, limit: number = 20): Promise<ApiResponse<Anime[]>> {
    try {
      console.log(`🌐 [STATIC API] Buscando animes por gênero: ${genre}`)
      return await StaticAnimeService.getAnimesByGenre(genre, page, limit)
    } catch (error: any) {
      console.warn(`⚠️ [STATIC API] Erro ao buscar animes por gênero, usando fallback:`, error.message)
      
      // Filtrar dados mock por gênero (simulado)
      const filteredAnimes = mockAnimes.filter(anime => 
        anime.name.toLowerCase().includes(genre.toLowerCase())
      )
      
      return createMockResponse(filteredAnimes, page, limit)
    }
  }

  // Buscar estatísticas de um anime
  static async getAnimeStats(animeId: number): Promise<any> {
    try {
      console.log(`🌐 [STATIC API] Buscando estatísticas do anime ID: ${animeId}`)
      return await StaticAnimeService.getAnimeStats(animeId)
    } catch (error: any) {
      console.warn(`⚠️ [STATIC API] Erro ao buscar estatísticas do anime, usando fallback:`, error.message)
      
      // Retornar estatísticas mock
      return {
        views: Math.floor(Math.random() * 100000),
        likes: Math.floor(Math.random() * 10000),
        rating: (Math.random() * 5 + 5).toFixed(1),
        episodes_watched: Math.floor(Math.random() * 1000)
      }
    }
  }

  // Buscar múltiplos animes por IDs
  static async getAnimesByIds(animeIds: number[]): Promise<Record<number, Anime>> {
    try {
      if (animeIds.length === 0) {
        return {}
      }

      console.log(`🌐 [STATIC API] Buscando informações para ${animeIds.length} animes:`, animeIds)
      
      // Buscar cada anime individualmente e criar um mapa
      const animePromises = animeIds.map(async (id) => {
        try {
          const response = await this.getAnimeById(id)
          return { id, anime: response.data }
        } catch (error) {
          console.warn(`⚠️ [STATIC API] Erro ao buscar anime ${id}:`, error)
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

      console.log(`✅ [STATIC API] Informações de ${Object.keys(animeMap).length} animes carregadas`)
      return animeMap
    } catch (error) {
      console.error('❌ [STATIC API] Erro ao buscar animes por IDs:', error)
      return {}
    }
  }
}

// Serviços da API de Episódios (usando API estática)
export class EpisodeService {
  // Obter episódios de um anime
  static async getEpisodes(animeId: number): Promise<Episode[]> {
    try {
      console.log(`🌐 [STATIC API] Buscando episódios do anime ID: ${animeId}`)
      return await StaticEpisodeService.getEpisodes(animeId)
    } catch (error) {
      console.error('❌ [STATIC API] Erro ao buscar episódios:', error)
      
      // Fallback para episódios mock
      console.log('📦 [STATIC API] Usando episódios mock para anime:', animeId)
      return [
        {
          id: 1,
          number: 1,
          title: `Episódio 1 - Anime ${animeId}`,
          url: `/watch/${animeId}/1`,
          anime_id: animeId,
          anime_name: `Anime ${animeId}`
        },
        {
          id: 2,
          number: 2,
          title: `Episódio 2 - Anime ${animeId}`,
          url: `/watch/${animeId}/2`,
          anime_id: animeId,
          anime_name: `Anime ${animeId}`
        }
      ]
    }
  }

  // Obter dados de streaming de um episódio
  static async getEpisodeStream(animeId: number, episodeNumber: number): Promise<EpisodeStreamResponse> {
    try {
      console.log(`🌐 [STATIC API] Buscando stream para anime ${animeId}, episódio ${episodeNumber}`)
      return await StaticEpisodeService.getEpisodeStream(animeId, episodeNumber)
    } catch (error: any) {
      console.error(`❌ [STATIC API] Erro ao buscar stream para anime ${animeId}, episódio ${episodeNumber}:`, error.message)
      
      // Se for erro 404, episódio não existe
      if (error.message?.includes('não encontrado')) {
        throw new Error('Episódio não encontrado.')
      }
      
      // Para outros erros
      throw new Error('Episódio temporariamente indisponível. Tente novamente em alguns minutos.')
    }
  }
}

// Função utilitária para processar dados de stream (usando API estática)
export function processEpisodeStreamData(response: EpisodeStreamResponse): VideoQualityOption[] {
  console.log('🔧 [STATIC API] Processando dados de stream:', response)
  
  try {
    // Verificar se response.data existe antes de processar
    if (!response || !response.data) {
      console.error('❌ [STATIC API] Dados de resposta inválidos:', response);
      return [];
    }
    
    // Processar os dados de streaming usando a função da classe StaticEpisodeService
    const processedData = StaticEpisodeService.processExternalStreamingData(response.data)
    
    // Para dados reais da API externa - retornar apenas a URL principal
    if (processedData.mainUrl) {
      const mainSource: VideoQualityOption[] = [{
        label: response?.data?.token ? 'Token Principal' : 'Melhor Qualidade',
        src: processedData.mainUrl,
        isAlternative: false
      }]
      
      console.log('🎯 [STATIC API] Fonte principal selecionada:', mainSource[0].label, 'URL:', processedData.mainUrl)
      return mainSource
    }
    
    console.log('⚠️ [STATIC API] Nenhuma fonte principal encontrada')
    return []
  } catch (error) {
    console.error('❌ [STATIC API] Erro ao processar dados de stream:', error)
    return []
  }
}

// Interceptors removidos - usando API estática local