import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

interface LayoutProps {
  showHeader?: boolean
  showFooter?: boolean
  className?: string
}

export const Layout: React.FC<LayoutProps> = ({
  showHeader = true,
  showFooter = true,
  className = ''
}) => {
  return (
    <div className={`min-h-screen bg-gray-900 flex flex-col ${className}`}>
      {showHeader && <Header />}
      
      <main className={`flex-1 ${showHeader ? 'pt-16' : ''}`}>
        <Outlet />
      </main>
      
      {showFooter && <Footer />}
    </div>
  )
}

// Layout específico para player (sem header/footer)
export const PlayerLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      <Outlet />
    </div>
  )
}

// Layout para páginas de autenticação
export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}