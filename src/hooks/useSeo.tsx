import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getPageBySlug, forceReload } from '../services/cmsApi';

/**
 * 🎯 Hook de SEO Global
 * 
 * Sistema unificado de gestión de SEO para toda la aplicación:
 * - Páginas CMS: Carga datos dinámicos desde el servidor
 * - Páginas Dashboard: Utiliza configuración estática
 * - Manejo automático de React Helmet y meta tags
 * - Sistema de cache inteligente y eventos en tiempo real
 * 
 * @param pageName - Identificador de la página (ej: "home", "dashboard")
 * @param fallbackTitle - Título alternativo si no hay datos CMS
 * @param fallbackDescription - Descripción alternativa
 * 
 * @returns Estado de carga, datos SEO y componente Helmet optimizado
 */

interface SeoData {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
}

interface UseSeoOptions {
  pageName: string; // 'home', 'about', 'services', etc.
  fallbackTitle?: string;
  fallbackDescription?: string;
}

interface UseSeoReturn {
  seoData: SeoData;
  isLoading: boolean;
  SeoHelmet: () => React.ReactElement | null;
}

const DEFAULT_SEO: SeoData = {
  metaTitle: 'SCUTI Company',
  metaDescription: 'Empresa líder en desarrollo de software en Perú.',
  keywords: ['desarrollo', 'software', 'tecnología', 'IA', 'aplicaciones'],
  ogTitle: 'SCUTI Company',
  ogDescription: 'Empresa líder en desarrollo de software en Perú.',
  ogImage: ''
};

// 📋 Páginas que SÍ existen en el CMS y necesitan datos dinámicos
const CMS_PAGES = ['home', 'about', 'services', 'contact'];

// 📋 Páginas del dashboard que solo necesitan SEO estático
const DASHBOARD_PAGES = ['dashboard', 'cms', 'profile', 'settings', 'help', 'media'];

/**
 * 🎯 Hook global para manejo de SEO dinámico
 * - Para páginas CMS: Carga datos dinámicos desde la API
 * - Para páginas dashboard: Usa solo fallbacks (sin API calls)
 */
export function useSeo({ pageName, fallbackTitle, fallbackDescription }: UseSeoOptions): UseSeoReturn {
  const [seoData, setSeoData] = useState<SeoData>(() => ({
    ...DEFAULT_SEO,
    metaTitle: fallbackTitle || DEFAULT_SEO.metaTitle,
    metaDescription: fallbackDescription || DEFAULT_SEO.metaDescription,
  }));
  const [isLoading, setIsLoading] = useState(true);
  
  // 🎯 Determinar si la página necesita datos del CMS
  const needsCmsData = CMS_PAGES.includes(pageName);
  const isDashboardPage = DASHBOARD_PAGES.includes(pageName);

  // 🔄 Efecto para cargar datos de SEO (CMS o estático)
  useEffect(() => {
    const loadSeoData = async (forceRefresh = false) => {
      try {
        setIsLoading(true);
        
        // 🎯 Si es página del dashboard, usar solo fallbacks (sin API)
        if (isDashboardPage) {
          const staticSeoData: SeoData = {
            metaTitle: fallbackTitle || DEFAULT_SEO.metaTitle,
            metaDescription: fallbackDescription || DEFAULT_SEO.metaDescription,
            keywords: DEFAULT_SEO.keywords,
            ogTitle: fallbackTitle || DEFAULT_SEO.ogTitle,
            ogDescription: fallbackDescription || DEFAULT_SEO.ogDescription,
            ogImage: DEFAULT_SEO.ogImage
          };
          
          setSeoData(staticSeoData);
          document.title = staticSeoData.metaTitle;
          return;
        }
        
        // 🎯 Si es página CMS, cargar datos dinámicos
        if (needsCmsData) {
          const data = forceRefresh 
            ? await forceReload(pageName)  // Limpia caché y recarga
            : await getPageBySlug(pageName, true); // Usa caché si está disponible
          
          if (data && data.seo) {
            const newSeoData: SeoData = {
              metaTitle: data.seo.metaTitle || fallbackTitle || DEFAULT_SEO.metaTitle,
              metaDescription: data.seo.metaDescription || fallbackDescription || DEFAULT_SEO.metaDescription,
              keywords: data.seo.keywords || DEFAULT_SEO.keywords,
              ogTitle: data.seo.ogTitle || data.seo.metaTitle || fallbackTitle || DEFAULT_SEO.ogTitle,
              ogDescription: data.seo.ogDescription || data.seo.metaDescription || fallbackDescription || DEFAULT_SEO.ogDescription,
              ogImage: data.seo.ogImage || ''
            };
            
            setSeoData(newSeoData);
            document.title = newSeoData.metaTitle;
          }
        }
        
      } catch (error) {
        console.error(`❌ [useSeo] Error en "${pageName}":`, error);
      } finally {
        setIsLoading(false);
      }
    };

    // 🎯 Solo escuchar eventos CMS si la página necesita datos dinámicos
    const handleCMSUpdate = () => {
      if (needsCmsData) {
        loadSeoData(true); // Force refresh
      }
    };

    const handleClearCache = () => {
      if (needsCmsData) {
        loadSeoData(true); // Force refresh
      }
    };

    // Cargar datos inicial
    loadSeoData();

    // Solo registrar listeners para páginas CMS
    if (needsCmsData) {
      window.addEventListener('cmsUpdate', handleCMSUpdate);
      window.addEventListener('clearCache', handleClearCache);
    }

    return () => {
      if (needsCmsData) {
        window.removeEventListener('cmsUpdate', handleCMSUpdate);
        window.removeEventListener('clearCache', handleClearCache);
      }
    };
  }, [pageName, fallbackTitle, fallbackDescription]);

  // 🎯 Efecto para sincronizar cambios de SEO (solo si cambia el título)
  useEffect(() => {
    if (seoData.metaTitle && seoData.metaTitle !== document.title) {
      document.title = seoData.metaTitle;
    }
  }, [seoData.metaTitle, seoData.metaDescription, pageName]);

  // 🎨 Componente Helmet optimizado
  const SeoHelmet = () => {
    if (!seoData.metaTitle) return null;

    return (
      <Helmet key={`seo-${pageName}-${seoData.metaTitle}`} defer={false}>
        <title>{seoData.metaTitle}</title>
        <meta name="description" content={seoData.metaDescription} />
        <meta name="keywords" content={seoData.keywords.join(', ')} />
        
        {/* Open Graph */}
        <meta property="og:title" content={seoData.ogTitle} />
        <meta property="og:description" content={seoData.ogDescription} />
        {seoData.ogImage && <meta property="og:image" content={seoData.ogImage} />}
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.ogTitle} />
        <meta name="twitter:description" content={seoData.ogDescription} />
        {seoData.ogImage && <meta name="twitter:image" content={seoData.ogImage} />}
      </Helmet>
    );
  };

  return {
    seoData,
    isLoading,
    SeoHelmet
  };
}

export default useSeo;