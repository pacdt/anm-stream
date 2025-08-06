[DEBUG] Buscando seção: latest, página: 1, limite: 20
useAnimes.ts:65 📂 [DEBUG] Usando endpoint /section/latest para seção
api.ts:59 🌐 [API] Chamando /animes/section/lancamentos (original: latest)
api.ts:60 🔧 [API] Mapeamento de seções: {latest: 'lancamentos', popular: 'home', dublados: 'dublados', legendados: 'legendados'}
useAnimes.ts:56 🔍 [DEBUG] Buscando seção: popular, página: 1, limite: 20
useAnimes.ts:65 📂 [DEBUG] Usando endpoint /section/popular para seção
api.ts:59 🌐 [API] Chamando /animes/section/home (original: popular)
api.ts:60 🔧 [API] Mapeamento de seções: {latest: 'lancamentos', popular: 'home', dublados: 'dublados', legendados: 'legendados'}
useAnimes.ts:56 🔍 [DEBUG] Buscando seção: top-rated, página: 1, limite: 20
useAnimes.ts:62 🎯 [DEBUG] Usando endpoint /top/20 para top-rated
api.ts:74 🏆 [API] Chamando /animes/top/20
useAnimes.ts:56 🔍 [DEBUG] Buscando seção: dublados, página: 1, limite: 20
useAnimes.ts:65 📂 [DEBUG] Usando endpoint /section/dublados para seção
api.ts:59 🌐 [API] Chamando /animes/section/dublados (original: dublados)
api.ts:60 🔧 [API] Mapeamento de seções: {latest: 'lancamentos', popular: 'home', dublados: 'dublados', legendados: 'legendados'}
useAnimes.ts:56 🔍 [DEBUG] Buscando seção: legendados, página: 1, limite: 20
useAnimes.ts:65 📂 [DEBUG] Usando endpoint /section/legendados para seção
api.ts:59 🌐 [API] Chamando /animes/section/legendados (original: legendados)
api.ts:60 🔧 [API] Mapeamento de seções: {latest: 'lancamentos', popular: 'home', dublados: 'dublados', legendados: 'legendados'}
hook.js:608 ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. Error Component Stack
    at BrowserRouter (react-router-dom.js?v=9ed70bbf:5247:5)
    at QueryClientProvider (@tanstack_react-query.js?v=9ed70bbf:2934:3)
    at App (<anonymous>)
overrideMethod @ hook.js:608
warnOnce @ react-router-dom.js?v=9ed70bbf:4393
logDeprecation @ react-router-dom.js?v=9ed70bbf:4396
logV6DeprecationWarnings @ react-router-dom.js?v=9ed70bbf:4399
(anônimo) @ react-router-dom.js?v=9ed70bbf:5271
commitHookEffectListMount @ chunk-276SZO74.js?v=9ed70bbf:16915
commitPassiveMountOnFiber @ chunk-276SZO74.js?v=9ed70bbf:18156
commitPassiveMountEffects_complete @ chunk-276SZO74.js?v=9ed70bbf:18129
commitPassiveMountEffects_begin @ chunk-276SZO74.js?v=9ed70bbf:18119
commitPassiveMountEffects @ chunk-276SZO74.js?v=9ed70bbf:18109
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=9ed70bbf:19490
flushPassiveEffects @ chunk-276SZO74.js?v=9ed70bbf:19447
(anônimo) @ chunk-276SZO74.js?v=9ed70bbf:19328
workLoop @ chunk-276SZO74.js?v=9ed70bbf:197
flushWork @ chunk-276SZO74.js?v=9ed70bbf:176
performWorkUntilDeadline @ chunk-276SZO74.js?v=9ed70bbf:384Entenda o aviso
hook.js:608 ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. Error Component Stack
    at BrowserRouter (react-router-dom.js?v=9ed70bbf:5247:5)
    at QueryClientProvider (@tanstack_react-query.js?v=9ed70bbf:2934:3)
    at App (<anonymous>)
overrideMethod @ hook.js:608
warnOnce @ react-router-dom.js?v=9ed70bbf:4393
logDeprecation @ react-router-dom.js?v=9ed70bbf:4396
logV6DeprecationWarnings @ react-router-dom.js?v=9ed70bbf:4402
(anônimo) @ react-router-dom.js?v=9ed70bbf:5271
commitHookEffectListMount @ chunk-276SZO74.js?v=9ed70bbf:16915
commitPassiveMountOnFiber @ chunk-276SZO74.js?v=9ed70bbf:18156
commitPassiveMountEffects_complete @ chunk-276SZO74.js?v=9ed70bbf:18129
commitPassiveMountEffects_begin @ chunk-276SZO74.js?v=9ed70bbf:18119
commitPassiveMountEffects @ chunk-276SZO74.js?v=9ed70bbf:18109
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=9ed70bbf:19490
flushPassiveEffects @ chunk-276SZO74.js?v=9ed70bbf:19447
(anônimo) @ chunk-276SZO74.js?v=9ed70bbf:19328
workLoop @ chunk-276SZO74.js?v=9ed70bbf:197
flushWork @ chunk-276SZO74.js?v=9ed70bbf:176
performWorkUntilDeadline @ chunk-276SZO74.js?v=9ed70bbf:384Entenda o aviso
api.ts:209 API Request: GET /animes/section/lancamentos
api.ts:209 API Request: GET /animes/section/home
api.ts:209 API Request: GET /animes/top/20
api.ts:209 API Request: GET /animes/section/dublados
api.ts:209 API Request: GET /animes/section/legendados
2useAuth.ts:64 Erro ao verificar usuário: AuthSessionMissingError: Auth session missing!
    at @supabase_supabase-js.js?v=9ed70bbf:6076:49
    at SupabaseAuthClient._useSession (@supabase_supabase-js.js?v=9ed70bbf:5977:20)
    at async SupabaseAuthClient._getUser (@supabase_supabase-js.js?v=9ed70bbf:6069:14)
    at async @supabase_supabase-js.js?v=9ed70bbf:6056:14
overrideMethod @ hook.js:608
checkUser @ useAuth.ts:64
await in checkUser
(anônimo) @ useAuth.ts:71
commitHookEffectListMount @ chunk-276SZO74.js?v=9ed70bbf:16915
commitPassiveMountOnFiber @ chunk-276SZO74.js?v=9ed70bbf:18156
commitPassiveMountEffects_complete @ chunk-276SZO74.js?v=9ed70bbf:18129
commitPassiveMountEffects_begin @ chunk-276SZO74.js?v=9ed70bbf:18119
commitPassiveMountEffects @ chunk-276SZO74.js?v=9ed70bbf:18109
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=9ed70bbf:19490
flushPassiveEffects @ chunk-276SZO74.js?v=9ed70bbf:19447
(anônimo) @ chunk-276SZO74.js?v=9ed70bbf:19328
workLoop @ chunk-276SZO74.js?v=9ed70bbf:197
flushWork @ chunk-276SZO74.js?v=9ed70bbf:176
performWorkUntilDeadline @ chunk-276SZO74.js?v=9ed70bbf:384Entenda o erro
2useAuth.ts:64 Erro ao verificar usuário: AuthSessionMissingError: Auth session missing!
    at @supabase_supabase-js.js?v=9ed70bbf:6076:49
    at SupabaseAuthClient._useSession (@supabase_supabase-js.js?v=9ed70bbf:5977:20)
    at async SupabaseAuthClient._getUser (@supabase_supabase-js.js?v=9ed70bbf:6069:14)
    at async @supabase_supabase-js.js?v=9ed70bbf:6056:14
overrideMethod @ hook.js:608
checkUser @ useAuth.ts:64
await in checkUser
(anônimo) @ useAuth.ts:71
commitHookEffectListMount @ chunk-276SZO74.js?v=9ed70bbf:16915
invokePassiveEffectMountInDEV @ chunk-276SZO74.js?v=9ed70bbf:18324
invokeEffectsInDev @ chunk-276SZO74.js?v=9ed70bbf:19701
commitDoubleInvokeEffectsInDEV @ chunk-276SZO74.js?v=9ed70bbf:19686
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=9ed70bbf:19503
flushPassiveEffects @ chunk-276SZO74.js?v=9ed70bbf:19447
(anônimo) @ chunk-276SZO74.js?v=9ed70bbf:19328
workLoop @ chunk-276SZO74.js?v=9ed70bbf:197
flushWork @ chunk-276SZO74.js?v=9ed70bbf:176
performWorkUntilDeadline @ chunk-276SZO74.js?v=9ed70bbf:384Entenda o erro
api.ts:66 📡 [API] Resposta HTTP status: 200
api.ts:67 📦 [API] Dados recebidos: {message: 'Animes da seção: lancamentos', section: 'lancamentos', data: Array(20), pagination: {…}}
useAnimes.ts:69 ✅ [DEBUG] Resposta da API para seção latest: {message: 'Animes da seção: lancamentos', section: 'lancamentos', data: Array(20), pagination: {…}}
useAnimes.ts:70 📊 [DEBUG] Dados encontrados: 20 animes
api.ts:66 📡 [API] Resposta HTTP status: 200
api.ts:67 📦 [API] Dados recebidos: {message: 'Animes da seção: home', section: 'home', data: Array(0), pagination: {…}}
useAnimes.ts:69 ✅ [DEBUG] Resposta da API para seção popular: {message: 'Animes da seção: home', section: 'home', data: Array(0), pagination: {…}}
useAnimes.ts:70 📊 [DEBUG] Dados encontrados: 0 animes
api.ts:66 📡 [API] Resposta HTTP status: 200
api.ts:67 📦 [API] Dados recebidos: {message: 'Animes da seção: dublados', section: 'dublados', data: Array(20), pagination: {…}}
useAnimes.ts:69 ✅ [DEBUG] Resposta da API para seção dublados: {message: 'Animes da seção: dublados', section: 'dublados', data: Array(20), pagination: {…}}
useAnimes.ts:70 📊 [DEBUG] Dados encontrados: 20 animes
api.ts:78 📡 [API] Resposta HTTP status: 200
api.ts:79 📦 [API] Top animes recebidos: {message: 'Top 20 animes por rating', data: Array(20), total: 20}
useAnimes.ts:69 ✅ [DEBUG] Resposta da API para seção top-rated: {message: 'Top 20 animes por rating', data: Array(20), total: 20}
useAnimes.ts:70 📊 [DEBUG] Dados encontrados: 20 animes
api.ts:66 📡 [API] Resposta HTTP status: 200
api.ts:67 📦 [API] Dados recebidos: {message: 'Animes da seção: legendados', section: 'legendados', data: Array(20), pagination: {…}}
useAnimes.ts:69 ✅ [DEBUG] Resposta da API para seção legendados: {message: 'Animes da seção: legendados', section: 'legendados', data: Array(20), pagination: {…}}
useAnimes.ts:70 📊 [DEBUG] Dados encontrados: 20 animes
20useAuth.ts:64 Erro ao verificar usuário: AuthSessionMissingError: Auth session missing!
    at @supabase_supabase-js.js?v=9ed70bbf:6076:49
    at SupabaseAuthClient._useSession (@supabase_supabase-js.js?v=9ed70bbf:5977:20)
    at async SupabaseAuthClient._getUser (@supabase_supabase-js.js?v=9ed70bbf:6069:14)
    at async @supabase_supabase-js.js?v=9ed70bbf:6056:14
overrideMethod @ hook.js:608
checkUser @ useAuth.ts:64
await in checkUser
(anônimo) @ useAuth.ts:71
commitHookEffectListMount @ chunk-276SZO74.js?v=9ed70bbf:16915
commitPassiveMountOnFiber @ chunk-276SZO74.js?v=9ed70bbf:18156
commitPassiveMountEffects_complete @ chunk-276SZO74.js?v=9ed70bbf:18129
commitPassiveMountEffects_begin @ chunk-276SZO74.js?v=9ed70bbf:18119
commitPassiveMountEffects @ chunk-276SZO74.js?v=9ed70bbf:18109
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=9ed70bbf:19490
flushPassiveEffects @ chunk-276SZO74.js?v=9ed70bbf:19447
commitRootImpl @ chunk-276SZO74.js?v=9ed70bbf:19416
commitRoot @ chunk-276SZO74.js?v=9ed70bbf:19277
performSyncWorkOnRoot @ chunk-276SZO74.js?v=9ed70bbf:18895
flushSyncCallbacks @ chunk-276SZO74.js?v=9ed70bbf:9119
(anônimo) @ chunk-276SZO74.js?v=9ed70bbf:18627
setTimeout
defaultScheduler @ @tanstack_react-query.js?v=9ed70bbf:565
flush @ @tanstack_react-query.js?v=9ed70bbf:589
batch @ @tanstack_react-query.js?v=9ed70bbf:607
dispatch_fn @ @tanstack_react-query.js?v=9ed70bbf:1040
setData @ @tanstack_react-query.js?v=9ed70bbf:718
onSuccess @ @tanstack_react-query.js?v=9ed70bbf:940
resolve @ @tanstack_react-query.js?v=9ed70bbf:475
Promise.then
run @ @tanstack_react-query.js?v=9ed70bbf:517
start @ @tanstack_react-query.js?v=9ed70bbf:555
fetch @ @tanstack_react-query.js?v=9ed70bbf:969
executeFetch_fn @ @tanstack_react-query.js?v=9ed70bbf:2280
onSubscribe @ @tanstack_react-query.js?v=9ed70bbf:1983
subscribe @ @tanstack_react-query.js?v=9ed70bbf:24
(anônimo) @ @tanstack_react-query.js?v=9ed70bbf:3147
subscribeToStore @ chunk-276SZO74.js?v=9ed70bbf:11984
commitHookEffectListMount @ chunk-276SZO74.js?v=9ed70bbf:16915
commitPassiveMountOnFiber @ chunk-276SZO74.js?v=9ed70bbf:18156
commitPassiveMountEffects_complete @ chunk-276SZO74.js?v=9ed70bbf:18129
commitPassiveMountEffects_begin @ chunk-276SZO74.js?v=9ed70bbf:18119
commitPassiveMountEffects @ chunk-276SZO74.js?v=9ed70bbf:18109
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=9ed70bbf:19490
flushPassiveEffects @ chunk-276SZO74.js?v=9ed70bbf:19447
(anônimo) @ chunk-276SZO74.js?v=9ed70bbf:19328
workLoop @ chunk-276SZO74.js?v=9ed70bbf:197
flushWork @ chunk-276SZO74.js?v=9ed70bbf:176
performWorkUntilDeadline @ chunk-276SZO74.js?v=9ed70bbf:384Entenda o erro
20useAuth.ts:64 Erro ao verificar usuário: AuthSessionMissingError: Auth session missing!
    at @supabase_supabase-js.js?v=9ed70bbf:6076:49
    at SupabaseAuthClient._useSession (@supabase_supabase-js.js?v=9ed70bbf:5977:20)
    at async SupabaseAuthClient._getUser (@supabase_supabase-js.js?v=9ed70bbf:6069:14)
    at async @supabase_supabase-js.js?v=9ed70bbf:6056:14
overrideMethod @ hook.js:608
checkUser @ useAuth.ts:64
await in checkUser
(anônimo) @ useAuth.ts:71
commitHookEffectListMount @ chunk-276SZO74.js?v=9ed70bbf:16915
invokePassiveEffectMountInDEV @ chunk-276SZO74.js?v=9ed70bbf:18324
invokeEffectsInDev @ chunk-276SZO74.js?v=9ed70bbf:19701
commitDoubleInvokeEffectsInDEV @ chunk-276SZO74.js?v=9ed70bbf:19686
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=9ed70bbf:19503
flushPassiveEffects @ chunk-276SZO74.js?v=9ed70bbf:19447
commitRootImpl @ chunk-276SZO74.js?v=9ed70bbf:19416
commitRoot @ chunk-276SZO74.js?v=9ed70bbf:19277
performSyncWorkOnRoot @ chunk-276SZO74.js?v=9ed70bbf:18895
flushSyncCallbacks @ chunk-276SZO74.js?v=9ed70bbf:9119
(anônimo) @ chunk-276SZO74.js?v=9ed70bbf:18627
setTimeout
defaultScheduler @ @tanstack_react-query.js?v=9ed70bbf:565
flush @ @tanstack_react-query.js?v=9ed70bbf:589
batch @ @tanstack_react-query.js?v=9ed70bbf:607
dispatch_fn @ @tanstack_react-query.js?v=9ed70bbf:1040
setData @ @tanstack_react-query.js?v=9ed70bbf:718
onSuccess @ @tanstack_react-query.js?v=9ed70bbf:940
resolve @ @tanstack_react-query.js?v=9ed70bbf:475
Promise.then
run @ @tanstack_react-query.js?v=9ed70bbf:517
start @ @tanstack_react-query.js?v=9ed70bbf:555
fetch @ @tanstack_react-query.js?v=9ed70bbf:969
executeFetch_fn @ @tanstack_react-query.js?v=9ed70bbf:2280
onSubscribe @ @tanstack_react-query.js?v=9ed70bbf:1983
subscribe @ @tanstack_react-query.js?v=9ed70bbf:24
(anônimo) @ @tanstack_react-query.js?v=9ed70bbf:3147
subscribeToStore @ chunk-276SZO74.js?v=9ed70bbf:11984
commitHookEffectListMount @ chunk-276SZO74.js?v=9ed70bbf:16915
commitPassiveMountOnFiber @ chunk-276SZO74.js?v=9ed70bbf:18156
commitPassiveMountEffects_complete @ chunk-276SZO74.js?v=9ed70bbf:18129
commitPassiveMountEffects_begin @ chunk-276SZO74.js?v=9ed70bbf:18119
commitPassiveMountEffects @ chunk-276SZO74.js?v=9ed70bbf:18109
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=9ed70bbf:19490
flushPassiveEffects @ chunk-276SZO74.js?v=9ed70bbf:19447
(anônimo) @ chunk-276SZO74.js?v=9ed70bbf:19328
workLoop @ chunk-276SZO74.js?v=9ed70bbf:197
flushWork @ chunk-276SZO74.js?v=9ed70bbf:176
performWorkUntilDeadline @ chunk-276SZO74.js?v=9ed70bbf:384Entenda o erro
60useAuth.ts:64 Erro ao verificar usuário: AuthSessionMissingError: Auth session missing!
    at @supabase_supabase-js.js?v=9ed70bbf:6076:49
    at SupabaseAuthClient._useSession (@supabase_supabase-js.js?v=9ed70bbf:5977:20)
    at async SupabaseAuthClient._getUser (@supabase_supabase-js.js?v=9ed70bbf:6069:14)
    at async @supabase_supabase-js.js?v=9ed70bbf:6056:14
overrideMethod @ hook.js:608
checkUser @ useAuth.ts:64
await in checkUser
(anônimo) @ useAuth.ts:71
commitHookEffectListMount @ chunk-276SZO74.js?v=9ed70bbf:16915
commitPassiveMountOnFiber @ chunk-276SZO74.js?v=9ed70bbf:18156
commitPassiveMountEffects_complete @ chunk-276SZO74.js?v=9ed70bbf:18129
commitPassiveMountEffects_begin @ chunk-276SZO74.js?v=9ed70bbf:18119
commitPassiveMountEffects @ chunk-276SZO74.js?v=9ed70bbf:18109
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=9ed70bbf:19490
flushPassiveEffects @ chunk-276SZO74.js?v=9ed70bbf:19447
commitRootImpl @ chunk-276SZO74.js?v=9ed70bbf:19416
commitRoot @ chunk-276SZO74.js?v=9ed70bbf:19277
performSyncWorkOnRoot @ chunk-276SZO74.js?v=9ed70bbf:18895
flushSyncCallbacks @ chunk-276SZO74.js?v=9ed70bbf:9119
(anônimo) @ chunk-276SZO74.js?v=9ed70bbf:18627
setTimeout
defaultScheduler @ @tanstack_react-query.js?v=9ed70bbf:565
flush @ @tanstack_react-query.js?v=9ed70bbf:589
batch @ @tanstack_react-query.js?v=9ed70bbf:607
dispatch_fn @ @tanstack_react-query.js?v=9ed70bbf:1040
setData @ @tanstack_react-query.js?v=9ed70bbf:718
onSuccess @ @tanstack_react-query.js?v=9ed70bbf:940
resolve @ @tanstack_react-query.js?v=9ed70bbf:475
Promise.then
run @ @tanstack_react-query.js?v=9ed70bbf:517
start @ @tanstack_react-query.js?v=9ed70bbf:555
fetch @ @tanstack_react-query.js?v=9ed70bbf:969
executeFetch_fn @ @tanstack_react-query.js?v=9ed70bbf:2280
onSubscribe @ @tanstack_react-query.js?v=9ed70bbf:1983
subscribe @ @tanstack_react-query.js?v=9ed70bbf:24
(anônimo) @ @tanstack_react-query.js?v=9ed70bbf:3147
subscribeToStore @ chunk-276SZO74.js?v=9ed70bbf:11984
commitHookEffectListMount @ chunk-276SZO74.js?v=9ed70bbf:16915
commitPassiveMountOnFiber @ chunk-276SZO74.js?v=9ed70bbf:18156
commitPassiveMountEffects_complete @ chunk-276SZO74.js?v=9ed70bbf:18129
commitPassiveMountEffects_begin @ chunk-276SZO74.js?v=9ed70bbf:18119
commitPassiveMountEffects @ chunk-276SZO74.js?v=9ed70bbf:18109
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=9ed70bbf:19490
flushPassiveEffects @ chunk-276SZO74.js?v=9ed70bbf:19447
(anônimo) @ chunk-276SZO74.js?v=9ed70bbf:19328
workLoop @ chunk-276SZO74.js?v=9ed70bbf:197
flushWork @ chunk-276SZO74.js?v=9ed70bbf:176
performWorkUntilDeadline @ chunk-276SZO74.js?v=9ed70bbf:384Entenda o erro
36useAuth.ts:64 Erro ao verificar usuário: AuthSessionMissingError: Auth session missing!
    at @supabase_supabase-js.js?v=9ed70bbf:6076:49
    at SupabaseAuthClient._useSession (@supabase_supabase-js.js?v=9ed70bbf:5977:20)
    at async SupabaseAuthClient._getUser (@supabase_supabase-js.js?v=9ed70bbf:6069:14)
    at async @supabase_supabase-js.js?v=9ed70bbf:6056:14
overrideMethod @ hook.js:608
checkUser @ useAuth.ts:64
await in checkUser
(anônimo) @ useAuth.ts:71
commitHookEffectListMount @ chunk-276SZO74.js?v=9ed70bbf:16915
invokePassiveEffectMountInDEV @ chunk-276SZO74.js?v=9ed70bbf:18324
invokeEffectsInDev @ chunk-276SZO74.js?v=9ed70bbf:19701
commitDoubleInvokeEffectsInDEV @ chunk-276SZO74.js?v=9ed70bbf:19686
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=9ed70bbf:19503
flushPassiveEffects @ chunk-276SZO74.js?v=9ed70bbf:19447
commitRootImpl @ chunk-276SZO74.js?v=9ed70bbf:19416
commitRoot @ chunk-276SZO74.js?v=9ed70bbf:19277
performSyncWorkOnRoot @ chunk-276SZO74.js?v=9ed70bbf:18895
flushSyncCallbacks @ chunk-276SZO74.js?v=9ed70bbf:9119
(anônimo) @ chunk-276SZO74.js?v=9ed70bbf:18627
setTimeout
defaultScheduler @ @tanstack_react-query.js?v=9ed70bbf:565
flush @ @tanstack_react-query.js?v=9ed70bbf:589
batch @ @tanstack_react-query.js?v=9ed70bbf:607
dispatch_fn @ @tanstack_react-query.js?v=9ed70bbf:1040
setData @ @tanstack_react-query.js?v=9ed70bbf:718
onSuccess @ @tanstack_react-query.js?v=9ed70bbf:940
resolve @ @tanstack_react-query.js?v=9ed70bbf:475
Promise.then
run @ @tanstack_react-query.js?v=9ed70bbf:517
start @ @tanstack_react-query.js?v=9ed70bbf:555
fetch @ @tanstack_react-query.js?v=9ed70bbf:969
executeFetch_fn @ @tanstack_react-query.js?v=9ed70bbf:2280
onSubscribe @ @tanstack_react-query.js?v=9ed70bbf:1983
subscribe @ @tanstack_react-query.js?v=9ed70bbf:24
(anônimo) @ @tanstack_react-query.js?v=9ed70bbf:3147
subscribeToStore @ chunk-276SZO74.js?v=9ed70bbf:11984
commitHookEffectListMount @ chunk-276SZO74.js?v=9ed70bbf:16915
commitPassiveMountOnFiber @ chunk-276SZO74.js?v=9ed70bbf:18156
commitPassiveMountEffects_complete @ chunk-276SZO74.js?v=9ed70bbf:18129
commitPassiveMountEffects_begin @ chunk-276SZO74.js?v=9ed70bbf:18119
commitPassiveMountEffects @ chunk-276SZO74.js?v=9ed70bbf:18109
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=9ed70bbf:19490
flushPassiveEffects @ chunk-276SZO74.js?v=9ed70bbf:19447
(anônimo) @ chunk-276SZO74.js?v=9ed70bbf:19328
workLoop @ chunk-276SZO74.js?v=9ed70bbf:197
flushWork @ chunk-276SZO74.js?v=9ed70bbf:176
performWorkUntilDeadline @ chunk-276SZO74.js?v=9ed70bbf:384Entenda o erro
24useAuth.ts:64 Erro ao verificar usuário: AuthSessionMissingError: Auth session missing!
    at @supabase_supabase-js.js?v=9ed70bbf:6076:49
    at SupabaseAuthClient._useSession (@supabase_supabase-js.js?v=9ed70bbf:5977:20)
    at async SupabaseAuthClient._getUser (@supabase_supabase-js.js?v=9ed70bbf:6069:14)
    at async @supabase_supabase-js.js?v=9ed70bbf:6056:14
overrideMethod @ hook.js:608
checkUser @ useAuth.ts:64Entenda o erro
2useAuth.ts:64 Erro ao verificar usuário: AuthSessionMissingError: Auth session missing!
    at @supabase_supabase-js.js?v=9ed70bbf:6076:49
    at SupabaseAuthClient._useSession (@supabase_supabase-js.js?v=9ed70bbf:5977:20)
    at async SupabaseAuthClient._getUser (@supabase_supabase-js.js?v=9ed70bbf:6069:14)
    at async @supabase_supabase-js.js?v=9ed70bbf:6056:14
overrideMethod @ hook.js:608
checkUser @ useAuth.ts:64
await in checkUser
(anônimo) @ useAuth.ts:71
commitHookEffectListMount @ chunk-276SZO74.js?v=9ed70bbf:16915
commitPassiveMountOnFiber @ chunk-276SZO74.js?v=9ed70bbf:18156
commitPassiveMountEffects_complete @ chunk-276SZO74.js?v=9ed70bbf:18129
commitPassiveMountEffects_begin @ chunk-276SZO74.js?v=9ed70bbf:18119
commitPassiveMountEffects @ chunk-276SZO74.js?v=9ed70bbf:18109
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=9ed70bbf:19490
flushPassiveEffects @ chunk-276SZO74.js?v=9ed70bbf:19447
commitRootImpl @ chunk-276SZO74.js?v=9ed70bbf:19416
commitRoot @ chunk-276SZO74.js?v=9ed70bbf:19277
performSyncWorkOnRoot @ chunk-276SZO74.js?v=9ed70bbf:18895
flushSyncCallbacks @ chunk-276SZO74.js?v=9ed70bbf:9119
(anônimo) @ chunk-276SZO74.js?v=9ed70bbf:18627Entenda o erro
2useAuth.ts:64 Erro ao verificar usuário: AuthSessionMissingError: Auth session missing!
    at @supabase_supabase-js.js?v=9ed70bbf:6076:49
    at SupabaseAuthClient._useSession (@supabase_supabase-js.js?v=9ed70bbf:5977:20)
    at async SupabaseAuthClient._getUser (@supabase_supabase-js.js?v=9ed70bbf:6069:14)
    at async @supabase_supabase-js.js?v=9ed70bbf:6056:14
overrideMethod @ hook.js:608
checkUser @ useAuth.ts:64
await in checkUser
(anônimo) @ useAuth.ts:71
commitHookEffectListMount @ chunk-276SZO74.js?v=9ed70bbf:16915
invokePassiveEffectMountInDEV @ chunk-276SZO74.js?v=9ed70bbf:18324
invokeEffectsInDev @ chunk-276SZO74.js?v=9ed70bbf:19701
commitDoubleInvokeEffectsInDEV @ chunk-276SZO74.js?v=9ed70bbf:19686
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=9ed70bbf:19503
flushPassiveEffects @ chunk-276SZO74.js?v=9ed70bbf:19447
commitRootImpl @ chunk-276SZO74.js?v=9ed70bbf:19416
commitRoot @ chunk-276SZO74.js?v=9ed70bbf:19277
performSyncWorkOnRoot @ chunk-276SZO74.js?v=9ed70bbf:18895
flushSyncCallbacks @ chunk-276SZO74.js?v=9ed70bbf:9119
(anônimo) @ chunk-276SZO74.js?v=9ed70bbf:18627Entenda o erro
82useAuth.ts:64 Erro ao verificar usuário: AuthSessionMissingError: Auth session missing!
    at @supabase_supabase-js.js?v=9ed70bbf:6076:49
    at SupabaseAuthClient._useSession (@supabase_supabase-js.js?v=9ed70bbf:5977:20)
    at async SupabaseAuthClient._getUser (@supabase_supabase-js.js?v=9ed70bbf:6069:14)
    at async @supabase_supabase-js.js?v=9ed70bbf:6056:14
overrideMethod @ hook.js:608
checkUser @ useAuth.ts:64
await in checkUser
(anônimo) @ useAuth.ts:71
commitHookEffectListMount @ chunk-276SZO74.js?v=9ed70bbf:16915
commitPassiveMountOnFiber @ chunk-276SZO74.js?v=9ed70bbf:18156
commitPassiveMountEffects_complete @ chunk-276SZO74.js?v=9ed70bbf:18129
commitPassiveMountEffects_begin @ chunk-276SZO74.js?v=9ed70bbf:18119
commitPassiveMountEffects @ chunk-276SZO74.js?v=9ed70bbf:18109
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=9ed70bbf:19490
flushPassiveEffects @ chunk-276SZO74.js?v=9ed70bbf:19447
(anônimo) @ chunk-276SZO74.js?v=9ed70bbf:19328
workLoop @ chunk-276SZO74.js?v=9ed70bbf:197
flushWork @ chunk-276SZO74.js?v=9ed70bbf:176
performWorkUntilDeadline @ chunk-276SZO74.js?v=9ed70bbf:384Entenda o erro
3useAuth.ts:64 Erro ao verificar usuário: AuthSessionMissingError: Auth session missing!
    at @supabase_supabase-js.js?v=9ed70bbf:6076:49
    at SupabaseAuthClient._useSession (@supabase_supabase-js.js?v=9ed70bbf:5977:20)
    at async SupabaseAuthClient._getUser (@supabase_supabase-js.js?v=9ed70bbf:6069:14)
    at async @supabase_supabase-js.js?v=9ed70bbf:6056:14
overrideMethod @ hook.js:608
checkUser @ useAuth.ts:64
await in checkUser
(anônimo) @ useAuth.ts:71
commitHookEffectListMount @ chunk-276SZO74.js?v=9ed70bbf:16915
invokePassiveEffectMountInDEV @ chunk-276SZO74.js?v=9ed70bbf:18324
invokeEffectsInDev @ chunk-276SZO74.js?v=9ed70bbf:19701
commitDoubleInvokeEffectsInDEV @ chunk-276SZO74.js?v=9ed70bbf:19686
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=9ed70bbf:19503
flushPassiveEffects @ chunk-276SZO74.js?v=9ed70bbf:19447
(anônimo) @ chunk-276SZO74.js?v=9ed70bbf:19328
workLoop @ chunk-276SZO74.js?v=9ed70bbf:197
flushWork @ chunk-276SZO74.js?v=9ed70bbf:176
performWorkUntilDeadline @ chunk-276SZO74.js?v=9ed70bbf:384Entenda o erro
79useAuth.ts:64 Erro ao verificar usuário: AuthSessionMissingError: Auth session missing!
    at @supabase_supabase-js.js?v=9ed70bbf:6076:49
    at SupabaseAuthClient._useSession (@supabase_supabase-js.js?v=9ed70bbf:5977:20)
    at async SupabaseAuthClient._getUser (@supabase_supabase-js.js?v=9ed70bbf:6069:14)
    at async @supabase_supabase-js.js?v=9ed70bbf:6056:14
overrideMethod @ hook.js:608
checkUser @ useAuth.ts:64Entenda o erro
useAuth.ts:64 Erro ao verificar usuário: AuthSessionMissingError: Auth session missing!
    at @supabase_supabase-js.js?v=9ed70bbf:6076:49
    at SupabaseAuthClient._useSession (@supabase_supabase-js.js?v=9ed70bbf:5977:20)
    at async SupabaseAuthClient._getUser (@supabase_supabase-js.js?v=9ed70bbf:6069:14)
    at async @supabase_supabase-js.js?v=9ed70bbf:6056:14
overrideMethod @ hook.js:608
checkUser @ useAuth.ts:64
await in checkUser
(anônimo) @ useAuth.ts:71
commitHookEffectListMount @ chunk-276SZO74.js?v=9ed70bbf:16915
commitPassiveMountOnFiber @ chunk-276SZO74.js?v=9ed70bbf:18156
commitPassiveMountEffects_complete @ chunk-276SZO74.js?v=9ed70bbf:18129
commitPassiveMountEffects_begin @ chunk-276SZO74.js?v=9ed70bbf:18119
commitPassiveMountEffects @ chunk-276SZO74.js?v=9ed70bbf:18109
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=9ed70bbf:19490
flushPassiveEffects @ chunk-276SZO74.js?v=9ed70bbf:19447
(anônimo) @ chunk-276SZO74.js?v=9ed70bbf:19328
workLoop @ chunk-276SZO74.js?v=9ed70bbf:197
flushWork @ chunk-276SZO74.js?v=9ed70bbf:176
performWorkUntilDeadline @ chunk-276SZO74.js?v=9ed70bbf:384Entenda o erro
useAuth.ts:64 Erro ao verificar usuário: AuthSessionMissingError: Auth session missing!
    at @supabase_supabase-js.js?v=9ed70bbf:6076:49
    at SupabaseAuthClient._useSession (@supabase_supabase-js.js?v=9ed70bbf:5977:20)
    at async SupabaseAuthClient._getUser (@supabase_supabase-js.js?v=9ed70bbf:6069:14)
    at async @supabase_supabase-js.js?v=9ed70bbf:6056:14
overrideMethod @ hook.js:608
checkUser @ useAuth.ts:64
await in checkUser
(anônimo) @ useAuth.ts:71
commitHookEffectListMount @ chunk-276SZO74.js?v=9ed70bbf:16915
invokePassiveEffectMountInDEV @ chunk-276SZO74.js?v=9ed70bbf:18324
invokeEffectsInDev @ chunk-276SZO74.js?v=9ed70bbf:19701
commitDoubleInvokeEffectsInDEV @ chunk-276SZO74.js?v=9ed70bbf:19686
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=9ed70bbf:19503
flushPassiveEffects @ chunk-276SZO74.js?v=9ed70bbf:19447
(anônimo) @ chunk-276SZO74.js?v=9ed70bbf:19328
workLoop @ chunk-276SZO74.js?v=9ed70bbf:197
flushWork @ chunk-276SZO74.js?v=9ed70bbf:176
performWorkUntilDeadline @ chunk-276SZO74.js?v=9ed70bbf:384Entenda o erro
82useAuth.ts:64 Erro ao verificar usuário: AuthSessionMissingError: Auth session missing!
    at @supabase_supabase-js.js?v=9ed70bbf:6076:49
    at SupabaseAuthClient._useSession (@supabase_supabase-js.js?v=9ed70bbf:5977:20)
    at async SupabaseAuthClient._getUser (@supabase_supabase-js.js?v=9ed70bbf:6069:14)
    at async @supabase_supabase-js.js?v=9ed70bbf:6056:14
overrideMethod @ hook.js:608
checkUser @ useAuth.ts:64
await in checkUser
(anônimo) @ useAuth.ts:71
commitHookEffectListMount @ chunk-276SZO74.js?v=9ed70bbf:16915
commitPassiveMountOnFiber @ chunk-276SZO74.js?v=9ed70bbf:18156
commitPassiveMountEffects_complete @ chunk-276SZO74.js?v=9ed70bbf:18129
commitPassiveMountEffects_begin @ chunk-276SZO74.js?v=9ed70bbf:18119
commitPassiveMountEffects @ chunk-276SZO74.js?v=9ed70bbf:18109
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=9ed70bbf:19490
flushPassiveEffects @ chunk-276SZO74.js?v=9ed70bbf:19447
(anônimo) @ chunk-276SZO74.js?v=9ed70bbf:19328
workLoop @ chunk-276SZO74.js?v=9ed70bbf:197
flushWork @ chunk-276SZO74.js?v=9ed70bbf:176
performWorkUntilDeadline @ chunk-276SZO74.js?v=9ed70bbf:384Entenda o erro
22useAuth.ts:64 Erro ao verificar usuário: AuthSessionMissingError: Auth session missing!
    at @supabase_supabase-js.js?v=9ed70bbf:6076:49
    at SupabaseAuthClient._useSession (@supabase_supabase-js.js?v=9ed70bbf:5977:20)
    at async SupabaseAuthClient._getUser (@supabase_supabase-js.js?v=9ed70bbf:6069:14)
    at async @supabase_supabase-js.js?v=9ed70bbf:6056:14
overrideMethod @ hook.js:608
checkUser @ useAuth.ts:64
await in checkUser
(anônimo) @ useAuth.ts:71
commitHookEffectListMount @ chunk-276SZO74.js?v=9ed70bbf:16915
invokePassiveEffectMountInDEV @ chunk-276SZO74.js?v=9ed70bbf:18324
invokeEffectsInDev @ chunk-276SZO74.js?v=9ed70bbf:19701
commitDoubleInvokeEffectsInDEV @ chunk-276SZO74.js?v=9ed70bbf:19686
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=9ed70bbf:19503
flushPassiveEffects @ chunk-276SZO74.js?v=9ed70bbf:19447
(anônimo) @ chunk-276SZO74.js?v=9ed70bbf:19328
workLoop @ chunk-276SZO74.js?v=9ed70bbf:197
flushWork @ chunk-276SZO74.js?v=9ed70bbf:176
performWorkUntilDeadline @ chunk-276SZO74.js?v=9ed70bbf:384Entenda o erro
60useAuth.ts:64 Erro ao verificar usuário: AuthSessionMissingError: Auth session missing!
    at @supabase_supabase-js.js?v=9ed70bbf:6076:49
    at SupabaseAuthClient._useSession (@supabase_supabase-js.js?v=9ed70bbf:5977:20)
    at async SupabaseAuthClient._getUser (@supabase_supabase-js.js?v=9ed70bbf:6069:14)
    at async @supabase_supabase-js.js?v=9ed70bbf:6056:14
overrideMethod @ hook.js:608
checkUser @ useAuth.ts:64Entenda o erro
2useAuth.ts:64 Erro ao verificar usuário: AuthSessionMissingError: Auth session missing!
    at @supabase_supabase-js.js?v=9ed70bbf:6076:49
    at SupabaseAuthClient._useSession (@supabase_supabase-js.js?v=9ed70bbf:5977:20)
    at async SupabaseAuthClient._getUser (@supabase_supabase-js.js?v=9ed70bbf:6069:14)
    at async @supabase_supabase-js.js?v=9ed70bbf:6056:14
overrideMethod @ hook.js:608
checkUser @ useAuth.ts:64
await in checkUser
(anônimo) @ useAuth.ts:71
commitHookEffectListMount @ chunk-276SZO74.js?v=9ed70bbf:16915
commitPassiveMountOnFiber @ chunk-276SZO74.js?v=9ed70bbf:18156
commitPassiveMountEffects_complete @ chunk-276SZO74.js?v=9ed70bbf:18129
commitPassiveMountEffects_begin @ chunk-276SZO74.js?v=9ed70bbf:18119
commitPassiveMountEffects @ chunk-276SZO74.js?v=9ed70bbf:18109
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=9ed70bbf:19490
flushPassiveEffects @ chunk-276SZO74.js?v=9ed70bbf:19447
commitRootImpl @ chunk-276SZO74.js?v=9ed70bbf:19416
commitRoot @ chunk-276SZO74.js?v=9ed70bbf:19277
performSyncWorkOnRoot @ chunk-276SZO74.js?v=9ed70bbf:18895
flushSyncCallbacks @ chunk-276SZO74.js?v=9ed70bbf:9119
(anônimo) @ chunk-276SZO74.js?v=9ed70bbf:18627Entenda o erro
2useAuth.ts:64 Erro ao verificar usuário: AuthSessionMissingError: Auth session missing!
    at @supabase_supabase-js.js?v=9ed70bbf:6076:49
    at SupabaseAuthClient._useSession (@supabase_supabase-js.js?v=9ed70bbf:5977:20)
    at async SupabaseAuthClient._getUser (@supabase_supabase-js.js?v=9ed70bbf:6069:14)
    at async @supabase_supabase-js.js?v=9ed70bbf:6056:14
overrideMethod @ hook.js:608
checkUser @ useAuth.ts:64
await in checkUser
(anônimo) @ useAuth.ts:71
commitHookEffectListMount @ chunk-276SZO74.js?v=9ed70bbf:16915
invokePassiveEffectMountInDEV @ chunk-276SZO74.js?v=9ed70bbf:18324
invokeEffectsInDev @ chunk-276SZO74.js?v=9ed70bbf:19701
commitDoubleInvokeEffectsInDEV @ chunk-276SZO74.js?v=9ed70bbf:19686
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=9ed70bbf:19503
flushPassiveEffects @ chunk-276SZO74.js?v=9ed70bbf:19447
commitRootImpl @ chunk-276SZO74.js?v=9ed70bbf:19416
commitRoot @ chunk-276SZO74.js?v=9ed70bbf:19277
performSyncWorkOnRoot @ chunk-276SZO74.js?v=9ed70bbf:18895
flushSyncCallbacks @ chunk-276SZO74.js?v=9ed70bbf:9119
(anônimo) @ chunk-276SZO74.js?v=9ed70bbf:18627Entenda o erro
api.ts:209 API Request: GET /animes
20useAuth.ts:64 Erro ao verificar usuário: AuthSessionMissingError: Auth session missing!
    at @supabase_supabase-js.js?v=9ed70bbf:6076:49
    at SupabaseAuthClient._useSession (@supabase_supabase-js.js?v=9ed70bbf:5977:20)
    at async SupabaseAuthClient._getUser (@supabase_supabase-js.js?v=9ed70bbf:6069:14)
    at async @supabase_supabase-js.js?v=9ed70bbf:6056:14
overrideMethod @ hook.js:608
checkUser @ useAuth.ts:64
await in checkUser
(anônimo) @ useAuth.ts:71
commitHookEffectListMount @ chunk-276SZO74.js?v=9ed70bbf:16915
commitPassiveMountOnFiber @ chunk-276SZO74.js?v=9ed70bbf:18156
commitPassiveMountEffects_complete @ chunk-276SZO74.js?v=9ed70bbf:18129
commitPassiveMountEffects_begin @ chunk-276SZO74.js?v=9ed70bbf:18119
commitPassiveMountEffects @ chunk-276SZO74.js?v=9ed70bbf:18109
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=9ed70bbf:19490
flushPassiveEffects @ chunk-276SZO74.js?v=9ed70bbf:19447
commitRootImpl @ chunk-276SZO74.js?v=9ed70bbf:19416
commitRoot @ chunk-276SZO74.js?v=9ed70bbf:19277
performSyncWorkOnRoot @ chunk-276SZO74.js?v=9ed70bbf:18895
flushSyncCallbacks @ chunk-276SZO74.js?v=9ed70bbf:9119
(anônimo) @ chunk-276SZO74.js?v=9ed70bbf:18627
setTimeout
defaultScheduler @ @tanstack_react-query.js?v=9ed70bbf:565
flush @ @tanstack_react-query.js?v=9ed70bbf:589
batch @ @tanstack_react-query.js?v=9ed70bbf:607
dispatch_fn @ @tanstack_react-query.js?v=9ed70bbf:1040
setData @ @tanstack_react-query.js?v=9ed70bbf:718
onSuccess @ @tanstack_react-query.js?v=9ed70bbf:940
resolve @ @tanstack_react-query.js?v=9ed70bbf:475
Promise.then
run @ @tanstack_react-query.js?v=9ed70bbf:517
start @ @tanstack_react-query.js?v=9ed70bbf:555
fetch @ @tanstack_react-query.js?v=9ed70bbf:969
executeFetch_fn @ @tanstack_react-query.js?v=9ed70bbf:2280
onSubscribe @ @tanstack_react-query.js?v=9ed70bbf:1983
subscribe @ @tanstack_react-query.js?v=9ed70bbf:24
(anônimo) @ @tanstack_react-query.js?v=9ed70bbf:3147
subscribeToStore @ chunk-276SZO74.js?v=9ed70bbf:11984
commitHookEffectListMount @ chunk-276SZO74.js?v=9ed70bbf:16915
commitPassiveMountOnFiber @ chunk-276SZO74.js?v=9ed70bbf:18156
commitPassiveMountEffects_complete @ chunk-276SZO74.js?v=9ed70bbf:18129
commitPassiveMountEffects_begin @ chunk-276SZO74.js?v=9ed70bbf:18119
commitPassiveMountEffects @ chunk-276SZO74.js?v=9ed70bbf:18109
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=9ed70bbf:19490
flushPassiveEffects @ chunk-276SZO74.js?v=9ed70bbf:19447
commitRootImpl @ chunk-276SZO74.js?v=9ed70bbf:19416
commitRoot @ chunk-276SZO74.js?v=9ed70bbf:19277
performSyncWorkOnRoot @ chunk-276SZO74.js?v=9ed70bbf:18895
flushSyncCallbacks @ chunk-276SZO74.js?v=9ed70bbf:9119
(anônimo) @ chunk-276SZO74.js?v=9ed70bbf:18627Entenda o erro
20useAuth.ts:64 Erro ao verificar usuário: AuthSessionMissingError: Auth session missing!
    at @supabase_supabase-js.js?v=9ed70bbf:6076:49
    at SupabaseAuthClient._useSession (@supabase_supabase-js.js?v=9ed70bbf:5977:20)
    at async SupabaseAuthClient._getUser (@supabase_supabase-js.js?v=9ed70bbf:6069:14)
    at async @supabase_supabase-js.js?v=9ed70bbf:6056:14
overrideMethod @ hook.js:608
checkUser @ useAuth.ts:64
await in checkUser
(anônimo) @ useAuth.ts:71
commitHookEffectListMount @ chunk-276SZO74.js?v=9ed70bbf:16915
invokePassiveEffectMountInDEV @ chunk-276SZO74.js?v=9ed70bbf:18324
invokeEffectsInDev @ chunk-276SZO74.js?v=9ed70bbf:19701
commitDoubleInvokeEffectsInDEV @ chunk-276SZO74.js?v=9ed70bbf:19686
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=9ed70bbf:19503
flushPassiveEffects @ chunk-276SZO74.js?v=9ed70bbf:19447
commitRootImpl @ chunk-276SZO74.js?v=9ed70bbf:19416
commitRoot @ chunk-276SZO74.js?v=9ed70bbf:19277
performSyncWorkOnRoot @ chunk-276SZO74.js?v=9ed70bbf:18895
flushSyncCallbacks @ chunk-276SZO74.js?v=9ed70bbf:9119
(anônimo) @ chunk-276SZO74.js?v=9ed70bbf:18627
setTimeout
defaultScheduler @ @tanstack_react-query.js?v=9ed70bbf:565
flush @ @tanstack_react-query.js?v=9ed70bbf:589
batch @ @tanstack_react-query.js?v=9ed70bbf:607
dispatch_fn @ @tanstack_react-query.js?v=9ed70bbf:1040
setData @ @tanstack_react-query.js?v=9ed70bbf:718
onSuccess @ @tanstack_react-query.js?v=9ed70bbf:940
resolve @ @tanstack_react-query.js?v=9ed70bbf:475
Promise.then
run @ @tanstack_react-query.js?v=9ed70bbf:517
start @ @tanstack_react-query.js?v=9ed70bbf:555
fetch @ @tanstack_react-query.js?v=9ed70bbf:969
executeFetch_fn @ @tanstack_react-query.js?v=9ed70bbf:2280
onSubscribe @ @tanstack_react-query.js?v=9ed70bbf:1983
subscribe @ @tanstack_react-query.js?v=9ed70bbf:24
(anônimo) @ @tanstack_react-query.js?v=9ed70bbf:3147
subscribeToStore @ chunk-276SZO74.js?v=9ed70bbf:11984
commitHookEffectListMount @ chunk-276SZO74.js?v=9ed70bbf:16915
commitPassiveMountOnFiber @ chunk-276SZO74.js?v=9ed70bbf:18156
commitPassiveMountEffects_complete @ chunk-276SZO74.js?v=9ed70bbf:18129
commitPassiveMountEffects_begin @ chunk-276SZO74.js?v=9ed70bbf:18119
commitPassiveMountEffects @ chunk-276SZO74.js?v=9ed70bbf:18109
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=9ed70bbf:19490
flushPassiveEffects @ chunk-276SZO74.js?v=9ed70bbf:19447
commitRootImpl @ chunk-276SZO74.js?v=9ed70bbf:19416
commitRoot @ chunk-276SZO74.js?v=9ed70bbf:19277
performSyncWorkOnRoot @ chunk-276SZO74.js?v=9ed70bbf:18895
flushSyncCallbacks @ chunk-276SZO74.js?v=9ed70bbf:9119
(anônimo) @ chunk-276SZO74.js?v=9ed70bbf:18627Entenda o erro
api.ts:209 API Request: GET /animes/1
api.ts:209 API Request: GET /episodes/1
useAuth.ts:64 Erro ao verificar usuário: AuthSessionMissingError: Auth session missing!
    at @supabase_supabase-js.js?v=9ed70bbf:6076:49
    at SupabaseAuthClient._useSession (@supabase_supabase-js.js?v=9ed70bbf:5977:20)
    at async SupabaseAuthClient._getUser (@supabase_supabase-js.js?v=9ed70bbf:6069:14)
    at async @supabase_supabase-js.js?v=9ed70bbf:6056:14
overrideMethod @ hook.js:608
checkUser @ useAuth.ts:64
await in checkUser
(anônimo) @ useAuth.ts:71
commitHookEffectListMount @ chunk-276SZO74.js?v=9ed70bbf:16915
commitPassiveMountOnFiber @ chunk-276SZO74.js?v=9ed70bbf:18156
commitPassiveMountEffects_complete @ chunk-276SZO74.js?v=9ed70bbf:18129
commitPassiveMountEffects_begin @ chunk-276SZO74.js?v=9ed70bbf:18119
commitPassiveMountEffects @ chunk-276SZO74.js?v=9ed70bbf:18109
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=9ed70bbf:19490
flushPassiveEffects @ chunk-276SZO74.js?v=9ed70bbf:19447
commitRootImpl @ chunk-276SZO74.js?v=9ed70bbf:19416
commitRoot @ chunk-276SZO74.js?v=9ed70bbf:19277
performSyncWorkOnRoot @ chunk-276SZO74.js?v=9ed70bbf:18895
flushSyncCallbacks @ chunk-276SZO74.js?v=9ed70bbf:9119
(anônimo) @ chunk-276SZO74.js?v=9ed70bbf:18627Entenda o erro
useAuth.ts:64 Erro ao verificar usuário: AuthSessionMissingError: Auth session missing!
    at @supabase_supabase-js.js?v=9ed70bbf:6076:49
    at SupabaseAuthClient._useSession (@supabase_supabase-js.js?v=9ed70bbf:5977:20)
    at async SupabaseAuthClient._getUser (@supabase_supabase-js.js?v=9ed70bbf:6069:14)
    at async @supabase_supabase-js.js?v=9ed70bbf:6056:14
overrideMethod @ hook.js:608
checkUser @ useAuth.ts:64
await in checkUser
(anônimo) @ useAuth.ts:71
commitHookEffectListMount @ chunk-276SZO74.js?v=9ed70bbf:16915
invokePassiveEffectMountInDEV @ chunk-276SZO74.js?v=9ed70bbf:18324
invokeEffectsInDev @ chunk-276SZO74.js?v=9ed70bbf:19701
commitDoubleInvokeEffectsInDEV @ chunk-276SZO74.js?v=9ed70bbf:19686
flushPassiveEffectsImpl @ chunk-276SZO74.js?v=9ed70bbf:19503
flushPassiveEffects @ chunk-276SZO74.js?v=9ed70bbf:19447
commitRootImpl @ chunk-276SZO74.js?v=9ed70bbf:19416
commitRoot @ chunk-276SZO74.js?v=9ed70bbf:19277
performSyncWorkOnRoot @ chunk-276SZO74.js?v=9ed70bbf:18895
flushSyncCallbacks @ chunk-276SZO74.js?v=9ed70bbf:9119
(anônimo) @ chunk-276SZO74.js?v=9ed70bbf:18627Entenda o erro
2AnimeDetail.tsx:51 Erro ao alterar favorito: Error: Usuário não autenticado
    at SupabaseService.addToFavorites (supabaseService.ts:12:22)