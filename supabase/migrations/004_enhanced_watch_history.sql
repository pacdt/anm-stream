-- Migração 004: Sistema de Progresso Avançado
-- Adicionar campos para controle detalhado de progresso de visualização

-- Adicionar novos campos à tabela watch_history
ALTER TABLE watch_history 
ADD COLUMN IF NOT EXISTS last_position_seconds INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Atualizar registros existentes para ter last_watched_at baseado em created_at
UPDATE watch_history 
SET last_watched_at = created_at 
WHERE last_watched_at IS NULL;

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_watch_history_user_anime 
ON watch_history(user_id, anime_id);

CREATE INDEX IF NOT EXISTS idx_watch_history_last_watched 
ON watch_history(user_id, last_watched_at DESC);

CREATE INDEX IF NOT EXISTS idx_watch_history_anime_progress 
ON watch_history(user_id, anime_id, last_watched_at DESC);

-- Comentários para documentação
COMMENT ON COLUMN watch_history.last_position_seconds IS 'Posição exata em segundos onde o usuário parou de assistir';
COMMENT ON COLUMN watch_history.is_completed IS 'Indica se o episódio foi completamente assistido (90% ou mais)';
COMMENT ON COLUMN watch_history.last_watched_at IS 'Timestamp da última vez que o usuário assistiu este episódio';