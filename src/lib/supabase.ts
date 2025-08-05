import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types'

// Configuração do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Verificar se o Supabase está configurado
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Criar cliente do Supabase apenas se estiver configurado
export const supabase = isSupabaseConfigured 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null

// Função para verificar se o Supabase está disponível
export const checkSupabaseAvailable = () => {
  if (!isSupabaseConfigured) {
    console.warn('Supabase não configurado - rodando em modo visitante')
    return false
  }
  return true
}