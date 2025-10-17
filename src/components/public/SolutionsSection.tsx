import React from 'react';
import DOMPurify from 'dompurify';
import { useTheme } from '../../contexts/ThemeContext';
import type { CardDesignStyles } from '../../types/cms';

interface SolutionItem {
  iconLight?: string;  // URL del icono para tema claro (PNG)
  iconDark?: string;   // URL del icono para tema oscuro (PNG)
  // Mantener para compatibilidad
  icon?: React.ReactNode | string;
  iconUrl?: string;
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
  cardsDesign?: {
    light: CardDesignStyles;
    dark: CardDesignStyles;
  };
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

  // Valores por defecto para el diseño de tarjetas
  const defaultLightStyles: CardDesignStyles = {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    borderWidth: '1px',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    hoverBackground: 'rgba(255, 255, 255, 0.15)',
    hoverBorder: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
    hoverShadow: '0 20px 40px rgba(139, 92, 246, 0.2)',
    iconGradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    iconBackground: 'rgba(255, 255, 255, 0.9)',
    iconColor: '#1f2937',
    titleColor: '#1f2937',
    descriptionColor: '#4b5563',
    linkColor: '#a78bfa',
    cardMinWidth: '280px',
    cardMaxWidth: '100%',
    cardMinHeight: 'auto',
    cardPadding: '2rem',
    iconBorderEnabled: true,
    iconAlignment: 'left'
  };

  const defaultDarkStyles: CardDesignStyles = {
    background: 'rgba(0, 0, 0, 0.3)',
    border: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    borderWidth: '2px',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    hoverBackground: 'rgba(0, 0, 0, 0.4)',
    hoverBorder: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
    hoverShadow: '0 20px 40px rgba(139, 92, 246, 0.3)',
    iconGradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    iconBackground: 'rgba(17, 24, 39, 0.8)',
    iconColor: '#ffffff',
    titleColor: '#ffffff',
    descriptionColor: '#d1d5db',
    linkColor: '#a78bfa',
    cardMinWidth: '280px',
    cardMaxWidth: '100%',
    cardMinHeight: 'auto',
    cardPadding: '2rem',
    iconBorderEnabled: true,
    iconAlignment: 'left'
  };

  // Obtener estilos actuales según el tema
  const cardStyles = theme === 'light'
    ? {
        ...defaultLightStyles,
        ...(solutionsData.cardsDesign?.light || {}),
        // Asegurar que iconAlignment tenga un valor por defecto si no existe
        iconAlignment: solutionsData.cardsDesign?.light?.iconAlignment || 'left'
      }
    : {
        ...defaultDarkStyles,
        ...(solutionsData.cardsDesign?.dark || {}),
        // Asegurar que iconAlignment tenga un valor por defecto si no existe
        iconAlignment: solutionsData.cardsDesign?.dark?.iconAlignment || 'left'
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

  // Función helper para detectar si un string es una URL de imagen
  const isImageUrl = (str: string): boolean => {
    return str.startsWith('http://') || str.startsWith('https://') || str.startsWith('/');
  };

  // Obtener el icono correcto según el tema activo
  const getCurrentIcon = (solution: SolutionItem): { type: 'image' | 'emoji' | 'component' | 'none', value: string | React.ReactNode | null } => {
    // Prioridad 1: iconLight/iconDark según tema activo
    if (theme === 'light' && solution.iconLight) {
      const iconType = isImageUrl(solution.iconLight) ? 'image' : 'emoji';
      return { type: iconType, value: solution.iconLight };
    }
    if (theme === 'dark' && solution.iconDark) {
      const iconType = isImageUrl(solution.iconDark) ? 'image' : 'emoji';
      return { type: iconType, value: solution.iconDark };
    }
    
    // Prioridad 2: Fallback al icono del otro tema si el actual no existe
    if (theme === 'light' && solution.iconDark) {
      const iconType = isImageUrl(solution.iconDark) ? 'image' : 'emoji';
      return { type: iconType, value: solution.iconDark };
    }
    if (theme === 'dark' && solution.iconLight) {
      const iconType = isImageUrl(solution.iconLight) ? 'image' : 'emoji';
      return { type: iconType, value: solution.iconLight };
    }
    
    // Prioridad 3: Compatibilidad con formato anterior
    if (solution.iconUrl) {
      return { type: 'image', value: solution.iconUrl };
    }
    if (solution.icon) {
      return { 
        type: typeof solution.icon === 'string' ? 'emoji' : 'component', 
        value: solution.icon 
      };
    }
    
    // Fallback: No icon
    return { type: 'none', value: null };
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
              opacity: theme === 'dark' ? 0.65 : 0.85  // Más nitidez en ambos modos
            }}
            role="img"
            aria-label={solutionsData.backgroundImageAlt || 'Solutions background'}
          />
          {/* Overlay condicional según tema */}
          {theme === 'dark' ? (
            // Modo oscuro: overlay muy sutil para mantener contraste del texto
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
          ) : (
            // Modo claro: sin overlay, imagen pura
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/10" />
          )}
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
              className="group relative rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-2 overflow-hidden"
              style={{
                animationDelay: `${index * 100}ms`,
                background: cardStyles.background,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: cardStyles.shadow,
                minWidth: cardStyles.cardMinWidth || '280px',
                maxWidth: cardStyles.cardMaxWidth || '100%',
                minHeight: cardStyles.cardMinHeight || 'auto',
                padding: cardStyles.cardPadding || '2rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                const card = e.currentTarget;
                card.style.background = cardStyles.hoverBackground;
                card.style.boxShadow = cardStyles.hoverShadow;
                const borderEl = card.querySelector('.card-border') as HTMLElement;
                if (borderEl) {
                  borderEl.style.background = cardStyles.hoverBorder;
                }
              }}
              onMouseLeave={(e) => {
                const card = e.currentTarget;
                card.style.background = cardStyles.background;
                card.style.boxShadow = cardStyles.shadow;
                const borderEl = card.querySelector('.card-border') as HTMLElement;
                if (borderEl) {
                  borderEl.style.background = cardStyles.border;
                }
              }}
            >
              {/* Borde con soporte para degradados */}
              <div 
                className="card-border absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300"
                style={{
                  background: cardStyles.border,
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  padding: cardStyles.borderWidth
                }}
              />
              
              {/* Icon - Condicional con/sin borde y por tema */}
              {(() => {
                const currentIcon = getCurrentIcon(solution);
                
                // Renderizar contenido del icono basado en el tipo
                const renderIconContent = () => {
                  switch (currentIcon.type) {
                    case 'image':
                      return (
                        <img 
                          src={currentIcon.value as string} 
                          alt={solution.title} 
                          className="w-12 h-12 object-contain"
                        />
                      );
                    case 'emoji':
                      return (
                        <span 
                          className="text-3xl leading-none flex items-center justify-center"
                          style={{ 
                            fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
                            textRendering: 'optimizeLegibility'
                          }}
                        >
                          {currentIcon.value as string}
                        </span>
                      );
                    case 'component':
                      return currentIcon.value as React.ReactNode;
                    default:
                      return <span className="text-3xl">📄</span>; // Fallback icon
                  }
                };

                // Obtener clases de alineación
                const getAlignmentClasses = () => {
                  const alignment = cardStyles.iconAlignment || 'left';
                  switch (alignment) {
                    case 'center':
                      return 'mx-auto';
                    case 'right':
                      return 'ml-auto';
                    case 'left':
                    default:
                      return 'mr-auto';
                  }
                };

                // Renderizar con o sin borde
                return cardStyles.iconBorderEnabled === true ? (
                  // Con borde gradiente
                  <div className={`relative mb-6 w-16 h-16 rounded-xl p-0.5 ${getAlignmentClasses()}`}
                       style={{
                         background: cardStyles.iconGradient
                       }}>
                    <div
                      className="w-full h-full rounded-xl flex items-center justify-center"
                      style={{
                        background: cardStyles.iconBackground,
                        // Solo aplicar color si no es emoji
                        color: currentIcon.type === 'emoji' ? 'inherit' : cardStyles.iconColor
                      }}
                    >
                      {renderIconContent()}
                    </div>
                  </div>
                ) : (
                  // Sin borde - icono directo
                  <div className={`relative mb-6 w-16 h-16 flex items-center justify-center ${getAlignmentClasses()}`}
                       style={{
                         // Solo aplicar color si no es emoji
                         color: currentIcon.type === 'emoji' ? 'inherit' : cardStyles.iconColor
                       }}>
                    {renderIconContent()}
                  </div>
                );
              })()}

              {/* Content */}
              <div className="relative">
                <div
                  className="text-2xl font-bold mb-4 transition-colors"
                  style={{
                    color: cardStyles.titleColor
                  }}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(solution.title) }}
                />
                <div
                  className="leading-relaxed transition-colors"
                  style={{
                    color: cardStyles.descriptionColor
                  }}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(solution.description) }}
                />
              </div>

              {/* Arrow Indicator */}
              <div
                className="relative mt-6 flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: cardStyles.linkColor }}
              >
                <span className="text-sm font-medium mr-2">Conocer más</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
