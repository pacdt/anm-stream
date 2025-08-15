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
useSync.ts:54 useSync - Parando sincronização automática (usuário não autenticado)
useSync.ts:54 useSync - Parando sincronização automática (usuário não autenticado)
staticApi.ts:31 ✅ [STATIC API] Dados carregados: /animes/3601.json
staticApi.ts:31 ✅ [STATIC API] Dados carregados: /episodes/3601.json
staticApi.ts:31 ✅ [STATIC API] Dados carregados: /episodes/3601.json
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://animefire.plus/video/sousou-no-frieren-dublado/1
staticApi.ts:506 ⚠️ [PROXY] URL do AnimeFire detectada, mas não será proxificada (retorna HTML): https://animefire.plus/video/sousou-no-frieren-dublado/1
staticApi.ts:562 🔄 [STATIC API] Usando proxy: https://animefire.plus/video/sousou-no-frieren-dublado/1 (original: https://animefire.plus/video/sousou-no-frieren-dublado/1)
staticApi.ts:429 🔄 [REQUEST] Tentativa 1/3 para: https://animefire.plus/video/sousou-no-frieren-dublado/1
useAuth.ts:44 👤 Nenhuma sessão ativa - modo visitante
useAuth.ts:44 👤 Nenhuma sessão ativa - modo visitante
useAuth.ts:60 🔐 Auth state change: INITIAL_SESSION
useAuth.ts:44 👤 Nenhuma sessão ativa - modo visitante
useAuth.ts:60 🔐 Auth state change: INITIAL_SESSION
useAuth.ts:44 👤 Nenhuma sessão ativa - modo visitante
1:1 Access to fetch at 'https://animefire.plus/video/sousou-no-frieren-dublado/1' from origin 'http://localhost:3001' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
staticApi.ts:384  GET https://animefire.plus/video/sousou-no-frieren-dublado/1 net::ERR_FAILED 200 (OK)
fetchWithTimeout @ staticApi.ts:384
fetchWithRetry @ staticApi.ts:431
getEpisodeStream @ staticApi.ts:565
await in getEpisodeStream
getEpisodeStream @ api.ts:380
queryFn @ useEpisodes.ts:19
fetchFn @ @tanstack_react-query.js?v=6500782f:881
run @ @tanstack_react-query.js?v=6500782f:513
start @ @tanstack_react-query.js?v=6500782f:555
fetch @ @tanstack_react-query.js?v=6500782f:969
executeFetch_fn @ @tanstack_react-query.js?v=6500782f:2280
onSubscribe @ @tanstack_react-query.js?v=6500782f:1983
subscribe @ @tanstack_react-query.js?v=6500782f:24
(anônimo) @ @tanstack_react-query.js?v=6500782f:3147
subscribeToStore @ chunk-276SZO74.js?v=6500782f:11984
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
staticApi.ts:449 ⚠️ [REQUEST] Tentativa 1 falhou: Failed to fetch
overrideMethod @ hook.js:608
fetchWithRetry @ staticApi.ts:449
await in fetchWithRetry
getEpisodeStream @ staticApi.ts:565
await in getEpisodeStream
getEpisodeStream @ api.ts:380
queryFn @ useEpisodes.ts:19
fetchFn @ @tanstack_react-query.js?v=6500782f:881
run @ @tanstack_react-query.js?v=6500782f:513
start @ @tanstack_react-query.js?v=6500782f:555
fetch @ @tanstack_react-query.js?v=6500782f:969
executeFetch_fn @ @tanstack_react-query.js?v=6500782f:2280
onSubscribe @ @tanstack_react-query.js?v=6500782f:1983
subscribe @ @tanstack_react-query.js?v=6500782f:24
(anônimo) @ @tanstack_react-query.js?v=6500782f:3147
subscribeToStore @ chunk-276SZO74.js?v=6500782f:11984
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
staticApi.ts:454 ⏳ [REQUEST] Aguardando 1500ms antes da próxima tentativa...
staticApi.ts:429 🔄 [REQUEST] Tentativa 2/3 para: https://animefire.plus/video/sousou-no-frieren-dublado/1
1:1 Access to fetch at 'https://animefire.plus/video/sousou-no-frieren-dublado/1' from origin 'http://localhost:3001' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
staticApi.ts:384  GET https://animefire.plus/video/sousou-no-frieren-dublado/1 net::ERR_FAILED 200 (OK)
fetchWithTimeout @ staticApi.ts:384
fetchWithRetry @ staticApi.ts:431
await in fetchWithRetry
getEpisodeStream @ staticApi.ts:565
await in getEpisodeStream
getEpisodeStream @ api.ts:380
queryFn @ useEpisodes.ts:19
fetchFn @ @tanstack_react-query.js?v=6500782f:881
run @ @tanstack_react-query.js?v=6500782f:513
start @ @tanstack_react-query.js?v=6500782f:555
fetch @ @tanstack_react-query.js?v=6500782f:969
executeFetch_fn @ @tanstack_react-query.js?v=6500782f:2280
onSubscribe @ @tanstack_react-query.js?v=6500782f:1983
subscribe @ @tanstack_react-query.js?v=6500782f:24
(anônimo) @ @tanstack_react-query.js?v=6500782f:3147
subscribeToStore @ chunk-276SZO74.js?v=6500782f:11984
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
staticApi.ts:449 ⚠️ [REQUEST] Tentativa 2 falhou: Failed to fetch
overrideMethod @ hook.js:608
fetchWithRetry @ staticApi.ts:449
await in fetchWithRetry
getEpisodeStream @ staticApi.ts:565
await in getEpisodeStream
getEpisodeStream @ api.ts:380
queryFn @ useEpisodes.ts:19
fetchFn @ @tanstack_react-query.js?v=6500782f:881
run @ @tanstack_react-query.js?v=6500782f:513
start @ @tanstack_react-query.js?v=6500782f:555
fetch @ @tanstack_react-query.js?v=6500782f:969
executeFetch_fn @ @tanstack_react-query.js?v=6500782f:2280
onSubscribe @ @tanstack_react-query.js?v=6500782f:1983
subscribe @ @tanstack_react-query.js?v=6500782f:24
(anônimo) @ @tanstack_react-query.js?v=6500782f:3147
subscribeToStore @ chunk-276SZO74.js?v=6500782f:11984
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
staticApi.ts:454 ⏳ [REQUEST] Aguardando 3000ms antes da próxima tentativa...
staticApi.ts:429 🔄 [REQUEST] Tentativa 3/3 para: https://animefire.plus/video/sousou-no-frieren-dublado/1
1:1 Access to fetch at 'https://animefire.plus/video/sousou-no-frieren-dublado/1' from origin 'http://localhost:3001' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
staticApi.ts:384  GET https://animefire.plus/video/sousou-no-frieren-dublado/1 net::ERR_FAILED 200 (OK)
fetchWithTimeout @ staticApi.ts:384
fetchWithRetry @ staticApi.ts:431
await in fetchWithRetry
getEpisodeStream @ staticApi.ts:565
await in getEpisodeStream
getEpisodeStream @ api.ts:380
queryFn @ useEpisodes.ts:19
fetchFn @ @tanstack_react-query.js?v=6500782f:881
run @ @tanstack_react-query.js?v=6500782f:513
start @ @tanstack_react-query.js?v=6500782f:555
fetch @ @tanstack_react-query.js?v=6500782f:969
executeFetch_fn @ @tanstack_react-query.js?v=6500782f:2280
onSubscribe @ @tanstack_react-query.js?v=6500782f:1983
subscribe @ @tanstack_react-query.js?v=6500782f:24
(anônimo) @ @tanstack_react-query.js?v=6500782f:3147
subscribeToStore @ chunk-276SZO74.js?v=6500782f:11984
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
staticApi.ts:449 ⚠️ [REQUEST] Tentativa 3 falhou: Failed to fetch
overrideMethod @ hook.js:608
fetchWithRetry @ staticApi.ts:449
await in fetchWithRetry
getEpisodeStream @ staticApi.ts:565
await in getEpisodeStream
getEpisodeStream @ api.ts:380
queryFn @ useEpisodes.ts:19
fetchFn @ @tanstack_react-query.js?v=6500782f:881
run @ @tanstack_react-query.js?v=6500782f:513
start @ @tanstack_react-query.js?v=6500782f:555
fetch @ @tanstack_react-query.js?v=6500782f:969
executeFetch_fn @ @tanstack_react-query.js?v=6500782f:2280
onSubscribe @ @tanstack_react-query.js?v=6500782f:1983
subscribe @ @tanstack_react-query.js?v=6500782f:24
(anônimo) @ @tanstack_react-query.js?v=6500782f:3147
subscribeToStore @ chunk-276SZO74.js?v=6500782f:11984
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
staticApi.ts:460 ❌ [REQUEST] Todas as 3 tentativas falharam para: https://animefire.plus/video/sousou-no-frieren-dublado/1
overrideMethod @ hook.js:608
fetchWithRetry @ staticApi.ts:460
await in fetchWithRetry
getEpisodeStream @ staticApi.ts:565
await in getEpisodeStream
getEpisodeStream @ api.ts:380
queryFn @ useEpisodes.ts:19
fetchFn @ @tanstack_react-query.js?v=6500782f:881
run @ @tanstack_react-query.js?v=6500782f:513
start @ @tanstack_react-query.js?v=6500782f:555
fetch @ @tanstack_react-query.js?v=6500782f:969
executeFetch_fn @ @tanstack_react-query.js?v=6500782f:2280
onSubscribe @ @tanstack_react-query.js?v=6500782f:1983
subscribe @ @tanstack_react-query.js?v=6500782f:24
(anônimo) @ @tanstack_react-query.js?v=6500782f:3147
subscribeToStore @ chunk-276SZO74.js?v=6500782f:11984
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
staticApi.ts:331 ❌ [CACHE] URL marcada como falhada: streaming:https://animefire.plus/video/sousou-no-frieren-dublado/1 (TTL: 5min)
staticApi.ts:587 ❌ [STATIC API] API externa falhou após tentativas: Failed to fetch
overrideMethod @ hook.js:608
getEpisodeStream @ staticApi.ts:587
await in getEpisodeStream
getEpisodeStream @ api.ts:380
queryFn @ useEpisodes.ts:19
fetchFn @ @tanstack_react-query.js?v=6500782f:881
run @ @tanstack_react-query.js?v=6500782f:513
start @ @tanstack_react-query.js?v=6500782f:555
fetch @ @tanstack_react-query.js?v=6500782f:969
executeFetch_fn @ @tanstack_react-query.js?v=6500782f:2280
onSubscribe @ @tanstack_react-query.js?v=6500782f:1983
subscribe @ @tanstack_react-query.js?v=6500782f:24
(anônimo) @ @tanstack_react-query.js?v=6500782f:3147
subscribeToStore @ chunk-276SZO74.js?v=6500782f:11984
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
staticApi.ts:591 ❌ [STATIC API] Erro ao buscar stream para anime 3601, episódio 1: Error: Episódio 1 não disponível: Failed to fetch
    at StaticEpisodeService.getEpisodeStream (staticApi.ts:588:15)
    at async EpisodeService.getEpisodeStream (api.ts:380:14)
overrideMethod @ hook.js:608
getEpisodeStream @ staticApi.ts:591
await in getEpisodeStream
getEpisodeStream @ api.ts:380
queryFn @ useEpisodes.ts:19
fetchFn @ @tanstack_react-query.js?v=6500782f:881
run @ @tanstack_react-query.js?v=6500782f:513
start @ @tanstack_react-query.js?v=6500782f:555
fetch @ @tanstack_react-query.js?v=6500782f:969
executeFetch_fn @ @tanstack_react-query.js?v=6500782f:2280
onSubscribe @ @tanstack_react-query.js?v=6500782f:1983
subscribe @ @tanstack_react-query.js?v=6500782f:24
(anônimo) @ @tanstack_react-query.js?v=6500782f:3147
subscribeToStore @ chunk-276SZO74.js?v=6500782f:11984
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
api.ts:382 ❌ [STATIC API] Erro ao buscar stream para anime 3601, episódio 1: Episódio 1 não disponível: Failed to fetch
overrideMethod @ hook.js:608
getEpisodeStream @ api.ts:382
await in getEpisodeStream
queryFn @ useEpisodes.ts:19
fetchFn @ @tanstack_react-query.js?v=6500782f:881
run @ @tanstack_react-query.js?v=6500782f:513
start @ @tanstack_react-query.js?v=6500782f:555
fetch @ @tanstack_react-query.js?v=6500782f:969
executeFetch_fn @ @tanstack_react-query.js?v=6500782f:2280
onSubscribe @ @tanstack_react-query.js?v=6500782f:1983
subscribe @ @tanstack_react-query.js?v=6500782f:24
(anônimo) @ @tanstack_react-query.js?v=6500782f:3147
subscribeToStore @ chunk-276SZO74.js?v=6500782f:11984
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
api.ts:379 🌐 [STATIC API] Buscando stream para anime 3601, episódio 1
staticApi.ts:542 🎬 [STATIC API] Buscando stream para anime 3601, episódio 1
staticApi.ts:14 📦 [STATIC API] Usando cache para: /episodes/3601.json
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://animefire.plus/video/sousou-no-frieren-dublado/1
staticApi.ts:506 ⚠️ [PROXY] URL do AnimeFire detectada, mas não será proxificada (retorna HTML): https://animefire.plus/video/sousou-no-frieren-dublado/1
staticApi.ts:562 🔄 [STATIC API] Usando proxy: https://animefire.plus/video/sousou-no-frieren-dublado/1 (original: https://animefire.plus/video/sousou-no-frieren-dublado/1)
staticApi.ts:346 🚫 [CACHE] URL ainda marcada como falhada: streaming:https://animefire.plus/video/sousou-no-frieren-dublado/1
staticApi.ts:587 ❌ [STATIC API] API externa falhou após tentativas: URL marcada como falhada no cache
overrideMethod @ hook.js:608
getEpisodeStream @ staticApi.ts:587
await in getEpisodeStream
getEpisodeStream @ api.ts:380
queryFn @ useEpisodes.ts:19
fetchFn @ @tanstack_react-query.js?v=6500782f:881
run @ @tanstack_react-query.js?v=6500782f:513
(anônimo) @ @tanstack_react-query.js?v=6500782f:538
Promise.then
(anônimo) @ @tanstack_react-query.js?v=6500782f:534
Promise.catch
run @ @tanstack_react-query.js?v=6500782f:517
start @ @tanstack_react-query.js?v=6500782f:555
fetch @ @tanstack_react-query.js?v=6500782f:969
executeFetch_fn @ @tanstack_react-query.js?v=6500782f:2280
onSubscribe @ @tanstack_react-query.js?v=6500782f:1983
subscribe @ @tanstack_react-query.js?v=6500782f:24
(anônimo) @ @tanstack_react-query.js?v=6500782f:3147
subscribeToStore @ chunk-276SZO74.js?v=6500782f:11984
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
staticApi.ts:591 ❌ [STATIC API] Erro ao buscar stream para anime 3601, episódio 1: Error: Episódio 1 não disponível: URL marcada como falhada no cache
    at StaticEpisodeService.getEpisodeStream (staticApi.ts:588:15)
    at async EpisodeService.getEpisodeStream (api.ts:380:14)
overrideMethod @ hook.js:608
getEpisodeStream @ staticApi.ts:591
await in getEpisodeStream
getEpisodeStream @ api.ts:380
queryFn @ useEpisodes.ts:19
fetchFn @ @tanstack_react-query.js?v=6500782f:881
run @ @tanstack_react-query.js?v=6500782f:513
(anônimo) @ @tanstack_react-query.js?v=6500782f:538
Promise.then
(anônimo) @ @tanstack_react-query.js?v=6500782f:534
Promise.catch
run @ @tanstack_react-query.js?v=6500782f:517
start @ @tanstack_react-query.js?v=6500782f:555
fetch @ @tanstack_react-query.js?v=6500782f:969
executeFetch_fn @ @tanstack_react-query.js?v=6500782f:2280
onSubscribe @ @tanstack_react-query.js?v=6500782f:1983
subscribe @ @tanstack_react-query.js?v=6500782f:24
(anônimo) @ @tanstack_react-query.js?v=6500782f:3147
subscribeToStore @ chunk-276SZO74.js?v=6500782f:11984
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
api.ts:382 ❌ [STATIC API] Erro ao buscar stream para anime 3601, episódio 1: Episódio 1 não disponível: URL marcada como falhada no cache
overrideMethod @ hook.js:608
getEpisodeStream @ api.ts:382
await in getEpisodeStream
queryFn @ useEpisodes.ts:19
fetchFn @ @tanstack_react-query.js?v=6500782f:881
run @ @tanstack_react-query.js?v=6500782f:513
(anônimo) @ @tanstack_react-query.js?v=6500782f:538
Promise.then
(anônimo) @ @tanstack_react-query.js?v=6500782f:534
Promise.catch
run @ @tanstack_react-query.js?v=6500782f:517
start @ @tanstack_react-query.js?v=6500782f:555
fetch @ @tanstack_react-query.js?v=6500782f:969
executeFetch_fn @ @tanstack_react-query.js?v=6500782f:2280
onSubscribe @ @tanstack_react-query.js?v=6500782f:1983
subscribe @ @tanstack_react-query.js?v=6500782f:24
(anônimo) @ @tanstack_react-query.js?v=6500782f:3147
subscribeToStore @ chunk-276SZO74.js?v=6500782f:11984
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
api.ts:379 🌐 [STATIC API] Buscando stream para anime 3601, episódio 1
staticApi.ts:542 🎬 [STATIC API] Buscando stream para anime 3601, episódio 1
staticApi.ts:14 📦 [STATIC API] Usando cache para: /episodes/3601.json
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://animefire.plus/video/sousou-no-frieren-dublado/1
staticApi.ts:506 ⚠️ [PROXY] URL do AnimeFire detectada, mas não será proxificada (retorna HTML): https://animefire.plus/video/sousou-no-frieren-dublado/1
staticApi.ts:562 🔄 [STATIC API] Usando proxy: https://animefire.plus/video/sousou-no-frieren-dublado/1 (original: https://animefire.plus/video/sousou-no-frieren-dublado/1)
staticApi.ts:346 🚫 [CACHE] URL ainda marcada como falhada: streaming:https://animefire.plus/video/sousou-no-frieren-dublado/1
staticApi.ts:587 ❌ [STATIC API] API externa falhou após tentativas: URL marcada como falhada no cache
overrideMethod @ hook.js:608
getEpisodeStream @ staticApi.ts:587
await in getEpisodeStream
getEpisodeStream @ api.ts:380
queryFn @ useEpisodes.ts:19
fetchFn @ @tanstack_react-query.js?v=6500782f:881
run @ @tanstack_react-query.js?v=6500782f:513
(anônimo) @ @tanstack_react-query.js?v=6500782f:538
Promise.then
(anônimo) @ @tanstack_react-query.js?v=6500782f:534
Promise.catch
run @ @tanstack_react-query.js?v=6500782f:517
(anônimo) @ @tanstack_react-query.js?v=6500782f:538
Promise.then
(anônimo) @ @tanstack_react-query.js?v=6500782f:534
Promise.catch
run @ @tanstack_react-query.js?v=6500782f:517
start @ @tanstack_react-query.js?v=6500782f:555
fetch @ @tanstack_react-query.js?v=6500782f:969
executeFetch_fn @ @tanstack_react-query.js?v=6500782f:2280
onSubscribe @ @tanstack_react-query.js?v=6500782f:1983
subscribe @ @tanstack_react-query.js?v=6500782f:24
(anônimo) @ @tanstack_react-query.js?v=6500782f:3147
subscribeToStore @ chunk-276SZO74.js?v=6500782f:11984
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
staticApi.ts:591 ❌ [STATIC API] Erro ao buscar stream para anime 3601, episódio 1: Error: Episódio 1 não disponível: URL marcada como falhada no cache
    at StaticEpisodeService.getEpisodeStream (staticApi.ts:588:15)
    at async EpisodeService.getEpisodeStream (api.ts:380:14)
overrideMethod @ hook.js:608
getEpisodeStream @ staticApi.ts:591
await in getEpisodeStream
getEpisodeStream @ api.ts:380
queryFn @ useEpisodes.ts:19
fetchFn @ @tanstack_react-query.js?v=6500782f:881
run @ @tanstack_react-query.js?v=6500782f:513
(anônimo) @ @tanstack_react-query.js?v=6500782f:538
Promise.then
(anônimo) @ @tanstack_react-query.js?v=6500782f:534
Promise.catch
run @ @tanstack_react-query.js?v=6500782f:517
(anônimo) @ @tanstack_react-query.js?v=6500782f:538
Promise.then
(anônimo) @ @tanstack_react-query.js?v=6500782f:534
Promise.catch
run @ @tanstack_react-query.js?v=6500782f:517
start @ @tanstack_react-query.js?v=6500782f:555
fetch @ @tanstack_react-query.js?v=6500782f:969
executeFetch_fn @ @tanstack_react-query.js?v=6500782f:2280
onSubscribe @ @tanstack_react-query.js?v=6500782f:1983
subscribe @ @tanstack_react-query.js?v=6500782f:24
(anônimo) @ @tanstack_react-query.js?v=6500782f:3147
subscribeToStore @ chunk-276SZO74.js?v=6500782f:11984
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
api.ts:382 ❌ [STATIC API] Erro ao buscar stream para anime 3601, episódio 1: Episódio 1 não disponível: URL marcada como falhada no cache
overrideMethod @ hook.js:608
getEpisodeStream @ api.ts:382
await in getEpisodeStream
queryFn @ useEpisodes.ts:19
fetchFn @ @tanstack_react-query.js?v=6500782f:881
run @ @tanstack_react-query.js?v=6500782f:513
(anônimo) @ @tanstack_react-query.js?v=6500782f:538
Promise.then
(anônimo) @ @tanstack_react-query.js?v=6500782f:534
Promise.catch
run @ @tanstack_react-query.js?v=6500782f:517
(anônimo) @ @tanstack_react-query.js?v=6500782f:538
Promise.then
(anônimo) @ @tanstack_react-query.js?v=6500782f:534
Promise.catch
run @ @tanstack_react-query.js?v=6500782f:517
start @ @tanstack_react-query.js?v=6500782f:555
fetch @ @tanstack_react-query.js?v=6500782f:969
executeFetch_fn @ @tanstack_react-query.js?v=6500782f:2280
onSubscribe @ @tanstack_react-query.js?v=6500782f:1983
subscribe @ @tanstack_react-query.js?v=6500782f:24
(anônimo) @ @tanstack_react-query.js?v=6500782f:3147
subscribeToStore @ chunk-276SZO74.js?v=6500782f:11984
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
api.ts:379 🌐 [STATIC API] Buscando stream para anime 3601, episódio 1
staticApi.ts:542 🎬 [STATIC API] Buscando stream para anime 3601, episódio 1
staticApi.ts:14 📦 [STATIC API] Usando cache para: /episodes/3601.json
staticApi.ts:478 🔄 [PROXY] Analisando URL: https://animefire.plus/video/sousou-no-frieren-dublado/1
staticApi.ts:506 ⚠️ [PROXY] URL do AnimeFire detectada, mas não será proxificada (retorna HTML): https://animefire.plus/video/sousou-no-frieren-dublado/1
staticApi.ts:562 🔄 [STATIC API] Usando proxy: https://animefire.plus/video/sousou-no-frieren-dublado/1 (original: https://animefire.plus/video/sousou-no-frieren-dublado/1)
staticApi.ts:346 🚫 [CACHE] URL ainda marcada como falhada: streaming:https://animefire.plus/video/sousou-no-frieren-dublado/1
staticApi.ts:587 ❌ [STATIC API] API externa falhou após tentativas: URL marcada como falhada no cache
overrideMethod @ hook.js:608
getEpisodeStream @ staticApi.ts:587
await in getEpisodeStream
getEpisodeStream @ api.ts:380
queryFn @ useEpisodes.ts:19
fetchFn @ @tanstack_react-query.js?v=6500782f:881
run @ @tanstack_react-query.js?v=6500782f:513
(anônimo) @ @tanstack_react-query.js?v=6500782f:538
Promise.then
(anônimo) @ @tanstack_react-query.js?v=6500782f:534
Promise.catch
run @ @tanstack_react-query.js?v=6500782f:517
(anônimo) @ @tanstack_react-query.js?v=6500782f:538
Promise.then
(anônimo) @ @tanstack_react-query.js?v=6500782f:534
Promise.catch
run @ @tanstack_react-query.js?v=6500782f:517
(anônimo) @ @tanstack_react-query.js?v=6500782f:538
Promise.then
(anônimo) @ @tanstack_react-query.js?v=6500782f:534
Promise.catch
run @ @tanstack_react-query.js?v=6500782f:517
start @ @tanstack_react-query.js?v=6500782f:555
fetch @ @tanstack_react-query.js?v=6500782f:969
executeFetch_fn @ @tanstack_react-query.js?v=6500782f:2280
onSubscribe @ @tanstack_react-query.js?v=6500782f:1983
subscribe @ @tanstack_react-query.js?v=6500782f:24
(anônimo) @ @tanstack_react-query.js?v=6500782f:3147
subscribeToStore @ chunk-276SZO74.js?v=6500782f:11984
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
staticApi.ts:591 ❌ [STATIC API] Erro ao buscar stream para anime 3601, episódio 1: Error: Episódio 1 não disponível: URL marcada como falhada no cache
    at StaticEpisodeService.getEpisodeStream (staticApi.ts:588:15)
    at async EpisodeService.getEpisodeStream (api.ts:380:14)
overrideMethod @ hook.js:608
getEpisodeStream @ staticApi.ts:591
await in getEpisodeStream
getEpisodeStream @ api.ts:380
queryFn @ useEpisodes.ts:19
fetchFn @ @tanstack_react-query.js?v=6500782f:881
run @ @tanstack_react-query.js?v=6500782f:513
(anônimo) @ @tanstack_react-query.js?v=6500782f:538
Promise.then
(anônimo) @ @tanstack_react-query.js?v=6500782f:534
Promise.catch
run @ @tanstack_react-query.js?v=6500782f:517
(anônimo) @ @tanstack_react-query.js?v=6500782f:538
Promise.then
(anônimo) @ @tanstack_react-query.js?v=6500782f:534
Promise.catch
run @ @tanstack_react-query.js?v=6500782f:517
(anônimo) @ @tanstack_react-query.js?v=6500782f:538
Promise.then
(anônimo) @ @tanstack_react-query.js?v=6500782f:534
Promise.catch
run @ @tanstack_react-query.js?v=6500782f:517
start @ @tanstack_react-query.js?v=6500782f:555
fetch @ @tanstack_react-query.js?v=6500782f:969
executeFetch_fn @ @tanstack_react-query.js?v=6500782f:2280
onSubscribe @ @tanstack_react-query.js?v=6500782f:1983
subscribe @ @tanstack_react-query.js?v=6500782f:24
(anônimo) @ @tanstack_react-query.js?v=6500782f:3147
subscribeToStore @ chunk-276SZO74.js?v=6500782f:11984
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
api.ts:382 ❌ [STATIC API] Erro ao buscar stream para anime 3601, episódio 1: Episódio 1 não disponível: URL marcada como falhada no cache
overrideMethod @ hook.js:608
getEpisodeStream @ api.ts:382
await in getEpisodeStream
queryFn @ useEpisodes.ts:19
fetchFn @ @tanstack_react-query.js?v=6500782f:881
run @ @tanstack_react-query.js?v=6500782f:513
(anônimo) @ @tanstack_react-query.js?v=6500782f:538
Promise.then
(anônimo) @ @tanstack_react-query.js?v=6500782f:534
Promise.catch
run @ @tanstack_react-query.js?v=6500782f:517
(anônimo) @ @tanstack_react-query.js?v=6500782f:538
Promise.then
(anônimo) @ @tanstack_react-query.js?v=6500782f:534
Promise.catch
run @ @tanstack_react-query.js?v=6500782f:517
(anônimo) @ @tanstack_react-query.js?v=6500782f:538
Promise.then
(anônimo) @ @tanstack_react-query.js?v=6500782f:534
Promise.catch
run @ @tanstack_react-query.js?v=6500782f:517
start @ @tanstack_react-query.js?v=6500782f:555
fetch @ @tanstack_react-query.js?v=6500782f:969
executeFetch_fn @ @tanstack_react-query.js?v=6500782f:2280
onSubscribe @ @tanstack_react-query.js?v=6500782f:1983
subscribe @ @tanstack_react-query.js?v=6500782f:24
(anônimo) @ @tanstack_react-query.js?v=6500782f:3147
subscribeToStore @ chunk-276SZO74.js?v=6500782f:11984
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
