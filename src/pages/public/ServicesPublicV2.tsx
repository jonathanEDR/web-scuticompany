/**
 * 🌟 PÁGINA PÚBLICA DE SERVICIOS MEJORADA
 * Vista optimizada para mostrar servicios al público con filtros y búsqueda
 * ⚡ Optimizada con lazy loading y React.memo
 */

import { useState, useMemo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';
import FloatingChatWidget from '../../components/floating-chat/FloatingChatWidget';
import { ServicioPublicCard } from '../../components/public/ServicioPublicCard';
import { ServicesAccordionList } from '../../components/public/ServicesAccordionList';
import { useTheme } from '../../contexts/ThemeContext';
import { useServiciosList } from '../../hooks/useServiciosCache';
import { useCategoriasList } from '../../hooks/useCategoriasCache';
import { invalidateServiciosCache } from '../../utils/serviciosCache';
import { getPageBySlug } from '../../services/cmsApi';
import { useSiteConfig } from '../../hooks/useSiteConfig';
import type { Servicio, ServicioFilters } from '../../types/servicios';

// ============================================
// COMPONENTE FAQ ACCORDION ITEM
// ============================================
const FaqAccordionItem = ({ question, answer, theme }: { question: string; answer: string; theme: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
      theme === 'dark'
        ? 'bg-transparent border-white/20 hover:border-white/40'
        : `backdrop-blur-md ${isOpen ? 'border-purple-200 bg-white/70 shadow-lg shadow-purple-500/10' : 'border-gray-200/50 bg-white/50 hover:border-gray-300'}`
    }`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
      >
        <span className={`text-base font-semibold pr-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{question}</span>
        <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? 'bg-purple-600 text-white rotate-180' 
            : (theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500')
        }`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className={`px-5 pb-5 leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {answer}
        </div>
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const ServicesPublicV2 = () => {
  // ============================================
  // ESTADO
  // ============================================

  // 🆕 Configuración centralizada del sitio
  const { config, getFullUrl, getImageUrl } = useSiteConfig();

  // Obtener query params de la URL
  const [searchParams] = useSearchParams();

  const [busqueda, setBusqueda] = useState('');
  // Inicializar categoría desde query param si existe
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>(
    searchParams.get('categoria') || ''
  );
  const [ordenamiento, setOrdenamiento] = useState<string>('destacado');

  // Sincronizar categoría cuando cambia la URL
  useEffect(() => {
    const categoriaFromUrl = searchParams.get('categoria');
    if (categoriaFromUrl !== null && categoriaFromUrl !== categoriaSeleccionada) {
      setCategoriaSeleccionada(categoriaFromUrl);
    }
  }, [searchParams]);
  
  // 🚀 Usar hook con cache para categorías
  const { data: categorias } = useCategoriasList({ activas: true });
  
  // 🆕 Estado para datos del CMS (hero, etc.)
  const [pageData, setPageData] = useState<any>(null);
  
  // 🎠 Estado para el carrusel de servicios destacados
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  
  // 🎨 Obtener tema actual para mostrar imagen correcta
  const { theme: currentTheme } = useTheme();
  
  // 🖼️ Obtener imagen de fondo según el tema
  const getBackgroundImage = () => {
    const bgImage = pageData?.content?.hero?.backgroundImage;
    if (!bgImage) return null;
    if (typeof bgImage === 'string') return bgImage;
    return currentTheme === 'light' 
      ? (bgImage.light || bgImage.dark) 
      : (bgImage.dark || bgImage.light);
  };

  // 🆕 Cargar datos del CMS para la página de servicios
  useEffect(() => {
    const loadPageData = async () => {
      try {
        const data = await getPageBySlug('services');
        // console.log('📄 [Services] Datos del CMS cargados:', data);
        setPageData(data);
      } catch (error) {
        // console.warn('⚠️ [Services] No se pudieron cargar datos del CMS:', error);
        // Usar valores por defecto si no hay datos
        setPageData(null);
      }
    };

    loadPageData();
  }, []);

  // 🎠 Funciones para el carrusel de servicios destacados
  const checkCarouselScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
      
      // Calcular slide actual basado en el scroll
      const slideWidth = clientWidth;
      const calculatedSlide = Math.round(scrollLeft / slideWidth);
      setCurrentSlide(calculatedSlide);
    }
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.85; // Desplazar 85% del ancho visible
      const newScrollLeft = direction === 'left' 
        ? Math.max(0, carouselRef.current.scrollLeft - scrollAmount)
        : carouselRef.current.scrollLeft + scrollAmount;
      
      carouselRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
      
      // Forzar verificación después del scroll
      setTimeout(() => checkCarouselScroll(), 400);
    }
  };
  
  const scrollToSlide = (index: number) => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.clientWidth;
      carouselRef.current.scrollTo({
        left: slideWidth * index,
        behavior: 'smooth'
      });
      setTimeout(() => checkCarouselScroll(), 400);
    }
  };

  // Verificar scroll del carrusel cuando cambian los servicios
  useEffect(() => {
    const timer = setTimeout(() => {
      checkCarouselScroll();
    }, 100);
    
    // Agregar listener para actualizar flechas al hacer scroll
    const carousel = carouselRef.current;
    if (carousel) {
      const handleScroll = () => {
        checkCarouselScroll();
      };
      
      carousel.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
      
      return () => {
        clearTimeout(timer);
        carousel.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }
    
    return () => clearTimeout(timer);
  }, []); // Sin dependencias para evitar re-renders

  // ============================================
  // FILTROS PARA EL CACHE - INCLUYEN BÚSQUEDA Y CATEGORÍA
  // ============================================

  const filtros: ServicioFilters = useMemo(() => ({
    visibleEnWeb: true,
    activo: true,
    limit: 100, // Obtener todos los servicios para paginar en frontend
    ...(busqueda && { search: busqueda }),
    ...(categoriaSeleccionada && { categoria: categoriaSeleccionada }),
    sort: ordenamiento === 'destacado' ? '-destacado,-createdAt' : ordenamiento
  }), [busqueda, categoriaSeleccionada, ordenamiento]);

  // ============================================
  // HOOK DE CACHE - REEMPLAZA USEEFFECT + API CALL
  // ============================================

  const {
    data: serviciosResponse = null,
    loading,
    error,
    refetch: recargarServicios,
    // isFromCache - removido porque no se usa actualmente
  } = useServiciosList(filtros, {
    enabled: true,
    onError: () => {
      // Error manejado por el hook
    }
  });

  // Extraer servicios del response
  const servicios = serviciosResponse?.data || [];

  // 🔄 Función para invalidar cache y recargar
  const recargarConInvalidacion = async () => {
    try {
      // 1. Invalidar cache local
      invalidateServiciosCache();
      
      // 2. Recargar servicios
      await recargarServicios();
    } catch (error) {
      // Error manejado silenciosamente
    }
  };

  // ============================================
  // SEO - Hardcoded para indexación inmediata
  // ============================================

  // ============================================
  // FUNCIONES OPTIMIZADAS CON MEMOIZATION
  // ============================================

  // El backend ya devuelve los datos filtrados y ordenados
  const serviciosFiltrados = servicios || [];
  
  // Separar destacados del resto
  const serviciosDestacados = serviciosFiltrados.filter((s: Servicio) => s.destacado);

  // ============================================
  // RENDER
  // ============================================

  return (
    <>
      {/* ✅ SEO usando configuración centralizada */}
      <Helmet>
        <title>Nuestros Servicios{config.seo.titleSuffix}</title>
        <meta name="description" content="Consultoría IT, Proyectos Tecnológicos e Inteligencia Artificial para impulsar tu negocio. Soluciones de desarrollo de software a medida." />
        <meta name="keywords" content="servicios, consultoría, tecnología, software, inteligencia artificial, desarrollo web, aplicaciones móviles, soluciones digitales" />

        {/* Open Graph - ✅ Usando configuración centralizada */}
        <meta property="og:title" content={`Servicios de Desarrollo de Software${config.seo.titleSuffix}`} />
        <meta property="og:description" content={`Consultoría IT, desarrollo web/móvil e Inteligencia Artificial para impulsar tu negocio. Soluciones tecnológicas a medida en ${config.country}.`} />
        <meta property="og:image" content={getImageUrl(config.images.ogServices)} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`${config.siteName} - Servicios de desarrollo de software y consultoría IT`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={getFullUrl('/servicios')} />
        <meta property="og:site_name" content={config.siteName} />
        <meta property="og:locale" content={config.locale} />

        {/* Twitter Card - ✅ Usando configuración centralizada */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Servicios de Desarrollo de Software${config.seo.titleSuffix}`} />
        <meta name="twitter:description" content="Consultoría IT, desarrollo web/móvil e Inteligencia Artificial para impulsar tu negocio." />
        <meta name="twitter:image" content={getImageUrl(config.images.ogServices)} />
        <meta name="twitter:image:alt" content={`${config.siteName} - Servicios de desarrollo de software y consultoría IT`} />

        {/* Canonical */}
        <link rel="canonical" href={getFullUrl('/servicios')} />

        {/* Schema.org - Service Catalog */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": `Servicios de Desarrollo de Software - ${config.siteName}`,
            "description": `Catálogo de servicios de desarrollo de software, consultoría IT e inteligencia artificial para empresas PYMES en ${config.country}`,
            "url": getFullUrl('/servicios'),
            "numberOfItems": servicios?.length || 24,
            "itemListElement": servicios?.slice(0, 10).map((servicio: Servicio, index: number) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Service",
                "name": servicio.titulo,
                "description": servicio.descripcionCorta || servicio.descripcion?.substring(0, 160),
                "url": getFullUrl(`/servicios/${servicio.slug}`),
                "provider": {
                  "@type": "Organization",
                  "name": config.siteName,
                  "url": config.siteUrl
                },
                "areaServed": {
                  "@type": "Country",
                  "name": config.country
                }
              }
            })) || []
          })}
        </script>

        {/* Schema.org - FAQ Page (SEO para preguntas frecuentes) */}
        {(() => {
          const faq = (pageData?.content as any)?.faq || {};
          if (faq.enabled === false) return null;
          const defaultFaqItems = [
            { question: '¿Cuánto tiempo toma desarrollar un sistema personalizado?', answer: 'El tiempo varía según la complejidad. Un prototipo MVP funcional puede estar listo en 4 a 6 semanas, mientras que sistemas ERP o CRM completos suelen tomar de 3 a 5 meses.' },
            { question: '¿El software será de mi propiedad o tendré que pagar mensualidades?', answer: 'En Scut1 Company entregamos la propiedad total del código y la documentación. No dependes de licencias mensuales; el sistema es un activo de tu empresa.' },
            { question: '¿Qué pasa si mi empresa crece y necesito más funciones?', answer: 'Desarrollamos bajo una arquitectura escalable. Esto significa que podemos añadir nuevos módulos o integraciones en el futuro sin necesidad de rehacer el sistema desde cero.' },
            { question: '¿Pueden integrar el nuevo software con mis sistemas actuales (Excel, SAP, etc.)?', answer: 'Sí, somos especialistas en integración de sistemas para que la información fluya sin interrupciones entre tus herramientas actuales y el nuevo software.' }
          ];
          const faqItems = faq.items?.length > 0 ? faq.items : defaultFaqItems;
          return (
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": faqItems.map((item: any) => ({
                  "@type": "Question",
                  "name": item.question,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item.answer
                  }
                }))
              })}
            </script>
          );
        })()}
      </Helmet>

      <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <PublicHeader />
        
        {/* 🖼️ Hero Section con imagen de fondo del CMS - SIN margen inferior para eliminar línea */}
        <section className="relative overflow-hidden -mt-12 -mx-4 px-4" style={{ minHeight: '500px' }}>
          {/* Imagen de fondo con opacidad configurable */}
          {(() => {
            const bgImage = getBackgroundImage();
            // Usar opacidad del hero si está configurada, si no usar la de servicesGrid como fallback
            const heroOpacity = pageData?.content?.hero?.backgroundOpacity 
              || (pageData?.content as any)?.servicesGrid?.featuredSection?.backgroundOpacity 
              || 0.8;
            
            // Calcular opacidad del overlay basada en la opacidad de la imagen
            const overlayOpacity = heroOpacity >= 0.7 ? 0.2 : heroOpacity >= 0.4 ? 0.4 : 0.6;
            
            return bgImage ? (
              <>
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
                  style={{
                    backgroundImage: 'url(' + bgImage + ')',
                    opacity: heroOpacity
                  }}
                  aria-label={pageData?.content?.hero?.backgroundImageAlt || 'Servicios background'}
                />
                {/* Overlay gradiente dinámico */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: currentTheme === 'dark'
                      ? 'linear-gradient(180deg, transparent 0%, rgba(17, 24, 39, ' + overlayOpacity + ') 100%)'
                      : 'linear-gradient(180deg, transparent 0%, rgba(249, 250, 251, ' + overlayOpacity + ') 100%)'
                  }}
                />
              </>
            ) : null;
          })()}
          
          {/* Contenido del Hero - Posicionado en la parte inferior (debajo del centro) */}
          <div className="relative z-10 container mx-auto h-full flex items-end pb-12 md:pb-16" style={{ minHeight: '500px' }}>
            <div className="text-center animate-fade-in-down max-w-4xl mx-auto w-full">
              <h1 
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-1 leading-none"
                dangerouslySetInnerHTML={{ 
                  __html: pageData?.content?.hero?.title || 'Nuestros <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Servicios</span>'
                }}
              />
              <p 
                className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mt-1 mb-0 leading-tight"
                dangerouslySetInnerHTML={{ 
                  __html: pageData?.content?.hero?.subtitle || 'Soluciones digitales de vanguardia diseñadas para impulsar tu negocio hacia el éxito'
                }}
              />
              {/* Descripción adicional si existe */}
              {pageData?.content?.hero?.description && (
                <p 
                  className="text-sm text-gray-500 dark:text-gray-400 max-w-3xl mx-auto mt-1 leading-tight"
                  dangerouslySetInnerHTML={{ 
                    __html: pageData.content.hero.description
                  }}
                />
              )}
            </div>
          </div>
          
          {/* Extensión del hero hacia abajo para eliminar línea */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
            style={{
              background: currentTheme === 'dark'
                ? 'linear-gradient(to bottom, transparent, rgba(17, 24, 39, 0))'
                : 'linear-gradient(to bottom, transparent, rgba(249, 250, 251, 0))'
            }}
          />
        </section>

        {/* Main sin padding top para conectar con hero */}
        <main className="container mx-auto px-4 -mt-8">

          {/* Layout con Sidebar + Contenido - Ahora con imagen de fondo compartida */}
          <div className="max-w-7xl mx-auto">
            {/* 🖼️ Contenedor con imagen de fondo que cubre filtros + sección destacada */}
            <div className="relative">
              {/* Imagen de fondo compartida - AHORA CUBRE TODO EL ANCHO */}
              {(() => {
                const bgImage = (pageData?.content as any)?.servicesGrid?.featuredSection?.backgroundImage;
                const currentBg = bgImage ? (currentTheme === 'light' ? bgImage.light : bgImage.dark) : null;
                // Opacidad configurable (5% a 100%)
                const opacity = (pageData?.content as any)?.servicesGrid?.featuredSection?.backgroundOpacity || 0.15;
                
                // Solo mostrar si hay servicios destacados
                const hasDestacados = serviciosDestacados.length > 0;
                
                // Calcular opacidad del overlay basada en la opacidad de la imagen
                const overlayOpacity = opacity >= 0.7 ? 0.2 : opacity >= 0.4 ? 0.4 : 0.6;
                
                return currentBg && hasDestacados ? (
                  <div 
                    className="absolute inset-0 overflow-hidden pointer-events-none"
                    style={{ 
                      zIndex: 0,
                      // Extender más allá del contenedor para cubrir todo el ancho
                      left: '50%',
                      right: '50%',
                      marginLeft: '-50vw',
                      marginRight: '-50vw',
                      width: '100vw',
                      // La altura se ajusta dinámicamente
                      minHeight: '100%'
                    }}
                  >
                    <div 
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{ 
                        backgroundImage: `url(${currentBg})`,
                        opacity: opacity
                      }}
                    />
                    {/* Overlay gradiente sutil - solo en los bordes para transición suave */}
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: currentTheme === 'dark'
                          ? `linear-gradient(180deg, transparent 0%, rgba(17, 24, 39, ${overlayOpacity}) 100%)`
                          : `linear-gradient(180deg, transparent 0%, rgba(249, 250, 251, ${overlayOpacity}) 100%)`
                      }}
                    />
                  </div>
                ) : null;
              })()}
              
              {/* Contenido principal */}
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row gap-8 p-4">
              
              {/* SIDEBAR - Barra Lateral de Filtros con estilos del CMS */}
              {/* En móvil: 100% ancho, En desktop: ancho fijo (20rem = 320px por defecto) */}
              <aside className="w-full lg:w-80 lg:flex-shrink-0 animate-fade-in delay-100">
                {/* Contenedor con borde gradiente */}
                {(() => {
                  const styles = pageData?.content?.servicesFilter?.styles;
                  const isDark = currentTheme === 'dark';
                  
                  // Verificar si el fondo es transparente
                  const isTransparent = isDark 
                    ? (styles?.bgTransparentDark === true || styles?.bgTransparentDark === 'true')
                    : (styles?.bgTransparent === true || styles?.bgTransparent === 'true');
                  
                  // Obtener el estilo de borde según el tema
                  const borderStyle = isDark 
                    ? (styles?.borderStyleDark || styles?.borderStyle || 'gradient')
                    : (styles?.borderStyle || 'gradient');
                  
                  const borderWidth = styles?.borderWidth || '2px';
                  const borderRadius = styles?.borderRadius || '1rem';
                  
                  // Obtener color/gradiente del borde
                  const getBorderBackground = () => {
                    if (borderStyle === 'none') return 'transparent';
                    
                    if (borderStyle === 'solid') {
                      return isDark 
                        ? (styles?.borderColorDark || styles?.borderColor || '#A78BFA')
                        : (styles?.borderColor || '#8B5CF6');
                    }
                    
                    // Gradiente
                    const direction = isDark 
                      ? (styles?.borderGradientDirectionDark || styles?.borderGradientDirection || '135deg')
                      : (styles?.borderGradientDirection || '135deg');
                    const from = isDark 
                      ? (styles?.borderGradientFromDark || '#A78BFA')
                      : (styles?.borderGradientFrom || '#8B5CF6');
                    const to = isDark 
                      ? (styles?.borderGradientToDark || '#22D3EE')
                      : (styles?.borderGradientTo || '#06B6D4');
                    
                    return `linear-gradient(${direction}, ${from}, ${to})`;
                  };
                  
                  // Obtener color de fondo
                  const getBackgroundColor = () => {
                    if (isTransparent) return 'transparent';
                    return isDark 
                      ? (styles?.backgroundColorDark || '#1e293b')
                      : (styles?.backgroundColor || '#ffffff');
                  };
                  
                  // Si el fondo es transparente y hay borde gradiente, usar técnica de mask
                  if (isTransparent && borderStyle === 'gradient') {
                    return (
                      <div 
                        className="sticky top-24 relative"
                        style={{
                          borderRadius: borderRadius,
                          padding: borderWidth,
                          minHeight: styles?.panelMinHeight !== 'auto' ? styles?.panelMinHeight : undefined,
                        }}
                      >
                        {/* Borde gradiente con mask */}
                        <div
                          className="absolute inset-0 rounded-[inherit]"
                          style={{
                            background: getBorderBackground(),
                            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                            maskComposite: 'xor',
                            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                            WebkitMaskComposite: 'xor',
                            padding: borderWidth,
                            pointerEvents: 'none'
                          }}
                        />
                        {/* Contenido interior */}
                        <div 
                          className="relative"
                          style={{
                            padding: styles?.panelPadding || '1.5rem',
                            borderRadius: `calc(${borderRadius} - ${borderWidth})`,
                            backgroundColor: 'transparent'
                          }}
                        >
                    
                    {/* Sección BUSCAR */}
                    <div style={{ marginBottom: pageData?.content?.servicesFilter?.styles?.sectionGap || '1.5rem' }}>
                      <h3 
                        className="text-sm uppercase tracking-wider mb-1"
                        style={{ 
                          color: currentTheme === 'dark' 
                            ? (pageData?.content?.servicesFilter?.styles?.sectionTitleColorDark || '#A78BFA')
                            : (pageData?.content?.servicesFilter?.styles?.sectionTitleColor || '#8B5CF6'),
                          fontFamily: pageData?.content?.servicesFilter?.styles?.titleFontFamily || 'inherit',
                          fontWeight: pageData?.content?.servicesFilter?.styles?.titleFontWeight || '700'
                        }}
                      >
                        {pageData?.content?.servicesFilter?.searchTitle || 'BUSCAR'}
                      </h3>
                      <p 
                        className="text-xs text-gray-500 dark:text-gray-400 mb-3"
                        style={{
                          fontFamily: pageData?.content?.servicesFilter?.styles?.contentFontFamily || 'inherit',
                          fontWeight: pageData?.content?.servicesFilter?.styles?.contentFontWeight || '400'
                        }}
                      >
                        {pageData?.content?.servicesFilter?.searchDescription || 'Escribe aquí para encontrar el servicio que necesitas...'}
                      </p>
                      <div className="relative">
                        <span 
                          className="absolute left-3 top-1/2 -translate-y-1/2"
                          style={{
                            color: currentTheme === 'dark'
                              ? (pageData?.content?.servicesFilter?.styles?.iconSearchColorDark || '#6b7280')
                              : (pageData?.content?.servicesFilter?.styles?.iconSearchColor || '#9ca3af')
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                          </svg>
                        </span>
                        <input
                          type="text"
                          value={busqueda}
                          onChange={(e) => setBusqueda(e.target.value)}
                          placeholder={pageData?.content?.servicesFilter?.searchPlaceholder || 'Busca un servicio...'}
                          className="w-full pl-10 pr-10 py-3 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          style={{
                            backgroundColor: (() => {
                              const s = pageData?.content?.servicesFilter?.styles;
                              if (currentTheme === 'dark') {
                                return (s?.searchInputBgTransparentDark === true || s?.searchInputBgTransparentDark === 'true')
                                  ? 'transparent'
                                  : (s?.searchInputBgDark || '#1f2937');
                              }
                              return (s?.searchInputBgTransparent === true || s?.searchInputBgTransparent === 'true')
                                ? 'transparent'
                                : (s?.searchInputBg || '#ffffff');
                            })(),
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: currentTheme === 'dark'
                              ? (pageData?.content?.servicesFilter?.styles?.searchInputBorderDark || '#374151')
                              : (pageData?.content?.servicesFilter?.styles?.searchInputBorder || '#e5e7eb'),
                            color: currentTheme === 'dark'
                              ? (pageData?.content?.servicesFilter?.styles?.searchInputTextDark || '#f9fafb')
                              : (pageData?.content?.servicesFilter?.styles?.searchInputText || '#111827'),
                            '--placeholder-color': currentTheme === 'dark'
                              ? (pageData?.content?.servicesFilter?.styles?.searchInputPlaceholderDark || '#6b7280')
                              : (pageData?.content?.servicesFilter?.styles?.searchInputPlaceholder || '#9ca3af')
                          } as React.CSSProperties}
                        />
                        {busqueda && (
                          <button
                            onClick={() => setBusqueda('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                            style={{
                              color: currentTheme === 'dark'
                                ? (pageData?.content?.servicesFilter?.styles?.iconClearColorDark || '#6b7280')
                                : (pageData?.content?.servicesFilter?.styles?.iconClearColor || '#9ca3af')
                            }}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Sección CATEGORÍAS */}
                    <div style={{ marginBottom: pageData?.content?.servicesFilter?.styles?.sectionGap || '1.5rem' }}>
                      <h3 
                        className="text-sm uppercase tracking-wider mb-3"
                        style={{ 
                          color: currentTheme === 'dark' 
                            ? (pageData?.content?.servicesFilter?.styles?.sectionTitleColorDark || '#A78BFA')
                            : (pageData?.content?.servicesFilter?.styles?.sectionTitleColor || '#8B5CF6'),
                          fontFamily: pageData?.content?.servicesFilter?.styles?.titleFontFamily || 'inherit',
                          fontWeight: pageData?.content?.servicesFilter?.styles?.titleFontWeight || '700'
                        }}
                      >
                        {pageData?.content?.servicesFilter?.categoriesTitle || 'CATEGORÍAS'}
                      </h3>
                      <div className="space-y-1">
                        {/* Opción "Todas las categorías" */}
                        {(() => {
                          const s = pageData?.content?.servicesFilter?.styles;
                          const isActive = categoriaSeleccionada === '';
                          const isDark = currentTheme === 'dark';
                          
                          // Función para obtener el estilo de fondo
                          const getActiveBg = () => {
                            if (!isActive) return 'transparent';
                            const bgStyle = isDark ? (s?.activeCategoryBgStyleDark || 'solid') : (s?.activeCategoryBgStyle || 'solid');
                            if (bgStyle === 'transparent') return 'transparent';
                            if (bgStyle === 'gradient') {
                              const dir = isDark ? (s?.activeCategoryBgGradientDirectionDark || '135deg') : (s?.activeCategoryBgGradientDirection || '135deg');
                              const from = isDark ? (s?.activeCategoryBgGradientFromDark || '#A78BFA') : (s?.activeCategoryBgGradientFrom || '#8B5CF6');
                              const to = isDark ? (s?.activeCategoryBgGradientToDark || '#22D3EE') : (s?.activeCategoryBgGradientTo || '#06B6D4');
                              return `linear-gradient(${dir}, ${from}, ${to})`;
                            }
                            return isDark ? (s?.activeCategoryBgDark || 'rgba(139, 92, 246, 0.2)') : (s?.activeCategoryBg || 'rgba(139, 92, 246, 0.1)');
                          };
                          
                          // Función para obtener el estilo de texto
                          const getActiveTextStyle = (): React.CSSProperties => {
                            if (!isActive) {
                              return { color: isDark ? (s?.textColorDark || '#D1D5DB') : (s?.textColor || '#374151') };
                            }
                            const textStyle = isDark ? (s?.activeCategoryTextStyleDark || 'solid') : (s?.activeCategoryTextStyle || 'solid');
                            if (textStyle === 'gradient') {
                              const dir = isDark ? (s?.activeCategoryTextGradientDirectionDark || '90deg') : (s?.activeCategoryTextGradientDirection || '90deg');
                              const from = isDark ? (s?.activeCategoryTextGradientFromDark || '#A78BFA') : (s?.activeCategoryTextGradientFrom || '#8B5CF6');
                              const to = isDark ? (s?.activeCategoryTextGradientToDark || '#22D3EE') : (s?.activeCategoryTextGradientTo || '#06B6D4');
                              return {
                                background: `linear-gradient(${dir}, ${from}, ${to})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                              };
                            }
                            return { color: isDark ? (s?.activeCategoryTextDark || '#A78BFA') : (s?.activeCategoryText || '#8B5CF6') };
                          };
                          
                          // Función para obtener el borde
                          const getActiveBorder = () => {
                            if (!isActive) return '3px solid transparent';
                            const borderStyle = isDark ? (s?.activeCategoryBorderStyleDark || 'solid') : (s?.activeCategoryBorderStyle || 'solid');
                            if (borderStyle === 'none') return 'none';
                            if (borderStyle === 'gradient') {
                              // Para borde gradiente usamos el color "from" como fallback
                              const from = isDark ? (s?.activeCategoryBorderGradientFromDark || '#A78BFA') : (s?.activeCategoryBorderGradientFrom || '#8B5CF6');
                              return `3px solid ${from}`;
                            }
                            return `3px solid ${isDark ? (s?.activeCategoryBorderDark || '#A78BFA') : (s?.activeCategoryBorder || '#8B5CF6')}`;
                          };
                          
                          return (
                            <button
                              onClick={() => setCategoriaSeleccionada('')}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                !isActive ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50' : ''
                              }`}
                              style={{
                                background: getActiveBg(),
                                borderLeft: getActiveBorder(),
                                fontFamily: s?.contentFontFamily || 'inherit',
                                fontWeight: isActive ? '600' : (s?.contentFontWeight || '500'),
                                ...getActiveTextStyle()
                              }}
                            >
                              {pageData?.content?.servicesFilter?.showAllCategoriesText || 'Todas las categorías'}
                            </button>
                          );
                        })()}

                        {/* Categorías dinámicas */}
                        {categorias.map(categoria => {
                          const s = pageData?.content?.servicesFilter?.styles;
                          const isActive = categoriaSeleccionada === categoria.slug;
                          const isDark = currentTheme === 'dark';
                          
                          const getActiveBg = () => {
                            if (!isActive) return 'transparent';
                            const bgStyle = isDark ? (s?.activeCategoryBgStyleDark || 'solid') : (s?.activeCategoryBgStyle || 'solid');
                            if (bgStyle === 'transparent') return 'transparent';
                            if (bgStyle === 'gradient') {
                              const dir = isDark ? (s?.activeCategoryBgGradientDirectionDark || '135deg') : (s?.activeCategoryBgGradientDirection || '135deg');
                              const from = isDark ? (s?.activeCategoryBgGradientFromDark || '#A78BFA') : (s?.activeCategoryBgGradientFrom || '#8B5CF6');
                              const to = isDark ? (s?.activeCategoryBgGradientToDark || '#22D3EE') : (s?.activeCategoryBgGradientTo || '#06B6D4');
                              return `linear-gradient(${dir}, ${from}, ${to})`;
                            }
                            return isDark ? (s?.activeCategoryBgDark || 'rgba(139, 92, 246, 0.2)') : (s?.activeCategoryBg || 'rgba(139, 92, 246, 0.1)');
                          };
                          
                          const getActiveTextStyle = (): React.CSSProperties => {
                            if (!isActive) {
                              return { color: isDark ? (s?.textColorDark || '#D1D5DB') : (s?.textColor || '#374151') };
                            }
                            const textStyle = isDark ? (s?.activeCategoryTextStyleDark || 'solid') : (s?.activeCategoryTextStyle || 'solid');
                            if (textStyle === 'gradient') {
                              const dir = isDark ? (s?.activeCategoryTextGradientDirectionDark || '90deg') : (s?.activeCategoryTextGradientDirection || '90deg');
                              const from = isDark ? (s?.activeCategoryTextGradientFromDark || '#A78BFA') : (s?.activeCategoryTextGradientFrom || '#8B5CF6');
                              const to = isDark ? (s?.activeCategoryTextGradientToDark || '#22D3EE') : (s?.activeCategoryTextGradientTo || '#06B6D4');
                              return {
                                background: `linear-gradient(${dir}, ${from}, ${to})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                              };
                            }
                            return { color: isDark ? (s?.activeCategoryTextDark || '#A78BFA') : (s?.activeCategoryText || '#8B5CF6') };
                          };
                          
                          const getActiveBorder = () => {
                            if (!isActive) return '3px solid transparent';
                            const borderStyle = isDark ? (s?.activeCategoryBorderStyleDark || 'solid') : (s?.activeCategoryBorderStyle || 'solid');
                            if (borderStyle === 'none') return 'none';
                            if (borderStyle === 'gradient') {
                              const from = isDark ? (s?.activeCategoryBorderGradientFromDark || '#A78BFA') : (s?.activeCategoryBorderGradientFrom || '#8B5CF6');
                              return `3px solid ${from}`;
                            }
                            return `3px solid ${isDark ? (s?.activeCategoryBorderDark || '#A78BFA') : (s?.activeCategoryBorder || '#8B5CF6')}`;
                          };
                          
                          return (
                            <button
                              key={categoria.slug}
                              onClick={() => setCategoriaSeleccionada(categoria.slug)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                !isActive ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50' : ''
                              }`}
                              style={{
                                background: getActiveBg(),
                                borderLeft: getActiveBorder(),
                                fontFamily: s?.contentFontFamily || 'inherit',
                                fontWeight: isActive ? '600' : (s?.contentFontWeight || '500'),
                                ...getActiveTextStyle()
                              }}
                            >
                              {categoria.nombre}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Sección ORDENAR */}
                    <div style={{ marginBottom: pageData?.content?.servicesFilter?.styles?.sectionGap || '1.5rem' }}>
                      <h3 
                        className="text-sm uppercase tracking-wider mb-3"
                        style={{ 
                          color: currentTheme === 'dark' 
                            ? (pageData?.content?.servicesFilter?.styles?.sectionTitleColorDark || '#A78BFA')
                            : (pageData?.content?.servicesFilter?.styles?.sectionTitleColor || '#8B5CF6'),
                          fontFamily: pageData?.content?.servicesFilter?.styles?.titleFontFamily || 'inherit',
                          fontWeight: pageData?.content?.servicesFilter?.styles?.titleFontWeight || '700'
                        }}
                      >
                        {pageData?.content?.servicesFilter?.sortTitle || 'ORDENAR'}
                      </h3>
                      <div className="relative">
                        <select
                          value={ordenamiento}
                          onChange={(e) => setOrdenamiento(e.target.value)}
                          className="w-full px-4 py-3 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none cursor-pointer transition-all"
                          style={{
                            backgroundColor: (() => {
                              const s = pageData?.content?.servicesFilter?.styles;
                              if (currentTheme === 'dark') {
                                return (s?.sortSelectBgTransparentDark === true || s?.sortSelectBgTransparentDark === 'true')
                                  ? 'transparent'
                                  : (s?.sortSelectBgDark || '#1f2937');
                              }
                              return (s?.sortSelectBgTransparent === true || s?.sortSelectBgTransparent === 'true')
                                ? 'transparent'
                                : (s?.sortSelectBg || '#ffffff');
                            })(),
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: currentTheme === 'dark'
                              ? (pageData?.content?.servicesFilter?.styles?.sortSelectBorderDark || '#374151')
                              : (pageData?.content?.servicesFilter?.styles?.sortSelectBorder || '#e5e7eb'),
                            color: currentTheme === 'dark'
                              ? (pageData?.content?.servicesFilter?.styles?.sortSelectTextDark || '#f9fafb')
                              : (pageData?.content?.servicesFilter?.styles?.sortSelectText || '#111827'),
                            fontFamily: pageData?.content?.servicesFilter?.styles?.contentFontFamily || 'inherit',
                            fontWeight: pageData?.content?.servicesFilter?.styles?.contentFontWeight || '500'
                          }}
                        >
                          <option value="destacado">★ Destacados</option>
                          <option value="nuevo">● Recientes</option>
                          <option value="titulo">◆ A-Z</option>
                          <option value="precio-asc">▼ Menor precio</option>
                          <option value="precio-desc">▲ Mayor precio</option>
                        </select>
                        <span 
                          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
                          style={{
                            color: (() => {
                              const s = pageData?.content?.servicesFilter?.styles;
                              // Si hay color configurado en CMS, usar ese
                              const configuredColor = currentTheme === 'dark'
                                ? s?.iconDropdownColorDark
                                : s?.iconDropdownColor;
                              
                              if (configuredColor) {
                                return configuredColor;
                              }
                              
                              // Si no hay color configurado, usar el mismo color que el texto del select
                              return currentTheme === 'dark'
                                ? (s?.sortSelectTextDark || '#f9fafb')
                                : (s?.sortSelectText || '#111827');
                            })()
                          }}
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            style={{ display: 'block' }}
                          >
                            <path d="m6 9 6 6 6-6"></path>
                          </svg>
                        </span>
                      </div>
                    </div>

                    {/* Resultados */}
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between text-sm">
                        <span 
                          className="text-gray-500 dark:text-gray-400"
                          style={{
                            fontFamily: pageData?.content?.servicesFilter?.styles?.contentFontFamily || 'inherit',
                            fontWeight: pageData?.content?.servicesFilter?.styles?.contentFontWeight || '400'
                          }}
                        >
                          {pageData?.content?.servicesFilter?.resultsText || 'Resultados:'}
                        </span>
                        <span 
                          className="font-bold text-gray-900 dark:text-white"
                          style={{
                            fontFamily: pageData?.content?.servicesFilter?.styles?.titleFontFamily || 'inherit'
                          }}
                        >
                          {serviciosFiltrados.length}
                        </span>
                      </div>
                    </div>

                    {/* Botón Limpiar Filtros */}
                    {(busqueda || categoriaSeleccionada !== '') && (
                      <button
                        onClick={() => {
                          setBusqueda('');
                          setCategoriaSeleccionada('');
                        }}
                        className="w-full mt-4 px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all flex items-center justify-center gap-2"
                      >
                        <span>✕</span>
                        <span>Limpiar filtros</span>
                      </button>
                    )}

                        </div>
                      </div>
                    );
                  }
                  
                  // Caso normal: fondo sólido o sin borde gradiente
                  return (
                    <div 
                      className="sticky top-24 overflow-hidden"
                      style={{
                        borderRadius: borderRadius,
                        padding: borderWidth,
                        background: getBorderBackground(),
                        minHeight: styles?.panelMinHeight !== 'auto' ? styles?.panelMinHeight : undefined,
                        boxShadow: styles?.shadow === 'none' ? 'none' :
                                   styles?.shadow === 'sm' ? '0 1px 2px rgba(0,0,0,0.05)' :
                                   styles?.shadow === 'md' ? '0 4px 6px rgba(0,0,0,0.1)' :
                                   styles?.shadow === 'lg' ? '0 10px 15px rgba(0,0,0,0.1)' :
                                   styles?.shadow === 'xl' ? '0 20px 25px rgba(0,0,0,0.15)' : undefined
                      }}
                    >
                      <div 
                        style={{
                          padding: styles?.panelPadding || '1.5rem',
                          borderRadius: `calc(${borderRadius} - ${borderWidth})`,
                          backgroundColor: getBackgroundColor()
                        }}
                      >
                        {/* Sección BUSCAR */}
                        <div style={{ marginBottom: styles?.sectionGap || '1.5rem' }}>
                          <h3 
                            className="text-sm uppercase tracking-wider mb-1"
                            style={{ 
                              color: isDark 
                                ? (styles?.sectionTitleColorDark || '#A78BFA')
                                : (styles?.sectionTitleColor || '#8B5CF6'),
                              fontFamily: styles?.titleFontFamily || 'inherit',
                              fontWeight: styles?.titleFontWeight || '700'
                            }}
                          >
                            {pageData?.content?.servicesFilter?.searchTitle || 'BUSCAR'}
                          </h3>
                          <p 
                            className="text-xs text-gray-500 dark:text-gray-400 mb-3"
                            style={{
                              fontFamily: styles?.contentFontFamily || 'inherit',
                              fontWeight: styles?.contentFontWeight || '400'
                            }}
                          >
                            {pageData?.content?.servicesFilter?.searchDescription || 'Escribe aquí para encontrar el servicio que necesitas...'}
                          </p>
                          <div className="relative">
                            <span 
                              className="absolute left-3 top-1/2 -translate-y-1/2"
                              style={{
                                color: isDark
                                  ? (styles?.iconSearchColorDark || '#6b7280')
                                  : (styles?.iconSearchColor || '#9ca3af')
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                              </svg>
                            </span>
                            <input
                              type="text"
                              value={busqueda}
                              onChange={(e) => setBusqueda(e.target.value)}
                              placeholder={pageData?.content?.servicesFilter?.searchPlaceholder || 'Busca un servicio...'}
                              className="w-full pl-10 pr-10 py-3 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                              style={{
                                backgroundColor: (() => {
                                  if (isDark) {
                                    return (styles?.searchInputBgTransparentDark === true || styles?.searchInputBgTransparentDark === 'true')
                                      ? 'transparent'
                                      : (styles?.searchInputBgDark || '#1f2937');
                                  }
                                  return (styles?.searchInputBgTransparent === true || styles?.searchInputBgTransparent === 'true')
                                    ? 'transparent'
                                    : (styles?.searchInputBg || '#ffffff');
                                })(),
                                borderWidth: '1px',
                                borderStyle: 'solid',
                                borderColor: isDark
                                  ? (styles?.searchInputBorderDark || '#374151')
                                  : (styles?.searchInputBorder || '#e5e7eb'),
                                color: isDark
                                  ? (styles?.searchInputTextDark || '#f9fafb')
                                  : (styles?.searchInputText || '#111827')
                              }}
                            />
                            {busqueda && (
                              <button
                                onClick={() => setBusqueda('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
                                style={{
                                  color: isDark
                                    ? (styles?.iconClearColorDark || '#6b7280')
                                    : (styles?.iconClearColor || '#9ca3af')
                                }}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Sección CATEGORÍAS */}
                        <div style={{ marginBottom: styles?.sectionGap || '1.5rem' }}>
                          <h3 
                            className="text-sm uppercase tracking-wider mb-3"
                            style={{ 
                              color: isDark 
                                ? (styles?.sectionTitleColorDark || '#A78BFA')
                                : (styles?.sectionTitleColor || '#8B5CF6'),
                              fontFamily: styles?.titleFontFamily || 'inherit',
                              fontWeight: styles?.titleFontWeight || '700'
                            }}
                          >
                            {pageData?.content?.servicesFilter?.categoriesTitle || 'CATEGORÍAS'}
                          </h3>
                          <div className="space-y-1">
                            {/* Botón "Todas las categorías" */}
                            {(() => {
                              const isActive = categoriaSeleccionada === '';
                              
                              const getActiveBg = () => {
                                if (!isActive) return 'transparent';
                                const bgStyle = isDark ? (styles?.activeCategoryBgStyleDark || 'solid') : (styles?.activeCategoryBgStyle || 'solid');
                                if (bgStyle === 'transparent') return 'transparent';
                                if (bgStyle === 'gradient') {
                                  const dir = isDark ? (styles?.activeCategoryBgGradientDirectionDark || '135deg') : (styles?.activeCategoryBgGradientDirection || '135deg');
                                  const from = isDark ? (styles?.activeCategoryBgGradientFromDark || '#A78BFA') : (styles?.activeCategoryBgGradientFrom || '#8B5CF6');
                                  const to = isDark ? (styles?.activeCategoryBgGradientToDark || '#22D3EE') : (styles?.activeCategoryBgGradientTo || '#06B6D4');
                                  return `linear-gradient(${dir}, ${from}, ${to})`;
                                }
                                return isDark ? (styles?.activeCategoryBgDark || 'rgba(139, 92, 246, 0.2)') : (styles?.activeCategoryBg || 'rgba(139, 92, 246, 0.1)');
                              };
                              
                              const getActiveTextStyle = (): React.CSSProperties => {
                                if (!isActive) {
                                  return { color: isDark ? (styles?.textColorDark || '#D1D5DB') : (styles?.textColor || '#374151') };
                                }
                                const textStyle = isDark ? (styles?.activeCategoryTextStyleDark || 'solid') : (styles?.activeCategoryTextStyle || 'solid');
                                if (textStyle === 'gradient') {
                                  const dir = isDark ? (styles?.activeCategoryTextGradientDirectionDark || '90deg') : (styles?.activeCategoryTextGradientDirection || '90deg');
                                  const from = isDark ? (styles?.activeCategoryTextGradientFromDark || '#A78BFA') : (styles?.activeCategoryTextGradientFrom || '#8B5CF6');
                                  const to = isDark ? (styles?.activeCategoryTextGradientToDark || '#22D3EE') : (styles?.activeCategoryTextGradientTo || '#06B6D4');
                                  return {
                                    background: `linear-gradient(${dir}, ${from}, ${to})`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                  };
                                }
                                return { color: isDark ? (styles?.activeCategoryTextDark || '#A78BFA') : (styles?.activeCategoryText || '#8B5CF6') };
                              };
                              
                              const getActiveBorder = () => {
                                if (!isActive) return '3px solid transparent';
                                const borderStyle = isDark ? (styles?.activeCategoryBorderStyleDark || 'solid') : (styles?.activeCategoryBorderStyle || 'solid');
                                if (borderStyle === 'none') return 'none';
                                if (borderStyle === 'gradient') {
                                  const from = isDark ? (styles?.activeCategoryBorderGradientFromDark || '#A78BFA') : (styles?.activeCategoryBorderGradientFrom || '#8B5CF6');
                                  return `3px solid ${from}`;
                                }
                                return `3px solid ${isDark ? (styles?.activeCategoryBorderDark || '#A78BFA') : (styles?.activeCategoryBorder || '#8B5CF6')}`;
                              };
                              
                              return (
                                <button
                                  onClick={() => setCategoriaSeleccionada('')}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                                    !isActive ? 'hover:bg-gray-100 dark:hover:bg-gray-700/50' : ''
                                  }`}
                                  style={{
                                    background: getActiveBg(),
                                    borderLeft: getActiveBorder(),
                                    fontFamily: styles?.contentFontFamily || 'inherit',
                                    fontWeight: isActive ? '600' : (styles?.contentFontWeight || '500'),
                                    ...getActiveTextStyle()
                                  }}
                                >
                                  {pageData?.content?.servicesFilter?.showAllCategoriesText || 'Todas las categorías'}
                                </button>
                              );
                            })()}
                            
                            {/* Categorías dinámicas */}
                            {categorias.map((cat) => {
                              const isActive = categoriaSeleccionada === cat.slug;
                              
                              const getActiveBg = () => {
                                if (!isActive) return 'transparent';
                                const bgStyle = isDark ? (styles?.activeCategoryBgStyleDark || 'solid') : (styles?.activeCategoryBgStyle || 'solid');
                                if (bgStyle === 'transparent') return 'transparent';
                                if (bgStyle === 'gradient') {
                                  const dir = isDark ? (styles?.activeCategoryBgGradientDirectionDark || '135deg') : (styles?.activeCategoryBgGradientDirection || '135deg');
                                  const from = isDark ? (styles?.activeCategoryBgGradientFromDark || '#A78BFA') : (styles?.activeCategoryBgGradientFrom || '#8B5CF6');
                                  const to = isDark ? (styles?.activeCategoryBgGradientToDark || '#22D3EE') : (styles?.activeCategoryBgGradientTo || '#06B6D4');
                                  return `linear-gradient(${dir}, ${from}, ${to})`;
                                }
                                return isDark ? (styles?.activeCategoryBgDark || 'rgba(139, 92, 246, 0.2)') : (styles?.activeCategoryBg || 'rgba(139, 92, 246, 0.1)');
                              };
                              
                              const getActiveTextStyle = (): React.CSSProperties => {
                                if (!isActive) {
                                  return { color: isDark ? (styles?.textColorDark || '#D1D5DB') : (styles?.textColor || '#374151') };
                                }
                                const textStyle = isDark ? (styles?.activeCategoryTextStyleDark || 'solid') : (styles?.activeCategoryTextStyle || 'solid');
                                if (textStyle === 'gradient') {
                                  const dir = isDark ? (styles?.activeCategoryTextGradientDirectionDark || '90deg') : (styles?.activeCategoryTextGradientDirection || '90deg');
                                  const from = isDark ? (styles?.activeCategoryTextGradientFromDark || '#A78BFA') : (styles?.activeCategoryTextGradientFrom || '#8B5CF6');
                                  const to = isDark ? (styles?.activeCategoryTextGradientToDark || '#22D3EE') : (styles?.activeCategoryTextGradientTo || '#06B6D4');
                                  return {
                                    background: `linear-gradient(${dir}, ${from}, ${to})`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                  };
                                }
                                return { color: isDark ? (styles?.activeCategoryTextDark || '#A78BFA') : (styles?.activeCategoryText || '#8B5CF6') };
                              };
                              
                              const getActiveBorder = () => {
                                if (!isActive) return '3px solid transparent';
                                const borderStyle = isDark ? (styles?.activeCategoryBorderStyleDark || 'solid') : (styles?.activeCategoryBorderStyle || 'solid');
                                if (borderStyle === 'none') return 'none';
                                if (borderStyle === 'gradient') {
                                  const from = isDark ? (styles?.activeCategoryBorderGradientFromDark || '#A78BFA') : (styles?.activeCategoryBorderGradientFrom || '#8B5CF6');
                                  return `3px solid ${from}`;
                                }
                                return `3px solid ${isDark ? (styles?.activeCategoryBorderDark || '#A78BFA') : (styles?.activeCategoryBorder || '#8B5CF6')}`;
                              };
                              
                              return (
                                <button
                                  key={cat.slug}
                                  onClick={() => setCategoriaSeleccionada(cat.slug)}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                                    !isActive ? 'hover:bg-gray-100 dark:hover:bg-gray-700/50' : ''
                                  }`}
                                  style={{
                                    background: getActiveBg(),
                                    borderLeft: getActiveBorder(),
                                    fontFamily: styles?.contentFontFamily || 'inherit',
                                    fontWeight: isActive ? '600' : (styles?.contentFontWeight || '500'),
                                    ...getActiveTextStyle()
                                  }}
                                >
                                  {cat.nombre}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Sección ORDENAR */}
                        <div style={{ marginBottom: styles?.sectionGap || '1.5rem' }}>
                          <h3 
                            className="text-sm uppercase tracking-wider mb-3"
                            style={{ 
                              color: isDark 
                                ? (styles?.sectionTitleColorDark || '#A78BFA')
                                : (styles?.sectionTitleColor || '#8B5CF6'),
                              fontFamily: styles?.titleFontFamily || 'inherit',
                              fontWeight: styles?.titleFontWeight || '700'
                            }}
                          >
                            {pageData?.content?.servicesFilter?.sortTitle || 'ORDENAR'}
                          </h3>
                          <div className="relative">
                            <select
                              value={ordenamiento}
                              onChange={(e) => setOrdenamiento(e.target.value as any)}
                              className="w-full appearance-none px-4 py-3 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
                              style={{
                                backgroundColor: (() => {
                                  if (isDark) {
                                    return (styles?.sortSelectBgTransparentDark === true || styles?.sortSelectBgTransparentDark === 'true')
                                      ? 'transparent'
                                      : (styles?.sortSelectBgDark || '#1f2937');
                                  }
                                  return (styles?.sortSelectBgTransparent === true || styles?.sortSelectBgTransparent === 'true')
                                    ? 'transparent'
                                    : (styles?.sortSelectBg || '#ffffff');
                                })(),
                                borderWidth: '1px',
                                borderStyle: 'solid',
                                borderColor: isDark
                                  ? (styles?.sortSelectBorderDark || '#374151')
                                  : (styles?.sortSelectBorder || '#e5e7eb'),
                                color: isDark
                                  ? (styles?.sortSelectTextDark || '#f9fafb')
                                  : (styles?.sortSelectText || '#111827'),
                                fontFamily: styles?.contentFontFamily || 'inherit',
                                fontWeight: styles?.contentFontWeight || '500'
                              }}
                            >
                              <option value="destacado">★ Destacados</option>
                              <option value="nuevo">● Recientes</option>
                              <option value="titulo">◆ A-Z</option>
                              <option value="precio-asc">▼ Menor precio</option>
                              <option value="precio-desc">▲ Mayor precio</option>
                            </select>
                            <span 
                              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
                              style={{
                                color: (() => {
                                  // Si hay color configurado en CMS, usar ese
                                  const configuredColor = isDark
                                    ? styles?.iconDropdownColorDark
                                    : styles?.iconDropdownColor;
                                  
                                  if (configuredColor) {
                                    return configuredColor;
                                  }
                                  
                                  // Si no hay color configurado, usar el mismo color que el texto del select
                                  return isDark
                                    ? (styles?.sortSelectTextDark || '#f9fafb')
                                    : (styles?.sortSelectText || '#111827');
                                })()
                              }}
                            >
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="16" 
                                height="16" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2.5" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                                style={{ display: 'block' }}
                              >
                                <path d="m6 9 6 6 6-6"></path>
                              </svg>
                            </span>
                          </div>
                        </div>

                        {/* Resultados */}
                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex items-center justify-between text-sm">
                            <span 
                              className="text-gray-500 dark:text-gray-400"
                              style={{
                                fontFamily: styles?.contentFontFamily || 'inherit',
                                fontWeight: styles?.contentFontWeight || '400'
                              }}
                            >
                              {pageData?.content?.servicesFilter?.resultsText || 'Resultados:'}
                            </span>
                            <span 
                              className="font-bold text-gray-900 dark:text-white"
                              style={{
                                fontFamily: styles?.titleFontFamily || 'inherit'
                              }}
                            >
                              {serviciosFiltrados.length}
                            </span>
                          </div>
                        </div>

                        {/* Botón Limpiar Filtros */}
                        {(busqueda || categoriaSeleccionada !== '') && (
                          <button
                            onClick={() => {
                              setBusqueda('');
                              setCategoriaSeleccionada('');
                            }}
                            className="w-full mt-4 px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all flex items-center justify-center gap-2"
                          >
                            <span>✕</span>
                            <span>Limpiar filtros</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </aside>

              {/* CONTENIDO PRINCIPAL - Grid de Servicios */}
              <div className="flex-1 min-w-0">{/* min-w-0 previene overflow */}

                {/* Estado de carga con skeleton */}
                {loading && (
                  <div className="animate-fade-in">
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
                      <p className="text-gray-600 dark:text-gray-400 animate-pulse">Cargando servicios...</p>
                    </div>
                    
                    {/* Skeleton cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg animate-pulse">
                          <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-xl mb-4 shimmer"></div>
                          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded mb-3 shimmer"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2 shimmer"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3 shimmer"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Estado de error con animación */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center mb-8 animate-scale-in">
                    <div className="text-4xl mb-2 animate-bounce">❌</div>
                    <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
                    <button
                      onClick={() => recargarConInvalidacion()}
                      className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                    >
                      🔄 Recargar servicios
                    </button>
                  </div>
                )}

                {/* 🌟 SERVICIOS DESTACADOS con Carrusel */}
                {!loading && !error && serviciosDestacados.length > 0 && (
                  <div className="mb-12 animate-fade-in-up delay-200">
                    {/* Header con título */}
                    <h2 
                      className="text-3xl mb-6 flex items-center gap-2"
                      style={{
                        fontFamily: (pageData?.content as any)?.servicesGrid?.cardDesign?.titleFontFamily || 'inherit',
                        fontWeight: (pageData?.content as any)?.servicesGrid?.cardDesign?.titleFontWeight || '700',
                        color: currentTheme === 'dark'
                          ? ((pageData?.content as any)?.servicesGrid?.featuredSection?.titleColorDark || '#f9fafb')
                          : ((pageData?.content as any)?.servicesGrid?.featuredSection?.titleColor || '#1f2937')
                      }}
                    >
                      <span 
                        style={{
                          color: currentTheme === 'dark'
                            ? ((pageData?.content as any)?.servicesGrid?.featuredSection?.iconColorDark || '#fbbf24')
                            : ((pageData?.content as any)?.servicesGrid?.featuredSection?.iconColor || '#f59e0b')
                        }}
                      >
                        {(pageData?.content as any)?.servicesGrid?.featuredSection?.icon || '★'}
                      </span>
                      <span>{(pageData?.content as any)?.servicesGrid?.featuredSection?.title?.replace(/^[^\s]+\s/, '') || 'Servicios Destacados'}</span>
                    </h2>
                    
                    {/* Carrusel con scroll horizontal */}
                    <div className="relative">
                      {/* Gradiente izquierdo para indicar más contenido */}
                      {showLeftArrow && (
                        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent pointer-events-none z-10" />
                      )}
                      
                      {/* Gradiente derecho para indicar más contenido */}
                      {showRightArrow && (
                        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent pointer-events-none z-10" />
                      )}
                      
                      {/* Contenedor del carrusel */}
                      <div 
                        ref={carouselRef}
                        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
                        style={{
                          scrollSnapType: 'x mandatory',
                          WebkitOverflowScrolling: 'touch'
                        }}
                      >
                        {serviciosDestacados.map((servicio: Servicio) => (
                          <div 
                            key={servicio._id} 
                            className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(50%-12px)]"
                            style={{ scrollSnapAlign: 'start' }}
                          >
                            <ServicioPublicCard
                              servicio={servicio}
                              featured={true}
                              cardConfig={(pageData?.content as any)?.servicesGrid?.cardDesign}
                              currentTheme={currentTheme}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Indicadores circulares sutiles - Solo mostrar si hay más de 2 servicios */}
                    {serviciosDestacados.length > 2 && (
                      <div className="flex justify-center items-center mt-6 gap-2">
                        {/* Botón izquierda */}
                        <button
                          onClick={() => scrollCarousel('left')}
                          disabled={!showLeftArrow}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                            showLeftArrow
                              ? 'text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                              : 'text-gray-300 dark:text-gray-700 cursor-not-allowed'
                          }`}
                          aria-label="Anterior"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        
                        {/* Indicadores de posición */}
                        <div className="flex gap-2">
                          {Array.from({ length: Math.ceil(serviciosDestacados.length / 2) }).map((_, index) => (
                            <button
                              key={index}
                              onClick={() => scrollToSlide(index)}
                              className={`transition-all duration-300 rounded-full ${
                                currentSlide === index
                                  ? 'w-8 h-2 bg-purple-600 dark:bg-purple-400'
                                  : 'w-2 h-2 bg-gray-300 dark:bg-gray-600 hover:bg-purple-400 dark:hover:bg-purple-500'
                              }`}
                              aria-label={`Ir a página ${index + 1}`}
                            />
                          ))}
                        </div>
                        
                        {/* Botón derecha */}
                        <button
                          onClick={() => scrollCarousel('right')}
                          disabled={!showRightArrow}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                            showRightArrow
                              ? 'text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                              : 'text-gray-300 dark:text-gray-700 cursor-not-allowed'
                          }`}
                          aria-label="Siguiente"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>{/* Cierra flex-1 min-w-0 (CONTENIDO PRINCIPAL) */}
            </div>{/* Cierra flex flex-col lg:flex-row */}
              </div>{/* Cierra relative z-10 */}
            </div>{/* Cierra relative (contenedor imagen fondo) */}
          </div>{/* Cierra max-w-7xl mx-auto */}
          
          {/* ===== SECCIÓN ACORDEÓN: TODOS LOS SERVICIOS ===== */}
          {(pageData?.content as any)?.servicesAccordion?.enabled !== false && servicios && servicios.length > 0 && (
            <ServicesAccordionList
              servicios={servicios}
              config={(pageData?.content as any)?.servicesAccordion}
              currentTheme={currentTheme}
              className="mt-0"
            />
          )}

          {/* ===== CONTENEDOR CON FONDO COMPARTIDO PARA LAS 3 SECCIONES ===== */}
          {(() => {
            // 🔒 VALIDACIÓN: Esperar a que pageData?.content esté disponible
            if (!pageData || !pageData.content) {
              return null; // No renderizar hasta que los datos del CMS estén cargados
            }
            
            // Verificar si al menos una de las 3 secciones está habilitada
            const whyChoose = (pageData?.content as any)?.whyChooseUs || {};
            const process = (pageData?.content as any)?.developmentProcess || {};
            const faq = (pageData?.content as any)?.faq || {};
            
            const hasAnySectionEnabled = 
              whyChoose.enabled !== false || 
              process.enabled !== false || 
              faq.enabled !== false;
            
            if (!hasAnySectionEnabled) return null;

            // Configuración de fondo compartido
            const sharedBg = (pageData?.content as any)?.extraSectionsBackground || {};
            const bgImage = sharedBg.backgroundImage
              ? (currentTheme === 'dark' 
                  ? (sharedBg.backgroundImage.dark || sharedBg.backgroundImage.light) 
                  : (sharedBg.backgroundImage.light || sharedBg.backgroundImage.dark))
              : null;

            return (
              <div
                className="relative overflow-hidden"
                style={{
                  width: '100vw',
                  marginLeft: 'calc(-50vw + 50%)',
                  marginRight: 'calc(-50vw + 50%)'
                }}
              >
                {/* Fondo compartido para las 3 secciones - Full viewport width */}
                {!bgImage && (
                  <div className="absolute inset-0" style={{ backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff' }} />
                )}
                {bgImage && (
                  <>
                    <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
                      backgroundImage: `url(${bgImage})`,
                      opacity: currentTheme === 'dark' ? 1 : (sharedBg.backgroundOpacity ?? 1)
                    }} />
                    {sharedBg.backgroundOverlay && currentTheme === 'light' && (
                      <div className="absolute inset-0" style={{
                        backgroundColor: 'rgba(255,255,255,0.3)'
                      }} />
                    )}
                  </>
                )}

                {/* SECCIÓN 1: ¿POR QUÉ ELEGIRNOS? */}
                {whyChoose.enabled !== false && (() => {
                  const defaultItems = [
                    { title: 'Desarrollo Rápido', description: 'Entregamos proyectos en tiempo récord sin comprometer la calidad.', iconBgColor: 'purple' },
                    { title: 'Calidad Garantizada', description: 'Cada proyecto pasa por rigurosas pruebas de calidad.', iconBgColor: 'blue' },
                    { title: 'Soporte Continuo', description: 'Te acompañamos durante todo el proceso y después del lanzamiento.', iconBgColor: 'green' }
                  ];
                  const items = whyChoose.items?.length > 0 ? whyChoose.items : defaultItems;
                  const title = whyChoose.title || '¿Por qué elegir Scuti Company?';
                  const subtitle = whyChoose.subtitle || '';
                  const titleColor = currentTheme === 'dark' ? (whyChoose.titleColorDark || '#ffffff') : (whyChoose.titleColor || '#111827');
                  const subtitleColor = currentTheme === 'dark' ? (whyChoose.subtitleColorDark || '#9ca3af') : (whyChoose.subtitleColor || '#6b7280');

                  const colorMap: Record<string, { bg: string; text: string }> = {
                    purple: { bg: 'bg-purple-100 dark:bg-purple-900/50', text: 'text-purple-600 dark:text-purple-400' },
                    blue: { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-600 dark:text-blue-400' },
                    green: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-600 dark:text-green-400' },
                    cyan: { bg: 'bg-cyan-100 dark:bg-cyan-900/50', text: 'text-cyan-600 dark:text-cyan-400' },
                    amber: { bg: 'bg-amber-100 dark:bg-amber-900/50', text: 'text-amber-600 dark:text-amber-400' },
                    rose: { bg: 'bg-rose-100 dark:bg-rose-900/50', text: 'text-rose-600 dark:text-rose-400' }
                  };

                  const iconPaths = [
                    'M13 10V3L4 14h7v7l9-11h-7z', // rayo
                    'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', // check
                    'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75c0-1.148-.198-2.25-.559-3.262', // soporte
                    'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4', // settings
                    'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', // idea
                    'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', // equipo
                  ];

                  return (
                    <section className="relative py-16">
                      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: titleColor }}>{title}</h2>
                          {subtitle && <p className="text-lg max-w-3xl mx-auto" style={{ color: subtitleColor }}>{subtitle}</p>}
                        </div>
                        <div className={`grid md:grid-cols-${Math.min(items.length, 4)} gap-8`}>
                          {items.map((item: any, index: number) => {
                            const colors = colorMap[item.iconBgColor || 'purple'] || colorMap.purple;
                            return (
                              <div key={index} className="text-center group">
                                <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110`}>
                                  <svg className={`w-8 h-8 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPaths[index % iconPaths.length]} />
                                  </svg>
                                </div>
                                <h3 className={`text-xl font-semibold mb-2 ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                                <p className={currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{item.description}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </section>
                  );
                })()}

                {/* SECCIÓN 2: PROCESO DE DESARROLLO */}
                {process.enabled !== false && (() => {
                  const defaultSteps = [
                    { title: 'Fase de Diagnóstico y Viabilidad', description: 'Analizamos tus procesos actuales para identificar cuellos de botella y asegurar que la solución propuesta sea técnicamente realizable y rentable.' },
                    { title: 'Diseño de Arquitectura y UX', description: 'Planificamos la estructura técnica y el diseño de interfaz para que tu software sea intuitivo para el usuario y fácil de escalar a futuro.' },
                    { title: 'Desarrollo Ágil (Sprints de 2 semanas)', description: 'Construimos el software en ciclos cortos con entregas constantes, permitiéndote ver avances reales y realizar ajustes sobre la marcha.' },
                    { title: 'Despliegue, Capacitación y Soporte', description: 'Lanzamos la solución, capacitamos a tu equipo y te acompañamos con soporte técnico preventivo para asegurar la continuidad de tu operación.' }
                  ];
                  const steps = process.steps?.length > 0 ? process.steps : defaultSteps;
                  const title = process.title || 'De la Idea al Sistema: Nuestro Método de Trabajo';
                  const subtitle = process.subtitle || 'Un proceso ágil y transparente diseñado para minimizar riesgos y maximizar la inversión de tu empresa.';
                  const titleColor = currentTheme === 'dark' ? (process.titleColorDark || '#ffffff') : (process.titleColor || '#111827');
                  const subtitleColor = currentTheme === 'dark' ? (process.subtitleColorDark || '#9ca3af') : (process.subtitleColor || '#6b7280');

                  const stepIcons = ['🔍', '📐', '⚡', '🚀', '🔧', '📊'];
                  const stepColors = [
                    'from-purple-500 to-indigo-500',
                    'from-blue-500 to-cyan-500',
                    'from-emerald-500 to-teal-500',
                    'from-amber-500 to-orange-500',
                    'from-rose-500 to-pink-500',
                    'from-violet-500 to-fuchsia-500',
                  ];

                  return (
                    <section className="relative py-20">
                      {/* Patrón decorativo sutil */}
                      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, currentColor 2px, transparent 0)', backgroundSize: '50px 50px' }} />
                      
                      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: titleColor }}>{title}</h2>
                          <p className="text-lg max-w-3xl mx-auto" style={{ color: subtitleColor }}>{subtitle}</p>
                        </div>
                        
                        <div className="relative">
                          {/* Línea vertical conectora */}
                          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-emerald-500 hidden md:block" style={{ transform: 'translateX(-50%)' }} />
                          
                          <div className="space-y-12">
                            {steps.map((step: any, index: number) => {
                              const isLeft = index % 2 === 0;
                              return (
                                <div key={index} className={`relative flex items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col md:gap-8`}>
                                  {/* Número/Icono central */}
                                  <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10 hidden md:flex">
                                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${stepColors[index % stepColors.length]} flex items-center justify-center shadow-lg text-white font-bold text-lg`}>
                                      {index + 1}
                                    </div>
                                  </div>
                                  
                                  {/* Tarjeta */}
                                  <div className={`w-full md:w-5/12 ${isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'}`}>
                                    <div className={`p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${currentTheme === 'dark' ? 'bg-transparent border-white/20 hover:border-white/40' : 'backdrop-blur-md bg-white/70 border-white/50 shadow-lg hover:shadow-xl'}`}>
                                      <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                                        {/* Icono mobile */}
                                        <div className={`md:hidden w-10 h-10 rounded-full bg-gradient-to-br ${stepColors[index % stepColors.length]} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                                          {index + 1}
                                        </div>
                                        <span className="text-2xl">{stepIcons[index % stepIcons.length]}</span>
                                        <h3 className={`text-lg font-bold ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{step.title}</h3>
                                      </div>
                                      <p className={`leading-relaxed ${currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{step.description}</p>
                                    </div>
                                  </div>
                                  
                                  {/* Espaciador */}
                                  <div className="hidden md:block w-5/12" />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </section>
                  );
                })()}

                {/* SECCIÓN 3: FAQ */}
                {faq.enabled !== false && (() => {
                  const defaultItems = [
                    { question: '¿Cuánto tiempo toma desarrollar un sistema personalizado?', answer: 'El tiempo varía según la complejidad. Un prototipo MVP funcional puede estar listo en 4 a 6 semanas, mientras que sistemas ERP o CRM completos suelen tomar de 3 a 5 meses.' },
                    { question: '¿El software será de mi propiedad o tendré que pagar mensualidades?', answer: 'En Scut1 Company entregamos la propiedad total del código y la documentación. No dependes de licencias mensuales; el sistema es un activo de tu empresa.' },
                    { question: '¿Qué pasa si mi empresa crece y necesito más funciones?', answer: 'Desarrollamos bajo una arquitectura escalable. Esto significa que podemos añadir nuevos módulos o integraciones en el futuro sin necesidad de rehacer el sistema desde cero.' },
                    { question: '¿Pueden integrar el nuevo software con mis sistemas actuales (Excel, SAP, etc.)?', answer: 'Sí, somos especialistas en integración de sistemas para que la información fluya sin interrupciones entre tus herramientas actuales y el nuevo software.' }
                  ];
                  const items = faq.items?.length > 0 ? faq.items : defaultItems;
                  const title = faq.title || 'Consultas Frecuentes sobre Software a Medida';
                  const titleColor = currentTheme === 'dark' ? (faq.titleColorDark || '#ffffff') : (faq.titleColor || '#111827');

                  return (
                    <section className="relative py-20">
                      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                          <span className="text-4xl mb-4 block">❓</span>
                          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: titleColor }}>{title}</h2>
                        </div>
                        
                        <div className="space-y-4">
                          {items.map((item: any, index: number) => (
                            <FaqAccordionItem
                              key={index}
                              question={item.question}
                              answer={item.answer}
                              theme={currentTheme}
                            />
                          ))}
                        </div>
                      </div>
                    </section>
                  );
                })()}

              </div>
            );
          })()}
          
        </main>
        
        <PublicFooter />
        
        {/* 💬 Chatbot de Ventas Flotante */}
        <FloatingChatWidget />
      </div>
    </>
  );
};

export default ServicesPublicV2;