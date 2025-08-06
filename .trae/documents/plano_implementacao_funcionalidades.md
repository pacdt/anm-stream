# Plano de Implementação - Funcionalidades Avançadas

## 📋 Visão Geral

Este documento detalha o plano de implementação para 5 funcionalidades principais no projeto AnimeStream:

1. **Sistema de Progresso Avançado** - Salvar progresso detalhado com timestamp
2. **Refatoração da Pesquisa** - Melhorar funcionalidade de busca
3. **Página de Histórico Funcional** - Implementar visualização completa do histórico
4. **Seção "Talvez você Goste"** - Substituir "Populares da Semana" por recomendações
5. **Melhorias nos Cards** - Adicionar faixa etária e melhorar visibilidade

---

## 🏗️ Análise da Arquitetura Atual

### Frontend
- **Framework**: React 18 + TypeScript
- **Roteamento**: React Router
- **Estado**: TanStack Query (React Query)
- **Estilização**: Tailwind CSS
- **Componentes**: Lucide React (ícones)

### Backend/Dados
- **BaaS**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Armazenamento**: Supabase Storage

### Estrutura Atual Relevante
```
src/
├── components/
│   ├── AnimeCard.tsx          # Cards de anime
│   ├── Header.tsx             # Cabeçalho com busca
│   └── Carousel.tsx           # Carrossel de animes
├── pages/
│   ├── Home.tsx               # Página inicial
│   ├── Search.tsx             # Página de busca
│   └── History.tsx            # Página de histórico
├── hooks/
│   ├── useAnimes.ts           # Hooks para animes
│   ├── useHistory.ts          # Hooks para histórico
│   └── useAuth.ts             # Hooks de autenticação
├── lib/
│   └── supabaseService.ts     # Serviços do Supabase
└── types/
    └── index.ts               # Definições de tipos
```

---

## 🎯 Funcionalidades Detalhadas

### 1. Sistema de Progresso Avançado

#### 📊 Situação Atual
- Tabela `watch_history` existe com campos básicos
- Hooks `useEpisodeProgress` e `useAnimeProgress` implementados
- Função `updateWatchProgress` funcional

#### 🔧 Implementações Necessárias

**1.1 Migração do Banco de Dados**
```sql
-- Adicionar novos campos à tabela watch_history
ALTER TABLE watch_history 
ADD COLUMN IF NOT EXISTS last_position_seconds INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_watch_history_user_anime 
ON watch_history(user_id, anime_id);

CREATE INDEX IF NOT EXISTS idx_watch_history_last_watched 
ON watch_history(user_id, last_watched_at DESC);
```

**1.2 Atualizar Tipos TypeScript**
```typescript
// Atualizar WatchHistoryItem em types/index.ts
export interface WatchHistoryItem {
  id: string;
  user_id: string;
  anime_id: number;
  anime_name: string;
  episode_number: number;
  progress_seconds: number;
  total_duration_seconds?: number;
  last_position_seconds: number;  // NOVO
  is_completed: boolean;           // NOVO
  last_watched_at: string;         // NOVO (renomeado de last_watched)
}

// Novo tipo para progresso de anime
export interface AnimeProgress {
  anime_id: number;
  anime_name: string;
  last_episode: number;
  last_position_seconds: number;
  total_episodes_watched: number;
  completion_percentage: number;
  last_watched_at: string;
}
```

**1.3 Atualizar SupabaseService**
```typescript
// Adicionar em supabaseService.ts
static async getLastWatchedEpisode(animeId: number): Promise<WatchHistoryItem | null> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null

  const { data, error } = await supabase
    .from('watch_history')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('anime_id', animeId)
    .order('last_watched_at', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

static async updateDetailedWatchProgress(params: {
  animeId: number;
  animeName: string;
  episodeNumber: number;
  currentTimeSeconds: number;
  totalDurationSeconds: number;
  isCompleted?: boolean;
}) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) throw new Error('Usuário não autenticado')

  const { data, error } = await supabase
    .from('watch_history')
    .upsert({
      user_id: session.user.id,
      anime_id: params.animeId,
      anime_name: params.animeName,
      episode_number: params.episodeNumber,
      progress_seconds: params.currentTimeSeconds,
      total_duration_seconds: params.totalDurationSeconds,
      last_position_seconds: params.currentTimeSeconds,
      is_completed: params.isCompleted || false,
      last_watched_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,anime_id,episode_number'
    })

  if (error) throw error
  return data
}
```

**1.4 Atualizar VideoPlayer**
```typescript
// Modificar VideoPlayer.tsx para salvar progresso a cada pausa
const handlePause = () => {
  setIsPlaying(false)
  
  // Salvar progresso quando pausar
  if (currentTime > 0) {
    updateWatchProgress.mutate({
      animeId: anime.id,
      animeName: anime.name,
      episodeNumber: episode.number,
      currentTimeSeconds: Math.floor(currentTime),
      totalDurationSeconds: Math.floor(duration),
      isCompleted: currentTime >= duration * 0.9 // 90% = completo
    })
  }
}

// Salvar progresso a cada 30 segundos durante reprodução
useEffect(() => {
  if (isPlaying && currentTime > 0) {
    const interval = setInterval(() => {
      updateWatchProgress.mutate({
        animeId: anime.id,
        animeName: anime.name,
        episodeNumber: episode.number,
        currentTimeSeconds: Math.floor(currentTime),
        totalDurationSeconds: Math.floor(duration)
      })
    }, 30000) // A cada 30 segundos

    return () => clearInterval(interval)
  }
}, [isPlaying, currentTime])
```

**1.5 Implementar Botão "Continuar"**
```typescript
// Criar hook useAnimeWatchStatus
export const useAnimeWatchStatus = (animeId: number) => {
  return useQuery({
    queryKey: ['anime-watch-status', animeId],
    queryFn: () => SupabaseService.getLastWatchedEpisode(animeId),
    enabled: !!animeId
  })
}

// Atualizar AnimeCard.tsx
const { data: watchStatus } = useAnimeWatchStatus(anime.id)
const hasProgress = watchStatus && watchStatus.last_position_seconds > 30

// Renderizar botão baseado no progresso
{hasProgress ? (
  <Link
    to={`/anime/${anime.id}/episode/${watchStatus.episode_number}?t=${watchStatus.last_position_seconds}`}
    className="bg-green-600 rounded-full p-3"
  >
    <Play className="w-6 h-6 text-white fill-current" />
    <span className="sr-only">Continuar</span>
  </Link>
) : (
  <Link
    to={`/anime/${anime.id}`}
    className="bg-red-600 rounded-full p-3"
  >
    <Play className="w-6 h-6 text-white fill-current" />
    <span className="sr-only">Assistir</span>
  </Link>
)}
```

### 2. Refatoração da Função de Pesquisa

#### 📊 Situação Atual
- Header.tsx tem busca com dropdown de resultados
- Search.tsx existe mas usa hook `useAnimeSearch` não implementado
- Navegação para `/search?q=` funciona parcialmente

#### 🔧 Implementações Necessárias

**2.1 Corrigir Hook de Busca**
```typescript
// Atualizar useAnimes.ts
export const useSearchAnimes = (query: string, page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['search-animes', query, page, limit],
    queryFn: async () => {
      if (!query.trim()) return { animes: [], total: 0, totalPages: 0 }
      
      // Implementar busca real na API
      const response = await fetch(
        `/api/animes/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
      )
      
      if (!response.ok) throw new Error('Erro na busca')
      return response.json()
    },
    enabled: !!query.trim(),
    staleTime: 5 * 60 * 1000 // 5 minutos
  })
}
```

**2.2 Melhorar Header.tsx**
```typescript
// Adicionar função para busca com Enter
const handleSearchKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    handleSearchSubmit(e as any)
  }
}

// Adicionar botão de busca
<div className="relative flex items-center">
  <input
    ref={searchInputRef}
    type="text"
    placeholder="Buscar animes..."
    className="w-64 px-4 py-2 pl-10 pr-12 bg-gray-800..."
    onChange={handleSearchInputChange}
    onKeyDown={handleSearchKeyDown}
    onFocus={() => searchQuery && setIsSearchOpen(true)}
  />
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
  <button
    type="submit"
    onClick={handleSearchSubmit}
    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-white"
  >
    <Search className="w-4 h-4" />
  </button>
</div>
```

**2.3 Corrigir Search.tsx**
```typescript
// Substituir useAnimeSearch por useSearchAnimes
const {
  data: searchResults,
  isLoading,
  error
} = useSearchAnimes(query, page, 20)

// Adicionar tratamento de resultados vazios
{searchResults && searchResults.animes.length === 0 && query && (
  <div className="text-center py-12">
    <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-400 mb-2">
      Nenhum resultado encontrado
    </h3>
    <p className="text-gray-500">
      Tente buscar com termos diferentes ou verifique a ortografia
    </p>
  </div>
)}
```

### 3. Página de Histórico Funcional

#### 📊 Situação Atual
- History.tsx existe mas não exibe dados reais
- useWatchHistory implementado mas retorna dados simulados
- Interface preparada mas sem integração

#### 🔧 Implementações Necessárias

**3.1 Corrigir useWatchHistory**
```typescript
// Atualizar useHistory.ts
export const useWatchHistory = (params: {
  period?: 'today' | 'week' | 'month' | 'all'
  search?: string
  page?: number
  limit?: number
} = {}) => {
  return useQuery({
    queryKey: ['watch-history', params],
    queryFn: async (): Promise<HistoryResponse> => {
      const history = await SupabaseService.getWatchHistory()
      
      // Aplicar filtros
      let filteredHistory = history
      
      // Filtro de busca
      if (params.search) {
        const searchLower = params.search.toLowerCase()
        filteredHistory = filteredHistory.filter(item => 
          item.anime_name.toLowerCase().includes(searchLower)
        )
      }
      
      // Filtro de período
      if (params.period && params.period !== 'all') {
        const now = new Date()
        filteredHistory = filteredHistory.filter(item => {
          const itemDate = new Date(item.last_watched_at)
          
          switch (params.period) {
            case 'today':
              return itemDate.toDateString() === now.toDateString()
            case 'week':
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
              return itemDate >= weekAgo
            case 'month':
              const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
              return itemDate >= monthAgo
            default:
              return true
          }
        })
      }
      
      // Ordenar por data mais recente
      filteredHistory.sort((a, b) => 
        new Date(b.last_watched_at).getTime() - new Date(a.last_watched_at).getTime()
      )
      
      // Paginação
      const page = params.page || 1
      const limit = params.limit || 20
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedHistory = filteredHistory.slice(startIndex, endIndex)
      
      return {
        entries: paginatedHistory,
        total: filteredHistory.length,
        totalPages: Math.ceil(filteredHistory.length / limit),
        currentPage: page,
        hasNext: endIndex < filteredHistory.length,
        hasPrev: page > 1
      }
    },
    staleTime: 1 * 60 * 1000
  })
}
```

**3.2 Atualizar History.tsx**
```typescript
// Adicionar renderização dos cards de histórico
{historyData && historyData.entries.length > 0 && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {historyData.entries.map((item) => (
      <div key={`${item.anime_id}-${item.episode_number}`} className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="p-4">
          <h3 className="font-semibold text-white mb-2 line-clamp-1">
            {item.anime_name}
          </h3>
          
          <div className="text-gray-400 text-sm mb-3">
            <p>Episódio {item.episode_number}</p>
            <p>
              Parou em: {Math.floor(item.last_position_seconds / 60)}:{(item.last_position_seconds % 60).toString().padStart(2, '0')}
            </p>
            <p className="text-xs">
              {formatDistanceToNow(new Date(item.last_watched_at), { 
                addSuffix: true, 
                locale: ptBR 
              })}
            </p>
          </div>
          
          {/* Barra de progresso */}
          {item.total_duration_seconds && (
            <div className="w-full bg-gray-600 rounded-full h-1 mb-3">
              <div
                className="bg-red-600 h-1 rounded-full"
                style={{ 
                  width: `${Math.min((item.last_position_seconds / item.total_duration_seconds) * 100, 100)}%` 
                }}
              />
            </div>
          )}
          
          {/* Botões de ação */}
          <div className="flex gap-2">
            <Link
              to={`/anime/${item.anime_id}/episode/${item.episode_number}?t=${item.last_position_seconds}`}
              className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-center text-sm hover:bg-red-700 transition-colors"
            >
              Continuar
            </Link>
            <button
              onClick={() => removeFromHistory.mutate({ 
                animeId: item.anime_id, 
                episodeNumber: item.episode_number 
              })}
              className="bg-gray-700 text-gray-300 px-3 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
)}
```

### 4. Seção "Talvez você Goste"

#### 📊 Situação Atual
- Home.tsx tem seção "Populares da Semana"
- useAnimesBySection implementado
- Carrossel funcional

#### 🔧 Implementações Necessárias

**4.1 Criar Hook para Recomendações**
```typescript
// Adicionar em useAnimes.ts
export const useRandomRecommendations = (limit: number = 20) => {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['random-recommendations', user?.id, limit],
    queryFn: async () => {
      // Buscar animes aleatórios de ambas as seções
      const [dubladosResponse, legendadosResponse] = await Promise.all([
        fetch(`/api/animes/section/dublados?page=1&limit=50`),
        fetch(`/api/animes/section/legendados?page=1&limit=50`)
      ])
      
      const dublados = await dubladosResponse.json()
      const legendados = await legendadosResponse.json()
      
      // Combinar e embaralhar
      const allAnimes = [...(dublados.data || []), ...(legendados.data || [])]
      
      // Se usuário logado, filtrar animes já assistidos
      let filteredAnimes = allAnimes
      if (user) {
        const watchHistory = await SupabaseService.getWatchHistory()
        const watchedAnimeIds = new Set(watchHistory.map(item => item.anime_id))
        filteredAnimes = allAnimes.filter(anime => !watchedAnimeIds.has(anime.id))
      }
      
      // Embaralhar e pegar quantidade solicitada
      const shuffled = filteredAnimes.sort(() => Math.random() - 0.5)
      return shuffled.slice(0, limit)
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false
  })
}
```

**4.2 Atualizar Home.tsx**
```typescript
// Substituir seção "Populares da Semana"
const { data: recommendedAnimes, isLoading: recommendedLoading } = useRandomRecommendations(20)

// Remover:
// const { data: popularAnimes, isLoading: popularLoading, error: popularError } = useAnimesBySection('popular', 1, 20)

// Substituir no JSX:
{/* Talvez você Goste */}
<Carousel
  title="Talvez você Goste"
  animes={recommendedAnimes || []}
  isLoading={recommendedLoading}
  cardSize="md"
/>
```

### 5. Melhorias nos Cards de Anime

#### 📊 Situação Atual
- AnimeCard.tsx implementado com rating
- Nome do anime só aparece no hover
- Faixa etária não exibida

#### 🔧 Implementações Necessárias

**5.1 Atualizar AnimeCard.tsx**
```typescript
// Adicionar faixa etária e melhorar visibilidade do nome
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
    <div className="relative w-full h-4/5"> {/* Reduzir altura da imagem */}
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
      
      {/* Botão de play no hover */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-red-600 rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
          <Play className="w-6 h-6 text-white fill-current" />
        </div>
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
          <Heart className={cn('w-4 h-4', isFavorite && 'fill-current')} />
        </button>
      )}
    </div>
    
    {/* Informações sempre visíveis */}
    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
      <h3 className={cn(
        'font-semibold mb-1 line-clamp-2',
        textSizeClasses[size]
      )}>
        {anime.nome}
      </h3>
      
      <div className="flex items-center justify-between text-xs text-gray-300">
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
  </Link>
)
```

---

## 📅 Cronograma de Implementação

### Fase 1: Sistema de Progresso (Prioridade Alta)
**Tempo estimado: 3-4 dias**

1. **Dia 1**: Migração do banco + atualização de tipos
2. **Dia 2**: Atualização do SupabaseService + hooks
3. **Dia 3**: Modificação do VideoPlayer para salvar progresso
4. **Dia 4**: Implementação do botão "Continuar" + testes

### Fase 2: Melhorias nos Cards (Prioridade Alta)
**Tempo estimado: 1-2 dias**

1. **Dia 1**: Atualização do AnimeCard com faixa etária
2. **Dia 2**: Ajustes de layout e responsividade

### Fase 3: Página de Histórico (Prioridade Média)
**Tempo estimado: 2-3 dias**

1. **Dia 1**: Correção dos hooks de histórico
2. **Dia 2**: Implementação da interface de histórico
3. **Dia 3**: Testes e ajustes de UX

### Fase 4: Refatoração da Pesquisa (Prioridade Média)
**Tempo estimado: 2-3 dias**

1. **Dia 1**: Correção do hook de busca
2. **Dia 2**: Melhorias no Header e Search.tsx
3. **Dia 3**: Testes de integração

### Fase 5: Seção "Talvez você Goste" (Prioridade Baixa)
**Tempo estimado: 1-2 dias**

1. **Dia 1**: Implementação do hook de recomendações
2. **Dia 2**: Integração na Home + testes

**Tempo total estimado: 9-14 dias**

---

## ⚠️ Considerações Técnicas

### Performance
- Implementar debounce na busca (já existe)
- Cache de recomendações por 10 minutos
- Paginação no histórico para grandes volumes
- Índices no banco para consultas otimizadas

### UX/UI
- Feedback visual durante carregamento
- Estados de erro tratados
- Responsividade mantida
- Acessibilidade preservada

### Segurança
- Validação de dados no frontend e backend
- Autenticação obrigatória para funcionalidades de usuário
- Rate limiting na busca

### Testes
- Testes unitários para hooks críticos
- Testes de integração para fluxos principais
- Testes de performance para consultas de banco

---

## 🚀 Próximos Passos

1. **Configurar ambiente de desenvolvimento**
2. **Executar migração do banco de dados**
3. **Implementar Fase 1 (Sistema de Progresso)**
4. **Testar funcionalidades implementadas**
5. **Continuar com próximas fases conforme cronograma**

---

*Documento criado em: $(date)*
*Versão