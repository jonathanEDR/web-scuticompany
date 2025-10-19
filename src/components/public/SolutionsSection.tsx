import React from 'react';
import DOMPurify from 'dompurify';
import { useTheme } from '../../contexts/ThemeContext';
import { DEFAULT_SOLUTIONS_CONFIG } from '../../utils/defaultConfig';
import type { CardDesignStyles } from '../../types/cms';

interface SolutionItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconLight?: string;
  iconDark?: string;
}

interface SolutionsData {
  title: string;
  subtitle: string;
  backgroundImage: {
    light: string;
    dark: string;
  };
  backgroundImageAlt: string;
  cards: SolutionItem[];
}

interface SolutionsSectionProps {
  data?: SolutionsData;
}

const SolutionsSection = ({ data }: SolutionsSectionProps) => {
  const { theme } = useTheme();

  // Usar SOLO defaultConfig.ts como fuente única de verdad
  const solutionsData: SolutionsData = data || DEFAULT_SOLUTIONS_CONFIG;

  // Valores por defecto para el diseño de tarjetas - Colores según maqueta
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
    iconColor: '#7528ee', // Color violeta para iconos según maqueta
    titleColor: '#333333', // Color específico de la maqueta para títulos
    descriptionColor: '#6B7280', // Gris medio más legible
    linkColor: '#7528ee', // Violeta para enlaces
    cardMinWidth: '200px',
    cardMaxWidth: '100%',
    cardMinHeight: 'auto',
    cardPadding: '2rem',
    iconBorderEnabled: false,
    iconAlignment: 'center'
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
    iconBorderEnabled: false,
    iconAlignment: 'center'
  };

  // Obtener estilos actuales según el tema
  const cardStyles = theme === 'light' ? defaultLightStyles : defaultDarkStyles;

  // Obtener la imagen correcta según el tema activo
  const getCurrentBackgroundImage = () => {
    if (!solutionsData.backgroundImage) return null;
    
    // Usar imagen del tema activo
    return theme === 'light' 
      ? solutionsData.backgroundImage.light 
      : solutionsData.backgroundImage.dark;
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
    
    // Prioridad 3: Usar icon como fallback (siempre será string en defaultConfig)
    if (solution.icon) {
      const iconType = isImageUrl(solution.icon) ? 'image' : 'emoji';
      return { type: iconType, value: solution.icon };
    }
    
    // Fallback: No icon
    return { type: 'none', value: null };
  };

  const currentBackgroundImage = getCurrentBackgroundImage();

  // Usar items directamente de solutionsData (que ya viene de defaultConfig)
  const solutions = solutionsData.cards || [];

  return (
    <section className="relative py-20 theme-transition"
             style={{
               background: `linear-gradient(to bottom, color-mix(in srgb, var(--color-card-bg) 95%, var(--color-primary)), var(--color-card-bg))`
             }}>
      
      {/* Background Image (si existe) - CALIDAD HD SIN FILTROS */}
      {currentBackgroundImage && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 ease-in-out"
            style={{
              backgroundImage: `url(${currentBackgroundImage})`,
              opacity: 1  // 100% opacidad - calidad HD total
            }}
            role="img"
            aria-label={solutionsData.backgroundImageAlt || 'Solutions background'}
          />
          {/* SIN OVERLAY - imagen pura HD */}
        </>
      )}

      {/* Section Header - SIN SOMBRAS, colores según maqueta */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <div
          className="text-4xl sm:text-5xl font-bold mb-4 theme-transition"
          style={{
            color: theme === 'light' 
              ? '#333333' // Color específico de la maqueta para tema claro
              : '#FFFFFF', // Blanco para tema oscuro
            fontWeight: '700'
          }}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(solutionsData.title) }}
        />
        <div className="max-w-3xl mx-auto">
          <div
            className="text-xl theme-transition"
            style={{
              color: theme === 'light' 
                ? '#7528ee' // Color violeta específico de la maqueta
                : '#D1D5DB', // Gris claro para tema oscuro
              fontWeight: '400',
              lineHeight: '1.6'
            }}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(solutionsData.subtitle) }}
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
                // SIN backdrop-filter para máxima nitidez
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

        {/* Botón "Ver más..." según maqueta */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center">
          <button
            className="group relative px-8 py-3 rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75"
            style={{
              background: 'linear-gradient(135deg, #01c2cc 0%, #7528ee 100%)',
              color: '#FFFFFF',
              fontWeight: '600',
              fontSize: '0.875rem',
              boxShadow: '0 4px 15px rgba(117, 40, 238, 0.3)'
            }}
            onClick={() => {
              console.log('🔗 Ver más soluciones...');
              // Aquí puedes agregar navegación o modal
            }}
          >
            <span className="relative flex items-center space-x-2">
              <span>Ver más...</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
