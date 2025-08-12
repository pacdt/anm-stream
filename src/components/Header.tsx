import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, Menu, X, User, Heart, History, LogOut, Settings } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useUserProfile } from '@/hooks/useUser'
import { useSearchAnimes } from '@/hooks/useAnimes'
import { cn, debounce } from '@/lib/utils'
import { Anime } from '@/types'

export const Header: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, signOut } = useAuth()
  const { data: profile } = useUserProfile(user?.id || '')
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  
  const searchInputRef = useRef<HTMLInputElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const searchResultsRef = useRef<HTMLDivElement>(null)
  
  const { data: searchResults, isLoading: isSearchLoading } = useSearchAnimes(
    searchQuery,
    1
  )

  // Debounced search
  const debouncedSearch = debounce((query: string) => {
    setSearchQuery(query)
  }, 300)

  // Fechar menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fechar menu mobile ao navegar
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery('')
      searchInputRef.current?.blur()
    }
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    debouncedSearch(value)
    setIsSearchOpen(value.length > 0)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
        setIsSearchOpen(false)
        setSearchQuery('')
        searchInputRef.current?.blur()
      }
    }
  }

  const handleSearchButtonClick = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery('')
      searchInputRef.current?.blur()
    }
  }

  const handleAnimeClick = (anime: Anime) => {
    navigate(`/anime/${anime.id}`)
    setIsSearchOpen(false)
    setSearchQuery('')
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setIsUserMenuOpen(false)
      navigate('/')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const navLinks = [
    { to: '/', label: 'Início' },
    { to: '/catalog', label: 'Catálogo' },
    { to: '/favorites', label: 'Favoritos', authRequired: true },
    { to: '/history', label: 'Histórico', authRequired: true },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:block">
              AnimeStream
            </span>
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              if (link.authRequired && !isAuthenticated) return null
              
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'text-gray-300 hover:text-white transition-colors duration-300 font-medium',
                    location.pathname === link.to && 'text-red-400'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Busca e Usuário */}
          <div className="flex items-center gap-4">
            {/* Busca */}
            <div className="relative" ref={searchResultsRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar animes..."
                  className="w-64 px-4 py-2 pl-10 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none transition-colors duration-300 hidden sm:block"
                  onChange={handleSearchInputChange}
                  onKeyDown={handleSearchKeyDown}
                  onFocus={() => searchQuery && setIsSearchOpen(true)}
                />
                <button
                  type="button"
                  onClick={handleSearchButtonClick}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300 hidden sm:block"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Resultados da busca */}
              {isSearchOpen && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg border border-gray-700 shadow-xl max-h-96 overflow-y-auto z-50">
                  {isSearchLoading ? (
                    <div className="p-4 text-center text-gray-400">
                      Buscando...
                    </div>
                  ) : searchResults?.data && searchResults.data.length > 0 ? (
                    <div className="py-2">
                      {searchResults.data.slice(0, 5).map((anime) => (
                        <button
                          key={anime.id}
                          onClick={() => handleAnimeClick(anime)}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-700 transition-colors duration-300 text-left"
                        >
                          <img
                            src={anime.imagem_original || '/placeholder-anime.jpg'}
                            alt={anime.nome}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">
                              {anime.nome}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {anime.year} • {anime.total_episodios} eps
                            </p>
                          </div>
                        </button>
                      ))}
                      
                      {searchResults.data.length > 5 && (
                        <button
                          onClick={() => {
                            navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
                            setIsSearchOpen(false)
                          }}
                          className="w-full px-4 py-3 text-red-400 hover:bg-gray-700 transition-colors duration-300 text-center"
                        >
                          Ver todos os resultados ({searchResults.pagination?.total_items || 0})
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-400">
                      Nenhum resultado encontrado
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Busca Mobile */}
            <button
              onClick={() => navigate('/search')}
              className="p-2 text-gray-300 hover:text-white transition-colors duration-300 sm:hidden"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Menu do Usuário */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 text-gray-300 hover:text-white transition-colors duration-300"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:block">{profile?.displayName || user?.email || 'Usuário'}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-lg border border-gray-700 shadow-xl py-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-300"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Perfil
                    </Link>
                    
                    <Link
                      to="/favorites"
                      className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-300"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Heart className="w-4 h-4" />
                      Favoritos
                    </Link>
                    
                    <Link
                      to="/history"
                      className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-300"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <History className="w-4 h-4" />
                      Histórico
                    </Link>
                    
                    <hr className="my-2 border-gray-700" />
                    
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-300 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-300 hidden sm:block"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                >
                  Cadastrar
                </Link>
              </div>
            )}

            {/* Menu Mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-300 hover:text-white transition-colors duration-300 md:hidden"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => {
                if (link.authRequired && !isAuthenticated) return null
                
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      'text-gray-300 hover:text-white transition-colors duration-300 font-medium',
                      location.pathname === link.to && 'text-red-400'
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
              
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors duration-300 font-medium"
                >
                  Entrar
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}