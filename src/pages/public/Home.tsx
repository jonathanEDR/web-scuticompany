import { useState, useEffect } from 'react';
import PublicHeader from '../../components/public/PublicHeader';
import HeroSection from '../../components/public/HeroSection';
import SolutionsSection from '../../components/public/SolutionsSection';
import ValueAddedSection from '../../components/public/ValueAddedSection';
import ClientLogosSection from '../../components/public/ClientLogosSection';
import ContactSection from '../../components/public/ContactSection';
import PublicFooter from '../../components/public/PublicFooter';
import { getPageBySlug, clearCache, forceReload } from '../../services/cmsApi';
import { useTheme } from '../../contexts/ThemeContext';
import { useSeo } from '../../hooks/useSeo';
import { DEFAULT_HERO_CONFIG, DEFAULT_SOLUTIONS_CONFIG, DEFAULT_VALUE_ADDED_CONFIG, DEFAULT_CONTACT_CONFIG } from '../../utils/defaultConfig';
import { categoriasApi, type Categoria } from '../../services/categoriasApi';
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
    clientLogos?: ClientLogosContent;
    contactForm?: any;
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
    contactForm: DEFAULT_CONTACT_CONFIG
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
  const [pageData, setPageData] = useState<PageData>(DEFAULT_PAGE_DATA);
  const [isLoadingCMS, setIsLoadingCMS] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const { setThemeConfig } = useTheme();
    const { SeoHelmet } = useSeo({
      pageName: 'home',
      fallbackTitle: 'SCUTI Company - Transformamos tu empresa con tecnología inteligente',
      fallbackDescription: 'Soluciones digitales, desarrollo de software y modelos de IA personalizados para impulsar tu negocio.'
    });
  
  useEffect(() => {
    clearCache('page-home');
    loadPageData();
    loadCategorias();
  }, []);

  // Función para cargar categorías desde el CMS
  const loadCategorias = async () => {
    try {
      const response = await categoriasApi.getAll({ activas: true });
      setCategorias(response.data);
    } catch (error) {
      console.error('Error cargando categorías:', error);
      // En caso de error, usar array vacío (el selector se ocultará)
      setCategorias([]);
    }
  };

  // 📍 Manejo de navegación a sección de contacto
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#contacto') {
      // Pequeño delay para asegurar que el contenido se haya renderizado
      setTimeout(() => {
        const contactoElement = document.getElementById('contacto');
        if (contactoElement) {
          contactoElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 500);
    }
  }, []);

  // ⏰ Sistema de eventos CMS para mantener contenido sincronizado
  useEffect(() => {
    
    // Refrescar contenido cada 60 segundos (sin SEO)
    const interval = setInterval(() => {
      loadPageData(true); // Recarga silenciosa
    }, 60000); // 60 segundos

    // Escuchar eventos de actualización del CMS
    const handleCMSUpdate = () => {
      // Limpiar caché y forzar refresh cuando viene del CMS
      clearCache('page-home');
      loadPageData(true, true); // silent=true, forceRefresh=true
    };

    // Escuchar eventos de limpieza de caché
    const handleClearCache = () => {
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
      
      const data = forceRefresh 
        ? await forceReload('home')
        : await getPageBySlug('home', true);
      
      // Actualizar solo si obtuvimos datos válidos
      if (data && data.content) {
        // Eliminar datos de SEO para evitar conflictos con useSeo hook
        const dataWithoutSeo = {
          ...data,
          seo: undefined // El hook useSeo() maneja esto
        };
        
        setPageData(dataWithoutSeo);
        
        if (data.theme) {
          setThemeConfig(data.theme);
        }
        
        window.dispatchEvent(new CustomEvent('pageDataUpdated', { 
          detail: { valueAdded: data.content.valueAdded } 
        }));
      }
    } catch (error) {
      console.error('Error al cargar datos del CMS:', error);
    } finally {
      if (!silent) setIsLoadingCMS(false);
    }
  };

  return (
    <>
      <SeoHelmet />
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
