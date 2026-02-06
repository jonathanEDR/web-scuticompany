import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PublicHeader from '../../components/public/PublicHeader';
import HeroSection from '../../components/public/HeroSection';
import SolutionsSection from '../../components/public/SolutionsSection';
import ValueAddedSection from '../../components/public/ValueAddedSection';
import ClientLogosSection from '../../components/public/ClientLogosSection';
import FeaturedBlogSection from '../../components/public/FeaturedBlogSection';
import ContactSection from '../../components/public/ContactSection';
import PublicFooter from '../../components/public/PublicFooter';
import FloatingChatWidget from '../../components/floating-chat/FloatingChatWidget';
import { HomePageSchema } from '../../components/seo/SchemaOrg';
import { getPageBySlug, forceReload } from '../../services/cmsApi';
import { useTheme } from '../../contexts/ThemeContext';
import { useSiteConfig } from '../../hooks/useSiteConfig';
import { DEFAULT_HERO_CONFIG, DEFAULT_SOLUTIONS_CONFIG, DEFAULT_VALUE_ADDED_CONFIG, DEFAULT_CONTACT_CONFIG, DEFAULT_FEATURED_BLOG_CONFIG, DEFAULT_SEO_CONFIG } from '../../utils/defaultConfig';
import { useCategoriasList, type Categoria } from '../../hooks/useCategoriasCache';
import type { ThemeConfig } from '../../contexts/ThemeContext';
import type { ClientLogosContent } from '../../types/cms';
import type { DefaultFeaturedBlogConfig } from '../../utils/defaultConfig';


interface ButtonTheme {
  background: string;
  textColor: string;
  borderColor: string;
}

interface ExtendedThemeConfig extends ThemeConfig {
  lightMode: ThemeConfig['lightMode'] & {
    buttons?: {
      ctaPrimary?: ButtonTheme;
      contact?: ButtonTheme;
      dashboard?: ButtonTheme;
    };
  };
  darkMode: ThemeConfig['darkMode'] & {
    buttons?: {
      ctaPrimary?: ButtonTheme;
      contact?: ButtonTheme;
      dashboard?: ButtonTheme;
    };
  };
}

interface PageData {
  content: {
    hero: {
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
    };
    solutions: {
      title: string;
      subtitle: string;
      backgroundImage: {
        light: string;
        dark: string;
      };
      backgroundImageAlt: string;
      cards: Array<{
        id: string;
        title: string;
        description: string;
        icon: string;
        iconLight?: string;
        iconDark?: string;
      }>;
    };
    valueAdded: {
      title: string;
      subtitle?: string;
      backgroundImage: {
        light: string;
        dark: string;
      };
      backgroundImageAlt: string;
      cards: Array<{
        id: string;
        title: string;
        description: string;
        icon?: string; // Opcional, ahora usamos iconLight/iconDark
        iconLight?: string;
        iconDark?: string;
        gradient?: string;
      }>;
      logos?: Array<{
        _id: string;
        name: string;
        imageUrl: string;
        alt: string;
        link?: string;
        order: number;
      }>;
      logosBarDesign?: {
        light?: {
          animationsEnabled?: boolean;
          rotationMode?: 'none' | 'individual';
          animationSpeed?: 'slow' | 'normal' | 'fast';
          hoverEffects?: boolean;
          hoverIntensity?: 'light' | 'normal' | 'strong';
          glowEffects?: boolean;
          autoDetectTech?: boolean;
          logoSize?: 'small' | 'medium' | 'large';
          logoSpacing?: 'compact' | 'normal' | 'wide';
          logoFormat?: 'square' | 'rectangle' | 'original';
          maxLogoWidth?: 'small' | 'medium' | 'large';
          uniformSize?: boolean;
        };
        dark?: {
          animationsEnabled?: boolean;
          rotationMode?: 'none' | 'individual';
          animationSpeed?: 'slow' | 'normal' | 'fast';
          hoverEffects?: boolean;
          hoverIntensity?: 'light' | 'normal' | 'strong';
          glowEffects?: boolean;
          autoDetectTech?: boolean;
          logoSize?: 'small' | 'medium' | 'large';
          logoSpacing?: 'compact' | 'normal' | 'wide';
          logoFormat?: 'square' | 'rectangle' | 'original';
          maxLogoWidth?: 'small' | 'medium' | 'large';
          uniformSize?: boolean;
        };
      };
    };
    clientLogos?: ClientLogosContent;
    featuredBlog?: DefaultFeaturedBlogConfig;
    contactForm?: any;
  };
  seo: {
    focusKeyphrase?: string;  // Palabra clave principal para SEO
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
  };
  theme?: ExtendedThemeConfig;
}

// Función para agregar categorías a la configuración del CMS
const addCategoriasToConfig = (cmsConfig: any, categorias: Categoria[] = []) => {
  const configWithCategories = {
    ...cmsConfig,
    fields: {
      ...cmsConfig.fields,
      ...(categorias.length > 0 && {
        categoriaLabel: 'Servicio de Interés',
        categoriaPlaceholder: 'Selecciona el tipo de servicio que necesitas',
        categoriaRequired: false,
        categoriaEnabled: true,
      })
    }
  };
  
  return configWithCategories;
};

const DEFAULT_PAGE_DATA: PageData = {
  content: {
    hero: DEFAULT_HERO_CONFIG,
    solutions: DEFAULT_SOLUTIONS_CONFIG,
    valueAdded: DEFAULT_VALUE_ADDED_CONFIG,
    featuredBlog: DEFAULT_FEATURED_BLOG_CONFIG,
    contactForm: DEFAULT_CONTACT_CONFIG
  },
  seo: DEFAULT_SEO_CONFIG  // ✅ Importado de defaultConfig.ts (una sola fuente de verdad)
};

/**
 * Página Home Optimizada
 * - Renderiza contenido estático inmediatamente
 * - Carga datos del CMS en background sin bloquear
 * - Sin dependencias de autenticación
 */
const HomeOptimized = () => {
  const [pageData, setPageData] = useState<PageData>(DEFAULT_PAGE_DATA);
  const { setThemeConfig } = useTheme();
  
  // ✅ Configuración centralizada del sitio (sin hardcoded)
  const { config, getFullUrl, getImageUrl } = useSiteConfig();
  
  // 🚀 Usar hook con cache para categorías
  const { data: categorias } = useCategoriasList({ activas: true });
  
  // ✅ SOLUCIÓN: Usar SEO de pageData en lugar de hook separado (evita consulta duplicada)
  
  // ✅ Efecto inicial con cleanup - SIN limpiar caché automáticamente
  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const init = async () => {
      if (isMounted) {
        await loadPageData();
      }
    };

    init();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // 📍 Manejo de navegación a sección de contacto con cleanup
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const hash = window.location.hash;
    if (hash === '#contacto') {
      // Pequeño delay para asegurar que el contenido se haya renderizado
      timeoutId = setTimeout(() => {
        const contactoElement = document.getElementById('contacto');
        if (contactoElement) {
          contactoElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 500);
    }

    // ✅ Cleanup del timeout
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // ⏰ Sistema de eventos CMS - SOLO recargar cuando haya actualización real
  useEffect(() => {
    // ✅ ELIMINADO: setInterval que recargaba cada 5 minutos innecesariamente
    
    // Escuchar eventos de actualización del CMS
    const handleCMSUpdate = () => {
      loadPageData(true); // Forzar recarga cuando el CMS se actualiza
    };

    const handleClearCache = () => {
      loadPageData(true);
    };

    window.addEventListener('cmsUpdate', handleCMSUpdate);
    window.addEventListener('clearCache', handleClearCache);

    // ✅ Cleanup completo
    return () => {
      window.removeEventListener('cmsUpdate', handleCMSUpdate);
      window.removeEventListener('clearCache', handleClearCache);
    };
  }, []);

  const loadPageData = async (forceRefresh = false) => {
    try {
      
      // ✅ OPTIMIZACIÓN: Usar cache normalmente, forceReload solo cuando se pide explícitamente
      const data = forceRefresh 
        ? await forceReload('home')
        : await getPageBySlug('home');

      // Actualizar solo si obtuvimos datos válidos
      if (data && data.content) {
        setPageData(data);
        
        if (data.theme) {
          setThemeConfig(data.theme);
        }

        if (data.seo?.metaTitle) {
          document.title = data.seo.metaTitle;
        }
        
        window.dispatchEvent(new CustomEvent('pageDataUpdated', { 
          detail: { valueAdded: data.content.valueAdded } 
        }));
      }
    } catch (error) {
      console.error('Error cargando datos de página:', error);
    } finally {
    }
  };

  // ✅ Validar que la imagen OG sea una URL directa de imagen (no URLs de Facebook/redes sociales)
  const isValidOgImage = (url: string | undefined): boolean => {
    if (!url) return false;
    // Rechazar URLs de Facebook, Instagram, Twitter que no son imágenes directas
    const invalidPatterns = [
      'facebook.com/photo',
      'facebook.com/profile',
      'instagram.com/p/',
      'twitter.com/',
      'x.com/'
    ];
    return !invalidPatterns.some(pattern => url.includes(pattern));
  };

  // Obtener la imagen OG válida (prioriza CMS, pero valida que sea URL de imagen directa)
  const getValidOgImage = (): string => {
    const cmsImage = pageData.seo?.ogImage;
    if (cmsImage && isValidOgImage(cmsImage)) {
      // ✅ Si es una ruta relativa, convertir a absoluta usando configuración del sitio
      if (cmsImage.startsWith('/')) {
        return getFullUrl(cmsImage);
      }
      return cmsImage;
    }
    // ✅ Usar imagen por defecto de la configuración del sitio
    return getImageUrl(config.images.ogDefault);
  };

  const ogImage = getValidOgImage();

  return (
    <>
      {/* ✅ SEO Manual desde pageData (sin hook duplicado) */}
      <Helmet>
        <title>{pageData.seo?.metaTitle || DEFAULT_SEO_CONFIG.metaTitle}</title>
        <meta name="description" content={pageData.seo?.metaDescription || DEFAULT_SEO_CONFIG.metaDescription} />
        {/* Keywords: focusKeyphrase primero, luego las demás keywords (sin duplicados) */}
        <meta name="keywords" content={
          [...new Set([
            pageData.seo?.focusKeyphrase,
            ...(pageData.seo?.keywords || DEFAULT_SEO_CONFIG.keywords)
          ].filter(Boolean))].join(', ')
        } />
        {/* Focus Keyphrase como meta tag dedicado para SEO avanzado */}
        {pageData.seo?.focusKeyphrase && (
          <meta name="article:tag" content={pageData.seo.focusKeyphrase} />
        )}

        {/* Open Graph */}
        <meta property="og:title" content={pageData.seo?.ogTitle || pageData.seo?.metaTitle || DEFAULT_SEO_CONFIG.ogTitle} />
        <meta property="og:description" content={pageData.seo?.ogDescription || pageData.seo?.metaDescription || DEFAULT_SEO_CONFIG.ogDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${config.siteName} - ${config.siteDescription.substring(0, 50)}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={getFullUrl('/')} />
        <meta property="og:site_name" content={config.siteName} />
        <meta property="og:locale" content={config.locale} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageData.seo?.ogTitle || pageData.seo?.metaTitle || DEFAULT_SEO_CONFIG.ogTitle} />
        <meta name="twitter:description" content={pageData.seo?.ogDescription || pageData.seo?.metaDescription || DEFAULT_SEO_CONFIG.ogDescription} />
        <meta name="twitter:image" content={ogImage} />
        
        {/* Canonical */}
        <link rel="canonical" href={getFullUrl('/')} />
      </Helmet>
      
      {/* ✅ Schema.org - Datos estructurados para Google Rich Results */}
      <HomePageSchema />

      <div className="min-h-screen w-full overflow-x-hidden bg-transparent">
        <PublicHeader />
        <main className="w-full bg-transparent">
          <HeroSection data={pageData.content.hero} />
          <SolutionsSection 
            data={pageData.content.solutions} 
            themeConfig={pageData.theme}
          />
          <ValueAddedSection 
            data={pageData.content.valueAdded} 
            themeConfig={pageData.theme}
          />
          <ClientLogosSection 
            data={pageData.content.clientLogos}
          />

          <ContactSection 
            data={addCategoriasToConfig(pageData.content.contactForm, categorias)}
            categorias={categorias}
          />

          <FeaturedBlogSection 
            data={pageData.content.featuredBlog}
            themeConfig={pageData.theme}
          />
        </main>
        <PublicFooter />
        
        {/* 💬 Chatbot de Ventas Flotante */}
        <FloatingChatWidget />
        
      </div>
    </>
  );
};

export default HomeOptimized;
