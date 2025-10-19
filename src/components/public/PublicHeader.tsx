import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useClerkDetection } from '../../hooks/useClerkDetection';
import Logo from '../Logo';
import '../../styles/gradient-borders.css';

/**
 * Header optimizado para páginas públicas con detección progresiva de usuario
 * 
 * Características:
 * - Carga inicial rápida sin bloqueo por Clerk
 * - Detección progresiva del estado de autenticación
 * - Avatar real del usuario cuando Clerk está disponible
 * - Fallback a iniciales si no hay imagen
 * - Indicador visual de carga
 * - Botón "Contáctanos" temático
 * - Responsive design
 * 
 * Flujo de funcionamiento:
 * 1. Carga inicial: Header básico sin autenticación
 * 2. Detección progresiva: Verifica si Clerk está disponible
 * 3. Carga dinámica: Obtiene datos reales del usuario
 * 4. Actualización: Muestra avatar al lado del cambio de tema
 */
const PublicHeaderOptimized = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  // Estado removido - no necesitamos menú móvil desplegable
  
  // Hook personalizado para detectar usuario de Clerk
  const { userData, getUserInitials } = useClerkDetection();

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 theme-transition transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`} 
      style={{
        backgroundColor: lastScrollY > 50 ? 'rgba(15, 23, 42, 0.95)' : 'transparent',
        backdropFilter: lastScrollY > 50 ? 'blur(10px)' : 'none'
      }}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center h-auto sm:h-20">
          {/* Fila 1 Mobile: Logo centrado + Toggle tema derecha | Desktop: Logo izquierda */}
          <div className="flex justify-between items-center sm:justify-start py-4 sm:py-0">
            {/* Espaciador invisible en móvil para centrar logo */}
            <div className="w-10 sm:hidden"></div>
            
            <Link 
              to="/" 
              aria-label="Scuti Company - Ir al inicio"
              className="flex items-center transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 rounded-lg"
            >
              <Logo size="md" animated compact />
            </Link>

            {/* Theme Toggle - Derecha en móvil, se mueve a actions en desktop */}
            <div className="sm:hidden">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg theme-text-secondary hover:bg-white/5"
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
            </div>
          </div>

          {/* Fila 2 Mobile: Navegación horizontal | Desktop: Navegación centro */}
          <nav className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 py-3 sm:py-0 sm:space-x-8" role="navigation" aria-label="Navegación principal">
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
              onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--color-text-secondary)'}
            >
              Nosotros
            </Link>
            <div className="relative group">
              <button 
                className="theme-text-secondary theme-transition flex items-center px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 hover:bg-white/5"
                onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--color-primary)'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--color-text-secondary)'}
                aria-label="Menú de soluciones"
              >
                Soluciones
                <svg className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <div className="relative group">
              <button 
                className="theme-text-secondary theme-transition flex items-center px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 hover:bg-white/5"
                onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--color-primary)'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--color-text-secondary)'}
                aria-label="Menú de recursos"
              >
                Recursos
                <svg className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <Link 
              to="/proyectos" 
              className="theme-text-secondary theme-transition px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 hover:bg-white/5"
              onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--color-text-secondary)'}
            >
              Proyectos destacados
            </Link>
            
            {/* CONTÁCTANOS - Color rosado en tema blanco */}
            <Link 
              to="/contacto"
              className="px-4 py-2 rounded-full transition-all duration-300 font-medium text-sm border-2"
              style={{
                borderColor: theme === 'light' ? '#7528ee' : '#7528ee', // Rosado en light, violeta en dark
                color: theme === 'light' ? '#7528ee' : '#7528ee', // Rosado en light, violeta en dark
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                const element = e.target as HTMLElement;
                element.style.backgroundColor = theme === 'light' ? '#7528ee' : '#7528ee';
                element.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                const element = e.target as HTMLElement;
                element.style.backgroundColor = 'transparent';
                element.style.color = theme === 'light' ? '#7528ee' : '#7528ee';
              }}
            >
              CONTÁCTANOS
            </Link>
          </nav>

          {/* Actions Desktop - Solo visible en desktop */}
          <div className="hidden sm:flex items-center space-x-4">
            {/* Theme Toggle Desktop */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg theme-text-secondary theme-transition hover:bg-white/5"
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

            {/* Avatar del usuario - Solo si está logueado */}
            {userData ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    console.log('🚀 Redirigiendo al dashboard...');
                    navigate('/dashboard');
                  }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg theme-bg-card border theme-border hover:bg-white/5 transition-all duration-200 group"
                  aria-label={`Dashboard de ${userData.firstName || 'Usuario'}`}
                  title={`Ir al dashboard - ${userData.firstName || 'Usuario'}`}
                >
                  {/* Avatar con imagen real o iniciales */}
                  {userData.imageUrl ? (
                    <img 
                      src={userData.imageUrl} 
                      alt={`Avatar de ${userData.firstName || 'Usuario'}`}
                      className="w-8 h-8 rounded-full object-cover border-2 border-purple-500/20 group-hover:border-purple-500/40 transition-all duration-200"
                      onError={(e) => {
                        // Si falla la imagen, mostrar iniciales
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  
                  {/* Fallback con iniciales */}
                  <div 
                    className={`w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center text-white font-medium text-sm border-2 border-purple-500/20 group-hover:border-purple-500/40 transition-all duration-200 ${
                      userData.imageUrl ? 'hidden' : ''
                    }`}
                  >
                    {getUserInitials()}
                  </div>
                  
                  {/* Flecha indicadora */}
                  <svg className="w-4 h-4 theme-text-secondary group-hover:text-purple-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>


              </div>
            ) : null}
          </div>
        </div>
      </div>

    </header>
  );
};

export default PublicHeaderOptimized;
