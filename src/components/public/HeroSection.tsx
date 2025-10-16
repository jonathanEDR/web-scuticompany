import { Link } from 'react-router-dom';
import { SignUpButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/gradient-borders.css';

interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage?: {
    light?: string;
    dark?: string;
  };
  backgroundImageAlt?: string;
}

// Interfaz ButtonTheme removida ya que no se utiliza

// Interfaz ExtendedTheme removida ya que no se utiliza

interface HeroSectionProps {
  data?: HeroData;
}

// Constantes removidas ya que no se utilizan

const HeroSection = ({ data }: HeroSectionProps) => {
  // Estados para animaciones progresivas
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const { theme: currentTheme } = useTheme();

  // Obtener la imagen correcta según el tema activo
  const getCurrentBackgroundImage = () => {
    if (!data?.backgroundImage) return null;
    
    // Si es un string (formato anterior), usarlo como fallback
    if (typeof data.backgroundImage === 'string') {
      return data.backgroundImage;
    }
    
    // Usar imagen del tema activo, con fallback a la otra si no existe
    if (currentTheme === 'light') {
      return data.backgroundImage.light || data.backgroundImage.dark || null;
    } else {
      return data.backgroundImage.dark || data.backgroundImage.light || null;
    }
  };

  const currentBackgroundImage = getCurrentBackgroundImage();

  // Función helper removida ya que no se utiliza

  // Datos por defecto si no se proporcionan
  const heroData: HeroData = data || {
    title: 'Transformamos tu empresa con tecnología inteligente',
    subtitle: 'Innovamos para que tu empresa avance al ritmo de la tecnología.',
    description: 'Transformamos procesos con soluciones digitales, proyectos de software y modelos de IA personalizados.',
    ctaText: 'Conoce nuestros servicios',
    ctaLink: '#servicios'
  };

  // Animación progresiva al cargar el componente
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    const phases = [
      setTimeout(() => setAnimationPhase(1), 300),
      setTimeout(() => setAnimationPhase(2), 600),
      setTimeout(() => setAnimationPhase(3), 900),
    ];
    return () => {
      clearTimeout(timer);
      phases.forEach(clearTimeout);
    };
  }, []);

  return (
    <section className="relative overflow-hidden theme-transition"
             style={{
               background: `linear-gradient(135deg, var(--color-background), color-mix(in srgb, var(--color-primary) 10%, var(--color-background)), var(--color-background))`,
               minHeight: '100vh',
               height: '100vh'
             }}>
      
      {/* Background Image (si existe) */}
      {currentBackgroundImage && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 ease-in-out"
            style={{
              backgroundImage: `url(${currentBackgroundImage})`,
              opacity: 0.85
            }}
            role="img"
            aria-label={data?.backgroundImageAlt || 'Hero background'}
          />
          {/* Overlay muy sutil para mejorar legibilidad del texto */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5" />
        </>
      )}

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, color-mix(in srgb, var(--color-primary) 40%, transparent) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          animation: 'backgroundScroll 20s linear infinite'
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col justify-end items-center" 
           style={{ 
             paddingTop: '40vh',
             paddingBottom: '15vh',
             minHeight: '100vh'
           }}>
        <div className={`space-y-2 sm:space-y-3 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Main Title - Optimizado para móvil con animación progresiva */}
          <div className="max-w-3xl mx-auto">
            <h1 className={`text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold theme-text-primary theme-transition transition-all duration-1000 ${
              animationPhase >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} 
                style={{ lineHeight: '1.2' }}>
              <span className="block">{heroData.title}</span>
            </h1>
          </div>

          {/* Subtitle - Optimizado para móvil con animación escalonada */}
          <div className="max-w-2xl mx-auto space-y-2">
            <p className={`text-sm sm:text-sm md:text-base theme-text-primary theme-transition transition-all duration-1000 delay-300 ${
              animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`} 
               style={{ lineHeight: '1.4' }}>
              {heroData.subtitle}
            </p>
            <p className={`text-xs sm:text-xs md:text-sm theme-text-secondary theme-transition transition-all duration-1000 delay-500 ${
              animationPhase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`} 
               style={{ lineHeight: '1.5' }}>
              {heroData.description}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-row gap-2 justify-center items-center pt-2 sm:pt-3">
            {/* Botón principal de servicios */}
            <Link
              to={heroData.ctaLink}
              role="button"
              aria-label={`${heroData.ctaText} - Ir a la sección de servicios`}
              className={`group relative px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full overflow-hidden theme-transition transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition-all duration-300 ${
                animationPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{
                background: 'var(--color-cta-bg)',
                color: 'var(--color-cta-text)',
                backgroundSize: '200% 100%',
                animation: 'gradientShift 3s ease-in-out infinite'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = 'var(--color-cta-hover-bg)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = 'var(--color-cta-bg)';
              }}
            >
              <div className="absolute inset-0 blur-xl opacity-50 group-hover:opacity-75 transition-all duration-300"
                   style={{
                     background: 'var(--color-cta-bg)',
                     backgroundSize: '200% 100%'
                   }}></div>
              <span className="relative font-medium text-xs sm:text-sm flex items-center space-x-1.5">
                <span>{heroData.ctaText}</span>
                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>

            {/* Botones de autenticación */}
            <SignedOut>
              <SignUpButton mode="modal">
                <button 
                  aria-label="Comenzar gratis - Crear cuenta nueva"
                  className={`group relative px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full border-2 theme-transition font-medium text-xs sm:text-sm transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition-all duration-300 ${
                    animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{
                    borderColor: 'var(--color-primary)',
                    color: 'var(--color-primary)',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = 'var(--color-primary)';
                    (e.target as HTMLElement).style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = 'transparent';
                    (e.target as HTMLElement).style.color = 'var(--color-primary)';
                  }}>
                  <span className="flex items-center space-x-2">
                    <span role="img" aria-label="Cohete">🚀</span>
                    <span className="hidden sm:inline">Comenzar Gratis</span>
                  </span>
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <Link
                to="/dashboard"
                role="button"
                aria-label="Ir al Dashboard - Acceder a tu panel de control"
                className={`group relative px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 transform hover:scale-105 active:scale-95 transition-all duration-300 font-medium text-xs sm:text-sm ${
                  animationPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{
                  background: 'var(--color-dashboard-bg)',
                  color: 'var(--color-dashboard-text)',
                  borderColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = 'var(--color-dashboard-hover-bg)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = 'var(--color-dashboard-bg)';
                }}
              >
                <span className="flex items-center space-x-2">
                  <span role="img" aria-label="Objetivo">🎯</span>
                  <span className="hidden sm:inline">Ir al Dashboard</span>
                </span>
              </Link>
            </SignedIn>
          </div>

          {/* Scroll Indicator Dots */}
          <div className="flex justify-center space-x-1.5 pt-3">
            <div className="w-1 h-1 rounded-full bg-purple-400"></div>
            <div className="w-1 h-1 rounded-full bg-gray-600"></div>
            <div className="w-1 h-1 rounded-full bg-gray-600"></div>
            <div className="w-1 h-1 rounded-full bg-gray-600"></div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator con accesibilidad */}
      <button 
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 rounded-full p-2 transition-all duration-300 ${
          animationPhase >= 3 ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        aria-label="Desplazarse hacia abajo para ver más contenido"
      >
        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {/* CSS for enhanced animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes backgroundScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(40px); }
        }
        
        /* Smooth focus transitions */
        .focus-ring {
          transition: box-shadow 0.2s ease-in-out;
        }
        
        /* Improved button interactions */
        .button-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        /* Reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
