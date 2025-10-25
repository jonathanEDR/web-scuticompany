import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { useTheme } from '../../contexts/ThemeContext';
import { DEFAULT_VALUE_ADDED_CONFIG } from '../../utils/defaultConfig';
import type { CardDesignStyles, LogosBarDesignStyles } from '../../types/cms';

interface ValueAddedItem {
  id?: string;
  title: string;
  description: string;
  iconLight?: string;
  iconDark?: string;
  gradient?: string;
  _id?: any; // Para compatibilidad con MongoDB
  styles?: {
    light?: {
      titleColor?: string;
      descriptionColor?: string;
    };
    dark?: {
      titleColor?: string;
      descriptionColor?: string;
    };
  };
}

interface ValueAddedLogo {
  _id?: string;
  name: string;
  imageUrl: string;
  alt: string;
  link?: string;
  order?: number;
}

interface ValueAddedData {
  title: string;
  subtitle?: string; // Opcional para compatibilidad con defaultConfig
  description?: string; // Del CMS
  showIcons?: boolean; // Controla si se muestran los iconos
  backgroundImage: {
    light: string;
    dark: string;
  };
  backgroundImageAlt: string;
  cards?: ValueAddedItem[]; // Del defaultConfig
  items?: ValueAddedItem[]; // Del CMS
  logos?: ValueAddedLogo[]; // Del CMS
  cardsDesign?: {
    light: CardDesignStyles;
    dark: CardDesignStyles;
  };
  logosBarDesign?: {
    light: LogosBarDesignStyles;
    dark: LogosBarDesignStyles;
  };
  styles?: {
    light?: {
      titleColor?: string;
      descriptionColor?: string;
    };
    dark?: {
      titleColor?: string;
      descriptionColor?: string;
    };
  };
}

interface ValueAddedSectionProps {
  data?: ValueAddedData;
  themeConfig?: any; // Simplificado para evitar conflictos de tipos
}



const ValueAddedSection = ({ data }: ValueAddedSectionProps) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  // ⚡ Priorizar datos del CMS sobre defaultConfig
  const valueAddedData: ValueAddedData = data || DEFAULT_VALUE_ADDED_CONFIG;

  // Animación al cargar
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Mapear datos del CMS a estructura esperada
  const getMappedValueAddedData = () => {
    // Si tenemos datos del CMS (con 'items'), mapear a estructura esperada
    if (valueAddedData.items) {
      return {
        ...valueAddedData,
        // Mapear 'description' del CMS a 'subtitle' para compatibilidad
        subtitle: valueAddedData.description || valueAddedData.subtitle || '',
        // Usar 'items' del CMS como 'cards'
        cards: valueAddedData.items.map((item, index) => ({
          id: item.id || item._id?.toString() || index.toString(),
          title: item.title,
          description: item.description,
          // Solo usamos imágenes (iconLight/iconDark/iconUrl) — no emojis
          iconLight: item.iconLight,
          iconDark: item.iconDark,
          gradient: item.gradient || 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
          styles: item.styles, // ✅ Preservar estilos individuales
          _id: item._id // Preservar _id para compatibilidad
        })),
        // Incluir logos del CMS si existen
        logos: valueAddedData.logos || []
      };
    }
    
    // Fallback a estructura de defaultConfig
    return {
      ...valueAddedData,
      subtitle: valueAddedData.subtitle || '',
      cards: valueAddedData.cards || [],
      logos: valueAddedData.logos || []
    };
  };

  const mappedData = getMappedValueAddedData();

  // ⚡ Usar estilos del CMS si están disponibles, sino usar defaults
  const getCMSCardStyles = (): CardDesignStyles => {
    const cmsStyles = valueAddedData.cardsDesign;
    
    if (cmsStyles && cmsStyles[theme]) {
      const styles = cmsStyles[theme];
      
      // ⚡ CORRECCIÓN: Asegurar que 'transparent' se convierte correctamente
      if (styles.background === 'transparent') {
        styles.background = 'transparent';
      }
      
      return styles;
    }
    
    // Fallback a estilos por defecto
    return theme === 'light' ? defaultLightStyles : defaultDarkStyles;
  };

  // 🎨 Valores por defecto para el diseño de tarjetas - CORRECTOS para cada tema
  const defaultLightStyles: CardDesignStyles = {
    // ☀️ TEMA CLARO: Fondo claro + texto oscuro
    background: 'rgba(255, 255, 255, 0.9)',  // ✅ Fondo blanco/claro
    border: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    borderWidth: '2px',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    hoverBackground: 'rgba(255, 255, 255, 0.95)',
    hoverBorder: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
    hoverShadow: '0 20px 40px rgba(139, 92, 246, 0.2)',
    iconGradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    iconBackground: 'rgba(255, 255, 255, 0.9)',
    iconColor: '#7528ee',
    titleColor: '#1F2937',       // ✅ Texto OSCURO para tema claro
    descriptionColor: '#4B5563', // ✅ Gris oscuro para descripción
    linkColor: '#06B6D4',        // ✅ Cyan oscuro
    cardMinWidth: '280px',
    cardMaxWidth: '350px',
    cardMinHeight: '200px',
    cardPadding: '2rem',
    cardsAlignment: 'center',
    iconBorderEnabled: false,
    iconAlignment: 'center'
  };

  const defaultDarkStyles: CardDesignStyles = {
    // 🌙 TEMA OSCURO: Fondo oscuro + texto claro
    background: 'rgba(17, 24, 39, 0.9)',   // ✅ Fondo OSCURO (gris muy oscuro)
    border: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    borderWidth: '2px',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    hoverBackground: 'rgba(31, 41, 55, 0.95)', // ✅ Hover más oscuro
    hoverBorder: 'linear-gradient(135deg, #a78bfa, #22d3ee)',
    hoverShadow: '0 20px 40px rgba(139, 92, 246, 0.3)',
    iconGradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
    iconBackground: 'rgba(17, 24, 39, 0.8)',  // ✅ Fondo oscuro para icono
    iconColor: '#ffffff',
    titleColor: '#FFFFFF',       // ✅ Texto BLANCO para tema oscuro
    descriptionColor: '#D1D5DB', // ✅ Gris muy claro para descripción
    linkColor: '#a78bfa',        // ✅ Púrpura claro
    cardMinWidth: '280px',
    cardMaxWidth: '350px',
    cardMinHeight: '200px',
    cardPadding: '2rem',
    cardsAlignment: 'center',
    iconBorderEnabled: false,
    iconAlignment: 'center'
  };

  // Obtener estilos actuales según el tema (CMS o defaults)
  const cardStyles = getCMSCardStyles();

  // (Log de depuración eliminado)

  // Obtener la imagen correcta según el tema activo
  const getCurrentBackgroundImage = () => {
    if (!mappedData.backgroundImage) return null;
    
    // Usar imagen del tema activo
    return theme === 'light' 
      ? mappedData.backgroundImage.light 
      : mappedData.backgroundImage.dark;
  };

  // 🛡️ FUNCIÓN HELPER para CSS robusto - Evita valores undefined/null
  const getSafeStyle = (value: string | undefined, fallback: string): string => {
    return value && value !== 'undefined' && value !== 'null' ? value : fallback;
  };

  // 🎨 FUNCIÓN para remover colores inline y dejar que nuestro sistema de temas tome control
  const cleanInlineColors = (html: string): string => {
    if (!html) return html;
    
    // Remover atributos style que contengan color
    let cleanedHtml = html
      .replace(/style\s*=\s*["'][^"']*color[^"']*["']/gi, '') // Remover style="...color..."
      .replace(/color\s*:\s*[^;"}]+[;}]/gi, '') // Remover color: xxx; dentro de styles
      .replace(/style\s*=\s*["']\s*["']/gi, '') // Remover style="" vacíos
      .replace(/style\s*=\s*["']\s*;\s*["']/gi, ''); // Remover style="; " vacíos
    
    return cleanedHtml;
  };

  // Función helper para detectar si un string es una URL de imagen
  const getLogosBarStyles = () => {
    const logosBarDesign = mappedData.logosBarDesign;
    const currentTheme = theme as 'light' | 'dark';
    
    if (logosBarDesign && logosBarDesign[currentTheme]) {
      const themeStyles = logosBarDesign[currentTheme];
      return {
        background: themeStyles.background || (theme === 'light' 
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)' 
          : 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(31, 41, 55, 0.8) 100%)'),
        borderColor: themeStyles.borderColor || (theme === 'light'
          ? 'rgba(139, 92, 246, 0.15)'
          : 'rgba(139, 92, 246, 0.25)'),
        borderWidth: themeStyles.borderWidth || '1px',
        borderStyle: 'solid',
        boxShadow: themeStyles.shadow || (theme === 'light'
          ? '0 8px 32px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.05)'
          : '0 8px 32px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(255, 255, 255, 0.05)'),
        borderRadius: themeStyles.borderRadius || '1rem',
        // Efectos de dispersión con máscara de degradado en las puntas
        ...(themeStyles.disperseEffect && {
          maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        })
      };
    }
    
    // Estilos por defecto
    return {
      background: theme === 'light' 
        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)' 
        : 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(31, 41, 55, 0.8) 100%)',
      borderColor: theme === 'light'
        ? 'rgba(139, 92, 246, 0.15)'
        : 'rgba(139, 92, 246, 0.25)',
      borderWidth: '1px',
      borderStyle: 'solid',
      boxShadow: theme === 'light'
        ? '0 8px 32px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.05)'
        : '0 8px 32px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(255, 255, 255, 0.05)',
      borderRadius: '1rem'
    };
  };
  const isImageUrl = (str: string): boolean => {
    return str.startsWith('http://') || str.startsWith('https://') || str.startsWith('/');
  };

  // Obtener el icono correcto según el tema activo
  const getCurrentIcon = (valueItem: ValueAddedItem): { type: 'image' | 'none', value: string | null } => {
    // Solo consideramos imágenes subidas (iconLight/iconDark) o una URL directa
    if (theme === 'light' && valueItem.iconLight && isImageUrl(valueItem.iconLight)) {
      return { type: 'image', value: valueItem.iconLight };
    }
    if (theme === 'dark' && valueItem.iconDark && isImageUrl(valueItem.iconDark)) {
      return { type: 'image', value: valueItem.iconDark };
    }

    // Fallback al icono del otro tema si existe
    if (theme === 'light' && valueItem.iconDark && isImageUrl(valueItem.iconDark)) {
      return { type: 'image', value: valueItem.iconDark };
    }
    if (theme === 'dark' && valueItem.iconLight && isImageUrl(valueItem.iconLight)) {
      return { type: 'image', value: valueItem.iconLight };
    }

    // No hay imagen disponible
    return { type: 'none', value: null };
  };

  const currentBackgroundImage = getCurrentBackgroundImage();

  // Usar items mapeados correctamente
  const valueItems = mappedData.cards || [];



  // Función para obtener clases de alineación de tarjetas
  const getCardsAlignmentClasses = () => {
    const alignment = cardStyles.cardsAlignment || 'center';
    
    // Para que la alineación sea visible, necesitamos cambiar el comportamiento del grid
    switch (alignment) {
      case 'center':
        return 'justify-center'; // Centra todo el contenido del grid
      case 'right':
        return 'justify-end'; // Alinea todo a la derecha
      case 'left':
      default:
        return 'justify-start'; // Alinea todo a la izquierda (por defecto)
    }
  };

  return (
    <section 
      className="relative py-20 theme-transition overflow-hidden w-full"
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
            aria-label={mappedData.backgroundImageAlt || 'Value Added background'}
          />
          {/* SIN OVERLAY - imagen pura HD */}
        </>
      )}

      {/* Section Header - SIN SOMBRAS, colores según maqueta */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <div
          className={`text-4xl sm:text-5xl font-bold mb-4 theme-transition transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            color: theme === 'light' 
              ? '#FFFFFF' // Blanco para tema claro (sobre imagen oscura)
              : '#FFFFFF', // Blanco para tema oscuro
            fontWeight: '700',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.6)' // Sombra fuerte para legibilidad
          }}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(mappedData.title) }}
        />
        {mappedData.subtitle && (
          <div className="max-w-3xl mx-auto">
            <div
              className={`text-xl theme-transition transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{
                color: theme === 'light' 
                  ? '#E5E7EB' // Gris claro para subtítulo
                  : '#D1D5DB', // Gris claro para tema oscuro
                fontWeight: '400',
                lineHeight: '1.6',
                textShadow: '1px 1px 3px rgba(0,0,0,0.7)' // Sombra para legibilidad
              }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(mappedData.subtitle || '') }}
            />
          </div>
        )}
      </div>

      {/* Logos Bar - Barra de tecnologías */}
      {mappedData.logos && mappedData.logos.length > 0 && (
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div 
            className={`transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {/* Barra de fondo con estilos CMS */}
            <div className="relative">
              {/* Fondo de la barra con configuración personalizable */}
              <div 
                className={`absolute inset-0 ${mappedData.logosBarDesign?.[theme]?.backdropBlur !== false ? 'backdrop-blur-sm' : ''}`}
                style={getLogosBarStyles()}
              />
              
              {/* Contenedor de logos */}
              <div className="relative py-6 px-12">
                <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 lg:gap-12">
                  {mappedData.logos
                    .sort((a: ValueAddedLogo, b: ValueAddedLogo) => (a.order || 0) - (b.order || 0))
                    .map((logo: ValueAddedLogo, index: number) => (
                      <div
                        key={typeof logo._id === 'string' ? logo._id : `logo-${index}`}
                        className="flex items-center justify-center transition-all duration-300 hover:scale-110 hover:opacity-90 group"
                        style={{
                          animationDelay: `${index * 100 + 700}ms`
                        }}
                      >
                        {logo.link ? (
                          <a
                            href={logo.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group-hover:transform group-hover:scale-105 transition-transform duration-300"
                            title={logo.name}
                          >
                            <img
                              src={logo.imageUrl}
                              alt={logo.alt}
                              className="h-10 md:h-12 w-auto object-contain filter group-hover:brightness-110 transition-all duration-300"
                              style={{
                                maxWidth: '90px',
                                filter: theme === 'light' 
                                  ? 'none'
                                  : 'brightness(1.1) contrast(1.1)'
                              }}
                            />
                          </a>
                        ) : (
                          <img
                            src={logo.imageUrl}
                            alt={logo.alt}
                            title={logo.name}
                            className="h-10 md:h-12 w-auto object-contain filter group-hover:brightness-110 transition-all duration-300"
                            style={{
                              maxWidth: '90px',
                              filter: theme === 'light' 
                                ? 'none'
                                : 'brightness(1.1) contrast(1.1)'
                            }}
                          />
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Value Added Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-wrap gap-8 w-full ${getCardsAlignmentClasses()}`}>
          {valueItems.map((valueItem, index) => (
            <div
              key={index}
              className={`group relative rounded-2xl transition-all duration-300 hover:transform hover:-translate-y-2 overflow-hidden value-card flex-shrink-0 transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                animationDelay: `${index * 200 + 600}ms`,
                '--value-card-bg': cardStyles.background,
                background: 'transparent', // El fondo se maneja en el div interno del borde
                boxShadow: cardStyles.shadow,
                width: `min(${getSafeStyle(cardStyles.cardMinWidth, '320px')}, 100%)`, // 🛡️ CSS robusto
                maxWidth: getSafeStyle(cardStyles.cardMaxWidth, '100%'), // 🛡️ CSS robusto
                minHeight: getSafeStyle(cardStyles.cardMinHeight, 'auto'), // 🛡️ CSS robusto
                transition: 'all 0.3s ease'
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                const element = e.currentTarget;
                element.style.background = 'transparent'; // El fondo lo maneja el div interno
                element.style.boxShadow = cardStyles.hoverShadow;
                element.style.transform = 'translateY(-8px) scale(1.02)';
                
                const border = element.querySelector('.card-border') as HTMLElement;
                if (border) border.style.background = cardStyles.hoverBorder;
              }}
              onMouseLeave={(e) => {
                const element = e.currentTarget;
                element.style.background = 'transparent'; // El fondo lo maneja el div interno
                element.style.boxShadow = cardStyles.shadow;
                element.style.transform = 'translateY(0) scale(1)';
                
                const border = element.querySelector('.card-border') as HTMLElement;
                if (border) border.style.background = cardStyles.border;
              }}
            >
              {/* Border gradient - Técnica mejorada */}
              <div 
                className="card-border absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300"
                style={{
                  background: cardStyles.border,
                  borderRadius: '1rem',
                  padding: cardStyles.borderWidth || '2px'
                }}
              >
                <div 
                  className="w-full h-full rounded-2xl"
                  style={{
                    background: cardStyles.background,
                    borderRadius: `calc(1rem - ${cardStyles.borderWidth || '2px'})`
                  }}
                />
              </div>
              
              {/* Contenido de la tarjeta - Debe ir dentro de un div con padding */}
              <div 
                className="relative z-10 h-full"
                style={{
                  padding: getSafeStyle(cardStyles.cardPadding, '2rem') // 🛡️ CSS robusto
                }}
              >
                {/* Icono (solo imagen) - Condicional basado en showIcons */}
                {mappedData.showIcons !== false && (() => {
                  const iconData = getCurrentIcon(valueItem);
                  if (iconData.type === 'image' && iconData.value) {
                    return (
                      <div className={`mb-6 flex ${cardStyles.iconAlignment === 'center' ? 'justify-center' : cardStyles.iconAlignment === 'right' ? 'justify-end' : 'justify-start'}`}>
                        <div 
                          className="w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                          style={{
                            background: cardStyles.iconBackground,
                            border: cardStyles.iconBorderEnabled ? `2px solid ${cardStyles.iconColor}` : 'none'
                          }}
                        >
                          <img 
                            src={iconData.value as string} 
                            alt={`Icono ${valueItem.title}`}
                            className="w-10 h-10 object-contain"
                            style={{
                              filter: `hue-rotate(0deg) saturate(1) brightness(1)`
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Título */}
                <h3 
                  className="text-xl font-bold mb-4 group-hover:scale-105 transition-all duration-300"
                  style={{ 
                    color: getSafeStyle(
                      valueItem.styles?.[theme]?.titleColor,
                      cardStyles.titleColor
                    ),
                    textAlign: cardStyles.iconAlignment || 'left',
                    fontSize: 'inherit' // Permitir tamaños del RichTextEditor
                  }}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(cleanInlineColors(valueItem.title)) }}
                />

                {/* Descripción */}
                <p 
                  className="text-sm leading-relaxed"
                  style={{ 
                    color: getSafeStyle(
                      valueItem.styles?.[theme]?.descriptionColor,
                      cardStyles.descriptionColor
                    ),
                    textAlign: cardStyles.iconAlignment || 'left',
                    lineHeight: '1.6',
                    fontSize: 'inherit' // Permitir tamaños del RichTextEditor
                  }}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(cleanInlineColors(valueItem.description)) }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows como en la maqueta */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex justify-center space-x-4">
          <button
            className="w-12 h-12 rounded-full bg-gray-800 hover:bg-purple-600 transition-all duration-300 flex items-center justify-center group"
            aria-label="Anterior"
          >
            <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            className="w-12 h-12 rounded-full bg-gray-800 hover:bg-purple-600 transition-all duration-300 flex items-center justify-center group"
            aria-label="Siguiente"
          >
            <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ValueAddedSection;