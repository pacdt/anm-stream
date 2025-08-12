// Script de debug para verificar sincronização entre localStorage e Supabase

console.log('=== DEBUG SINCRONIZAÇÃO ===');

// Verificar dados no localStorage
const watchHistory = localStorage.getItem('anm-stream-watch-history');
const syncQueue = localStorage.getItem('anm-stream-sync-queue');

console.log('📦 Dados no localStorage:');
console.log('Watch History:', watchHistory ? JSON.parse(watchHistory) : 'Vazio');
console.log('Sync Queue:', syncQueue ? JSON.parse(syncQueue) : 'Vazio');

// Verificar se há itens não sincronizados
if (watchHistory) {
  const historyData = JSON.parse(watchHistory);
  const unsyncedItems = historyData.filter(item => !item.synced);
  console.log('🔄 Itens não sincronizados:', unsyncedItems.length);
  console.log('Detalhes dos itens não sincronizados:', unsyncedItems);
}

// Verificar fila de sincronização
if (syncQueue) {
  const queueData = JSON.parse(syncQueue);
  console.log('📋 Itens na fila de sincronização:', queueData.length);
  console.log('Detalhes da fila:', queueData);
}

// Verificar estado de autenticação
const authState = window.__SUPABASE_AUTH_STATE__ || 'Não disponível';
console.log('🔐 Estado de autenticação:', authState);

// Verificar se o Supabase está configurado
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
console.log('⚙️ Configuração Supabase:');
console.log('URL:', supabaseUrl ? 'Configurado' : 'Não configurado');
console.log('Key:', supabaseKey ? 'Configurado' : 'Não configurado');

console.log('=== FIM DEBUG ===');