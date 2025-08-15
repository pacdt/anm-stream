api.ts:56 🌐 [STATIC API] Buscando anime por ID: 3601
staticApi.ts:19 🌐 [STATIC API] Carregando: /api/animes/3601.json
api.ts:348 🌐 [STATIC API] Buscando episódios do anime ID: 3601
staticApi.ts:19 🌐 [STATIC API] Carregando: /api/episodes/3601.json
api.ts:379 🌐 [STATIC API] Buscando stream para anime 3601, episódio 1
staticApi.ts:542 🎬 [STATIC API] Buscando stream para anime 3601, episódio 1
staticApi.ts:19 🌐 [STATIC API] Carregando: /api/episodes/3601.json
hook.js:608 ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. Error Component Stack
    at BrowserRouter (react-router-dom.js?v=6500782f:5247:5)
    at AppContent (App.tsx:30:3)
    at QueryClientProvider (@tanstack_react-query.js?v=6500782f:2934:3)
    at App (<anonymous>)
overrideMethod @ hook.js:608
warnOnce @ react-router-dom.js?v=6500782f:4393
logDeprecation @ react-router-dom.js?v=6500782f:4396
logV6DeprecationWarnings @ react-router-dom.js?v=6500782f:4399
(anônimo) @ react-router-dom.js?v=6500782f:5271
commitHookEffectListMount @ chunk-276SZO74.js?v=6500782f:16915
commitPassiveMountOnFiber @ chunk-276SZO74.js?v=6500782f:18156
commitPassiveMountEffects_complete @ chunk-276SZO74.js?v=6500782f:18129
commitPassiveMountEffects_begin @ chunk-276SZO74.js?v=6500782f:18119
commitPassiveMountEffects @ chunk-276SZO74.js?v=6500782f:18109
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=6500782f:19490
flushPassiveEffects @ chunk-276SZO74.js?v=6500782f:19447
(anônimo) @ chunk-276SZO74.js?v=6500782f:19328
workLoop @ chunk-276SZO74.js?v=6500782f:197
flushWork @ chunk-276SZO74.js?v=6500782f:176
performWorkUntilDeadline @ chunk-276SZO74.js?v=6500782f:384
hook.js:608 ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. Error Component Stack
    at BrowserRouter (react-router-dom.js?v=6500782f:5247:5)
    at AppContent (App.tsx:30:3)
    at QueryClientProvider (@tanstack_react-query.js?v=6500782f:2934:3)
    at App (<anonymous>)
overrideMethod @ hook.js:608
warnOnce @ react-router-dom.js?v=6500782f:4393
logDeprecation @ react-router-dom.js?v=6500782f:4396
logV6DeprecationWarnings @ react-router-dom.js?v=6500782f:4402
(anônimo) @ react-router-dom.js?v=6500782f:5271
commitHookEffectListMount @ chunk-276SZO74.js?v=6500782f:16915
commitPassiveMountOnFiber @ chunk-276SZO74.js?v=6500782f:18156
commitPassiveMountEffects_complete @ chunk-276SZO74.js?v=6500782f:18129
commitPassiveMountEffects_begin @ chunk-276SZO74.js?v=6500782f:18119
commitPassiveMountEffects @ chunk-276SZO74.js?v=6500782f:18109
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=6500782f:19490
flushPassiveEffects @ chunk-276SZO74.js?v=6500782f:19447
(anônimo) @ chunk-276SZO74.js?v=6500782f:19328
workLoop @ chunk-276SZO74.js?v=6500782f:197
flushWork @ chunk-276SZO74.js?v=6500782f:176
performWorkUntilDeadline @ chunk-276SZO74.js?v=6500782f:384
useSync.ts:54 useSync - Parando sincronização automática (usuário não autenticado)
useSync.ts:54 useSync - Parando sincronização automática (usuário não autenticado)
staticApi.ts:31 ✅ [STATIC API] Dados carregados: /animes/3601.json
staticApi.ts:31 ✅ [STATIC API] Dados carregados: /episodes/3601.json
staticApi.ts:31 ✅ [STATIC API] Dados carregados: /episodes/3601.json
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://animefire.plus/video/sousou-no-frieren-dublado/1
staticApi.ts:507 🔄 [PROXY] Convertendo URL do AnimeFire: https://animefire.plus/video/sousou-no-frieren-dublado/1 -> /api/animefire/video/sousou-no-frieren-dublado/1
staticApi.ts:562 🔄 [STATIC API] Usando proxy: /api/animefire/video/sousou-no-frieren-dublado/1 (original: https://animefire.plus/video/sousou-no-frieren-dublado/1)
staticApi.ts:429 🔄 [REQUEST] Tentativa 1/3 para: /api/animefire/video/sousou-no-frieren-dublado/1
staticApi.ts:438 ✅ [REQUEST] Sucesso na tentativa 1 para: /api/animefire/video/sousou-no-frieren-dublado/1
staticApi.ts:305 💾 [CACHE] Dados armazenados para: streaming:/api/animefire/video/sousou-no-frieren-dublado/1 (TTL: 30min)
staticApi.ts:572 📡 [STATIC API] Dados de streaming recebidos: {data: Array(3), metadata: {…}, response: {…}}
staticApi.ts:648 🔄 [STATIC API] Processando dados de streaming externos
staticApi.ts:704 📺 [STATIC API] Maior qualidade selecionada: 1080p URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:713 ✅ [STATIC API] Stream processado: 3 qualidades, URL principal definida
api.ts:397 🔧 [STATIC API] Processando dados de stream: {message: 'Stream do episódio 1 carregado', data: {…}}
staticApi.ts:648 🔄 [STATIC API] Processando dados de streaming externos
staticApi.ts:652 ✅ [STATIC API] Dados já processados, retornando como estão
api.ts:435 🎯 [STATIC API] Fonte principal selecionada: Melhor Qualidade URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
api.ts:397 🔧 [STATIC API] Processando dados de stream: {message: 'Stream do episódio 1 carregado', data: {…}}
staticApi.ts:648 🔄 [STATIC API] Processando dados de streaming externos
staticApi.ts:652 ✅ [STATIC API] Dados já processados, retornando como estão
api.ts:435 🎯 [STATIC API] Fonte principal selecionada: Melhor Qualidade URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
Player.tsx:36 🎬 Player Debug Info:
Player.tsx:37   - Video Sources: 1 [{…}]
Player.tsx:38   - Selected Source: null
Player.tsx:39   - Current Episode: 1
Player.tsx:40   - Anime ID: 3601
Player.tsx:51 🔍 [Player] Debug seleção de fonte:
Player.tsx:52   - Total de fontes: 1
Player.tsx:53   - Todas as fontes: [{…}]
Player.tsx:54   - Fontes não alternativas: [{…}]
Player.tsx:58 🎯 [Player] Selecionando fonte padrão: {label: 'Melhor Qualidade', src: 'https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4', isAlternative: false}
api.ts:397 🔧 [STATIC API] Processando dados de stream: {message: 'Stream do episódio 1 carregado', data: {…}}
staticApi.ts:648 🔄 [STATIC API] Processando dados de streaming externos
staticApi.ts:652 ✅ [STATIC API] Dados já processados, retornando como estão
api.ts:435 🎯 [STATIC API] Fonte principal selecionada: Melhor Qualidade URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
api.ts:397 🔧 [STATIC API] Processando dados de stream: {message: 'Stream do episódio 1 carregado', data: {…}}
staticApi.ts:648 🔄 [STATIC API] Processando dados de streaming externos
staticApi.ts:652 ✅ [STATIC API] Dados já processados, retornando como estão
api.ts:435 🎯 [STATIC API] Fonte principal selecionada: Melhor Qualidade URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
chunk-276SZO74.js?v=6500782f:1232 Allow attribute will take precedence over 'allowfullscreen'.
setValueForProperty @ chunk-276SZO74.js?v=6500782f:1232
setInitialDOMProperties @ chunk-276SZO74.js?v=6500782f:7462
setInitialProperties @ chunk-276SZO74.js?v=6500782f:7595
finalizeInitialChildren @ chunk-276SZO74.js?v=6500782f:8345
completeWork @ chunk-276SZO74.js?v=6500782f:16293
completeUnitOfWork @ chunk-276SZO74.js?v=6500782f:19224
performUnitOfWork @ chunk-276SZO74.js?v=6500782f:19206
workLoopSync @ chunk-276SZO74.js?v=6500782f:19137
renderRootSync @ chunk-276SZO74.js?v=6500782f:19116
performConcurrentWorkOnRoot @ chunk-276SZO74.js?v=6500782f:18678
workLoop @ chunk-276SZO74.js?v=6500782f:197
flushWork @ chunk-276SZO74.js?v=6500782f:176
performWorkUntilDeadline @ chunk-276SZO74.js?v=6500782f:384
VideoPlayer.tsx:99 VideoPlayer - Available sources received: [{…}]
VideoPlayer.tsx:100 VideoPlayer - Available sources length: 1
VideoPlayer.tsx:101 VideoPlayer - Current source: {label: 'Melhor Qualidade', src: 'https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4', isAlternative: false}
VideoPlayer.tsx:102 VideoPlayer - Primary source: {label: 'Melhor Qualidade', src: 'https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4', isAlternative: false}
VideoPlayer.tsx:103 VideoPlayer - Primary source URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
Player.tsx:36 🎬 Player Debug Info:
Player.tsx:37   - Video Sources: 1 [{…}]
Player.tsx:38   - Selected Source: {label: 'Melhor Qualidade', src: 'https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4', isAlternative: false}
Player.tsx:39   - Current Episode: 1
Player.tsx:40   - Anime ID: 3601
VideoPlayer.tsx:99 VideoPlayer - Available sources received: [{…}]
VideoPlayer.tsx:100 VideoPlayer - Available sources length: 1
VideoPlayer.tsx:101 VideoPlayer - Current source: {label: 'Melhor Qualidade', src: 'https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4', isAlternative: false}
VideoPlayer.tsx:102 VideoPlayer - Primary source: {label: 'Melhor Qualidade', src: 'https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4', isAlternative: false}
VideoPlayer.tsx:103 VideoPlayer - Primary source URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
useAuth.ts:44 👤 Nenhuma sessão ativa - modo visitante
api.ts:397 🔧 [STATIC API] Processando dados de stream: {message: 'Stream do episódio 1 carregado', data: {…}}
staticApi.ts:648 🔄 [STATIC API] Processando dados de streaming externos
staticApi.ts:652 ✅ [STATIC API] Dados já processados, retornando como estão
api.ts:435 🎯 [STATIC API] Fonte principal selecionada: Melhor Qualidade URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
api.ts:397 🔧 [STATIC API] Processando dados de stream: {message: 'Stream do episódio 1 carregado', data: {…}}
staticApi.ts:648 🔄 [STATIC API] Processando dados de streaming externos
staticApi.ts:652 ✅ [STATIC API] Dados já processados, retornando como estão
api.ts:435 🎯 [STATIC API] Fonte principal selecionada: Melhor Qualidade URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
VideoPlayer.tsx:99 VideoPlayer - Available sources received: [{…}]
VideoPlayer.tsx:100 VideoPlayer - Available sources length: 1
VideoPlayer.tsx:101 VideoPlayer - Current source: {label: 'Melhor Qualidade', src: 'https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4', isAlternative: false}
VideoPlayer.tsx:102 VideoPlayer - Primary source: {label: 'Melhor Qualidade', src: 'https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4', isAlternative: false}
VideoPlayer.tsx:103 VideoPlayer - Primary source URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
api.ts:397 🔧 [STATIC API] Processando dados de stream: {message: 'Stream do episódio 1 carregado', data: {…}}
staticApi.ts:648 🔄 [STATIC API] Processando dados de streaming externos
staticApi.ts:652 ✅ [STATIC API] Dados já processados, retornando como estão
api.ts:435 🎯 [STATIC API] Fonte principal selecionada: Melhor Qualidade URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
api.ts:397 🔧 [STATIC API] Processando dados de stream: {message: 'Stream do episódio 1 carregado', data: {…}}
staticApi.ts:648 🔄 [STATIC API] Processando dados de streaming externos
staticApi.ts:652 ✅ [STATIC API] Dados já processados, retornando como estão
api.ts:435 🎯 [STATIC API] Fonte principal selecionada: Melhor Qualidade URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
VideoPlayer.tsx:99 VideoPlayer - Available sources received: [{…}]
VideoPlayer.tsx:100 VideoPlayer - Available sources length: 1
VideoPlayer.tsx:101 VideoPlayer - Current source: {label: 'Melhor Qualidade', src: 'https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4', isAlternative: false}
VideoPlayer.tsx:102 VideoPlayer - Primary source: {label: 'Melhor Qualidade', src: 'https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4', isAlternative: false}
VideoPlayer.tsx:103 VideoPlayer - Primary source URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
useAuth.ts:44 👤 Nenhuma sessão ativa - modo visitante
api.ts:397 🔧 [STATIC API] Processando dados de stream: {message: 'Stream do episódio 1 carregado', data: {…}}
staticApi.ts:648 🔄 [STATIC API] Processando dados de streaming externos
staticApi.ts:652 ✅ [STATIC API] Dados já processados, retornando como estão
api.ts:435 🎯 [STATIC API] Fonte principal selecionada: Melhor Qualidade URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
api.ts:397 🔧 [STATIC API] Processando dados de stream: {message: 'Stream do episódio 1 carregado', data: {…}}
staticApi.ts:648 🔄 [STATIC API] Processando dados de streaming externos
staticApi.ts:652 ✅ [STATIC API] Dados já processados, retornando como estão
api.ts:435 🎯 [STATIC API] Fonte principal selecionada: Melhor Qualidade URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
VideoPlayer.tsx:99 VideoPlayer - Available sources received: [{…}]
VideoPlayer.tsx:100 VideoPlayer - Available sources length: 1
VideoPlayer.tsx:101 VideoPlayer - Current source: {label: 'Melhor Qualidade', src: 'https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4', isAlternative: false}
VideoPlayer.tsx:102 VideoPlayer - Primary source: {label: 'Melhor Qualidade', src: 'https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4', isAlternative: false}
VideoPlayer.tsx:103 VideoPlayer - Primary source URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
useAuth.ts:60 🔐 Auth state change: INITIAL_SESSION
useAuth.ts:44 👤 Nenhuma sessão ativa - modo visitante
api.ts:397 🔧 [STATIC API] Processando dados de stream: {message: 'Stream do episódio 1 carregado', data: {…}}
staticApi.ts:648 🔄 [STATIC API] Processando dados de streaming externos
staticApi.ts:652 ✅ [STATIC API] Dados já processados, retornando como estão
api.ts:435 🎯 [STATIC API] Fonte principal selecionada: Melhor Qualidade URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
api.ts:397 🔧 [STATIC API] Processando dados de stream: {message: 'Stream do episódio 1 carregado', data: {…}}
staticApi.ts:648 🔄 [STATIC API] Processando dados de streaming externos
staticApi.ts:652 ✅ [STATIC API] Dados já processados, retornando como estão
api.ts:435 🎯 [STATIC API] Fonte principal selecionada: Melhor Qualidade URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
VideoPlayer.tsx:99 VideoPlayer - Available sources received: [{…}]
VideoPlayer.tsx:100 VideoPlayer - Available sources length: 1
VideoPlayer.tsx:101 VideoPlayer - Current source: {label: 'Melhor Qualidade', src: 'https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4', isAlternative: false}
VideoPlayer.tsx:102 VideoPlayer - Primary source: {label: 'Melhor Qualidade', src: 'https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4', isAlternative: false}
VideoPlayer.tsx:103 VideoPlayer - Primary source URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
useAuth.ts:60 🔐 Auth state change: INITIAL_SESSION
useAuth.ts:44 👤 Nenhuma sessão ativa - modo visitante
api.ts:397 🔧 [STATIC API] Processando dados de stream: {message: 'Stream do episódio 1 carregado', data: {…}}
staticApi.ts:648 🔄 [STATIC API] Processando dados de streaming externos
staticApi.ts:652 ✅ [STATIC API] Dados já processados, retornando como estão
api.ts:435 🎯 [STATIC API] Fonte principal selecionada: Melhor Qualidade URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
api.ts:397 🔧 [STATIC API] Processando dados de stream: {message: 'Stream do episódio 1 carregado', data: {…}}
staticApi.ts:648 🔄 [STATIC API] Processando dados de streaming externos
staticApi.ts:652 ✅ [STATIC API] Dados já processados, retornando como estão
api.ts:435 🎯 [STATIC API] Fonte principal selecionada: Melhor Qualidade URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
VideoPlayer.tsx:99 VideoPlayer - Available sources received: [{…}]
VideoPlayer.tsx:100 VideoPlayer - Available sources length: 1
VideoPlayer.tsx:101 VideoPlayer - Current source: {label: 'Melhor Qualidade', src: 'https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4', isAlternative: false}
VideoPlayer.tsx:102 VideoPlayer - Primary source: {label: 'Melhor Qualidade', src: 'https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4', isAlternative: false}
VideoPlayer.tsx:103 VideoPlayer - Primary source URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
useAuth.ts:44 👤 Nenhuma sessão ativa - modo visitante
api.ts:397 🔧 [STATIC API] Processando dados de stream: {message: 'Stream do episódio 1 carregado', data: {…}}
staticApi.ts:648 🔄 [STATIC API] Processando dados de streaming externos
staticApi.ts:652 ✅ [STATIC API] Dados já processados, retornando como estão
api.ts:435 🎯 [STATIC API] Fonte principal selecionada: Melhor Qualidade URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
api.ts:397 🔧 [STATIC API] Processando dados de stream: {message: 'Stream do episódio 1 carregado', data: {…}}
staticApi.ts:648 🔄 [STATIC API] Processando dados de streaming externos
staticApi.ts:652 ✅ [STATIC API] Dados já processados, retornando como estão
api.ts:435 🎯 [STATIC API] Fonte principal selecionada: Melhor Qualidade URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
VideoPlayer.tsx:99 VideoPlayer - Available sources received: [{…}]
VideoPlayer.tsx:100 VideoPlayer - Available sources length: 1
VideoPlayer.tsx:101 VideoPlayer - Current source: {label: 'Melhor Qualidade', src: 'https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4', isAlternative: false}
VideoPlayer.tsx:102 VideoPlayer - Primary source: {label: 'Melhor Qualidade', src: 'https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4', isAlternative: false}
VideoPlayer.tsx:103 VideoPlayer - Primary source URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
useAuth.ts:60 🔐 Auth state change: INITIAL_SESSION
useAuth.ts:44 👤 Nenhuma sessão ativa - modo visitante
api.ts:397 🔧 [STATIC API] Processando dados de stream: {message: 'Stream do episódio 1 carregado', data: {…}}
staticApi.ts:648 🔄 [STATIC API] Processando dados de streaming externos
staticApi.ts:652 ✅ [STATIC API] Dados já processados, retornando como estão
api.ts:435 🎯 [STATIC API] Fonte principal selecionada: Melhor Qualidade URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
api.ts:397 🔧 [STATIC API] Processando dados de stream: {message: 'Stream do episódio 1 carregado', data: {…}}
staticApi.ts:648 🔄 [STATIC API] Processando dados de streaming externos
staticApi.ts:652 ✅ [STATIC API] Dados já processados, retornando como estão
api.ts:435 🎯 [STATIC API] Fonte principal selecionada: Melhor Qualidade URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
VideoPlayer.tsx:99 VideoPlayer - Available sources received: [{…}]
VideoPlayer.tsx:100 VideoPlayer - Available sources length: 1
VideoPlayer.tsx:101 VideoPlayer - Current source: {label: 'Melhor Qualidade', src: 'https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4', isAlternative: false}
VideoPlayer.tsx:102 VideoPlayer - Primary source: {label: 'Melhor Qualidade', src: 'https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4', isAlternative: false}
VideoPlayer.tsx:103 VideoPlayer - Primary source URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
chromewebdata/:1 Refused to display 'https://lightspeedst.net/' in a frame because it set 'X-Frame-Options' to 'deny'.
VideoPlayer.tsx:113 VideoPlayer - Iframe ready
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:512 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] Analisando URL: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
 🔄 [PROXY] URL não necessita proxy: https://lightspeedst.net/s6/mp4/sousou-no-frieren-dublado/fhd/1.mp4
