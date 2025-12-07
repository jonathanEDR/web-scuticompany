/**
 * 🎯 useBlogCmsConfig Hook
 * Hook para obtener la configuración del blog desde el CMS
 */

import { useState, useEffect } from 'react';
import { getPageBySlug } from '../../services/cmsApi';

// Configuración por defecto del Hero del Blog
export const DEFAULT_BLOG_HERO_CONFIG = {
  title: 'Blog',
  titleHighlight: 'Tech',
  subtitle: 'Las últimas noticias y tendencias tecnológicas',
  fontFamily: 'Montserrat',
  // Estilos de resaltado del título principal (efecto badge/highlight)
  titleStyle: {
    italic: true, // Título en itálica
    hasBackground: true, // Mostrar fondo de resaltado
    backgroundColor: '#ffffff', // Color de fondo del resaltado
    padding: '4px 16px', // Padding del badge
    borderRadius: '8px', // Border radius del badge
  },
  // Estilos de resaltado de la palabra destacada
  highlightStyle: {
    italic: false, // Palabra destacada en itálica
    hasBackground: false, // Mostrar fondo de resaltado
    backgroundColor: 'transparent', // Color de fondo
    padding: '0', // Padding
    borderRadius: '0', // Border radius
  },
  backgroundImage: '', // Imagen de fondo (vacío = usar gradiente)
  backgroundOverlay: 0.5, // Oscurecer imagen
  gradientFrom: '#3b82f6',
  gradientTo: '#9333ea',
  showStats: true,
  stats: {
    articlesLabel: 'Artículos',
    readersCount: '15K+',
    readersLabel: 'Lectores'
  },
  search: {
    placeholder: 'Buscar noticias...',
    buttonText: 'Buscar',
    // Estilos del input de búsqueda
    inputStyles: {
      light: {
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        placeholderColor: '#9ca3af',
        borderColor: '#e5e7eb',
        borderWidth: '2px',
        borderRadius: '9999px', // Completamente redondeado
        iconColor: '#9ca3af',
        // Opciones de gradiente para el borde
        useGradientBorder: false,
        gradientBorderFrom: '#8b5cf6',
        gradientBorderTo: '#06b6d4',
        gradientBorderDirection: 'to right',
      },
      dark: {
        backgroundColor: '#1f2937',
        textColor: '#ffffff',
        placeholderColor: '#9ca3af',
        borderColor: '#374151',
        borderWidth: '2px',
        borderRadius: '9999px', // Completamente redondeado
        iconColor: '#9ca3af',
        // Opciones de gradiente para el borde
        useGradientBorder: false,
        gradientBorderFrom: '#8b5cf6',
        gradientBorderTo: '#06b6d4',
        gradientBorderDirection: 'to right',
      }
    },
    // Estilos del botón de búsqueda
    buttonStyles: {
      light: {
        backgroundColor: '#2563eb',
        textColor: '#ffffff',
        hoverBackgroundColor: '#1d4ed8',
        borderRadius: '9999px', // Completamente redondeado
      },
      dark: {
        backgroundColor: '#2563eb',
        textColor: '#ffffff',
        hoverBackgroundColor: '#1d4ed8',
        borderRadius: '9999px', // Completamente redondeado
      }
    }
  },
  styles: {
    light: {
      titleColor: '#ffffff',
      // Opciones de gradiente para el texto destacado
      titleHighlightColor: '#fde047',
      titleHighlightUseGradient: false,
      titleHighlightGradientFrom: '#8b5cf6',
      titleHighlightGradientTo: '#06b6d4',
      titleHighlightGradientDirection: 'to right',
      subtitleColor: '#bfdbfe',
      statsValueColor: '#ffffff',
      statsLabelColor: '#bfdbfe'
    },
    dark: {
      titleColor: '#ffffff',
      // Opciones de gradiente para el texto destacado
      titleHighlightColor: '#fde047',
      titleHighlightUseGradient: false,
      titleHighlightGradientFrom: '#8b5cf6',
      titleHighlightGradientTo: '#06b6d4',
      titleHighlightGradientDirection: 'to right',
      subtitleColor: '#bfdbfe',
      statsValueColor: '#ffffff',
      statsLabelColor: '#bfdbfe'
    }
  }
};

// Interfaz para estilos de resaltado (badge/highlight)
export interface TitleStyleConfig {
  italic: boolean;
  hasBackground: boolean;
  backgroundColor: string;
  padding: string;
  borderRadius: string;
}

// Interfaces para estilos del buscador
export interface SearchInputStyles {
  backgroundColor: string;
  textColor: string;
  placeholderColor: string;
  borderColor: string;
  borderWidth: string;
  borderRadius: string;
  iconColor: string;
  // Opciones de gradiente para el borde
  useGradientBorder?: boolean;
  gradientBorderFrom?: string;
  gradientBorderTo?: string;
  gradientBorderDirection?: string;
}

export interface SearchButtonStyles {
  backgroundColor: string;
  textColor: string;
  hoverBackgroundColor: string;
  borderRadius: string;
}

export interface SearchConfig {
  placeholder: string;
  buttonText: string;
  inputStyles?: {
    light: SearchInputStyles;
    dark: SearchInputStyles;
  };
  buttonStyles?: {
    light: SearchButtonStyles;
    dark: SearchButtonStyles;
  };
}

export interface BlogHeroConfig {
  title: string;
  titleHighlight: string;
  subtitle: string;
  fontFamily?: string;
  // Estilos de resaltado del título
  titleStyle?: TitleStyleConfig;
  highlightStyle?: TitleStyleConfig;
  backgroundImage?: string;
  backgroundOverlay?: number;
  gradientFrom: string;
  gradientTo: string;
  showStats: boolean;
  stats: {
    articlesLabel: string;
    readersCount: string;
    readersLabel: string;
  };
  search: SearchConfig;
  styles: {
    light: {
      titleColor: string;
      titleHighlightColor: string;
      // Opciones de gradiente para texto destacado
      titleHighlightUseGradient?: boolean;
      titleHighlightGradientFrom?: string;
      titleHighlightGradientTo?: string;
      titleHighlightGradientDirection?: string;
      subtitleColor: string;
      statsValueColor: string;
      statsLabelColor: string;
    };
    dark: {
      titleColor: string;
      titleHighlightColor: string;
      // Opciones de gradiente para texto destacado
      titleHighlightUseGradient?: boolean;
      titleHighlightGradientFrom?: string;
      titleHighlightGradientTo?: string;
      titleHighlightGradientDirection?: string;
      subtitleColor: string;
      statsValueColor: string;
      statsLabelColor: string;
    };
  };
}

// Configuración por defecto de Noticias Destacadas
export const DEFAULT_FEATURED_POSTS_CONFIG = {
  sectionTitle: 'Noticias Destacadas',
  showIcon: true,
  layout: 'hero-left' as const,
  maxFeaturedPosts: 3,
  fontFamily: 'Montserrat',
  // Colores de fondo por tema
  sectionBgColorLight: '#f3f4f6',
  sectionBgColorDark: '#111827',
  // Colores de texto por tema
  sectionTitleColorLight: '#111827',
  sectionTitleColorDark: '#ffffff',
  sectionIconColorLight: '#2563eb',
  sectionIconColorDark: '#60a5fa',
  sectionIconBgLight: '#dbeafe',
  sectionIconBgDark: 'rgba(37, 99, 235, 0.2)',
  // Imágenes de fondo por tema
  sectionBgImageLight: '',
  sectionBgImageDark: '',
  sectionBgOverlayLight: 0,
  sectionBgOverlayDark: 0,
  heroCard: {
    // Borde de la tarjeta
    cardBorderWidth: 2,
    cardBorderColor: '#3b82f6',
    // Franja de contenido
    contentBgColor: 'rgba(0,0,0,0.95)',
    borderTopColor: 'rgba(100,100,100,0.3)',
    // Textos
    titleColor: '#ffffff',
    excerptColor: '#d1d5db',
    dateColor: '#9ca3af',
    // Categoría
    categoryBgColor: '#2563eb',
    categoryTextColor: '#ffffff',
    // Tags
    tagBgColor: '#8b5cf6',
    tagBgTransparent: false,
    tagTextColor: '#ffffff',
    tagBorderColor: '#8b5cf6',
    tagBorderUseGradient: false,
    tagBorderGradientFrom: '#8b5cf6',
    tagBorderGradientTo: '#06b6d4',
    tagBorderGradientDirection: 'to-r' as const,
    // Botón
    buttonBgColor: 'transparent',
    buttonBgTransparent: true,
    buttonTextColor: '#00ffff',
    buttonBorderColor: '#00ffff',
    buttonBorderWidth: 2,
    // Gradiente del botón (fondo)
    buttonUseGradient: false,
    buttonGradientFrom: '#3b82f6',
    buttonGradientTo: '#8b5cf6',
    buttonGradientDirection: 'to-r' as const,
    // Gradiente del texto
    buttonTextUseGradient: false,
    buttonTextGradientFrom: '#00ffff',
    buttonTextGradientTo: '#ff00ff',
    buttonTextGradientDirection: 'to-r' as const,
    // Gradiente del borde
    buttonBorderUseGradient: false,
    buttonBorderGradientFrom: '#00ffff',
    buttonBorderGradientTo: '#ff00ff',
    buttonBorderGradientDirection: 'to-r' as const,
    // Overlay (deprecated pero mantenido por compatibilidad)
    overlayOpacity: 0.6,
    overlayColor: '#000000'
  },
  smallCard: {
    bgColor: '#ffffff',
    borderColor: '#e5e7eb',
    hoverBorderColor: '#93c5fd',
    titleColor: '#111827',
    excerptColor: '#4b5563',
    dateColor: '#6b7280',
    categoryBgColor: '#2563eb',
    categoryTextColor: '#ffffff'
  }
};

export interface FeaturedPostsConfig {
  sectionTitle?: string;
  showIcon?: boolean;
  layout?: 'hero-right' | 'hero-left' | 'grid' | 'stacked';
  maxFeaturedPosts?: number;
  fontFamily?: string;
  // Colores de fondo de la sección por tema
  sectionBgColorLight?: string;
  sectionBgColorDark?: string;
  // Colores de texto del título por tema
  sectionTitleColorLight?: string;
  sectionTitleColorDark?: string;
  sectionIconColorLight?: string;
  sectionIconColorDark?: string;
  sectionIconBgLight?: string;
  sectionIconBgDark?: string;
  // Imagen de fondo de la sección por tema
  sectionBgImageLight?: string;
  sectionBgImageDark?: string;
  sectionBgOverlayLight?: number;
  sectionBgOverlayDark?: number;
  // Deprecated - mantener por compatibilidad
  sectionBgImage?: string;
  sectionBgOverlay?: number;
  heroCard?: {
    // Borde de la tarjeta
    cardBorderWidth?: number;
    cardBorderColor?: string;
    // Franja de contenido
    overlayOpacity?: number;
    overlayColor?: string;
    contentBgColor?: string;
    borderTopColor?: string;
    // Textos
    titleColor?: string;
    excerptColor?: string;
    dateColor?: string;
    // Categoría
    categoryBgColor?: string;
    categoryTextColor?: string;
    // Tags
    tagBgColor?: string;
    tagBgTransparent?: boolean;
    tagTextColor?: string;
    tagBorderColor?: string;
    tagBorderUseGradient?: boolean;
    tagBorderGradientFrom?: string;
    tagBorderGradientTo?: string;
    tagBorderGradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-br';
    // Botón
    buttonBgColor?: string;
    buttonBgTransparent?: boolean;
    buttonTextColor?: string;
    buttonBorderColor?: string;
    buttonBorderWidth?: number;
    // Gradiente del botón (fondo)
    buttonUseGradient?: boolean;
    buttonGradientFrom?: string;
    buttonGradientTo?: string;
    buttonGradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
    // Gradiente del texto
    buttonTextUseGradient?: boolean;
    buttonTextGradientFrom?: string;
    buttonTextGradientTo?: string;
    buttonTextGradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
    // Gradiente del borde
    buttonBorderUseGradient?: boolean;
    buttonBorderGradientFrom?: string;
    buttonBorderGradientTo?: string;
    buttonBorderGradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
  };
  smallCard?: {
    bgColor?: string;
    borderColor?: string;
    hoverBorderColor?: string;
    titleColor?: string;
    excerptColor?: string;
    dateColor?: string;
    categoryBgColor?: string;
    categoryTextColor?: string;
  };
}

// Configuración por defecto de Todas las Noticias
export const DEFAULT_ALL_NEWS_CONFIG = {
  sectionTitle: 'Todas las Noticias',
  showIcon: true,
  postsPerPage: 6,
  fontFamily: 'Montserrat',
  // Layout
  layoutType: 'masonry' as const, // 'masonry' | 'grid' | 'list'
  // Colores de fondo por tema
  sectionBgColorLight: '#ffffff',
  sectionBgColorDark: '#0f172a',
  // Colores de título por tema
  sectionTitleColorLight: '#111827',
  sectionTitleColorDark: '#ffffff',
  sectionIconColorLight: '#2563eb',
  sectionIconColorDark: '#60a5fa',
  sectionIconBgLight: '#dbeafe',
  sectionIconBgDark: 'rgba(37, 99, 235, 0.2)',
  // Imagen de fondo
  sectionBgImageLight: '',
  sectionBgImageDark: '',
  sectionBgOverlayLight: 0,
  sectionBgOverlayDark: 0,
  // Tarjeta con imagen (overlay)
  imageCard: {
    overlayColor: 'rgba(0,0,0,0.7)',
    overlayOpacity: 0.7,
    titleColor: '#ffffff',
    categoryBgColor: '#8b5cf6',
    categoryTextColor: '#ffffff',
    authorNameColor: '#ffffff',
    authorDateColor: '#9ca3af',
    borderRadius: '16px',
    cardHeight: '400px',
    cardWidth: '100%',
    aspectRatio: 'portrait' as const
  },
  // Tarjeta solo texto
  textCard: {
    bgColor: '#1e1b4b',
    bgTransparent: false,
    titleColor: '#ffffff',
    titleUseGradient: false,
    titleGradientFrom: '#00ffff',
    titleGradientTo: '#ff00ff',
    titleGradientDirection: 'to-r' as const,
    excerptColor: '#d1d5db',
    tagBgColor: 'rgba(139, 92, 246, 0.3)',
    tagTextColor: '#c4b5fd',
    buttonText: 'Ver más',
    buttonBgColor: 'transparent',
    buttonBgTransparent: true,
    buttonUseGradient: false,
    buttonGradientFrom: '#3b82f6',
    buttonGradientTo: '#8b5cf6',
    buttonGradientDirection: 'to-r' as const,
    buttonTextColor: '#ffffff',
    buttonTextUseGradient: false,
    buttonTextGradientFrom: '#00ffff',
    buttonTextGradientTo: '#ff00ff',
    buttonTextGradientDirection: 'to-r' as const,
    buttonBorderColor: '#ffffff',
    buttonBorderUseGradient: false,
    buttonBorderGradientFrom: '#00ffff',
    buttonBorderGradientTo: '#ff00ff',
    buttonBorderGradientDirection: 'to-r' as const,
    buttonBorderWidth: 2,
    borderRadius: '16px',
    cardHeight: 'auto',
    cardWidth: '100%'
  },
  // Sidebar
  sidebar: {
    fontFamily: 'Montserrat',
    bgColor: 'transparent',
    showBorder: true,
    bgColorLight: '#ffffff',
    bgColorDark: '#1f2937',
    borderWidth: 1,
    borderColorLight: '#e5e7eb',
    borderColorDark: '#374151',
    borderRadius: '12px',
    padding: '16px',
    categoriesTitleColor: '#111827',
    categoriesTitleColorDark: '#ffffff',
    categoryItemColor: '#4b5563',
    categoryItemColorDark: '#d1d5db',
    categoryHoverColor: '#2563eb',
    tagsTitleColor: '#111827',
    tagsTitleColorDark: '#ffffff',
    tagBgColor: '#e5e7eb',
    tagBgColorDark: '#374151',
    tagTextColor: '#4b5563',
    tagTextColorDark: '#d1d5db',
    tagActiveBgColor: '#2563eb',
    tagActiveTextColor: '#ffffff',
    maxVisibleTags: 8
  },
  // Paginación
  paginationStyle: 'numbered' as const,
  // Paginación - Tema Claro
  paginationLight: {
    activeBg: '#8b5cf6',
    activeText: '#ffffff',
    activeUseGradient: false,
    activeGradientFrom: '#8b5cf6',
    activeGradientTo: '#06b6d4',
    activeGradientDirection: 'to-r' as const,
    inactiveBg: '#f3f4f6',
    inactiveText: '#374151',
    borderColor: '#d1d5db',
    borderRadius: '8px'
  },
  // Paginación - Tema Oscuro
  paginationDark: {
    activeBg: '#8b5cf6',
    activeText: '#ffffff',
    activeUseGradient: false,
    activeGradientFrom: '#8b5cf6',
    activeGradientTo: '#06b6d4',
    activeGradientDirection: 'to-r' as const,
    inactiveBg: '#1f2937',
    inactiveText: '#9ca3af',
    borderColor: '#374151',
    borderRadius: '8px'
  }
};

export interface AllNewsConfig {
  sectionTitle?: string;
  showIcon?: boolean;
  postsPerPage?: number;
  fontFamily?: string;
  layoutType?: 'masonry' | 'grid' | 'list';
  // Colores de fondo
  sectionBgColorLight?: string;
  sectionBgColorDark?: string;
  // Colores de título
  sectionTitleColorLight?: string;
  sectionTitleColorDark?: string;
  sectionIconColorLight?: string;
  sectionIconColorDark?: string;
  sectionIconBgLight?: string;
  sectionIconBgDark?: string;
  // Imagen de fondo
  sectionBgImageLight?: string;
  sectionBgImageDark?: string;
  sectionBgOverlayLight?: number;
  sectionBgOverlayDark?: number;
  // Tarjeta con imagen
  imageCard?: {
    overlayColor?: string;
    overlayOpacity?: number;
    titleColor?: string;
    categoryBgColor?: string;
    categoryTextColor?: string;
    categoryPosition?: 'left' | 'center' | 'right';
    authorNameColor?: string;
    authorDateColor?: string;
    borderRadius?: string;
    cardHeight?: string;
    cardWidth?: string;
    aspectRatio?: 'square' | 'landscape' | 'portrait' | 'wide' | 'custom';
  };
  // Tarjeta solo texto
  textCard?: {
    bgColor?: string;
    bgTransparent?: boolean;
    titleColor?: string;
    titleUseGradient?: boolean;
    titleGradientFrom?: string;
    titleGradientTo?: string;
    titleGradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
    excerptColor?: string;
    tagBgColor?: string;
    tagTextColor?: string;
    buttonText?: string;
    buttonBgColor?: string;
    buttonBgTransparent?: boolean;
    buttonUseGradient?: boolean;
    buttonGradientFrom?: string;
    buttonGradientTo?: string;
    buttonGradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
    buttonTextColor?: string;
    buttonTextUseGradient?: boolean;
    buttonTextGradientFrom?: string;
    buttonTextGradientTo?: string;
    buttonTextGradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
    buttonBorderColor?: string;
    buttonBorderUseGradient?: boolean;
    buttonBorderGradientFrom?: string;
    buttonBorderGradientTo?: string;
    buttonBorderGradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
    buttonBorderWidth?: number;
    borderRadius?: string;
    cardHeight?: string;
    cardWidth?: string;
  };
  // Sidebar
  sidebar?: {
    fontFamily?: string;
    transparentBg?: boolean;
    showBorder?: boolean;
    bgColor?: string;
    bgColorLight?: string;
    bgColorDark?: string;
    borderWidth?: number;
    borderColorLight?: string;
    borderColorDark?: string;
    borderRadius?: string;
    padding?: string;
    categoriesTitleColor?: string;
    categoriesTitleColorDark?: string;
    categoryItemColor?: string;
    categoryItemColorDark?: string;
    categoryHoverColor?: string;
    tagsTitleColor?: string;
    tagsTitleColorDark?: string;
    tagBgColor?: string;
    tagBgColorDark?: string;
    tagTextColor?: string;
    tagTextColorDark?: string;
    tagActiveBgColor?: string;
    tagActiveTextColor?: string;
    maxVisibleTags?: number;
  };
  // Paginación
  paginationStyle?: 'numbered' | 'simple' | 'loadMore';
  // Paginación por tema
  paginationLight?: {
    activeBg?: string;
    activeText?: string;
    activeUseGradient?: boolean;
    activeGradientFrom?: string;
    activeGradientTo?: string;
    activeGradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
    inactiveBg?: string;
    inactiveText?: string;
    borderColor?: string;
    borderRadius?: string;
  };
  paginationDark?: {
    activeBg?: string;
    activeText?: string;
    activeUseGradient?: boolean;
    activeGradientFrom?: string;
    activeGradientTo?: string;
    activeGradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
    inactiveBg?: string;
    inactiveText?: string;
    borderColor?: string;
    borderRadius?: string;
  };
  // Deprecados - mantener por compatibilidad
  paginationActiveBg?: string;
  paginationActiveText?: string;
  paginationInactiveBg?: string;
  paginationInactiveText?: string;
  paginationBorderColor?: string;
  paginationBorderRadius?: string;
}

export interface BlogCmsConfig {
  blogHero: BlogHeroConfig;
  featuredPosts: FeaturedPostsConfig;
  allNews: AllNewsConfig;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
}

export const useBlogCmsConfig = () => {
  const [config, setConfig] = useState<BlogCmsConfig>({
    blogHero: DEFAULT_BLOG_HERO_CONFIG,
    featuredPosts: DEFAULT_FEATURED_POSTS_CONFIG,
    allNews: DEFAULT_ALL_NEWS_CONFIG
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBlogConfig = async () => {
      try {
        setLoading(true);
        const pageData = await getPageBySlug('blog');
        
        if (pageData?.content) {
          setConfig({
            blogHero: {
              ...DEFAULT_BLOG_HERO_CONFIG,
              ...(pageData.content.blogHero || {}),
              stats: {
                ...DEFAULT_BLOG_HERO_CONFIG.stats,
                ...(pageData.content.blogHero?.stats || {})
              },
              search: {
                ...DEFAULT_BLOG_HERO_CONFIG.search,
                ...(pageData.content.blogHero?.search || {})
              },
              styles: {
                light: {
                  ...DEFAULT_BLOG_HERO_CONFIG.styles.light,
                  ...(pageData.content.blogHero?.styles?.light || {})
                },
                dark: {
                  ...DEFAULT_BLOG_HERO_CONFIG.styles.dark,
                  ...(pageData.content.blogHero?.styles?.dark || {})
                }
              }
            },
            featuredPosts: {
              ...DEFAULT_FEATURED_POSTS_CONFIG,
              ...(pageData.content.featuredPosts || {}),
              heroCard: {
                ...DEFAULT_FEATURED_POSTS_CONFIG.heroCard,
                ...(pageData.content.featuredPosts?.heroCard || {})
              },
              smallCard: {
                ...DEFAULT_FEATURED_POSTS_CONFIG.smallCard,
                ...(pageData.content.featuredPosts?.smallCard || {})
              }
            },
            allNews: {
              ...DEFAULT_ALL_NEWS_CONFIG,
              ...(pageData.content.allNews || {}),
              imageCard: {
                ...DEFAULT_ALL_NEWS_CONFIG.imageCard,
                ...(pageData.content.allNews?.imageCard || {})
              },
              textCard: {
                ...DEFAULT_ALL_NEWS_CONFIG.textCard,
                ...(pageData.content.allNews?.textCard || {})
              },
              sidebar: {
                ...DEFAULT_ALL_NEWS_CONFIG.sidebar,
                ...(pageData.content.allNews?.sidebar || {})
              }
            },
            seo: pageData.seo
          });
        }
      } catch (err) {
        console.warn('⚠️ No se pudo cargar la configuración del blog, usando valores por defecto');
        setError('Error cargando configuración');
        // Mantener la configuración por defecto
      } finally {
        setLoading(false);
      }
    };

    loadBlogConfig();
  }, []);

  return { config, loading, error };
};

export default useBlogCmsConfig;
