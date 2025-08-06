-- Criação das tabelas para o sistema de usuários

-- Tabela de favoritos dos usuários
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  anime_id INTEGER NOT NULL,
  anime_name TEXT NOT NULL,
  anime_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, anime_id)
);

-- Tabela de histórico de visualização
CREATE TABLE IF NOT EXISTS watch_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  anime_id INTEGER NOT NULL,
  anime_name TEXT NOT NULL,
  episode_number INTEGER NOT NULL,
  progress_seconds INTEGER DEFAULT 0,
  total_duration_seconds INTEGER,
  last_watched TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, anime_id, episode_number)
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_history ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para user_favorites
CREATE POLICY "Usuários podem ver apenas seus próprios favoritos" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios favoritos" ON user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios favoritos" ON user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas de segurança para watch_history
CREATE POLICY "Usuários podem ver apenas seu próprio histórico" ON watch_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir em seu próprio histórico" ON watch_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu próprio histórico" ON watch_history
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seu próprio histórico" ON watch_history
  FOR DELETE USING (auth.uid() = user_id);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_anime_id ON user_favorites(anime_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_user_id ON watch_history(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_anime_id ON watch_history(anime_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_last_watched ON watch_history(last_watched DESC);

-- Conceder permissões para os roles anon e authenticated
GRANT SELECT ON user_favorites TO anon;
GRANT ALL PRIVILEGES ON user_favorites TO authenticated;

GRANT SELECT ON watch_history TO anon;
GRANT ALL PRIVILEGES ON watch_history TO authenticated;