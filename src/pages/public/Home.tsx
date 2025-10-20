import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PublicHeader from '../../components/public/PublicHeader';
import HeroSection from '../../components/public/HeroSection';
import SolutionsSection from '../../components/public/SolutionsSection';
import ValueAddedSection from '../../components/public/ValueAddedSection';
import PublicFooter from '../../components/public/PublicFooter';
import { getPageBySlug, clearCache, forceReload } from '../../services/cmsApi';
import { useTheme } from '../../contexts/ThemeContext';
import { DEFAULT_HERO_CONFIG, DEFAULT_SOLUTIONS_CONFIG, DEFAULT_VALUE_ADDED_CONFIG } from '../../utils/defaultConfig';
import type { ThemeConfig } from '../../contexts/ThemeContext';

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
    };
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
  };
  theme?: ExtendedThemeConfig;
}

// ⚡ Usar SOLO defaultConfig.ts como fuente única de verdad
const DEFAULT_PAGE_DATA: PageData = {
  content: {
    hero: DEFAULT_HERO_CONFIG,
    solutions: DEFAULT_SOLUTIONS_CONFIG,
    valueAdded: DEFAULT_VALUE_ADDED_CONFIG
  },
  seo: {
    metaTitle: 'Scuti Company - Transformamos tu empresa con tecnología inteligente',
    metaDescription: 'Soluciones digitales, desarrollo de software y modelos de IA personalizados para impulsar tu negocio.',
    keywords: ['tecnología', 'software', 'inteligencia artificial', 'desarrollo web', 'transformación digital'],
    ogTitle: 'Scuti Company - Tecnología Inteligente',
    ogDescription: 'Transformamos procesos con soluciones digitales y modelos de IA',
    ogImage: ''
  }
};

/**
 * Página Home Optimizada
 * - Renderiza contenido estático inmediatamente
 * - Carga datos del CMS en background sin bloquear
 * - Sin dependencias de autenticación
 */
const HomeOptimized = () => {
  // ⚡ Estado inicial con datos por defecto - RENDERIZA INMEDIATAMENTE
  const [pageData, setPageData] = useState<PageData>(DEFAULT_PAGE_DATA);
  const [isLoadingCMS, setIsLoadingCMS] = useState(false);
  const { setThemeConfig } = useTheme();

  // ⚡ Limpiar caché al montar el componente para asegurar datos frescos
  useEffect(() => {
    clearCache('page-home');
    
    // Cargar datos del CMS en background (no bloquea renderizado inicial)
    loadPageData();
  }, []);

  // Refrescar datos cada 60 segundos (reducido de 30s para mejor rendimiento)
  useEffect(() => {
    const interval = setInterval(() => {
      loadPageData(true); // Recarga silenciosa
    }, 60000); // 60 segundos

    // Escuchar eventos de actualización del CMS
    const handleCMSUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      // SIEMPRE limpiar caché y forzar refresh cuando viene de un evento CMS
      clearCache('page-home');
      loadPageData(true, true); // silent=true, forceRefresh=true
    };

    // Escuchar eventos de limpieza de caché
    const handleClearCache = (event: Event) => {
      clearCache('page-home');
      loadPageData(true, true);
    };

    window.addEventListener('cmsUpdate', handleCMSUpdate);
    window.addEventListener('clearCache', handleClearCache);

    return () => {
      clearInterval(interval);
      window.removeEventListener('cmsUpdate', handleCMSUpdate);
      window.removeEventListener('clearCache', handleClearCache);
    };
  }, []);

  const loadPageData = async (silent = false, forceRefresh = false) => {
    try {
      if (!silent) setIsLoadingCMS(true);
      
      // ⚡ Usar forceReload si necesitamos datos frescos, sino getPageBySlug con caché
      const data = forceRefresh 
        ? await forceReload('home')  // Limpia caché y recarga
        : await getPageBySlug('home', true); // Usa caché si está disponible
      
      // Actualizar solo si obtuvimos datos válidos
      if (data && data.content) {
        setPageData(data);
        
        // Cargar configuración de tema si existe
        if (data.theme) {
          setThemeConfig(data.theme);
        }
        
        // 📡 Disparar evento personalizado para notificar a componentes
        window.dispatchEvent(new CustomEvent('pageDataUpdated', { 
          detail: { valueAdded: data.content.valueAdded } 
        }));
      }
    } catch (error) {
      console.error('❌ Error al cargar datos del CMS:', error);
      // No hacer nada - ya tenemos datos por defecto
    } finally {
      if (!silent) setIsLoadingCMS(false);
    }
  };

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{pageData.seo.metaTitle}</title>
        <meta name="description" content={pageData.seo.metaDescription} />
        <meta name="keywords" content={pageData.seo.keywords.join(', ')} />
        
        {/* Open Graph */}
        <meta property="og:title" content={pageData.seo.ogTitle} />
        <meta property="og:description" content={pageData.seo.ogDescription} />
        {pageData.seo.ogImage && <meta property="og:image" content={pageData.seo.ogImage} />}
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageData.seo.ogTitle} />
        <meta name="twitter:description" content={pageData.seo.ogDescription} />
        {pageData.seo.ogImage && <meta name="twitter:image" content={pageData.seo.ogImage} />}
      </Helmet>

      {/* ⚡ Contenido se renderiza INMEDIATAMENTE sin esperar autenticación ni CMS */}
      <div className="min-h-screen bg-gray-900 w-full overflow-x-hidden">
        <PublicHeader />
        <main className="w-full">
          <HeroSection data={pageData.content.hero} />
          <SolutionsSection 
            data={pageData.content.solutions} 
            themeConfig={pageData.theme}
          />
          <ValueAddedSection 
            data={pageData.content.valueAdded} 
            themeConfig={pageData.theme}
          />
        </main>
        <PublicFooter />
        
        {/* Indicador sutil de carga del CMS (opcional) */}
        {isLoadingCMS && (
          <div className="fixed bottom-4 right-4 bg-purple-600 text-white px-3 py-2 rounded-lg shadow-lg text-sm z-50">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Actualizando contenido...
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HomeOptimized;
