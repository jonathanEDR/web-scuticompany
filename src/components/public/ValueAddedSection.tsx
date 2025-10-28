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

  // 🤖 Función inteligente para detectar tipos de tecnología
  // 🎬 Función para obtener configuración de animaciones desde CMS (SIMPLIFICADA)
  const getAnimationConfig = () => {
    const logosBarDesign = mappedData.logosBarDesign;
    const currentTheme = theme as 'light' | 'dark';
    
    if (logosBarDesign && logosBarDesign[currentTheme]) {
      const config = logosBarDesign[currentTheme];
      // Forzar solo modo individual para evitar problemas
      return {
        ...config,
        rotationMode: 'individual' as const
      };
    }
    
    // Valores por defecto SIMPLIFICADOS - Solo animaciones individuales
    return {
      animationsEnabled: true,
      rotationMode: 'individual' as const,
      animationSpeed: 'normal' as const,
      hoverEffects: true,
      hoverIntensity: 'normal' as const,
      particleEffects: false, // Deshabilitamos efectos complejos
      glowEffects: true,
      autoDetectTech: true,
      logoSize: 'medium' as const,
      logoSpacing: 'normal' as const,
      logoFormat: 'rectangle' as const,
      maxLogoWidth: 'medium' as const,
      uniformSize: false
    };
  };

  // 🎨 Función para generar clases de animación SIMPLIFICADA - Solo individuales
  const getAnimationClasses = (techType: ReturnType<typeof detectTechType>) => {
    const config = getAnimationConfig();
    
    if (!config.animationsEnabled) {
      return 'logo-static'; // Sin animaciones
    }
    
    // SIMPLIFICADO: Solo animaciones individuales básicas
    return `logo-${techType.animationType}`;
  };

  // � Función simplificada - Solo logos originales sin duplicación
  const getDuplicatedLogos = () => {
    // SIMPLIFICADO: Siempre devolver logos originales
    return mappedData.logos;
  };

  // FUNCIONES DE CARRUSEL ELIMINADAS - Mantenemos solo animaciones individuales

  // 🎯 Función para obtener clases de hover basadas en configuración
  const getHoverClasses = (techType: ReturnType<typeof detectTechType>) => {
    const config = getAnimationConfig();
    
    if (!config.hoverEffects) {
      return 'logo-no-hover';
    }
    
    // 🎨 Mapeo de categorías a efectos elegantes (sin engranajes)
    const baseHoverClass = {
      'frontend': 'logo-bounce-elegant',  // Rebote suave para frontend
      'backend': 'logo-pulse-smooth',    // Pulso suave para backend
      'database': 'logo-float-gentle',   // Flotación suave para bases de datos
      'cloud': 'logo-glow-soft',         // Brillo suave para cloud
      'ai': 'logo-ai',                   // Mantener efecto AI especial
      'devops': 'logo-scale-smooth',     // Escalado suave para devops
      'mobile': 'logo-wobble-gentle',    // Bamboleo suave para móvil
      'other': 'logo-lift-elegant'       // Elevación elegante para otros
    }[techType.category] || 'logo-lift-elegant';
    
    // Agregar intensidad y efectos de glow
    const intensityClass = `hover-${config.hoverIntensity}`;
    const glowClass = config.glowEffects ? 'glow-enabled' : 'glow-disabled';
    
    return `${baseHoverClass} ${intensityClass} ${glowClass}`;
  };

  //  Función para obtener estilos de formato de logo
  const getLogoFormatStyles = () => {
    const config = getAnimationConfig();
    const logoFormat = config.logoFormat || 'rectangle';
    
    switch (logoFormat) {
      case 'square':
        // Modo cuadrado: altura fija con clases Tailwind responsivas
        const sizeMap = {
          small: 'h-10 sm:h-12 md:h-16 lg:h-20 w-auto max-w-[60px] sm:max-w-[80px] lg:max-w-[100px]',
          medium: 'h-12 sm:h-16 md:h-20 lg:h-24 w-auto max-w-[80px] sm:max-w-[120px] lg:max-w-[150px]', 
          large: 'h-16 sm:h-20 md:h-24 lg:h-28 w-auto max-w-[100px] sm:max-w-[150px] lg:max-w-[200px]'
        };
        const logoSize = config.logoSize || 'medium';
        return {
          className: `${sizeMap[logoSize]} object-contain`,
          style: {}
        };
        
      case 'rectangle':
        // Modo rectangular: usando clases Tailwind responsivas
        const rectangleMap = {
          small: 'h-auto w-auto max-h-[2.5rem] sm:max-h-[3.5rem] lg:max-h-[4.5rem] max-w-[60px] sm:max-w-[80px] lg:max-w-[100px]',
          medium: 'h-auto w-auto max-h-[2.5rem] sm:max-h-[4rem] lg:max-h-[5.5rem] max-w-[80px] sm:max-w-[120px] lg:max-w-[150px]',
          large: 'h-auto w-auto max-h-[3rem] sm:max-h-[5rem] lg:max-h-[6.5rem] max-w-[100px] sm:max-w-[150px] lg:max-w-[200px]'
        };
        const rectSize = config.logoSize || 'medium';
        return {
          className: `${rectangleMap[rectSize]} object-contain`,
          style: {}
        };
        
      case 'original':
        // Modo original: usando clases Tailwind responsivas
        const originalMap = {
          small: 'h-auto w-auto max-h-[3rem] sm:max-h-[4.5rem] lg:max-h-[5.5rem] max-w-[60px] sm:max-w-[80px] lg:max-w-[100px]',
          medium: 'h-auto w-auto max-h-[3rem] sm:max-h-[5rem] lg:max-h-[6.5rem] max-w-[80px] sm:max-w-[120px] lg:max-w-[150px]',
          large: 'h-auto w-auto max-h-[3.5rem] sm:max-h-[5.5rem] lg:max-h-[7rem] max-w-[100px] sm:max-w-[150px] lg:max-w-[200px]'
        };
        const origSize = config.logoSize || 'medium';
        return {
          className: `${originalMap[origSize]} object-contain`,
          style: {}
        };
        
      default:
        // Por defecto: usando clases Tailwind responsivas
        const defaultMap = {
          small: 'h-auto w-auto max-h-[2.5rem] sm:max-h-[3.5rem] lg:max-h-[4.5rem] max-w-[60px] sm:max-w-[80px] lg:max-w-[100px]',
          medium: 'h-auto w-auto max-h-[2.5rem] sm:max-h-[4rem] lg:max-h-[5.5rem] max-w-[80px] sm:max-w-[120px] lg:max-w-[150px]',
          large: 'h-auto w-auto max-h-[3rem] sm:max-h-[5rem] lg:max-h-[6.5rem] max-w-[100px] sm:max-w-[150px] lg:max-w-[200px]'
        };
        const defSize = config.logoSize || 'medium';
        return {
          className: `${defaultMap[defSize]} object-contain`,
          style: {}
        };
    }
  };

  // 📐 Función para obtener clases de espaciado RESPONSIVO
  const getLogoSpacingClasses = () => {
    const config = getAnimationConfig();
    
    // 📱 Espaciado más compacto en móviles, más amplio en desktop
    const spacingMap = {
      compact: 'gap-2 sm:gap-3 md:gap-4 lg:gap-6',
      normal: 'gap-3 sm:gap-4 md:gap-6 lg:gap-8',
      wide: 'gap-4 sm:gap-6 md:gap-8 lg:gap-12'
    };
    
    const logoSpacing = config.logoSpacing || 'normal';
    return spacingMap[logoSpacing];
  };

  const detectTechType = (logoName: string, logoAlt: string, logoUrl: string): {
    category: 'frontend' | 'backend' | 'database' | 'cloud' | 'ai' | 'devops' | 'mobile' | 'other';
    animationType: 'rotate' | 'float' | 'pulse' | 'bounce';
    intensity: 'low' | 'medium' | 'high';
  } => {
    const combined = `${logoName} ${logoAlt} ${logoUrl}`.toLowerCase();
    
    // 🎯 Detección por categorías
    if (combined.match(/(react|vue|angular|svelte|next|nuxt|gatsby)/)) {
      return { category: 'frontend', animationType: 'bounce', intensity: 'high' };
    }
    if (combined.match(/(node|express|django|rails|spring|laravel|fastapi)/)) {
      return { category: 'backend', animationType: 'pulse', intensity: 'medium' };
    }
    if (combined.match(/(mysql|postgres|mongodb|redis|sqlite|oracle)/)) {
      return { category: 'database', animationType: 'rotate', intensity: 'low' };
    }
    if (combined.match(/(aws|azure|google|gcp|docker|kubernetes|k8s)/)) {
      return { category: 'cloud', animationType: 'float', intensity: 'medium' };
    }
    if (combined.match(/(ai|artificial|machine|tensorflow|pytorch|openai)/)) {
      return { category: 'ai', animationType: 'pulse', intensity: 'high' };
    }
    if (combined.match(/(git|jenkins|ci|cd|devops|terraform)/)) {
      return { category: 'devops', animationType: 'rotate', intensity: 'medium' };
    }
    if (combined.match(/(ios|android|flutter|react.native|xamarin)/)) {
      return { category: 'mobile', animationType: 'bounce', intensity: 'medium' };
    }
    
    return { category: 'other', animationType: 'float', intensity: 'low' };
  };

  // 🎨 Generar estilos dinámicos basados en la tecnología
  const getTechStyles = (techType: ReturnType<typeof detectTechType>, index: number) => {
    const config = getAnimationConfig();
    const baseDelay = 700;
    const increment = techType.intensity === 'high' ? 100 : techType.intensity === 'medium' ? 150 : 200;
    
    // 🎬 Obtener duración base según configuración CMS - SIMPLIFICADO
    const getBaseDuration = () => {
      // Solo modo individual - velocidades normales
      switch (config.animationSpeed) {
        case 'slow': return { min: 20, max: 30 };
        case 'fast': return { min: 6, max: 10 };
        case 'normal':
        default: return { min: 12, max: 18 };
      }
    };
    
    const durationRange = getBaseDuration();
    const baseDuration = techType.intensity === 'high' 
      ? durationRange.min 
      : techType.intensity === 'medium' 
        ? (durationRange.min + durationRange.max) / 2
        : durationRange.max;
    
    const finalDuration = baseDuration + (index * 0.3);
    
    return {
      animationDelay: `${baseDelay + (index * increment)}ms`,
      '--animation-duration': `${finalDuration}s`, // Variable CSS para animaciones configurables
      animationDuration: `${finalDuration}s`, // Fallback para animaciones existentes
    } as React.CSSProperties;
  };

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

      {/* Logos Bar - Barra de tecnologías mejorada */}
      {mappedData.logos && mappedData.logos.length > 0 && (
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          {/* Título de la sección de tecnologías */}
          <div className="text-center mb-8">
            <h3 className="text-xl md:text-2xl font-semibold mb-2"
                style={{
                  color: theme === 'light' ? '#FFFFFF' : '#FFFFFF',
                  textShadow: '1px 1px 3px rgba(0,0,0,0.7)'
                }}>
              🚀 Tecnologías que Dominamos
            </h3>
            <div className="w-24 h-1 mx-auto rounded-full"
                 style={{
                   background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)'
                 }}></div>
          </div>
          
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
              
              {/* Contenedor de logos RESPONSIVO */}
              <div className="relative py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-12">
                <div 
                  className={`flex flex-wrap justify-center items-center ${getLogoSpacingClasses()}`}
                >
                  {getDuplicatedLogos()
                    .sort((a: ValueAddedLogo, b: ValueAddedLogo) => (a.order || 0) - (b.order || 0))
                    .map((logo: ValueAddedLogo, index: number) => {
                      // 🤖 Detección inteligente de tecnología
                      const config = getAnimationConfig();
                      const techType = config.autoDetectTech 
                        ? detectTechType(logo.name, logo.alt, logo.imageUrl)
                        : { category: 'other' as const, animationType: 'rotate' as const, intensity: 'medium' as const };
                      const techStyles = getTechStyles(techType, index);
                      
                      // 🎬 Obtener clases de animación y hover configurables
                      const animationClasses = getAnimationClasses(techType);
                      const hoverClasses = getHoverClasses(techType);
                      const logoFormatStyles = getLogoFormatStyles();
                      
                      return (
                        <div
                          key={typeof logo._id === 'string' ? logo._id : `logo-${index}`}
                          className={`
                            logo-entrance
                            logo-enhanced 
                            ${hoverClasses}
                            ${animationClasses}
                            flex items-center justify-center 
                            relative z-0 hover:z-10
                            cursor-pointer
                          `}
                          style={techStyles}
                        >
                          {/* Contenedor del logo sin efectos */}
                          <div className="relative">
                            {logo.link ? (
                              <a
                                href={logo.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block relative"
                                title={`${logo.name} - Ver más información`}
                              >
                                <img
                                  src={logo.imageUrl}
                                  alt={logo.alt}
                                  className={`${logoFormatStyles.className} transition-all duration-500`}
                                  style={{
                                    ...logoFormatStyles.style,
                                    filter: theme === 'light' 
                                      ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))' 
                                      : 'brightness(1.1) contrast(1.1) drop-shadow(0 2px 8px rgba(255,255,255,0.1))',
                                  }}
                                  loading="lazy"
                                />
                              </a>
                            ) : (
                              <img
                                src={logo.imageUrl}
                                alt={logo.alt}
                                title={logo.name}
                                className={`${logoFormatStyles.className} transition-all duration-500`}
                                style={{
                                  ...logoFormatStyles.style,
                                  filter: theme === 'light' 
                                    ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))' 
                                    : 'brightness(1.1) contrast(1.1) drop-shadow(0 2px 8px rgba(255,255,255,0.1))',
                                }}
                                loading="lazy"
                              />
                            )}
                            
                            {/* Tooltip mejorado con categoría de tecnología */}
                            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20">
                              <div className="text-center">
                                <span className="text-xs font-semibold px-3 py-1.5 rounded-full text-white whitespace-nowrap block mb-1"
                                      style={{
                                        background: `linear-gradient(135deg, 
                                          ${techType.category === 'ai' ? 'rgba(168, 85, 247, 0.95)' :
                                            techType.category === 'frontend' ? 'rgba(139, 92, 246, 0.95)' :
                                            techType.category === 'backend' ? 'rgba(6, 182, 212, 0.95)' :
                                            techType.category === 'database' ? 'rgba(34, 197, 94, 0.95)' :
                                            techType.category === 'cloud' ? 'rgba(59, 130, 246, 0.95)' :
                                            techType.category === 'devops' ? 'rgba(249, 115, 22, 0.95)' :
                                            techType.category === 'mobile' ? 'rgba(236, 72, 153, 0.95)' :
                                            'rgba(139, 92, 246, 0.95)'
                                          }, rgba(6, 182, 212, 0.95))`,
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
                                      }}>
                                  {logo.name}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded text-gray-600 dark:text-gray-300 font-medium uppercase tracking-wide"
                                      style={{
                                        background: theme === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(17,24,39,0.9)',
                                        backdropFilter: 'blur(4px)'
                                      }}>
                                  {techType.category === 'ai' ? '🤖 AI' :
                                   techType.category === 'frontend' ? '🎨 Frontend' :
                                   techType.category === 'backend' ? '⚙️ Backend' :
                                   techType.category === 'database' ? '🗄️ Database' :
                                   techType.category === 'cloud' ? '☁️ Cloud' :
                                   techType.category === 'devops' ? '🔧 DevOps' :
                                   techType.category === 'mobile' ? '📱 Mobile' :
                                   '🛠️ Tech'}
                                </span>
                              </div>
                            </div>
                            
                            {/* Partículas de efecto (aparecen en hover) */}
                            {config.particleEffects && (
                              <div className="absolute inset-0 pointer-events-none">
                                {[...Array(6)].map((_, particleIndex) => (
                                <div
                                  key={particleIndex}
                                  className="absolute w-1 h-1 rounded-full opacity-0 group-hover:opacity-100"
                                  style={{
                                    background: techType.category === 'ai' ? '#A855F7' :
                                               techType.category === 'frontend' ? '#8B5CF6' :
                                               techType.category === 'backend' ? '#06B6D4' :
                                               techType.category === 'database' ? '#22C55E' :
                                               '#8B5CF6',
                                    left: `${20 + (particleIndex * 15)}%`,
                                    top: `${10 + (particleIndex * 20)}%`,
                                    animation: `particle-float-${particleIndex % 3} 2s ease-in-out infinite`,
                                    animationDelay: `${particleIndex * 0.2}s`
                                  }}
                                />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
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

      {/* CSS Avanzado para Animaciones de Logos */}
      <style>{`
        /* 🎯 Animaciones principales */
        @keyframes rotate-gear {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes float-smooth {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { 
            transform: scale(1);
            filter: brightness(1) drop-shadow(0 0 0 transparent);
          }
          50% { 
            transform: scale(1.05);
            filter: brightness(1.1) drop-shadow(0 0 15px rgba(139, 92, 246, 0.4));
          }
        }
        

        
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0px) scale(1); }
          25% { transform: translateY(-4px) scale(1.02); }
          50% { transform: translateY(-8px) scale(1.03); }
          75% { transform: translateY(-4px) scale(1.02); }
        }
        
        /* 🌟 Nuevas animaciones elegantes */
        @keyframes pulse-gentle {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.02);
            opacity: 0.9;
          }
        }
        
        @keyframes ai-glow {
          0%, 100% {
            filter: brightness(1.2) hue-rotate(0deg) drop-shadow(0 0 20px rgba(168, 85, 247, 0.6));
          }
          33% {
            filter: brightness(1.3) hue-rotate(10deg) drop-shadow(0 0 25px rgba(59, 130, 246, 0.7));
          }
          66% {
            filter: brightness(1.25) hue-rotate(-5deg) drop-shadow(0 0 22px rgba(34, 197, 94, 0.6));
          }
        }
        
        /* 🎨 Clases de efectos básicas para logos - SIMPLIFICADO */
        .logo-rotate {
          animation: rotate-gear 15s linear infinite;
        }
        
        .logo-static {
          animation: none !important;
        }
        
        .logo-no-hover:hover {
          transform: none !important;
          filter: none !important;
        }
        
        /* 🎯 Intensidades de hover configurables */
        .hover-subtle:hover {
          transform: scale(1.1) !important;
        }
        
        .hover-normal:hover {
          transform: scale(1.3) !important;
        }
        
        .hover-intense:hover {
          transform: scale(1.5) !important;
        }
        
        /* 🌟 Efectos de glow configurables */
        .glow-enabled:hover {
          filter: brightness(1.2) drop-shadow(0 8px 25px rgba(139, 92, 246, 0.6)) !important;
        }
        
        .glow-disabled:hover {
          filter: brightness(1.1) !important;
        }
        
        .logo-float {
          animation: float-smooth 4s ease-in-out infinite;
        }
        
        .logo-pulse {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        
        .logo-bounce {
          animation: bounce-subtle 2.5s ease-in-out infinite;
        }
        

        
        /* 🌟 Hover effects avanzados */
        .logo-enhanced {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: visible;
        }
        
        .logo-enhanced:hover {
          transform: scale(1.4) rotate(8deg) !important;
          filter: brightness(1.2) contrast(1.1) drop-shadow(0 0 25px rgba(139, 92, 246, 0.8)) !important;
          z-index: 10;
        }
        
        .logo-enhanced:hover::after {
          content: '';
          position: absolute;
          inset: -10px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%);
          border-radius: 50%;
          z-index: -1;
          animation: pulse-glow 0.6s ease-out;
        }
        
        /* 🎯 Efectos hover elegantes y suaves */
        .logo-bounce-elegant:hover {
          transform: scale(1.1) translateY(-3px) !important;
          filter: brightness(1.15) drop-shadow(0 4px 15px rgba(139, 92, 246, 0.4)) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        .logo-pulse-smooth:hover {
          transform: scale(1.08) !important;
          filter: brightness(1.1) drop-shadow(0 0 12px rgba(6, 182, 212, 0.5)) !important;
          animation: pulse-gentle 1.5s ease-in-out infinite !important;
        }
        
        .logo-float-gentle:hover {
          transform: scale(1.06) translateY(-2px) !important;
          filter: brightness(1.1) drop-shadow(0 6px 20px rgba(34, 197, 94, 0.4)) !important;
        }
        
        .logo-glow-soft:hover {
          transform: scale(1.05) !important;
          filter: brightness(1.2) drop-shadow(0 0 15px rgba(59, 130, 246, 0.6)) !important;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.3) !important;
        }
        
        .logo-scale-smooth:hover {
          transform: scale(1.12) !important;
          filter: brightness(1.15) drop-shadow(0 4px 12px rgba(168, 85, 247, 0.4)) !important;
        }
        
        .logo-wobble-gentle:hover {
          transform: scale(1.08) rotate(2deg) !important;
          filter: brightness(1.1) drop-shadow(0 3px 10px rgba(236, 72, 153, 0.4)) !important;
        }
        
        .logo-lift-elegant:hover {
          transform: scale(1.1) translateY(-4px) rotate(1deg) !important;
          filter: brightness(1.12) drop-shadow(0 6px 18px rgba(139, 92, 246, 0.5)) !important;
        }
        
        .logo-ai:hover {
          transform: scale(1.15) !important;
          filter: brightness(1.2) hue-rotate(15deg) drop-shadow(0 0 20px rgba(168, 85, 247, 0.6)) !important;
          animation: ai-glow 2s ease-in-out infinite !important;
        }
        
        /* 🌊 Efectos de fondo dinámicos */
        .logos-container {
          position: relative;
        }
        
        .logos-container::before {
          content: '';
          position: absolute;
          inset: -20px;
          background: linear-gradient(
            45deg,
            rgba(139, 92, 246, 0.05),
            rgba(6, 182, 212, 0.05),
            rgba(139, 92, 246, 0.05)
          );
          background-size: 400% 400%;
          animation: gradient-shift 8s ease infinite;
          border-radius: inherit;
          z-index: -1;
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        /* 📱 Responsive adjustments - MEJORADO */
        @media (max-width: 640px) {
          /* Efectos más suaves en móviles */
          .logo-enhanced:hover {
            transform: scale(1.05) !important;
          }
          
          .logo-bounce-elegant:hover,
          .logo-pulse-smooth:hover,
          .logo-float-gentle:hover,
          .logo-glow-soft:hover,
          .logo-scale-smooth:hover,
          .logo-wobble-gentle:hover,
          .logo-lift-elegant:hover {
            transform: scale(1.03) translateY(-1px) !important;
          }
          
          .logo-ai:hover {
            transform: scale(1.06) !important;
          }
          
          /* Animaciones más lentas en móvil */
          .logo-float {
            animation-duration: 6s;
          }
          
          .logo-rotate {
            animation-duration: 25s;
          }
          
          .logo-pulse {
            animation-duration: 4s;
          }
        }
        
        @media (max-width: 480px) {
          /* Extra pequeño - efectos mínimos */
          .logo-enhanced:hover {
            transform: scale(1.02) !important;
          }
          
          [class*="logo-"]:hover {
            transform: scale(1.02) !important;
          }
        }
        
        /* 🎭 Animaciones de entrada escalonadas */
        .logo-entrance {
          opacity: 0;
          transform: translateY(30px) scale(0.8);
          animation: logoEntrance 0.8s ease-out forwards;
        }
        
        @keyframes logoEntrance {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        /* 🌟 Animaciones de partículas */
        @keyframes particle-float-0 {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          33% { transform: translateY(-15px) translateX(10px) rotate(120deg); }
          66% { transform: translateY(-8px) translateX(-12px) rotate(240deg); }
        }
        
        @keyframes particle-float-1 {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          50% { transform: translateY(-20px) translateX(-8px) rotate(180deg); }
        }
        
        @keyframes particle-float-2 {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          25% { transform: translateY(-10px) translateX(15px) rotate(90deg); }
          75% { transform: translateY(-18px) translateX(-5px) rotate(270deg); }
        }
        
        /* 🎯 Efectos de carga progresiva más suaves */
        .logo-entrance {
          animation-fill-mode: both;
        }
        
        /* 🎨 Mejoras de accesibilidad y rendimiento */
        @media (prefers-reduced-motion: reduce) {
          .logo-rotate,
          .logo-float,
          .logo-pulse,
          .logo-bounce,
          [class*="particle-float"] {
            animation: none !important;
          }
          
          .logo-enhanced:hover {
            transform: scale(1.1) !important;
          }
        }
        
        /* 🌙 Ajustes para modo oscuro */
        @media (prefers-color-scheme: dark) {
          .logo-enhanced:hover::after {
            background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%);
          }
        }
      `}</style>
    </section>
  );
};

export default ValueAddedSection;