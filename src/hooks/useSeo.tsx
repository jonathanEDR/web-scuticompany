import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { getPageBySlug, forceReload } from '../services/cmsApi';
import { getHardcodedSeo } from '../config/seoConfig';

const SITE_URL = 'https://scuticompany.com';

/**
 * Convierte URLs de imagen relativas a absolutas.
 * Google y redes sociales requieren URLs absolutas en og:image.
 */
function toAbsoluteImageUrl(url: string | undefined): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${SITE_URL}${url}`;
  return url;
}

/**
 * 🎯 Hook de SEO Global con Sistema de Prioridad
 * 
 * SISTEMA DE PRIORIDAD (DE MAYOR A MENOR):
 * 1. ✅ Datos del CMS (MongoDB) - PRIORIDAD MÁXIMA
 * 2. ✅ Configuración hardcodeada (seoConfig.ts)
 * 3. ✅ Fallbacks genéricos
 * 
 * Características:
 * - Páginas CMS: Carga datos dinámicos desde el servidor
 * - Páginas Dashboard: Utiliza configuración estática
 * - Logging transparente del origen de datos (DEV mode)
 * - Sistema de cache inteligente y eventos en tiempo real
 * 
 * @param pageName - Identificador de la página (ej: "home", "blog")
 * @param fallbackTitle - Título alternativo (usado solo si no hay CMS ni hardcoded)
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
  ogImageWidth?: string;
  ogImageHeight?: string;
  ogImageAlt?: string;
  canonical?: string;
  // Nuevos campos SEO avanzados
  canonicalUrl?: string;
  robots?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: Record<string, any> | null;
  // 🔍 Metadata para transparencia
  _source?: 'cms' | 'hardcoded' | 'fallback';
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
// ⚠️ NOTA: 'home' NO está aquí porque tiene su propio sistema de SEO (ver Home.tsx)
const CMS_PAGES = ['about', 'services', 'contact', 'blog'];

// 📋 Páginas del dashboard que solo necesitan SEO estático
const DASHBOARD_PAGES = ['dashboard', 'cms', 'profile', 'settings', 'help', 'media'];

/**
 * 🎯 Hook global para manejo de SEO con sistema de prioridad
 * PRIORIDAD: 1) CMS Database → 2) Hardcoded Config → 3) Fallbacks
 */
export function useSeo({ pageName, fallbackTitle, fallbackDescription }: UseSeoOptions): UseSeoReturn {
  // 🎯 Inicializar con configuración hardcodeada o fallback
  const [seoData, setSeoData] = useState<SeoData>(() => {
    const hardcodedSeo = getHardcodedSeo(pageName);
    
    if (hardcodedSeo) {
      // Usar configuración hardcodeada
      return {
        ...hardcodedSeo,
        _source: 'hardcoded'
      };
    }
    
    // Usar fallback genérico
    return {
      ...DEFAULT_SEO,
      metaTitle: fallbackTitle || DEFAULT_SEO.metaTitle,
      metaDescription: fallbackDescription || DEFAULT_SEO.metaDescription,
      _source: 'fallback'
    };
  });
  
  const [isLoading, setIsLoading] = useState(true);
  
  // 🎯 Determinar si la página necesita datos del CMS
  const needsCmsData = CMS_PAGES.includes(pageName);
  const isDashboardPage = DASHBOARD_PAGES.includes(pageName);

  // 🔄 Efecto para cargar datos de SEO (CMS o estático)
  useEffect(() => {
    const loadSeoData = async (forceRefresh = false) => {
      try {
        setIsLoading(true);
        
        // 🎯 Si es página del dashboard, usar solo hardcoded/fallbacks (sin API)
        if (isDashboardPage) {
          const hardcodedSeo = getHardcodedSeo(pageName);
          
          const staticSeoData: SeoData = hardcodedSeo ? {
            ...hardcodedSeo,
            _source: 'hardcoded'
          } : {
            metaTitle: fallbackTitle || DEFAULT_SEO.metaTitle,
            metaDescription: fallbackDescription || DEFAULT_SEO.metaDescription,
            keywords: DEFAULT_SEO.keywords,
            ogTitle: fallbackTitle || DEFAULT_SEO.ogTitle,
            ogDescription: fallbackDescription || DEFAULT_SEO.ogDescription,
            ogImage: DEFAULT_SEO.ogImage,
            _source: 'fallback'
          };
          
          setSeoData(staticSeoData);
          document.title = staticSeoData.metaTitle;
          
          // 📊 Log transparente en desarrollo
          if (import.meta.env.DEV) {
            // console.log(`🎯 [useSeo] "${pageName}" - Origen: ${staticSeoData._source?.toUpperCase()}`);
          }
          
          return;
        }
        
        // 🎯 Si es página CMS, intentar cargar datos dinámicos
        if (needsCmsData) {
          try {
            const data = forceRefresh 
              ? await forceReload(pageName)
              : await getPageBySlug(pageName, true);
            
            // ✅ PRIORIDAD 1: Datos del CMS (si existen y tienen contenido)
            if (data && data.seo && (data.seo.metaTitle || data.seo.metaDescription)) {
              const hardcodedSeo = getHardcodedSeo(pageName);
              
              const cmsSeoData: SeoData = {
                // Usar datos del CMS si existen, sino usar hardcoded, sino fallback
                metaTitle: data.seo.metaTitle || hardcodedSeo?.metaTitle || fallbackTitle || DEFAULT_SEO.metaTitle,
                metaDescription: data.seo.metaDescription || hardcodedSeo?.metaDescription || fallbackDescription || DEFAULT_SEO.metaDescription,
                keywords: (data.seo.keywords && data.seo.keywords.length > 0)
                  ? data.seo.keywords
                  : (hardcodedSeo?.keywords || DEFAULT_SEO.keywords),
                ogTitle: data.seo.ogTitle || data.seo.metaTitle || hardcodedSeo?.ogTitle || fallbackTitle || DEFAULT_SEO.ogTitle,
                ogDescription: data.seo.ogDescription || data.seo.metaDescription || hardcodedSeo?.ogDescription || fallbackDescription || DEFAULT_SEO.ogDescription,
                ogImage: toAbsoluteImageUrl(data.seo.ogImage || hardcodedSeo?.ogImage || ''),
                ogImageWidth: data.seo.ogImageWidth || hardcodedSeo?.ogImageWidth || '1200',
                ogImageHeight: data.seo.ogImageHeight || hardcodedSeo?.ogImageHeight || '630',
                ogImageAlt: data.seo.ogImageAlt || hardcodedSeo?.ogImageAlt || '',
                canonical: hardcodedSeo?.canonical,
                // Nuevos campos SEO del CMS
                canonicalUrl: data.seo.canonicalUrl || '',
                robots: data.seo.robots || 'index, follow, max-image-preview:large',
                ogType: data.seo.ogType || 'website',
                twitterCard: data.seo.twitterCard || hardcodedSeo?.twitterCard || 'summary_large_image',
                twitterTitle: data.seo.twitterTitle || '',
                twitterDescription: data.seo.twitterDescription || '',
                twitterImage: toAbsoluteImageUrl(data.seo.twitterImage || ''),
                structuredData: data.seo.structuredData || null,
                _source: 'cms'
              };
              
              setSeoData(cmsSeoData);
              document.title = cmsSeoData.metaTitle;
              
              // 📊 Log transparente en desarrollo
              if (import.meta.env.DEV) {
                console.log(`✅ [useSeo] "${pageName}" - Origen: CMS (Database)`);
                console.log(`   Title: ${cmsSeoData.metaTitle}`);
                console.log(`   Description: ${cmsSeoData.metaDescription.substring(0, 50)}...`);
              }
              
              return;
            }
            
            // Si el CMS no tiene datos, intentar hardcoded
            throw new Error('No SEO data in CMS');
            
          } catch (cmsError) {
            // ✅ PRIORIDAD 2: Configuración hardcodeada
            const hardcodedSeo = getHardcodedSeo(pageName);
            
            if (hardcodedSeo) {
              const hardcodedSeoData: SeoData = {
                ...hardcodedSeo,
                _source: 'hardcoded'
              };
              
              setSeoData(hardcodedSeoData);
              document.title = hardcodedSeoData.metaTitle;
              
              // 📊 Log transparente en desarrollo
              if (import.meta.env.DEV) {
                console.warn(`⚙️ [useSeo] "${pageName}" - Origen: HARDCODED (seoConfig.ts)`);
                console.warn(`   Razón: CMS no disponible o sin datos`);
              }
              
              return;
            }
            
            // ✅ PRIORIDAD 3: Fallbacks genéricos
            const fallbackSeoData: SeoData = {
              metaTitle: fallbackTitle || DEFAULT_SEO.metaTitle,
              metaDescription: fallbackDescription || DEFAULT_SEO.metaDescription,
              keywords: DEFAULT_SEO.keywords,
              ogTitle: fallbackTitle || DEFAULT_SEO.ogTitle,
              ogDescription: fallbackDescription || DEFAULT_SEO.ogDescription,
              ogImage: '',
              _source: 'fallback'
            };
            
            setSeoData(fallbackSeoData);
            document.title = fallbackSeoData.metaTitle;
            
            // 📊 Log transparente en desarrollo
            if (import.meta.env.DEV) {
              console.warn(`⚠️ [useSeo] "${pageName}" - Origen: FALLBACK`);
              console.warn(`   Razón: Sin CMS ni configuración hardcodeada`);
            }
          }
        }
        
      } catch (error) {
        // 🎯 Solo loguear en desarrollo
        if (import.meta.env.DEV) {
          console.error(`❌ [useSeo] Error crítico en "${pageName}":`, error);
        }
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
  }, [pageName, fallbackTitle, fallbackDescription, needsCmsData, isDashboardPage]);

  // 🎯 Efecto para sincronizar cambios de SEO (solo si cambia el título)
  useEffect(() => {
    if (seoData.metaTitle && seoData.metaTitle !== document.title) {
      document.title = seoData.metaTitle;
    }
  }, [seoData.metaTitle, seoData.metaDescription, pageName]);

  // 🎨 Componente Helmet optimizado
  const SeoHelmet = () => {
    if (!seoData.metaTitle) return null;

    // Resolver URLs y campos con fallbacks
    const resolvedCanonical = seoData.canonicalUrl || seoData.canonical || '';
    const resolvedTwitterTitle = seoData.twitterTitle || seoData.ogTitle;
    const resolvedTwitterDescription = seoData.twitterDescription || seoData.ogDescription;
    const resolvedTwitterImage = seoData.twitterImage || seoData.ogImage || '';
    const resolvedTwitterCard = seoData.twitterCard || 'summary_large_image';
    const resolvedOgType = seoData.ogType || 'website';

    return (
      <Helmet key={`seo-${pageName}-${seoData.metaTitle}`} defer={false}>
        <title>{seoData.metaTitle}</title>
        <meta name="description" content={seoData.metaDescription} />
        <meta name="keywords" content={seoData.keywords.join(', ')} />
        
        {/* Robots */}
        {seoData.robots && <meta name="robots" content={seoData.robots} />}
        
        {/* Canonical URL */}
        {resolvedCanonical && <link rel="canonical" href={resolvedCanonical} />}
        
        {/* Open Graph */}
        <meta property="og:title" content={seoData.ogTitle} />
        <meta property="og:description" content={seoData.ogDescription} />
        {seoData.ogImage && <meta property="og:image" content={seoData.ogImage} />}
        {seoData.ogImageWidth && <meta property="og:image:width" content={seoData.ogImageWidth} />}
        {seoData.ogImageHeight && <meta property="og:image:height" content={seoData.ogImageHeight} />}
        {seoData.ogImageAlt && <meta property="og:image:alt" content={seoData.ogImageAlt} />}
        <meta property="og:type" content={resolvedOgType} />
        {resolvedCanonical && <meta property="og:url" content={resolvedCanonical} />}
        <meta property="og:site_name" content="SCUTI Company" />
        <meta property="og:locale" content="es_PE" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content={resolvedTwitterCard} />
        <meta name="twitter:title" content={resolvedTwitterTitle} />
        <meta name="twitter:description" content={resolvedTwitterDescription} />
        {resolvedTwitterImage && <meta name="twitter:image" content={resolvedTwitterImage} />}
        {seoData.ogImageAlt && <meta name="twitter:image:alt" content={seoData.ogImageAlt} />}
        
        {/* Structured Data personalizado desde CMS */}
        {seoData.structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(seoData.structuredData)}
          </script>
        )}
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