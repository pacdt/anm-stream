-- Criar tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id)
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Política para usuários autenticados poderem ver seus próprios perfis
CREATE POLICY "Usuários podem ver seus próprios perfis" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Política para usuários autenticados poderem inserir seus próprios perfis
CREATE POLICY "Usuários podem inserir seus próprios perfis" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para usuários autenticados poderem atualizar seus próprios perfis
CREATE POLICY "Usuários podem atualizar seus próprios perfis" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Política para usuários autenticados poderem deletar seus próprios perfis
CREATE POLICY "Usuários podem deletar seus próprios perfis" ON user_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Conceder permissões para roles anon e authenticated
GRANT SELECT, INSERT, UPDATE, DELETE ON user_profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_display_name ON user_profiles(display_name);