import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout, AuthLayout, ProtectedRoute } from '@/components'
import { Home } from '@/pages/Home'
import { Login } from '@/pages/Login'
import { Register } from '@/pages/Register'
import { Catalog } from '@/pages/Catalog'
import { AnimeDetail } from '@/pages/AnimeDetail'
import { Player } from '@/pages/Player'
import { Search } from '@/pages/Search'
import { Profile } from '@/pages/Profile'
import { Favorites } from '@/pages/Favorites'
import { History } from '@/pages/History'
import { useSync } from '@/hooks/useSync'

// Configuração do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
})

// Componente interno para usar hooks dentro do QueryClientProvider
function AppContent() {
  // Inicializar sincronização automática
  useSync()

  return (
    <Router future={{ v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-900">
        <Routes>
          {/* Rotas públicas com layout completo */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            {/* Outras rotas públicas serão adicionadas aqui */}
          </Route>

          {/* Rotas de autenticação */}
          <Route path="/" element={<AuthLayout />}>
            <Route 
              path="login" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="register" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Register />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Rotas públicas com layout completo */}
          <Route path="/" element={<Layout />}>
            <Route path="catalog" element={<Catalog />} />
            <Route path="anime/:id" element={<AnimeDetail />} />
            <Route path="watch/:animeId/:episodeNumber" element={<Player />} />
            <Route path="search" element={<Search />} />
          </Route>

          {/* Rotas protegidas com layout completo */}
          <Route path="/" element={<Layout />}>
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
            <Route
              path="history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Rota 404 */}
          <Route path="*" element={
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-4">404</h1>
                <p className="text-gray-400 mb-8">Página não encontrada</p>
                <a href="/" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-300">
                  Voltar ao início
                </a>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      
      {/* React Query Devtools removido temporariamente */}
    </QueryClientProvider>
  )
}

export default App