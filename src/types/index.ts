// Tipo do Anime
export interface Anime {
  id: number;
  nome: string;
  name: string; // Alias para nome
  link: string;
  rating: string;
  classificacao_etaria: string;
  imagem_original: string;
  image: string; // Alias para imagem_original
  imagem_pasta?: string;
  secao: 'dublados' | 'legendados' | 'lancamentos';
  total_episodios: number;
  episodes_count: number; // Alias para total_episodios
  arquivo_origem?: string;
  timestamp_arquivo?: string;
  year?: number;
  genres?: string[];
}

// Tipos para filtros
export type AnimeGenre = string
export type AnimeStatus = 'completed' | 'ongoing' | 'upcoming'
export type AnimeType = 'tv' | 'movie' | 'ova' | 'special'

// Tipo do Episódio
export interface Episode {
  episode_number: number;
  episode_url: string;
  anime_id: number;
  anime_name: string;
}

// Tipo dos Dados de Stream
export interface StreamData {
  label: string;
  src: string;
}

// Tipo da Resposta de Stream do Episódio
export interface EpisodeStreamResponse {
  message: string;
  anime: {
    id: number;
    nome: string;
  };
  episode: {
    number: number;
    url: string;
  };
  stream_data: StreamData[];
  metadata: {
    op_start?: number | null;
    op_end?: number | null;
  };
  available_qualities: string[];
  token?: string;
}

// Tipo para Opções de Qualidade do Player
export interface VideoQualityOption {
  label: string;
  src: string;
  isAlternative?: boolean;
}

// Tipo de Resposta da API
export interface ApiResponse<T> {
  message: string;
  data: T;
  pagination?: PaginationInfo;
}

// Tipo de Resposta com Paginação
export interface PaginatedResponse<T> {
  animes: T[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Tipo para Busca de Animes
export interface AnimeSearchResponse {
  animes: Anime[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Tipo para Favoritos
export interface FavoritesResponse {
  animes: Anime[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Tipo para Histórico
export interface HistoryResponse {
  items: WatchHistoryItem[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Tipo de Paginação
export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// Tipo do Usuário (Supabase Auth)
export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Tipo do Perfil do Usuário
export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Tipo para dados de cadastro
export interface SignUpData {
  email: string;
  password: string;
  displayName: string;
}

// Tipo dos Favoritos
export interface UserFavorite {
  id: string;
  user_id: string;
  anime_id: number;
  anime_name: string;
  anime_image?: string;
  created_at: string;
}

// Tipo do Histórico de Visualização
export interface WatchHistoryItem {
  id: string;
  user_id: string;
  anime_id: number;
  anime_name: string;
  episode_number: number;
  progress_seconds: number;
  total_duration_seconds?: number;
  last_position_seconds: number;  // NOVO: Posição exata onde parou
  is_completed: boolean;           // NOVO: Se o episódio foi completado
  last_watched_at: string;         // NOVO: Timestamp da última visualização
  last_watched: string;            // Mantido para compatibilidade
}

// Tipo para progresso de anime
export interface AnimeProgress {
  anime_id: number;
  anime_name: string;
  last_episode: number;
  last_position_seconds: number;
  total_episodes_watched: number;
  completion_percentage: number;
  last_watched_at: string;
}

// Tipo para Sessão do Supabase
export interface SupabaseSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: User;
}

// Tipos do banco de dados Supabase
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserProfile, 'id' | 'user_id'>>;
      };
      user_favorites: {
        Row: UserFavorite;
        Insert: Omit<UserFavorite, 'id' | 'created_at'>;
        Update: Partial<Omit<UserFavorite, 'id' | 'user_id'>>;
      };
      watch_history: {
        Row: WatchHistoryItem;
        Insert: Omit<WatchHistoryItem, 'id' | 'last_watched' | 'last_watched_at'>;
        Update: Partial<Omit<WatchHistoryItem, 'id' | 'user_id'>>;
      };
    };
  };
}