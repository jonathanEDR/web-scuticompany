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
import PageLoader from '../../components/common/PageLoader';
import { HomePageSchema } from '../../components/seo/SchemaOrg';
import { getPageBySlug, forceReload, getCachedPageSync } from '../../services/cmsApi';
import { useTheme } from '../../contexts/ThemeContext';
import { useSiteConfig } from '../../hooks/useSiteConfig';
import { useCategoriasList, type Categoria } from '../../hooks/useCategoriasCache';
import type { ThemeConfig } from '../../contexts/ThemeContext';
import type { ClientLogosContent } from '../../types/cms';

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

interface FeaturedBlogConfig {
  headerIcon?: string;
  headerIconColor?: string;
  fontFamily?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: {
    light?: string;
    dark?: string;
  };
  backgroundImageAlt?: string;
  limit?: number;
  buttonText?: string;
  buttonLink?: string;
  styles?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
  cardsDesign?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
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
      styles?: {
        light?: Record<string, string>;
        dark?: Record<string, string>;
      };
    };
    solutions: {
      title: string;
      subtitle?: string;
      description?: string;
      backgroundImage?: {
        light?: string;
        dark?: string;
      };
      backgroundImageAlt?: string;
      cards?: Array<{
        id: string;
        title: string;
        description: string;
        icon?: string;
        iconLight?: string;
        iconDark?: string;
      }>;
      items?: Array<{
        id: string;
        title: string;
        description: string;
        icon?: string;
        iconLight?: string;
        iconDark?: string;
      }>;
    };
    valueAdded: {
      title: string;
      subtitle?: string;
      description?: string;
      backgroundImage?: {
        light?: string;
        dark?: string;
      };
      backgroundImageAlt?: string;
      cards?: Array<{
        id: string;
        title: string;
        description: string;
        icon?: string;
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
        light?: Record<string, unknown>;
        dark?: Record<string, unknown>;
      };
    };
    clientLogos?: ClientLogosContent;
    featuredBlog?: FeaturedBlogConfig;
    contactForm?: Record<string, unknown>;
  };
  seo?: {
    focusKeyphrase?: string;
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
  theme?: ExtendedThemeConfig;
}

// Función para agregar categorías a la configuración del CMS
const addCategoriasToConfig = (cmsConfig: Record<string, unknown> | undefined, categorias: Categoria[] = []): any => {
  if (!cmsConfig) return undefined;

  return {
    ...cmsConfig,
    fields: {
      ...(cmsConfig.fields as Record<string, unknown> || {}),
      ...(categorias.length > 0 && {
        categoriaLabel: 'Servicio de Interés',
        categoriaPlaceholder: 'Selecciona el tipo de servicio que necesitas',
        categoriaRequired: false,
        categoriaEnabled: true,
      })
    }
  };
};

/**
 * Página Home - Solo datos del CMS
 * - Usa PageLoader mientras carga datos
 * - Carga datos del CMS y renderiza cuando están disponibles
 * - Sin datos hardcodeados
 */
const HomeOptimized = () => {
  // Intentar obtener datos del caché de forma síncrona para evitar flash
  const cachedData = getCachedPageSync('home');

  const [pageData, setPageData] = useState<PageData | null>(cachedData);
  const [isLoading, setIsLoading] = useState(!cachedData);
  const { setThemeConfig, theme } = useTheme();

  // Configuración centralizada del sitio
  const { config, getFullUrl, getImageUrl } = useSiteConfig();

  // Hook con cache para categorías
  const { data: categorias } = useCategoriasList({ activas: true });

  // Efecto inicial - cargar datos del CMS
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

  // Manejo de navegación a sección de contacto
  useEffect(() => {
    if (!pageData) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const hash = window.location.hash;
    if (hash === '#contacto') {
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

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [pageData]);

  // Sistema de eventos CMS
  useEffect(() => {
    const handleCMSUpdate = () => {
      loadPageData(true);
    };

    const handleClearCache = () => {
      loadPageData(true);
    };

    window.addEventListener('cmsUpdate', handleCMSUpdate);
    window.addEventListener('clearCache', handleClearCache);

    return () => {
      window.removeEventListener('cmsUpdate', handleCMSUpdate);
      window.removeEventListener('clearCache', handleClearCache);
    };
  }, []);

  const loadPageData = async (forceRefresh = false) => {
    try {
      setIsLoading(true);

      const data = forceRefresh
        ? await forceReload('home')
        : await getPageBySlug('home');

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
      setIsLoading(false);
    }
  };

  // Validar que la imagen OG sea una URL directa de imagen
  const isValidOgImage = (url: string | undefined): boolean => {
    if (!url) return false;
    const invalidPatterns = [
      'facebook.com/photo',
      'facebook.com/profile',
      'instagram.com/p/',
      'twitter.com/',
      'x.com/'
    ];
    return !invalidPatterns.some(pattern => url.includes(pattern));
  };

  // Obtener la imagen OG válida
  const getValidOgImage = (): string => {
    const cmsImage = pageData?.seo?.ogImage;
    if (cmsImage && isValidOgImage(cmsImage)) {
      if (cmsImage.startsWith('/')) {
        return getFullUrl(cmsImage);
      }
      return cmsImage;
    }
    return getImageUrl(config.images.ogDefault);
  };

  // Mostrar loader mientras carga (solo si no hay datos en caché)
  if (isLoading && !pageData) {
    return <PageLoader fullScreen />;
  }

  // Si no hay datos después de cargar, mostrar mensaje de error
  if (!pageData) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="text-center p-8">
          <h1 className={`text-2xl font-bold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Error al cargar la página
          </h1>
          <p className={`mb-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            No se pudieron cargar los datos del CMS. Por favor, intenta nuevamente.
          </p>
          <button
            onClick={() => loadPageData(true)}
            className="px-6 py-3 rounded-full text-white font-semibold"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)' }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const ogImage = getValidOgImage();

  return (
    <>
      {/* SEO desde datos del CMS */}
      <Helmet>
        <title>{pageData.seo?.metaTitle || config.siteName}</title>
        <meta name="description" content={pageData.seo?.metaDescription || config.siteDescription} />
        {pageData.seo?.keywords && pageData.seo.keywords.length > 0 && (
          <meta name="keywords" content={
            [...new Set([
              pageData.seo?.focusKeyphrase,
              ...pageData.seo.keywords
            ].filter(Boolean))].join(', ')
          } />
        )}
        {pageData.seo?.focusKeyphrase && (
          <meta name="article:tag" content={pageData.seo.focusKeyphrase} />
        )}

        {/* Open Graph */}
        <meta property="og:title" content={pageData.seo?.ogTitle || pageData.seo?.metaTitle || config.siteName} />
        <meta property="og:description" content={pageData.seo?.ogDescription || pageData.seo?.metaDescription || config.siteDescription} />
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
        <meta name="twitter:title" content={pageData.seo?.ogTitle || pageData.seo?.metaTitle || config.siteName} />
        <meta name="twitter:description" content={pageData.seo?.ogDescription || pageData.seo?.metaDescription || config.siteDescription} />
        <meta name="twitter:image" content={ogImage} />

        {/* Canonical */}
        <link rel="canonical" href={getFullUrl('/')} />
      </Helmet>

      {/* Schema.org */}
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

        {/* Chatbot de Ventas Flotante */}
        <FloatingChatWidget />
      </div>
    </>
  );
};

export default HomeOptimized;
