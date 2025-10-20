import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { useTheme } from '../../contexts/ThemeContext';
import { DEFAULT_VALUE_ADDED_CONFIG } from '../../utils/defaultConfig';
import type { CardDesignStyles } from '../../types/cms';

interface ValueAddedItem {
  id?: string;
  title: string;
  description: string;
  iconLight?: string;
  iconDark?: string;
  gradient?: string;
  _id?: any; // Para compatibilidad con MongoDB
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
  cardsDesign?: {
    light: CardDesignStyles;
    dark: CardDesignStyles;
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
          gradient: item.gradient || 'linear-gradient(135deg, #8B5CF6, #06B6D4)'
        }))
      };
    }
    
    // Fallback a estructura de defaultConfig
    return {
      ...valueAddedData,
      subtitle: valueAddedData.subtitle || '',
      cards: valueAddedData.cards || []
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

  // Obtener la imagen correcta según el tema activo
  const getCurrentBackgroundImage = () => {
    if (!mappedData.backgroundImage) return null;
    
    // Usar imagen del tema activo
    return theme === 'light' 
      ? mappedData.backgroundImage.light 
      : mappedData.backgroundImage.dark;
  };

  // Función helper para detectar si un string es una URL de imagen
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
                width: `min(${cardStyles.cardMinWidth || '320px'}, 100%)`,
                maxWidth: cardStyles.cardMaxWidth || '100%',
                minHeight: cardStyles.cardMinHeight || 'auto',
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
                  padding: cardStyles.cardPadding || '2rem'
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
                    color: cardStyles.titleColor,
                    textAlign: cardStyles.iconAlignment || 'left'
                  }}
                >
                  {valueItem.title}
                </h3>

                {/* Descripción */}
                <p 
                  className="text-sm leading-relaxed"
                  style={{ 
                    color: cardStyles.descriptionColor,
                    textAlign: cardStyles.iconAlignment || 'left',
                    lineHeight: '1.6'
                  }}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(valueItem.description) }}
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