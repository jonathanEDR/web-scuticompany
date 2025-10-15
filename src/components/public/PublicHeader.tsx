import { Link } from 'react-router-dom';
import { useState } from 'react';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { useTheme } from '../../contexts/ThemeContext';

const PublicHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 w-full theme-transition z-50 border-b" 
            style={{ 
              backgroundColor: `color-mix(in srgb, var(--color-card-bg) 95%, transparent)`,
              borderColor: `color-mix(in srgb, var(--color-primary) 20%, transparent)`,
              backdropFilter: 'blur(12px)'
            }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              <span className="theme-text-primary">SCUTI</span>
              <span className="block text-xs tracking-wider" style={{ color: 'var(--color-primary)' }}>COMPANY</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="theme-text-primary font-medium theme-transition"
                  onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--color-primary)'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--color-text)'}>
              Inicio
            </Link>
            <Link to="/nosotros" className="theme-text-secondary theme-transition"
                  onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--color-primary)'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--color-text-secondary)'}>
              Nosotros
            </Link>
            <div className="relative group">
              <button className="theme-text-secondary theme-transition flex items-center"
                      onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--color-primary)'}
                      onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--color-text-secondary)'}>
                Soluciones
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <div className="relative group">
              <button className="theme-text-secondary theme-transition flex items-center"
                      onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--color-primary)'}
                      onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--color-text-secondary)'}>
                Recursos
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <Link to="/proyectos" className="theme-text-secondary theme-transition"
                  onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--color-primary)'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--color-text-secondary)'}>
              Proyectos destacados
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg theme-text-secondary theme-transition"
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = 'var(--color-primary)';
                (e.target as HTMLElement).style.backgroundColor = 'color-mix(in srgb, var(--color-primary) 10%, transparent)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = 'var(--color-text-secondary)';
                (e.target as HTMLElement).style.backgroundColor = 'transparent';
              }}
              aria-label="Cambiar tema"
            >
              {theme === 'light' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
            
            <SignedOut>
              {/* Botón Iniciar Sesión */}
              <SignInButton mode="modal">
                <button className="px-4 py-2 theme-text-secondary theme-transition font-medium"
                        onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--color-primary)'}
                        onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--color-text-secondary)'}>
                  Iniciar Sesión
                </button>
              </SignInButton>
              
              {/* Botón Registrarse */}
              <SignUpButton mode="modal">
                <button className="px-6 py-2.5 rounded-full text-white theme-transition font-medium"
                        style={{ 
                          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                          boxShadow: `0 10px 25px -3px color-mix(in srgb, var(--color-primary) 20%, transparent), 0 4px 6px -2px color-mix(in srgb, var(--color-primary) 5%, transparent)`
                        }}>
                  Registrarse
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              {/* Botón Dashboard */}
              <Link 
                to="/dashboard"
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 font-medium flex items-center space-x-2"
              >
                <span>🚀</span>
                <span>Dashboard</span>
              </Link>
              
              {/* Avatar del Usuario */}
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 rounded-full border-2 border-purple-400"
                  }
                }}
              />
            </SignedIn>

            {/* Botón Contacto */}
            <Link 
              to="/contacto"
              className="px-6 py-2.5 rounded-full border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white transition-all duration-300 font-medium"
            >
              CONTÁCTENOS
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-purple-500/20">
            <Link to="/" className="block text-white hover:text-purple-400 py-2">Inicio</Link>
            <Link to="/nosotros" className="block text-gray-300 hover:text-purple-400 py-2">Nosotros</Link>
            <Link to="/soluciones" className="block text-gray-300 hover:text-purple-400 py-2">Soluciones</Link>
            <Link to="/recursos" className="block text-gray-300 hover:text-purple-400 py-2">Recursos</Link>
            <Link to="/proyectos" className="block text-gray-300 hover:text-purple-400 py-2">Proyectos destacados</Link>
            
            {/* Auth Buttons Mobile */}
            <div className="pt-4 border-t border-purple-500/20 space-y-3">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="block w-full text-center px-6 py-2.5 text-gray-300 hover:text-purple-400 transition-colors font-medium">
                    Iniciar Sesión
                  </button>
                </SignInButton>
                
                <SignUpButton mode="modal">
                  <button className="block w-full text-center px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:shadow-lg transition-all duration-300 font-medium">
                    Registrarse
                  </button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                <Link 
                  to="/dashboard"
                  className="block w-full text-center px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:shadow-lg transition-all duration-300 font-medium"
                >
                  🚀 Ir al Dashboard
                </Link>
                
                <div className="flex justify-center py-2">
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10 rounded-full border-2 border-purple-400"
                      }
                    }}
                  />
                </div>
              </SignedIn>
            </div>

            <Link 
              to="/contacto"
              className="block w-full text-center px-6 py-2.5 rounded-full border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white transition-all duration-300 mt-4"
            >
              CONTÁCTENOS
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default PublicHeader;
