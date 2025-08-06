-- Adicionar campos adicionais à tabela user_profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS favorite_genres TEXT[]