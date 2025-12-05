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
    buttonText: 'Buscar'
  },
  styles: {
    light: {
      titleColor: '#ffffff',
      titleHighlightColor: '#fde047',
      subtitleColor: '#bfdbfe',
      statsValueColor: '#ffffff',
      statsLabelColor: '#bfdbfe'
    },
    dark: {
      titleColor: '#ffffff',
      titleHighlightColor: '#fde047',
      subtitleColor: '#bfdbfe',
      statsValueColor: '#ffffff',
      statsLabelColor: '#bfdbfe'
    }
  }
};

export interface BlogHeroConfig {
  title: string;
  titleHighlight: string;
  subtitle: string;
  fontFamily?: string;
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
  search: {
    placeholder: string;
    buttonText: string;
  };
  styles: {
    light: {
      titleColor: string;
      titleHighlightColor: string;
      subtitleColor: string;
      statsValueColor: string;
      statsLabelColor: string;
    };
    dark: {
      titleColor: string;
      titleHighlightColor: string;
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
    tagBgColor: 'rgba(255,255,255,0.1)',
    tagTextColor: '#d1d5db',
    tagBorderColor: 'rgba(255,255,255,0.2)',
    // Botón
    buttonBgColor: 'transparent',
    buttonTextColor: '#00ffff',
    buttonBorderColor: '#00ffff',
    buttonBorderWidth: 2,
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
    tagTextColor?: string;
    tagBorderColor?: string;
    // Botón
    buttonBgColor?: string;
    buttonTextColor?: string;
    buttonBorderColor?: string;
    buttonBorderWidth?: number;
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
    borderRadius: '16px'
  },
  // Tarjeta solo texto
  textCard: {
    bgColor: '#1e1b4b',
    titleColor: '#ffffff',
    excerptColor: '#d1d5db',
    tagBgColor: 'rgba(139, 92, 246, 0.3)',
    tagTextColor: '#c4b5fd',
    buttonText: 'Ver más',
    buttonBgColor: 'transparent',
    buttonTextColor: '#ffffff',
    buttonBorderColor: '#ffffff',
    borderRadius: '16px'
  },
  // Sidebar
  sidebar: {
    fontFamily: 'Montserrat',
    bgColor: 'transparent',
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
    tagActiveTextColor: '#ffffff'
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
  };
  // Tarjeta solo texto
  textCard?: {
    bgColor?: string;
    titleColor?: string;
    excerptColor?: string;
    tagBgColor?: string;
    tagTextColor?: string;
    buttonText?: string;
    buttonBgColor?: string;
    buttonTextColor?: string;
    buttonBorderColor?: string;
    borderRadius?: string;
  };
  // Sidebar
  sidebar?: {
    fontFamily?: string;
    transparentBg?: boolean;
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
  };
  // Paginación
  paginationStyle?: 'numbered' | 'simple' | 'loadMore';
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
