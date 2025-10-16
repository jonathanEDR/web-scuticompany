import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { useTheme } from '../../contexts/ThemeContext';
import Logo from '../Logo';
import '../../styles/gradient-borders.css';

const PublicHeader = () => {
  const { theme, toggleTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        // Siempre mostrar cuando estamos cerca del top
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling hacia arriba
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling hacia abajo y estamos lejos del top
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 theme-transition transition-all duration-300 ease-in-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`} 
            style={{
              backgroundColor: lastScrollY > 50 ? 'rgba(15, 23, 42, 0.95)' : 'transparent',
              backdropFilter: lastScrollY > 50 ? 'blur(10px)' : 'none'
            }}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Centrado en móvil, izquierda en desktop */}
          <Link 
            to="/" 
            aria-label="Scuti Company - Ir al inicio"
            className="flex items-center transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 rounded-lg md:flex-none flex-1 md:flex-initial justify-center md:justify-start"
          >
            <Logo size="md" animated compact />
          </Link>

          {/* Desktop Navigation - Centro */}
          <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Navegación principal">
            <Link 
              to="/" 
              className="theme-text-primary font-medium theme-transition px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 hover:bg-white/5"
              onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--color-text)'}
              aria-current="page"
            >
              Inicio
            </Link>
            <Link 
              to="/nosotros" 
              className="theme-text-secondary theme-transition px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 hover:bg-white/5"
              onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--color-text-secondary)'}>
              Nosotros
            </Link>
            <div className="relative group">
              <button 
                className="theme-text-secondary theme-transition flex items-center px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 hover:bg-white/5"
                onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--color-primary)'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--color-text-secondary)'}
                aria-expanded="false"
                aria-haspopup="true"
                aria-label="Menú de soluciones"
              >
                Soluciones
                <svg className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <div className="relative group">
              <button 
                className="theme-text-secondary theme-transition flex items-center px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 hover:bg-white/5"
                onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--color-primary)'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--color-text-secondary)'}
                aria-expanded="false"
                aria-haspopup="true"
                aria-label="Menú de recursos"
              >
                Recursos
                <svg className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <Link 
              to="/proyectos" 
              className="theme-text-secondary theme-transition px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 hover:bg-white/5"
              onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--color-text-secondary)'}>
              Proyectos destacados
            </Link>
          </nav>

          {/* Auth Buttons - Derecha */}
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
                <button 
                  className="px-4 py-2 theme-text-secondary theme-transition font-medium rounded focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 hover:bg-white/5 active:scale-95 transform transition-all duration-200"
                  onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--color-primary)'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--color-text-secondary)'}
                  aria-label="Iniciar sesión en tu cuenta"
                >
                  Iniciar Sesión
                </button>
              </SignInButton>
              
              {/* Botón Registrarse */}
              <SignUpButton mode="modal">
                <button 
                  className="px-6 py-2.5 rounded-full text-white theme-transition font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transform hover:scale-105 active:scale-95 transition-all duration-300"
                  style={{ 
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                    boxShadow: `0 10px 25px -3px color-mix(in srgb, var(--color-primary) 20%, transparent), 0 4px 6px -2px color-mix(in srgb, var(--color-primary) 5%, transparent)`
                  }}
                  aria-label="Crear una cuenta nueva"
                >
                  Registrarse
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              {/* Avatar del Usuario */}
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 rounded-full border-2 border-purple-400",
                    userButtonPopoverCard: "shadow-lg border",
                    userButtonPopoverMain: "p-0"
                  }
                }}
                userProfileProps={{
                  additionalOAuthScopes: {},
                  appearance: {
                    elements: {
                      navbarButton: "text-sm font-medium px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                    }
                  }
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="🚀 Ir al Dashboard"
                    labelIcon={<span>🚀</span>}
                    href="/dashboard"
                  />
                  <UserButton.Action 
                    label="Gestionar cuenta" 
                    labelIcon={<span>⚙️</span>}
                    onClick={() => {/* Manejo por defecto */}} 
                  />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>

            {/* Botón Contacto */}
            <Link 
              to="/contacto"
              className="px-3 py-1.5 rounded-full transition-all duration-300 font-medium text-sm gradient-border-button"
              style={{
                '--gradient-border': 'var(--color-contact-border)',
                '--gradient-border-hover': 'var(--color-contact-hover-bg)',
                color: 'var(--color-contact-text)',
                backgroundColor: 'transparent'
              } as React.CSSProperties & { [key: string]: string }}
            >
              CONTÁCTENOS
            </Link>
          </div>

          {/* Mobile Controls - Avatar y Theme Toggle */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Theme Toggle Button - Móvil */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg theme-text-secondary theme-transition hover:bg-white/10"
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

            {/* User Avatar */}
            <SignedIn>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 rounded-full border-2 border-purple-400"
                  }
                }}
                userProfileProps={{
                  additionalOAuthScopes: {},
                  appearance: {
                    elements: {
                      navbarButton: "text-sm font-medium px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                    }
                  }
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="🚀 Ir al Dashboard"
                    labelIcon={<span>🚀</span>}
                    href="/dashboard"
                  />
                  <UserButton.Action 
                    label="Gestionar cuenta" 
                    labelIcon={<span>⚙️</span>}
                    onClick={() => {/* Manejo por defecto */}} 
                  />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white flex items-center justify-center">
                  <span className="text-sm">👤</span>
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>

        {/* Segunda Fila - Navegación Móvil */}
        <div className="md:hidden px-2 py-3 border-t border-white/10">
          {/* Primera fila de navegación */}
          <nav className="flex items-center justify-center space-x-6 text-xs mb-2">
            <Link to="/" className="text-gray-200 hover:text-white transition-colors font-medium">
              Inicio
            </Link>
            <Link to="/nosotros" className="text-gray-400 hover:text-gray-200 transition-colors">
              Nosotros
            </Link>
            <Link to="/soluciones" className="text-gray-400 hover:text-gray-200 transition-colors">
              Soluciones
            </Link>
            <Link to="/recursos" className="text-gray-400 hover:text-gray-200 transition-colors">
              Recursos
            </Link>
          </nav>

          {/* Segunda fila - Proyectos destacados y Contáctanos */}
          <div className="flex items-center justify-center space-x-6 text-xs">
            <Link to="/proyectos" className="text-gray-400 hover:text-gray-200 transition-colors">
              Proyectos destacados
            </Link>
            <Link 
              to="/contacto"
              className="px-2.5 py-0.5 rounded-full transition-all duration-300 font-medium gradient-border-button"
              style={{
                '--gradient-border': 'var(--color-contact-border)',
                '--gradient-border-hover': 'var(--color-contact-hover-bg)',
                color: 'var(--color-contact-text)',
                backgroundColor: 'transparent',
                padding: '0.375rem 0.625rem'
              } as React.CSSProperties & { [key: string]: string }}
            >
              CONTÁCTANOS
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
