import { Anime, Episode, EpisodeStreamResponse, ApiResponse } from '@/types'

// Classe para gerenciar a API estática local
export class StaticApiService {
  private static baseUrl = '/api'
  
  // Cache para armazenar dados já carregados
  private static cache = new Map<string, any>()
  
  // Função para carregar arquivo JSON
  private static async loadJsonFile(path: string): Promise<any> {
    // Verificar cache primeiro
    if (this.cache.has(path)) {
      console.log(`📦 [STATIC API] Usando cache para: ${path}`)
      return this.cache.get(path)
    }
    
    try {
      console.log(`🌐 [STATIC API] Carregando: ${this.baseUrl}${path}`)
      const response = await fetch(`${this.baseUrl}${path}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Armazenar no cache
      this.cache.set(path, data)
      
      console.log(`✅ [STATIC API] Dados carregados: ${path}`)
      return data
    } catch (error: any) {
      console.error(`❌ [STATIC API] Erro ao carregar ${path}:`, error.message)
      throw new Error(`Erro ao carregar dados: ${error.message}`)
    }
  }
  
  // Função para mapear dados do formato estático para o formato esperado
  private static mapAnimeData(animeData: any): Anime {
    return {
      id: animeData.id,
      nome: animeData.nome,
      name: animeData.nome, // Usar nome como name também
      link: animeData.link || '',
      rating: animeData.rating || 0,
      classificacao_etaria: animeData.classificacao_etaria || 'L',
      imagem_original: animeData.imagem_original || '',
      image: animeData.imagem_original || '', // Usar imagem_original como image
      secao: animeData.secao || 'legendados',
      total_episodios: animeData.total_episodios || 0,
      episodes_count: animeData.total_episodios || 0,
      year: new Date().getFullYear(), // Ano padrão
      genres: ['Anime'] // Gêneros padrão
    }
  }
  
  // Função para criar resposta paginada
  private static createPaginatedResponse<T>(
    data: T[],
    page: number = 1,
    limit: number = 20,
    message: string = 'Dados carregados'
  ): ApiResponse<T[]> {
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = data.slice(startIndex, endIndex)
    
    return {
      message,
      data: paginatedData,
      pagination: {
        current_page: page,
        per_page: limit,
        total_items: data.length,
        total_pages: Math.ceil(data.length / limit),
        has_next: endIndex < data.length,
        has_prev: page > 1
      }
    }
  }
}

// Serviços da API Estática de Animes
export class StaticAnimeService {
  // Listar animes com paginação
  static async getAnimes(page: number = 1, limit: number = 20): Promise<ApiResponse<Anime[]>> {
    try {
      const data = await StaticApiService.loadJsonFile('/animes/index.json')
      const animes = data.data.map((anime: any) => StaticApiService.mapAnimeData(anime))
      
      return StaticApiService.createPaginatedResponse(
        animes,
        page,
        limit,
        'Lista de animes carregada'
      )
    } catch (error: any) {
      console.error('❌ [STATIC API] Erro ao buscar animes:', error)
      throw error
    }
  }
  
  // Buscar anime por ID
  static async getAnimeById(id: number): Promise<ApiResponse<Anime>> {
    try {
      const data = await StaticApiService.loadJsonFile(`/animes/${id}.json`)
      const anime = StaticApiService.mapAnimeData(data.data)
      
      return {
        message: 'Anime encontrado',
        data: anime,
        pagination: {
          current_page: 1,
          per_page: 1,
          total_items: 1,
          total_pages: 1,
          has_next: false,
          has_prev: false
        }
      }
    } catch (error: any) {
      console.error(`❌ [STATIC API] Erro ao buscar anime ${id}:`, error)
      throw error
    }
  }
  
  // Buscar animes por seção
  static async getAnimesBySection(section: string, page: number = 1, limit: number = 20): Promise<ApiResponse<Anime[]>> {
    try {
      const data = await StaticApiService.loadJsonFile(`/animes/section/${section}.json`)
      const animes = data.data.map((anime: any) => StaticApiService.mapAnimeData(anime))
      
      return StaticApiService.createPaginatedResponse(
        animes,
        page,
        limit,
        `Animes da seção ${section} carregados`
      )
    } catch (error: any) {
      console.error(`❌ [STATIC API] Erro ao buscar seção ${section}:`, error)
      // Fallback para lista geral
      return this.getAnimes(page, limit)
    }
  }
  
  // Buscar top animes
  static async getTopAnimes(limit: number = 20): Promise<ApiResponse<Anime[]>> {
    try {
      const data = await StaticApiService.loadJsonFile(`/animes/top/${limit}.json`)
      const animes = data.data.map((anime: any) => StaticApiService.mapAnimeData(anime))
      
      return {
        message: `Top ${limit} animes carregados`,
        data: animes,
        pagination: {
          current_page: 1,
          per_page: limit,
          total_items: animes.length,
          total_pages: 1,
          has_next: false,
          has_prev: false
        }
      }
    } catch (error: any) {
      console.error(`❌ [STATIC API] Erro ao buscar top animes:`, error)
      // Fallback para lista geral limitada
      return this.getAnimes(1, limit)
    }
  }
  
  // Buscar animes por nome
  static async searchAnimesByName(query: string, page: number = 1): Promise<ApiResponse<Anime[]>> {
    try {
      // Tentar buscar arquivo específico de busca
      const data = await StaticApiService.loadJsonFile(`/animes/search/${encodeURIComponent(query)}.json`)
      const animes = data.data.map((anime: any) => StaticApiService.mapAnimeData(anime))
      
      return StaticApiService.createPaginatedResponse(
        animes,
        page,
        20,
        `Resultados da busca por "${query}"`
      )
    } catch (error: any) {
      console.warn(`⚠️ [STATIC API] Busca específica falhou, fazendo busca manual:`, error.message)
      
      // Fallback: buscar manualmente na lista geral
      try {
        const allData = await StaticApiService.loadJsonFile('/animes/index.json')
        const filteredAnimes = allData.data
          .filter((anime: any) => 
            anime.nome.toLowerCase().includes(query.toLowerCase()) ||
            anime.texto_original?.toLowerCase().includes(query.toLowerCase())
          )
          .map((anime: any) => StaticApiService.mapAnimeData(anime))
        
        return StaticApiService.createPaginatedResponse(
          filteredAnimes,
          page,
          20,
          `Resultados da busca por "${query}" (busca manual)`
        )
      } catch (fallbackError: any) {
        console.error('❌ [STATIC API] Erro na busca manual:', fallbackError)
        throw fallbackError
      }
    }
  }
  
  // Buscar animes relacionados
  static async getRelatedAnimes(animeId: number, limit: number = 12): Promise<ApiResponse<Anime[]>> {
    try {
      // Como não temos dados de relacionamento, retornar animes aleatórios
      const data = await StaticApiService.loadJsonFile('/animes/random/12-v1.json')
      const animes = data.data.map((anime: any) => StaticApiService.mapAnimeData(anime))
      
      return {
        message: 'Animes relacionados carregados',
        data: animes.slice(0, limit),
        pagination: {
          current_page: 1,
          per_page: limit,
          total_items: animes.length,
          total_pages: 1,
          has_next: false,
          has_prev: false
        }
      }
    } catch (error: any) {
      console.error('❌ [STATIC API] Erro ao buscar animes relacionados:', error)
      // Fallback para lista geral
      return this.getAnimes(1, limit)
    }
  }
  
  // Buscar animes populares
  static async getPopularAnimes(limit: number = 20): Promise<ApiResponse<Anime[]>> {
    return this.getTopAnimes(limit)
  }
  
  // Buscar animes em destaque
  static async getFeaturedAnimes(limit: number = 10): Promise<ApiResponse<Anime[]>> {
    return this.getTopAnimes(limit)
  }
  
  // Buscar animes recentes
  static async getRecentAnimes(limit: number = 20): Promise<ApiResponse<Anime[]>> {
    return this.getAnimesBySection('lancamentos', 1, limit)
  }
  
  // Buscar múltiplos animes por IDs
  static async getAnimesByIds(animeIds: number[]): Promise<Record<number, Anime>> {
    try {
      const animeMap: Record<number, Anime> = {}
      
      // Buscar cada anime individualmente
      const promises = animeIds.map(async (id) => {
        try {
          const response = await this.getAnimeById(id)
          animeMap[id] = response.data
        } catch (error) {
          console.warn(`⚠️ [STATIC API] Erro ao buscar anime ${id}:`, error)
          // Criar anime mock em caso de erro
          animeMap[id] = {
            id,
            nome: `Anime ${id}`,
            name: `Anime ${id}`,
            link: '',
            rating: 0,
            classificacao_etaria: 'L',
            imagem_original: '',
            image: '',
            secao: 'legendados',
            total_episodios: 0,
            episodes_count: 0,
            year: new Date().getFullYear(),
            genres: ['Desconhecido']
          }
        }
      })
      
      await Promise.all(promises)
      return animeMap
    } catch (error) {
      console.error('❌ [STATIC API] Erro ao buscar animes por IDs:', error)
      return {}
    }
  }
}

// Sistema de cache para evitar requisições repetidas
class CacheManager {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
  private static failureCache = new Map<string, { timestamp: number; ttl: number }>()
  
  // Cache de sucesso com TTL
  static set(key: string, data: any, ttlMinutes: number = 30): void {
    const ttl = ttlMinutes * 60 * 1000 // converter para ms
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
    console.log(`💾 [CACHE] Dados armazenados para: ${key} (TTL: ${ttlMinutes}min)`)
  }
  
  // Recuperar do cache de sucesso
  static get(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    const isExpired = Date.now() - cached.timestamp > cached.ttl
    if (isExpired) {
      this.cache.delete(key)
      console.log(`🗑️ [CACHE] Cache expirado removido: ${key}`)
      return null
    }
    
    console.log(`✅ [CACHE] Cache hit para: ${key}`)
    return cached.data
  }
  
  // Marcar URL como falhada (cache de falha)
  static markFailure(key: string, ttlMinutes: number = 5): void {
    const ttl = ttlMinutes * 60 * 1000
    this.failureCache.set(key, {
      timestamp: Date.now(),
      ttl
    })
    console.log(`❌ [CACHE] URL marcada como falhada: ${key} (TTL: ${ttlMinutes}min)`)
  }
  
  // Verificar se URL está marcada como falhada
  static isMarkedAsFailed(key: string): boolean {
    const failed = this.failureCache.get(key)
    if (!failed) return false
    
    const isExpired = Date.now() - failed.timestamp > failed.ttl
    if (isExpired) {
      this.failureCache.delete(key)
      console.log(`🔄 [CACHE] Cache de falha expirado, permitindo nova tentativa: ${key}`)
      return false
    }
    
    console.log(`🚫 [CACHE] URL ainda marcada como falhada: ${key}`)
    return true
  }
  
  // Limpar caches antigos
  static cleanup(): void {
    const now = Date.now()
    let cleanedCount = 0
    
    // Limpar cache de sucesso
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > cached.ttl) {
        this.cache.delete(key)
        cleanedCount++
      }
    }
    
    // Limpar cache de falha
    for (const [key, failed] of this.failureCache.entries()) {
      if (now - failed.timestamp > failed.ttl) {
        this.failureCache.delete(key)
        cleanedCount++
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`🧹 [CACHE] ${cleanedCount} entradas antigas removidas`)
    }
  }
}

// Função utilitária para requisições com timeout e retry
class RequestManager {
  private static async fetchWithTimeout(url: string, timeout: number = 10000): Promise<Response> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'AnimeStream/1.0'
        }
      })
      clearTimeout(timeoutId)
      return response
    } catch (error: any) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        throw new Error(`Timeout: Requisição para ${url} excedeu ${timeout}ms`)
      }
      throw error
    }
  }
  
  static async fetchWithRetry(
    url: string, 
    maxRetries: number = 3, 
    timeout: number = 10000,
    retryDelay: number = 1000,
    useCache: boolean = true
  ): Promise<any> {
    const cacheKey = `streaming:${url}`
    
    // Verificar cache primeiro
    if (useCache) {
      // Verificar se está marcada como falhada
      if (CacheManager.isMarkedAsFailed(cacheKey)) {
        throw new Error('URL marcada como falhada no cache')
      }
      
      // Verificar cache de sucesso
      const cached = CacheManager.get(cacheKey)
      if (cached) {
        return cached
      }
    }
    
    let lastError: Error
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 [REQUEST] Tentativa ${attempt}/${maxRetries} para: ${url}`)
        
        const response = await this.fetchWithTimeout(url, timeout)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        console.log(`✅ [REQUEST] Sucesso na tentativa ${attempt} para: ${url}`)
        
        // Armazenar no cache de sucesso
        if (useCache) {
          CacheManager.set(cacheKey, data, 30) // Cache por 30 minutos
        }
        
        return data
        
      } catch (error: any) {
        lastError = error
        console.warn(`⚠️ [REQUEST] Tentativa ${attempt} falhou:`, error.message)
        
        // Se não é a última tentativa, aguardar antes de tentar novamente
        if (attempt < maxRetries) {
          const delay = retryDelay * attempt // Backoff exponencial
          console.log(`⏳ [REQUEST] Aguardando ${delay}ms antes da próxima tentativa...`)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
    
    console.error(`❌ [REQUEST] Todas as ${maxRetries} tentativas falharam para: ${url}`)
    
    // Marcar como falhada no cache
    if (useCache) {
      CacheManager.markFailure(cacheKey, 5) // Cache de falha por 5 minutos
    }
    
    throw lastError!
  }
}

// Inicializar limpeza automática do cache
setInterval(() => {
  CacheManager.cleanup()
}, 10 * 60 * 1000) // Limpar cache a cada 10 minutos

// Função utilitária para converter URLs para proxy
export function convertToProxyUrl(originalUrl: string): string {
  console.log(`🔄 [PROXY] Analisando URL: ${originalUrl}`)
  
  // Evitar dupla conversão: se já estiver usando proxy, retornar inalterado
  if (originalUrl.startsWith('/api/')) {
    console.log(`🔄 [PROXY] URL já está proxificada: ${originalUrl}`)
    return originalUrl
  }
  
  // Converter URLs do blogger.com para usar o proxy de vídeo
  if (originalUrl.includes('blogger.com') && originalUrl.includes('video.g')) {
    // Extrair apenas o path da URL do blogger
    const url = new URL(originalUrl)
    const path = url.pathname + url.search
    const proxyUrl = `/api/blogger${path}`
    console.log(`🔄 [PROXY] Convertendo URL de vídeo do Blogger: ${originalUrl} -> ${proxyUrl}`)
    return proxyUrl
  }
  
  // Converter outras URLs do blogger.com para usar o proxy geral
  if (originalUrl.includes('blogger.com')) {
    const proxyUrl = `/api/blogger?url=${encodeURIComponent(originalUrl)}`
    console.log(`🔄 [PROXY] Convertendo URL do Blogger: ${originalUrl} -> ${proxyUrl}`)
    return proxyUrl
  }
  
  // URLs do animefire.plus não são suportadas (causam erro de CORS)
  if (originalUrl.startsWith('https://animefire.plus')) {
    console.log(`🚫 [PROXY] URL do AnimeFire detectada, lançando erro: ${originalUrl}`)
    throw new Error('URLs do AnimeFire não são suportadas (causam erro de CORS)')
  }
  
  // Para outras URLs, retornar inalterado
  console.log(`🔄 [PROXY] URL não necessita proxy: ${originalUrl}`)
  return originalUrl
}

// Serviços da API Estática de Episódios
export class StaticEpisodeService {
  // Listar episódios de um anime
  static async getEpisodes(animeId: number): Promise<{ episodes: Episode[], total_episodes: number }> {
    try {
      const data = await StaticApiService.loadJsonFile(`/episodes/${animeId}.json`)
      
      const episodes: Episode[] = data.episodes.map((ep: any) => ({
        episode_number: ep.episode_number,
        episode_url: ep.episode_url,
        anime_id: ep.anime_id,
        anime_name: ep.anime_name
      }))
      
      return {
        episodes,
        total_episodes: data.total_episodes || episodes.length
      }
    } catch (error: any) {
      console.error(`❌ [STATIC API] Erro ao buscar episódios do anime ${animeId}:`, error)
      throw error
    }
  }
  
  // Obter dados de streaming de um episódio
  static async getEpisodeStream(animeId: number, episodeNumber: number): Promise<EpisodeStreamResponse> {
    console.log(`🎬 [STATIC API] Buscando stream para anime ${animeId}, episódio ${episodeNumber}`)
    
    try {
      // Buscar dados do episódio
      const data = await StaticApiService.loadJsonFile(`/episodes/${animeId}.json`)
      
      // Encontrar o episódio específico
      const episode = data.episodes.find((ep: any) => ep.episode_number === episodeNumber)
      
      if (!episode) {
        throw new Error(`Episódio ${episodeNumber} não encontrado para o anime ${animeId}`)
      }
      
      if (!episode.episode_url) {
        throw new Error(`URL do episódio não disponível para o episódio ${episodeNumber}`)
      }
      
      try {
        // Verificar se é URL do animefire.plus e falhar imediatamente
        if (episode.episode_url.includes('animefire.plus')) {
          console.log(`🚫 [STATIC API] URL do AnimeFire detectada, falhando imediatamente: ${episode.episode_url}`)
          throw new Error('URL do AnimeFire não suportada (causa erro de CORS)')
        }
        
        // Converter URL externa para usar o proxy correto baseado no ambiente
        const proxyUrl = convertToProxyUrl(episode.episode_url)
        console.log(`🔄 [STATIC API] Usando proxy: ${proxyUrl} (original: ${episode.episode_url})`)
        
        // Fazer requisição com timeout e retry para a API externa de streaming via proxy
        const streamingData = await RequestManager.fetchWithRetry(
          proxyUrl,
          3, // máximo 3 tentativas
          8000, // timeout de 8 segundos
          1500 // delay inicial de 1.5s
        )
        
        console.log(`📡 [STATIC API] Dados de streaming recebidos:`, streamingData)
        
        // Verificar se os dados recebidos são válidos
        if (streamingData && streamingData.data && Array.isArray(streamingData.data) && streamingData.data.length > 0) {
          // Processar dados de streaming com lógica de priorização
          const processedData = this.processExternalStreamingData(streamingData)
          
          return {
            message: `Stream do episódio ${episodeNumber} carregado`,
            data: processedData
          }
        } else {
          throw new Error('Dados de streaming inválidos ou vazios recebidos da API externa')
        }
      } catch (externalError: any) {
        console.error(`❌ [STATIC API] API externa falhou após tentativas:`, externalError.message)
        throw new Error(`Episódio ${episodeNumber} não disponível: ${externalError.message}`)
      }
    } catch (error: any) {
      console.error(`❌ [STATIC API] Erro ao buscar stream para anime ${animeId}, episódio ${episodeNumber}:`, error)
      throw error
    }
  }
  
  // Função removida - não usar mais dados mock
  
  // Processar dados de streaming externos com lógica de priorização automática
  static processExternalStreamingData(streamingData: any): ProcessedStreamData {
    console.log("🔄 [STATIC API] Processando dados de streaming externos");
    
    // Se os dados já foram processados (contém qualities), retornar como estão
    if (streamingData && streamingData.qualities && Array.isArray(streamingData.qualities)) {
      console.log("✅ [STATIC API] Dados já processados, retornando como estão");
      return streamingData;
    }
    
    // Verificar se streamingData e streamingData.data existem e são um array
    if (!streamingData || !streamingData.data || !Array.isArray(streamingData.data)) {
      console.error("❌ [STATIC API] Dados de streaming inválidos:", streamingData);
      // Retornar dados vazios para evitar erro
      return {
        qualities: [],
        mainUrl: "",
        video_url: ""
      };
    }
    
    // Mapear qualidades disponíveis
    const qualities = streamingData.data.map((q: any) => ({
      label: q.label,
      url: q.src, // Corrigido: usando 'src' em vez de 'file'
    }));

    // NOVA LÓGICA: Priorizar token, senão usar a maior qualidade
    let mainUrl = "";
    
    if (streamingData.token) {
      // Usar sempre o token original sem conversão
      console.log("🎯 [STATIC API] Token encontrado, usando URL original:", streamingData.token);
      mainUrl = streamingData.token;
    } else if (qualities.length > 0) {
      // Sem token: encontrar a maior qualidade (1080p > 720p > 480p > 360p > etc)
      const qualityPriority = ['1080p', '720p', '480p', '360p', '240p'];
      
      let bestQuality = qualities[0]; // fallback para a primeira
      
      // Procurar pela maior qualidade disponível na ordem de prioridade
      for (const priority of qualityPriority) {
        const found = qualities.find(q => q.label.toLowerCase().includes(priority.toLowerCase()));
        if (found) {
          bestQuality = found;
          break;
        }
      }
      
      mainUrl = bestQuality.url;
      console.log("📺 [STATIC API] Maior qualidade selecionada:", bestQuality.label, "URL:", mainUrl);
    }

    const processedData: ProcessedStreamData = {
      qualities,
      mainUrl,
      video_url: mainUrl,
    };

    console.log(
      `✅ [STATIC API] Stream processado: ${qualities.length} qualidades, URL principal definida`
    );
    return processedData;
  }
}

// Interface para dados de stream processados
interface ProcessedStreamData {
  qualities: { label: string; url: string }[];
  mainUrl: string;
  video_url: string;
}