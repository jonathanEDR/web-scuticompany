/**
 * 🎯 CONFIGURACIÓN SEO HARDCODEADA POR PÁGINA
 * 
 * Este archivo contiene los metadatos SEO por defecto para cada página.
 * 
 * SISTEMA DE PRIORIDAD:
 * 1. ✅ Datos del CMS (MongoDB) - PRIORIDAD MÁXIMA
 * 2. ✅ Configuración hardcodeada (este archivo)
 * 3. ✅ Fallbacks genéricos
 * 
 * ⚠️ IMPORTANTE:
 * - Los datos del CMS SIEMPRE tienen prioridad
 * - Esta configuración se usa solo cuando NO hay datos en el CMS
 * - Facilita debugging y proporciona defaults profesionales
 * 
 * 🖼️ IMÁGENES OPEN GRAPH (ogImage):
 * - Dimensiones ideales: 1200x630px
 * - Formatos: PNG, JPG (< 1MB)
 * - Ubicación: /public/logos/ o /public/
 * - Las rutas son relativas: '/logos/tu-imagen.png'
 * - Cuando configures desde CMS, usa URL completa o ruta relativa
 */

export interface PageSeoConfig {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  twitterCard?: string;
}

export interface SeoConfigMap {
  [key: string]: PageSeoConfig;
}

/**
 * 📋 Configuración SEO por defecto para cada página
 * 
 * ⚠️ NOTA: La página HOME no está aquí porque tiene su propio sistema
 * de gestión SEO que funciona perfectamente (ver: Home.tsx)
 */
export const DEFAULT_SEO_CONFIG: SeoConfigMap = {
  // 📰 PÁGINA BLOG
  blog: {
    metaTitle: 'Blog SCUTI Company - Noticias y Tendencias Tecnológicas | Contenido Curado',
    metaDescription: 'Mantente informado con las últimas noticias y tendencias del sector tecnológico. Contenido curado y validado por expertos en desarrollo y tecnología.',
    keywords: [
      'blog tecnologia',
      'noticias tech',
      'desarrollo web',
      'inteligencia artificial',
      'cloud computing',
      'tendencias tecnologicas',
      'programacion',
      'innovacion digital'
    ],
    ogTitle: 'Blog SCUTI - Innovación y Tecnología',
    ogDescription: 'Lee las últimas noticias del mundo tecnológico y mantente actualizado',
    ogImage: '/Logo.png', // TODO: Crear imagen OG optimizada 1200x630px
    twitterCard: 'summary_large_image'
  },

  // 💼 PÁGINA SERVICIOS
  services: {
    metaTitle: 'Servicios de Desarrollo Software - SCUTI Company',
    metaDescription: 'Desarrollo de aplicaciones web y móviles, soluciones de IA, cloud computing, consultoría tecnológica y más. Servicios profesionales para empresas en crecimiento.',
    keywords: [
      'servicios desarrollo software',
      'aplicaciones web peru',
      'desarrollo movil',
      'consultoria tecnologica',
      'soluciones ia',
      'cloud computing',
      'desarrollo backend',
      'desarrollo frontend'
    ],
    ogTitle: 'Nuestros Servicios - SCUTI Company',
    ogDescription: 'Servicios tecnológicos profesionales diseñados para impulsar tu empresa',
    ogImage: '/Logo.png', // TODO: Crear imagen OG optimizada 1200x630px
    twitterCard: 'summary_large_image'
  },

  // Alias para servicios
  servicios: {
    metaTitle: 'Servicios de Desarrollo Software - SCUTI Company',
    metaDescription: 'Desarrollo de aplicaciones web y móviles, soluciones de IA, cloud computing, consultoría tecnológica y más. Servicios profesionales para empresas en crecimiento.',
    keywords: [
      'servicios desarrollo software',
      'aplicaciones web peru',
      'desarrollo movil',
      'consultoria tecnologica',
      'soluciones ia',
      'cloud computing',
      'desarrollo backend',
      'desarrollo frontend'
    ],
    ogTitle: 'Nuestros Servicios - SCUTI Company',
    ogDescription: 'Servicios tecnológicos profesionales diseñados para impulsar tu empresa',
    ogImage: '/Logo.png', // TODO: Crear imagen OG optimizada 1200x630px
    twitterCard: 'summary_large_image'
  },

  // 👥 PÁGINA NOSOTROS/ABOUT
  about: {
    metaTitle: 'Sobre Nosotros - SCUTI Company | Quiénes Somos',
    metaDescription: 'Conoce a SCUTI Company: equipo de expertos en tecnología comprometidos con la innovación. Nuestra misión es transformar negocios mediante soluciones tecnológicas de vanguardia.',
    keywords: [
      'scuti company',
      'empresa tecnologia peru',
      'equipo desarrollo',
      'nosotros scuti',
      'vision mision',
      'valores empresa',
      'historia scuti',
      'equipo tech'
    ],
    ogTitle: 'Sobre SCUTI Company - Nuestro Equipo y Visión',
    ogDescription: 'Conoce quiénes somos, qué nos motiva y cómo transformamos negocios',
    ogImage: '/Logo.png', // TODO: Crear imagen OG optimizada 1200x630px
    twitterCard: 'summary_large_image'
  },

  // Alias para nosotros
  nosotros: {
    metaTitle: 'Sobre Nosotros - SCUTI Company | Quiénes Somos',
    metaDescription: 'Conoce a SCUTI Company: equipo de expertos en tecnología comprometidos con la innovación. Nuestra misión es transformar negocios mediante soluciones tecnológicas de vanguardia.',
    keywords: [
      'scuti company',
      'empresa tecnologia peru',
      'equipo desarrollo',
      'nosotros scuti',
      'vision mision',
      'valores empresa',
      'historia scuti',
      'equipo tech'
    ],
    ogTitle: 'Sobre SCUTI Company - Nuestro Equipo y Visión',
    ogDescription: 'Conoce quiénes somos, qué nos motiva y cómo transformamos negocios',
    ogImage: '/Logo.png', // TODO: Crear imagen OG optimizada 1200x630px
    twitterCard: 'summary_large_image'
  },

  // 📞 PÁGINA CONTACTO
  contact: {
    metaTitle: 'Contacto - SCUTI Company | Hablemos de tu Proyecto',
    metaDescription: 'Ponte en contacto con SCUTI Company. Agenda una consulta gratuita y descubre cómo podemos ayudarte a alcanzar tus objetivos tecnológicos.',
    keywords: [
      'contacto scuti',
      'consultoria tecnologica',
      'agenda reunion',
      'contacto empresa tech',
      'solicitar servicio',
      'presupuesto desarrollo'
    ],
    ogTitle: 'Contáctanos - SCUTI Company',
    ogDescription: 'Agenda una consulta gratuita y llevemos tu proyecto al siguiente nivel',
    ogImage: '/Logo.png', // TODO: Crear imagen OG optimizada 1200x630px
    twitterCard: 'summary_large_image'
  },

  // Alias para contacto
  contacto: {
    metaTitle: 'Contacto - SCUTI Company | Hablemos de tu Proyecto',
    metaDescription: 'Ponte en contacto con SCUTI Company. Agenda una consulta gratuita y descubre cómo podemos ayudarte a alcanzar tus objetivos tecnológicos.',
    keywords: [
      'contacto scuti',
      'consultoria tecnologica',
      'agenda reunion',
      'contacto empresa tech',
      'solicitar servicio',
      'presupuesto desarrollo'
    ],
    ogTitle: 'Contáctanos - SCUTI Company',
    ogDescription: 'Agenda una consulta gratuita y llevemos tu proyecto al siguiente nivel',
    ogImage: '/Logo.png', // TODO: Crear imagen OG optimizada 1200x630px
    twitterCard: 'summary_large_image'
  }
};

/**
 * 🔍 Obtener configuración SEO hardcodeada para una página
 * @param pageName - Nombre de la página (home, blog, services, etc.)
 * @returns Configuración SEO o undefined si no existe
 */
export const getHardcodedSeo = (pageName: string): PageSeoConfig | undefined => {
  return DEFAULT_SEO_CONFIG[pageName];
};

/**
 * 📊 Verificar si una página tiene configuración SEO hardcodeada
 * @param pageName - Nombre de la página
 * @returns true si existe configuración
 */
export const hasHardcodedSeo = (pageName: string): boolean => {
  return pageName in DEFAULT_SEO_CONFIG;
};

/**
 * 📝 Listar todas las páginas con configuración SEO
 * @returns Array de nombres de páginas
 */
export const getConfiguredPages = (): string[] => {
  return Object.keys(DEFAULT_SEO_CONFIG);
};
