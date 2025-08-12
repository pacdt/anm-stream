-- Verificar permissões das tabelas
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
  AND table_name IN ('watch_history', 'user_favorites') 
  AND grantee IN ('anon', 'authenticated') 
ORDER BY table_name, grantee;

-- Garantir permissões para as tabelas
GRANT SELECT ON watch_history TO anon;
GRANT ALL PRIVILEGES ON watch_history TO authenticated;

GRANT SELECT ON user_favorites TO anon;
GRANT ALL PRIVILEGES ON user_favorites TO authenticated;