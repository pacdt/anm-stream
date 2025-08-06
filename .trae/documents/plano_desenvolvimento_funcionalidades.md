# Plano de Desenvolvimento - Novas Funcionalidades

## 1. Visão Geral do Projeto

### Arquitetura Atual
- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Estado**: Zustand stores (authStore, playerStore)
- **Roteamento**: React Router
- **API**: Consumo de APIs externas para dados de anime

### Estrutura de Dados Existente
- `user_favorites`: Favoritos do usuário
- `watch_history`: Histórico básico de visualização
- `user_profiles`: Perfis de usuário

## 2. Funcionalidades a Implementar

### 2.1 Sistema de Progresso Avançado
**Objetivo**: Salvar progresso detalhado e implementar botão "Continuar"

**Análise Atual**:
- Já existe `watch_history` com campos básicos
- VideoPlayer já salva progresso a cada 10 segundos
- Falta lógica para detectar último episódio assistido

**Implementação**:
1. **Banco de Dados**:
   - Adicionar campos na tabela `watch_history`:
     - `last_position_seconds`: Posição exata de pausa
     - `is_completed`: Se o episódio foi completado
     - `last_watched_at`: Timestamp da última visualização

2. **Backend (SupabaseService)**:
   - `getLastWatchedEpisode(animeId)`: Retorna último episódio assistido
   - `updateWatchProgress()`: Melhorar para salvar posição exata
   - `markEpisodeCompleted()`: Marcar episódio como concluído

3. **Frontend**:
   - **AnimeCard**: Lógica para mostrar "Continuar" vs "Assistir"
   - **AnimeDetail**: Botão inteligente baseado no progresso
   - **VideoPlayer**: Salvar progresso a cada pausa
   - **Player**: Retomar do timestamp salvo

**Prioridade**: Alta
**Tempo estimado**: 2-3 dias

### 2.2 Refatoração da Função de Pesquisa
**Objetivo**: Melhorar busca com Enter e navegação para página de resultados

**Análise Atual**:
- Header tem campo de busca
- Existe página Search.tsx
- Falta integração adequada entre busca e resultados

**Implementação**:
1. **Header Component**:
   - Adicionar onSubmit no formulário de busca
   - Navegação para `/search?q={termo}` ao pressionar Enter
   - Melhorar UX do botão de busca

2. **Search Page**:
   - Ler parâmetro `q` da URL
   - Implementar busca na API de animes
   - Exibir resultados em grid responsivo
   - Estados de loading, erro e "nenhum resultado"

3. **API Integration**:
   - Função de busca na API externa
   - Filtros por tipo (legendado/dublado)
   - Paginação de resultados

**Prioridade**: Média
**Tempo estimado**: 1-2 dias

### 2.3 Página de Histórico Funcional
**Objetivo**: Exibir histórico com episódios e timestamps

**Análise Atual**:
- Página History.tsx existe mas está vazia
- Dados já são salvos em `watch_history`
- Hook `useHistory` já implementado

**Implementação**:
1. **History Page**:
   - Layout com cards de histórico
   - Informações: anime, episódio, progresso, data
   - Botão "Continuar" para retomar
   - Filtros por data/anime

2. **HistoryCard Component**:
   - Thumbnail do anime
   - Nome do anime e episódio
   - Barra de progresso visual
   - Timestamp de quando parou
   - Ação para continuar assistindo

3. **Backend**:
   - Otimizar query de histórico
   - Ordenação por data mais recente
   - Paginação para históricos extensos

**Prioridade**: Média
**Tempo estimado**: 1-2 dias

### 2.4 Seção "Talvez você Goste"
**Objetivo**: Substituir "Populares da Semana" por recomendações aleatórias

**Análise Atual**:
- Home.tsx tem seção de populares
- API fornece dados de animes
- Falta lógica de recomendação

**Implementação**:
1. **Home Page**:
   - Remover seção "Populares da Semana"
   - Adicionar seção "Talvez você Goste"
   - Algoritmo simples de recomendação

2. **Recommendation Logic**:
   - Buscar animes aleatórios da API
   - Misturar legendados e dublados
   - Evitar animes já assistidos (se logado)
   - Cache de recomendações por sessão

3. **API Integration**:
   - Endpoint para animes aleatórios
   - Filtros por qualidade/tipo
   - Fallback para animes populares

**Prioridade**: Baixa
**Tempo estimado**: 1 dia

### 2.5 Melhorias nos Cards de Anime
**Objetivo**: Adicionar faixa etária e melhorar visibilidade do nome

**Análise Atual**:
- AnimeCard.tsx já implementado
- Dados da API incluem rating
- Layout atual com hover effects

**Implementação**:
1. **AnimeCard Component**:
   - Adicionar badge de faixa etária
   - Nome sempre visível (sem hover)
   - Reposicionar rating e faixa etária
   - Melhorar responsividade

2. **Styling**:
   - Badge colorido para faixa etária
   - Gradiente no bottom para legibilidade
   - Ajustar tamanhos e espaçamentos
   - Hover effects mais sutis

3. **Data Mapping**:
   - Mapear ratings da API para faixas etárias
   - Fallback para "Não classificado"
   - Cores por categoria de idade

**Prioridade**: Baixa
**Tempo estimado**: 1 dia

## 3. Ordem de Implementação

### Fase 1 (Prioridade Alta)
1. **Sistema de Progresso Avançado**
   - Migração do banco de dados
   - Atualização do SupabaseService
   - Lógica do botão "Continuar"

### Fase 2 (Prioridade Média)
2. **Refatoração da Pesquisa**
   - Header com navegação
   - Página de resultados

3. **Página de Histórico**
   - Layout e componentes
   - Integração com dados

### Fase 3 (Prioridade Baixa)
4. **Seção "Talvez você Goste"**
   - Algoritmo de recomendação
   - Substituição na Home

5. **Melhorias nos Cards**
   - Faixa etária e layout
   - Ajustes visuais

## 4. Considerações Técnicas

### Dependências
- Todas as funcionalidades dependem da API externa de animes
- Sistema de progresso requer usuário autenticado
- Histórico e favoritos compartilham estrutura de dados

### Performance
- Cache de recomendações para evitar requests excessivos
- Paginação no histórico para grandes volumes
- Lazy loading de imagens nos cards

### UX/UI
- Estados de loading consistentes
- Feedback visual para ações do usuário
- Responsividade em todos os componentes
- Acessibilidade com ARIA labels

### Segurança
- Validação de dados do usuário
- Sanitização de inputs de busca
- Rate limiting nas APIs

## 5. Estrutura de Dados Necessária

### Migração do Banco (004_enhanced_watch_history.sql)
```sql
-- Adicionar campos à tabela watch_history
ALTER TABLE watch_history ADD COLUMN IF NOT EXISTS last_position_seconds INTEGER DEFAULT 0;
ALTER TABLE watch_history ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE watch_history ADD COLUMN IF NOT EXISTS last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_watch_history_last_watched ON watch_history(user_id, last_watched_at DESC);
CREATE INDEX IF NOT EXISTS idx_watch_history_anime_progress ON watch_history(user_id, anime_id, last_watched_at DESC);
```

### Novos Tipos TypeScript
```typescript
interface EnhancedWatchHistory extends WatchHistoryItem {
  lastPositionSeconds: number
  isCompleted: boolean
  lastWatchedAt: string
}

interface AnimeProgress {
  animeId: number
  lastEpisode: number
  lastPosition: number
  totalEpisodes: number
  completionPercentage: number
}

interface SearchResult {
  animes: Anime[]
  totalResults: number
  currentPage: number
  totalPages: number
}
```

## 6. Cronograma de Desenvolvimento

**Semana 1**:
- Migração do banco de dados
- Sistema de progresso avançado
- Testes da funcionalidade "Continuar"

**Semana 2**:
- Refatoração da pesquisa
- Página de histórico funcional
- Testes de integração

**Semana 3**:
- Seção "Talvez você Goste"
- Melhorias nos cards
- Polimento e otimizações

**Total estimado**: 3 semanas de desenvolvimento

---

*Este plano será atualizado conforme o progresso do desenvolvimento e feedback dos testes.*