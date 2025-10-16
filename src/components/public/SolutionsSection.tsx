import React from 'react';
import { Link } from 'react-router-dom';
import { SignUpButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import DOMPurify from 'dompurify';
import { useTheme } from '../../contexts/ThemeContext';

interface SolutionItem {
  icon: React.ReactNode | string;
  title: string;
  description: string;
  gradient: string;
}

interface SolutionsData {
  title: string;
  description: string;
  backgroundImage?: {
    light?: string;
    dark?: string;
  };
  backgroundImageAlt?: string;
  styles?: {
    light: {
      titleColor?: string;
      descriptionColor?: string;
    };
    dark: {
      titleColor?: string;
      descriptionColor?: string;
    };
  };
  items?: SolutionItem[];
}

interface SolutionsSectionProps {
  data?: SolutionsData;
}

const SolutionsSection = ({ data }: SolutionsSectionProps) => {
  const { theme } = useTheme();
  
  // Datos por defecto
  const solutionsData: SolutionsData = data || {
    title: 'Soluciones',
    description: 'En el dinámico entorno empresarial de hoy, la tecnología es la columna vertebral del éxito. Impulsa la innovación, seguridad y el crecimiento de tu negocio.',
    items: []
  };

  // Obtener la imagen correcta según el tema activo
  const getCurrentBackgroundImage = () => {
    if (!solutionsData.backgroundImage) return null;
    
    // Si es un string (formato anterior), usarlo como fallback
    if (typeof solutionsData.backgroundImage === 'string') {
      return solutionsData.backgroundImage;
    }
    
    // Usar imagen del tema activo, con fallback a la otra si no existe
    if (theme === 'light') {
      return solutionsData.backgroundImage.light || solutionsData.backgroundImage.dark || null;
    } else {
      return solutionsData.backgroundImage.dark || solutionsData.backgroundImage.light || null;
    }
  };

  const currentBackgroundImage = getCurrentBackgroundImage();

  const defaultSolutions: SolutionItem[] = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Soluciones Digitales',
      description: 'Transformamos tu negocio con estrategias digitales innovadoras y plataformas web de alto rendimiento.',
      gradient: 'from-purple-500 to-purple-700'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      title: 'Proyectos de Software',
      description: 'Desarrollamos software a medida con las últimas tecnologías para optimizar tus procesos empresariales.',
      gradient: 'from-cyan-500 to-cyan-700'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'Modelos de IA',
      description: 'Implementamos inteligencia artificial personalizada para automatizar y potenciar tu empresa.',
      gradient: 'from-amber-500 to-amber-700'
    }
  ];

  // Usar items de data si existen, sino usar defaultSolutions
  const solutions = (solutionsData.items && solutionsData.items.length > 0) 
    ? solutionsData.items 
    : defaultSolutions;

  return (
    <section className="relative py-20 theme-transition"
             style={{
               background: `linear-gradient(to bottom, color-mix(in srgb, var(--color-card-bg) 95%, var(--color-primary)), var(--color-card-bg))`
             }}>
      
      {/* Background Image (si existe) */}
      {currentBackgroundImage && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 ease-in-out"
            style={{
              backgroundImage: `url(${currentBackgroundImage})`,
              opacity: 0.08
            }}
            role="img"
            aria-label={solutionsData.backgroundImageAlt || 'Solutions background'}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent backdrop-blur-[2px]" />
        </>
      )}

      {/* Section Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <div
          className="text-4xl sm:text-5xl font-bold theme-text-primary mb-4 theme-transition"
          style={{
            color: solutionsData.styles?.[theme]?.titleColor || undefined
          }}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(solutionsData.title) }}
        />
        <div className="max-w-3xl mx-auto">
          <div
            className="text-xl theme-text-secondary theme-transition"
            style={{
              color: solutionsData.styles?.[theme]?.descriptionColor || undefined
            }}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(solutionsData.description) }}
          />
        </div>
      </div>

      {/* Solutions Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="group relative theme-bg-card backdrop-blur-sm rounded-2xl p-8 theme-border theme-transition hover:transform hover:-translate-y-2"
              style={{ 
                animationDelay: `${index * 100}ms`,
                borderWidth: '1px',
                borderColor: `color-mix(in srgb, var(--color-primary) 20%, transparent)`,
                transition: 'all 0.3s ease, border-color 0.3s ease, transform 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `color-mix(in srgb, var(--color-primary) 50%, transparent)`;
                e.currentTarget.style.boxShadow = `0 20px 40px -5px color-mix(in srgb, var(--color-primary) 20%, transparent)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `color-mix(in srgb, var(--color-primary) 20%, transparent)`;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300"
                   style={{
                     background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))`
                   }}></div>
              
              {/* Icon */}
              <div className="relative mb-6 w-16 h-16 rounded-xl p-0.5"
                   style={{
                     background: `linear-gradient(135deg, var(--color-primary), var(--color-secondary))`
                   }}>
                <div className="w-full h-full theme-bg-background rounded-xl flex items-center justify-center theme-text-primary">
                  {typeof solution.icon === 'string' ? (
                    <span className="text-3xl">{solution.icon}</span>
                  ) : (
                    solution.icon
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="relative">
                <div
                  className="text-2xl font-bold theme-text-primary mb-4 theme-transition"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(solution.title) }}
                />
                <div
                  className="theme-text-secondary leading-relaxed theme-transition"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(solution.description) }}
                />
              </div>

              {/* Arrow Indicator */}
              <div className="relative mt-6 flex items-center text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-medium mr-2">Conocer más</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center">
        <p className="text-gray-400 mb-6">¿Listo para transformar tu empresa?</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Botón principal */}
          <Link 
            to="/contacto"
            className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
          >
            Solicitar Consultoría Gratuita
          </Link>

          {/* Botones según estado de autenticación */}
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="px-8 py-3 rounded-full border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white transition-all duration-300 font-semibold">
                Crear Cuenta Gratis
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link 
              to="/dashboard"
              className="px-8 py-3 rounded-full border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white transition-all duration-300 font-semibold flex items-center justify-center space-x-2"
            >
              <span>🎯</span>
              <span>Acceder al Panel</span>
            </Link>
          </SignedIn>
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
