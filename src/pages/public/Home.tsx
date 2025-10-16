import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PublicHeader from '../../components/public/PublicHeader';
import HeroSection from '../../components/public/HeroSection';
import SolutionsSection from '../../components/public/SolutionsSection';
import PublicFooter from '../../components/public/PublicFooter';
import ThemeDebugger from '../../components/ThemeDebugger';
import ThemeSyncIndicator from '../../components/ThemeSyncIndicator';
import CSSVariablesDebug from '../../components/CSSVariablesDebug';
import { getPageBySlug } from '../../services/cmsApi';
import { useTheme } from '../../contexts/ThemeContext';
import type { ThemeConfig } from '../../contexts/ThemeContext';

interface ButtonTheme {
  bg: string;
  text: string;
  border?: string;
  hover: string;
  hoverText?: string;
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

const Home = () => {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const { setThemeConfig } = useTheme();

  useEffect(() => {
    if (!pageData && loading) {
      loadPageData();
    }
  }, [pageData, loading]);

  const loadPageData = async () => {
    if (!loading) return; // Evitar múltiples cargas
    
    try {
      const data = await getPageBySlug('home');
      
      setPageData(data);
      
      // Cargar configuración de tema si existe
      if (data.theme) {
        setThemeConfig(data.theme);
      }
    } catch (error) {
      console.error('Error al cargar página:', error);
      // Usar datos por defecto si falla
      setPageData({
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
            items: []
          }
        },
        seo: {
          metaTitle: 'Scuti Company - Tecnología Inteligente',
          metaDescription: 'Transformamos tu empresa con tecnología inteligente',
          keywords: ['tecnología', 'software', 'IA'],
          ogTitle: 'Scuti Company',
          ogDescription: 'Transformamos tu empresa con tecnología inteligente',
          ogImage: ''
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Error al cargar la página</div>
      </div>
    );
  }

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
        <meta property="og:image" content={pageData.seo.ogImage} />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageData.seo.ogTitle} />
        <meta name="twitter:description" content={pageData.seo.ogDescription} />
        <meta name="twitter:image" content={pageData.seo.ogImage} />
      </Helmet>

      <div className="min-h-screen bg-gray-900">
        <PublicHeader />
        <main>
          <HeroSection data={pageData.content.hero} />
          <SolutionsSection data={pageData.content.solutions} />
        </main>
        <PublicFooter />
        
        {/* Debug components - solo para desarrollo */}
        <CSSVariablesDebug />
        <ThemeDebugger />
        <ThemeSyncIndicator />
      </div>
    </>
  );
};

export default Home;
