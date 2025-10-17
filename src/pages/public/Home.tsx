import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PublicHeader from '../../components/public/PublicHeader';
import HeroSection from '../../components/public/HeroSection';
import SolutionsSection from '../../components/public/SolutionsSection';
import PublicFooter from '../../components/public/PublicFooter';
import { getPageBySlug } from '../../services/cmsApi';
import { useTheme } from '../../contexts/ThemeContext';
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
      description: string;
      backgroundImage?: {
        light?: string;
        dark?: string;
      };
      backgroundImageAlt?: string;
      items: Array<{
        icon: string;
        title: string;
        description: string;
        gradient: string;
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

// ⚡ Contenido por defecto - Se renderiza INMEDIATAMENTE
const DEFAULT_PAGE_DATA: PageData = {
  content: {
    hero: {
      title: 'Transformamos tu empresa con tecnología inteligente',
      subtitle: 'Innovamos para que tu empresa avance al ritmo de la tecnología.',
      description: 'Transformamos procesos con soluciones digitales, proyectos de software y modelos de IA personalizados.',
      ctaText: 'Conoce nuestros servicios',
      ctaLink: '#servicios'
    },
    solutions: {
      title: 'Soluciones',
      description: 'En el dinámico entorno empresarial de hoy, la tecnología es la columna vertebral del éxito.',
      items: [
        {
          icon: '🚀',
          title: 'Desarrollo de Software',
          description: 'Soluciones personalizadas para tu negocio',
          gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        {
          icon: '🤖',
          title: 'Inteligencia Artificial',
          description: 'Modelos de IA adaptados a tus necesidades',
          gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        },
        {
          icon: '☁️',
          title: 'Soluciones Cloud',
          description: 'Infraestructura escalable y segura',
          gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        }
      ]
    }
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

  useEffect(() => {
    // Cargar datos del CMS en background (no bloquea renderizado inicial)
    loadPageData();
  }, []);

  // Refrescar datos cada 60 segundos (reducido de 30s para mejor rendimiento)
  useEffect(() => {
    const interval = setInterval(() => {
      loadPageData(true); // Recarga silenciosa
    }, 60000); // 60 segundos

    // Escuchar eventos de actualización del CMS
    const handleCMSUpdate = () => {
      loadPageData(true);
    };

    window.addEventListener('cmsUpdate', handleCMSUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('cmsUpdate', handleCMSUpdate);
    };
  }, []);

  const loadPageData = async (silent = false) => {
    try {
      if (!silent) setIsLoadingCMS(true);
      
      console.log('🔄 Intentando cargar datos del CMS...');
      
      // Intentar obtener datos del CMS
      const data = await getPageBySlug('home');
      
      console.log('📦 Datos recibidos del CMS:', data);
      
      // Actualizar solo si obtuvimos datos válidos
      if (data && data.content) {
        console.log('✅ Aplicando datos del CMS a la página');
        setPageData(data);
        
        // Cargar configuración de tema si existe
        if (data.theme) {
          console.log('🎨 Aplicando configuración de tema del CMS');
          setThemeConfig(data.theme);
        }
      } else {
        console.warn('⚠️ Datos del CMS inválidos o vacíos, manteniendo valores por defecto');
      }
    } catch (error) {
      console.error('❌ Error al cargar datos del CMS:', error);
      console.warn('⚠️ Usando contenido por defecto debido al error');
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
      <div className="min-h-screen bg-gray-900">
        <PublicHeader />
        <main>
          <HeroSection data={pageData.content.hero} />
          <SolutionsSection data={pageData.content.solutions} />
        </main>
        <PublicFooter />
        
        {/* Indicador sutil de carga del CMS (opcional) */}
        {isLoadingCMS && (
          <div className="fixed bottom-4 right-4 bg-purple-600 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
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
