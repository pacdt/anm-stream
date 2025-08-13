# TODO:

- [x] 1: Modificar processEpisodeStreamData em api.ts para não adicionar fonte 'Principal' extra quando já existem qualidades válidas (priority: High)
- [x] 2: Garantir que apenas dados reais da API externa sejam usados, sem misturar com dados mock (priority: High)
- [x] 6: Investigar e corrigir problema com URLs baseadas em token da API externa (priority: High)
- [x] 7: Analisar estrutura dos tokens na resposta da API externa (priority: High)
- [x] 8: Verificar se convertToProxyUrl processa tokens corretamente (priority: High)
- [x] 3: Adicionar flag is_mock para distinguir dados reais de mock na resposta (priority: Medium)
- [x] 4: Melhorar tratamento de erro para URLs não suportadas (lightspeedst.net) (priority: Medium)
- [x] 5: Testar se vídeos MP4 reais executam corretamente sem dados mock (priority: Medium)
- [x] 9: Adicionar suporte para outros domínios de vídeo se necessário (priority: Medium)
- [x] 10: Testar reprodução de vídeos com token após correções (priority: Medium)
