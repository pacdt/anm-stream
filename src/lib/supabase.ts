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

// Função para validar credenciais do Supabase
export const validateSupabaseCredentials = (): boolean => {
  const url = import.meta.env.VITE_SUPABASE_URL || ''
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  
  // Verificar se URL tem formato válido
  const urlPattern = /^https:\/\/[a-zA-Z0-9-]+\.supabase\.co$/
  if (!urlPattern.test(url)) {
    console.error('❌ URL do Supabase inválida:', url)
    return false
  }
  
  // Verificar se a chave tem formato JWT válido
  const jwtPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/
  if (!jwtPattern.test(key)) {
    console.error('❌ Chave do Supabase inválida')
    return false
  }
  
  console.log('✅ Credenciais do Supabase válidas')
  return true
}

// Função simples para verificar conectividade do Supabase
export const checkSupabaseConnectivity = async (): Promise<boolean> => {
  if (!isSupabaseConfigured || !supabase) {
    return false
  }
  
  try {
    await supabase.auth.getSession()
    return true
  } catch (error: any) {
    return false
  }
}

// Função para verificar se o Supabase está disponível
export const checkSupabaseAvailable = () => {
  if (!isSupabaseConfigured) {
    console.warn('🔧 Supabase não configurado - rodando em modo visitante')
    return false
  }
  return true
}