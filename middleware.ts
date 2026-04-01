import { next } from '@vercel/edge';

/**
 * 🚀 Vercel Edge Middleware para SEO de Blog Posts
 * 
 * Este middleware intercepta las requests a /blog/:slug y modifica el HTML
 * para incluir los meta tags OG correctos del post.
 * 
 * Esto permite que Facebook, Twitter, LinkedIn y otros crawlers
 * vean los meta tags correctos sin necesidad de pre-rendering.
 */

// Configuración
const CONFIG = {
  apiUrl: 'https://web-scuticompany-back.onrender.com',
  siteUrl: 'https://scuticompany.com',
  siteName: 'SCUTI Company Blog',
  defaultImage: 'https://scuticompany.com/Logo.png',
  twitterHandle: '@scuticompany',
  // Imagen para Google Search Results (favicon grande)
  googleFavicon: 'https://scuticompany.com/logoiconoresultadosgoogle.jpeg'
};

/**
 * Generar favicons para Google Search Results
 */
function generateFavicons(): string {
  return `
    <!-- Favicons optimizados para Google Search -->
    <link rel="icon" href="/favicon.ico" sizes="48x48" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
    <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="shortcut icon" href="/logoiconoresultadosgoogle.jpeg" type="image/jpeg" />
  `;
}

// Cache en memoria para evitar llamadas repetidas a la API
const postCache = new Map<string, { data: any; timestamp: number }>();
const servicioCache = new Map<string, { data: any; timestamp: number }>();
const proyectoCache = new Map<string, { data: any; timestamp: number }>();
const pageSeoCache = new Map<string, { data: any; timestamp: number }>();
const pageFullCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hora

/**
 * Obtener datos del post desde la API
 */
async function getPostData(slug: string): Promise<any | null> {
  // Verificar cache
  const cached = postCache.get(slug);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `${CONFIG.apiUrl}/api/blog/posts/${slug}?incrementViews=false`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Vercel-Edge-Middleware'
        }
      }
    );

    if (!response.ok) {
      console.error(`Error fetching post ${slug}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    if (!data.success || !data.data?.post) {
      return null;
    }

    const post = data.data.post;
    
    // Guardar en cache
    postCache.set(slug, { data: post, timestamp: Date.now() });
    
    return post;
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    return null;
  }
}

/**
 * Obtener datos del servicio desde la API
 */
async function getServicioData(slug: string): Promise<any | null> {
  // Verificar cache
  const cached = servicioCache.get(slug);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `${CONFIG.apiUrl}/api/servicios/${slug}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Vercel-Edge-Middleware'
        }
      }
    );

    if (!response.ok) {
      console.error(`Error fetching servicio ${slug}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    if (!data.success || !data.data) {
      return null;
    }

    const servicio = data.data;
    
    // Guardar en cache
    servicioCache.set(slug, { data: servicio, timestamp: Date.now() });
    
    return servicio;
  } catch (error) {
    console.error(`Error fetching servicio ${slug}:`, error);
    return null;
  }
}

async function getProyectoData(slug: string): Promise<any | null> {
  const cached = proyectoCache.get(slug);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `${CONFIG.apiUrl}/api/proyectos/detalle/${slug}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Vercel-Edge-Middleware'
        }
      }
    );

    if (!response.ok) {
      console.error(`Error fetching proyecto ${slug}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    if (!data.success || !data.data) return null;

    proyectoCache.set(slug, { data: data.data, timestamp: Date.now() });
    return data.data;
  } catch (error) {
    console.error(`Error fetching proyecto ${slug}:`, error);
    return null;
  }
}

function generateProyectoMetaTags(proyecto: any): string {
  const nombre = escapeHtml(proyecto.nombre || 'Proyecto');
  const descripcion = escapeHtml(
    proyecto.descripcionCorta ||
    (proyecto.descripcionCompleta ? proyecto.descripcionCompleta.replace(/<[^>]*>/g, '').substring(0, 160) : '') ||
    'Proyecto tecnológico desarrollado por SCUTI Company'
  );
  const proyectoUrl = `${CONFIG.siteUrl}/proyectos/${proyecto.slug}`;
  const imagen = proyecto.imagenPrincipal?.url ||
    proyecto.imagenPrincipal?.secure_url ||
    (typeof proyecto.imagenPrincipal === 'string' && proyecto.imagenPrincipal.startsWith('http') ? proyecto.imagenPrincipal : null) ||
    CONFIG.defaultImage;
  const keywords = [
    proyecto.categoria || 'proyecto',
    'SCUTI Company',
    'desarrollo de software',
    ...(proyecto.tecnologias?.slice(0, 5).map((t: any) => typeof t === 'string' ? t : t.nombre) || [])
  ].filter(Boolean).join(', ');

  return `
    ${generateFavicons()}
    <!-- Primary Meta Tags - Proyecto - Generado por Edge Middleware -->
    <title>${nombre} | SCUTI Company</title>
    <meta name="title" content="${nombre} | SCUTI Company" />
    <meta name="description" content="${descripcion}" />
    <meta name="keywords" content="${escapeHtml(keywords)}" />
    <meta name="author" content="SCUTI Company" />
    <link rel="canonical" href="${proyectoUrl}" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${proyectoUrl}" />
    <meta property="og:title" content="${nombre} | SCUTI Company" />
    <meta property="og:description" content="${descripcion}" />
    <meta property="og:image" content="${imagen}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="SCUTI Company" />
    <meta property="og:locale" content="es_PE" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${proyectoUrl}" />
    <meta name="twitter:title" content="${nombre} | SCUTI Company" />
    <meta name="twitter:description" content="${descripcion}" />
    <meta name="twitter:image" content="${imagen}" />
    <meta name="twitter:site" content="${CONFIG.twitterHandle}" />

    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "${nombre}",
      "description": "${descripcion}",
      "url": "${proyectoUrl}",
      "image": "${imagen}",
      "applicationCategory": "${escapeHtml(proyecto.categoria || 'WebApplication')}",
      "creator": {
        "@type": "Organization",
        "name": "SCUTI Company",
        "url": "${CONFIG.siteUrl}"
      }
    }
    <\/script>
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Inicio", "item": "${CONFIG.siteUrl}"},
        {"@type": "ListItem", "position": 2, "name": "Proyectos", "item": "${CONFIG.siteUrl}/proyectos"},
        {"@type": "ListItem", "position": 3, "name": "${nombre}", "item": "${proyectoUrl}"}
      ]
    }
    <\/script>
  `;
}

/**
 * Obtener datos SEO de una página del CMS
 * Consulta /api/cms/pages/:slug y retorna el objeto seo
 */
async function getPageSeoData(slug: string): Promise<any | null> {
  // Verificar cache
  const cached = pageSeoCache.get(slug);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `${CONFIG.apiUrl}/api/cms/pages/${slug}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Vercel-Edge-Middleware'
        }
      }
    );

    if (!response.ok) {
      console.error(`[Edge Middleware] Error fetching CMS page "${slug}": ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (!data.success || !data.data?.seo) {
      console.log(`[Edge Middleware] No SEO data in CMS for page "${slug}"`);
      return null;
    }

    const seo = data.data.seo;

    // Guardar en cache
    pageSeoCache.set(slug, { data: seo, timestamp: Date.now() });

    return seo;
  } catch (error) {
    console.error(`[Edge Middleware] Error fetching CMS SEO for "${slug}":`, error);
    return null;
  }
}

/**
 * Obtener datos COMPLETOS de una página del CMS (SEO + contenido)
 * Para generar contenido visible para crawlers
 */
async function getFullCmsPageData(slug: string): Promise<any | null> {
  const cached = pageFullCache.get(slug);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const response = await fetch(
      `${CONFIG.apiUrl}/api/cms/pages/${slug}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Vercel-Edge-Middleware'
        }
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (!data.success || !data.data) return null;

    pageFullCache.set(slug, { data: data.data, timestamp: Date.now() });
    return data.data;
  } catch (error) {
    console.error(`[Edge Middleware] Error fetching full CMS page "${slug}":`, error);
    return null;
  }
}

/**
 * Obtener URL de imagen del servicio
 */
function getServicioImageUrl(servicio: any): string {
  // Prioridad: imagen principal > primera imagen de galería > logo horizontal
  if (servicio.imagen) {
    if (servicio.imagen.startsWith('http')) return servicio.imagen;
    return `https://res.cloudinary.com/ds54wlchi/image/upload/${servicio.imagen}`;
  }
  if (servicio.galeriaImagenes && servicio.galeriaImagenes.length > 0) {
    const img = servicio.galeriaImagenes[0];
    if (img.startsWith('http')) return img;
    return `https://res.cloudinary.com/ds54wlchi/image/upload/${img}`;
  }
  // Fallback al logo horizontal
  return `${CONFIG.siteUrl}/logohorizontal.jpeg`;
}

/**
 * Obtener URL de imagen
 */
function getImageUrl(image: any): string {
  if (!image) return CONFIG.defaultImage;
  if (typeof image === 'string') {
    if (image.startsWith('http')) return image;
    return `https://res.cloudinary.com/dqnjmqhqh/image/upload/${image}`;
  }
  if (image.url) return image.url;
  if (image.secure_url) return image.secure_url;
  return CONFIG.defaultImage;
}

/**
 * Obtener nombre del autor
 */
function getAuthorName(author: any): string {
  if (!author) return 'SCUTI Company';
  if (typeof author === 'string') return author;
  if (author.displayName) return author.displayName;
  if (author.firstName && author.lastName) return `${author.firstName} ${author.lastName}`;
  if (author.firstName) return author.firstName;
  return 'SCUTI Company';
}

/**
 * Escapar HTML
 */
function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generar meta tags dinámicos desde datos SEO del CMS
 * Si no hay datos del CMS, retorna el fallback hardcodeado
 */
function generateCmsPageMetaTags(
  seo: any | null,
  pageUrl: string,
  pageName: string,
  fallbackMetaTags: string
): string {
  // Si no hay datos del CMS, usar fallback hardcodeado
  if (!seo || (!seo.metaTitle && !seo.metaDescription)) {
    console.log(`[Edge Middleware] No CMS SEO for "${pageName}", using hardcoded fallback`);
    return fallbackMetaTags;
  }

  console.log(`[Edge Middleware] Using CMS SEO for "${pageName}": ${seo.metaTitle?.substring(0, 50)}`);

  const title = escapeHtml(seo.metaTitle || CONFIG.siteName);
  const description = escapeHtml(seo.metaDescription || '');
  const ogTitle = escapeHtml(seo.ogTitle || seo.metaTitle || CONFIG.siteName);
  const ogDescription = escapeHtml(seo.ogDescription || seo.metaDescription || '');
  const ogImage = seo.ogImage && seo.ogImage.startsWith('http')
    ? seo.ogImage
    : seo.ogImage
      ? `${CONFIG.siteUrl}${seo.ogImage.startsWith('/') ? '' : '/'}${seo.ogImage}`
      : `${CONFIG.siteUrl}/logofondonegro.jpeg`;
  const focusKeyphrase = escapeHtml(seo.focusKeyphrase || '');

  // Nuevos campos SEO desde CMS
  const canonicalUrl = seo.canonicalUrl || pageUrl;
  const robots = seo.robots || 'index, follow';
  const ogType = seo.ogType || 'website';
  const twitterTitle = escapeHtml(seo.twitterTitle || ogTitle);
  const twitterDescription = escapeHtml(seo.twitterDescription || ogDescription);
  const twitterImage = seo.twitterImage && seo.twitterImage.startsWith('http')
    ? seo.twitterImage
    : seo.twitterImage
      ? `${CONFIG.siteUrl}${seo.twitterImage.startsWith('/') ? '' : '/'}${seo.twitterImage}`
      : ogImage;

  // Construir keywords: focusKeyphrase + keywords array
  const keywordsArr: string[] = [];
  if (seo.focusKeyphrase) keywordsArr.push(seo.focusKeyphrase);
  if (seo.keywords?.length) keywordsArr.push(...seo.keywords);
  const keywords = escapeHtml(Array.from(new Set(keywordsArr)).filter(Boolean).join(', '));

  return `
    ${generateFavicons()}
    <!-- Primary Meta Tags - ${pageName} - Generado por Edge Middleware desde CMS -->
    <title>${title}</title>
    <meta name="title" content="${title}" />
    <meta name="description" content="${description}" />
    ${keywords ? `<meta name="keywords" content="${keywords}" />` : ''}
    ${focusKeyphrase ? `<meta name="article:tag" content="${focusKeyphrase}" />` : ''}
    <meta name="author" content="SCUTI Company" />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${canonicalUrl}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${ogType}" />
    <meta property="og:url" content="${pageUrl}" />
    <meta property="og:title" content="${ogTitle}" />
    <meta property="og:description" content="${ogDescription}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="SCUTI Company" />
    <meta property="og:locale" content="es_PE" />

    <!-- Twitter -->
    <meta name="twitter:card" content="${seo.twitterCard || 'summary_large_image'}" />
    <meta name="twitter:url" content="${pageUrl}" />
    <meta name="twitter:title" content="${twitterTitle}" />
    <meta name="twitter:description" content="${twitterDescription}" />
    <meta name="twitter:image" content="${twitterImage}" />
    <meta name="twitter:site" content="${CONFIG.twitterHandle}" />
  `;
}

/**
 * Generar meta tags para la página del listado del blog
 */
function generateBlogListMetaTags(): string {
  const title = 'Blog de Tecnología y Software';
  const description = 'Artículos sobre desarrollo de software, inteligencia artificial, automatización y transformación digital para PYMES. Consejos, guías y casos de éxito.';
  const blogUrl = `${CONFIG.siteUrl}/blog`;
  // Imagen específica para el blog - Logo horizontal con fondo blanco
  const imageUrl = `${CONFIG.siteUrl}/logohorizontal.jpeg`;

  return `
    ${generateFavicons()}
    <!-- Primary Meta Tags - Blog Listing - Generado por Edge Middleware -->
    <title>${title} | ${CONFIG.siteName}</title>
    <meta name="title" content="${title} | ${CONFIG.siteName}" />
    <meta name="description" content="${description}" />
    <meta name="keywords" content="blog tecnología, desarrollo software, inteligencia artificial, IA para PYMES, transformación digital, automatización empresarial, software a medida, artículos tecnología, noticias digitales Perú, tutoriales desarrollo, guías programación, tendencias tech" />
    <meta name="author" content="SCUTI Company" />
    <link rel="canonical" href="${blogUrl}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${blogUrl}" />
    <meta property="og:title" content="${title} | ${CONFIG.siteName}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="${CONFIG.siteName}" />
    <meta property="og:locale" content="es_PE" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${blogUrl}" />
    <meta name="twitter:title" content="${title} | ${CONFIG.siteName}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <meta name="twitter:site" content="${CONFIG.twitterHandle}" />
    
    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "${title}",
      "description": "${description}",
      "url": "${blogUrl}",
      "publisher": {
        "@type": "Organization",
        "name": "SCUTI Company",
        "logo": {
          "@type": "ImageObject",
          "url": "${CONFIG.defaultImage}"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${blogUrl}"
      }
    }
    </script>
  `;
}

/**
 * Generar meta tags para la página Home
 */
function generateHomeMetaTags(): string {
  const title = 'Desarrollo de Software e IA para PYMES';
  const description = 'Transformamos procesos con soluciones digitales innovadoras. La Solución en Perú: Software, IA y Automatización para PYMES. Obtén la tecnología y escala rápido.';
  const homeUrl = CONFIG.siteUrl;
  const imageUrl = `${CONFIG.siteUrl}/logohorizontal.jpeg`;

  return `
    ${generateFavicons()}
    <!-- Primary Meta Tags - Home - Generado por Edge Middleware -->
    <title>${title} | SCUTI Company Perú</title>
    <meta name="title" content="${title} | SCUTI Company Perú" />
    <meta name="description" content="${description}" />
    <meta name="keywords" content="desarrollo software, inteligencia artificial, IA, PYMES, automatización, software a medida, Perú, transformación digital, empresa tecnología Lima, sistemas empresariales, soluciones digitales Perú, desarrollo web Lima, apps empresariales" />
    <meta name="author" content="SCUTI Company" />
    <link rel="canonical" href="${homeUrl}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${homeUrl}" />
    <meta property="og:title" content="${title} | SCUTI Company Perú" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="SCUTI Company" />
    <meta property="og:locale" content="es_PE" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${homeUrl}" />
    <meta name="twitter:title" content="${title} | SCUTI Company Perú" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <meta name="twitter:site" content="${CONFIG.twitterHandle}" />
    
    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "SCUTI Company",
      "alternateName": "Scuti",
      "url": "${homeUrl}",
      "logo": {
        "@type": "ImageObject",
        "url": "${imageUrl}"
      },
      "description": "${description}",
      "foundingDate": "2024",
      "areaServed": {
        "@type": "Country",
        "name": "Perú"
      },
      "sameAs": [
        "https://www.linkedin.com/company/scuticompany",
        "https://twitter.com/scuticompany"
      ]
    }
    </script>
  `;
}

/**
 * Generar meta tags para la página Servicios
 */
function generateServiciosMetaTags(): string {
  const title = 'Servicios de Desarrollo de Software e IA';
  const description = 'Soluciones tecnológicas para PYMES: Desarrollo de Software a Medida, Inteligencia Artificial, Automatización de Procesos, Integración de Sistemas y Consultoría Tecnológica.';
  const serviciosUrl = `${CONFIG.siteUrl}/servicios`;
  const imageUrl = `${CONFIG.siteUrl}/logohorizontal.jpeg`;

  return `
    ${generateFavicons()}
    <!-- Primary Meta Tags - Servicios - Generado por Edge Middleware -->
    <title>${title} | SCUTI Company Perú</title>
    <meta name="title" content="${title} | SCUTI Company Perú" />
    <meta name="description" content="${description}" />
    <meta name="keywords" content="servicios software, desarrollo a medida, inteligencia artificial, automatización, integración sistemas, consultoría tecnológica, PYMES Perú, cotización software, apps empresariales Lima, sistemas web Perú, desarrollo aplicaciones, soluciones cloud" />
    <meta name="author" content="SCUTI Company" />
    <link rel="canonical" href="${serviciosUrl}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${serviciosUrl}" />
    <meta property="og:title" content="${title} | SCUTI Company Perú" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="SCUTI Company" />
    <meta property="og:locale" content="es_PE" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${serviciosUrl}" />
    <meta name="twitter:title" content="${title} | SCUTI Company Perú" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <meta name="twitter:site" content="${CONFIG.twitterHandle}" />
    
    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "${title}",
      "description": "${description}",
      "url": "${serviciosUrl}",
      "provider": {
        "@type": "Organization",
        "name": "SCUTI Company",
        "url": "${CONFIG.siteUrl}"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Perú"
      },
      "serviceType": ["Desarrollo de Software", "Inteligencia Artificial", "Automatización", "Consultoría Tecnológica"]
    }
    </script>
  `;
}

/**
 * Generar meta tags para la página Nosotros
 */
function generateNosotrosMetaTags(): string {
  const title = 'Sobre Nosotros - Conoce a SCUTI Company';
  const description = 'Somos una empresa peruana especializada en desarrollo de software e inteligencia artificial para PYMES. Conoce nuestra misión, visión y equipo de expertos.';
  const nosotrosUrl = `${CONFIG.siteUrl}/nosotros`;
  const imageUrl = `${CONFIG.siteUrl}/logohorizontal.jpeg`;

  return `
    ${generateFavicons()}
    <!-- Primary Meta Tags - Nosotros - Generado por Edge Middleware -->
    <title>${title} | SCUTI Company Perú</title>
    <meta name="title" content="${title} | SCUTI Company Perú" />
    <meta name="description" content="${description}" />
    <meta name="keywords" content="SCUTI Company, empresa software Perú, equipo desarrollo, IA PYMES, quiénes somos, misión visión, startup tecnología Lima, desarrolladores peruanos, empresa innovación digital, equipo tech Perú" />
    <meta name="author" content="SCUTI Company" />
    <link rel="canonical" href="${nosotrosUrl}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${nosotrosUrl}" />
    <meta property="og:title" content="${title} | SCUTI Company Perú" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="SCUTI Company" />
    <meta property="og:locale" content="es_PE" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${nosotrosUrl}" />
    <meta name="twitter:title" content="${title} | SCUTI Company Perú" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <meta name="twitter:site" content="${CONFIG.twitterHandle}" />
    
    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "${title}",
      "description": "${description}",
      "url": "${nosotrosUrl}",
      "mainEntity": {
        "@type": "Organization",
        "name": "SCUTI Company",
        "url": "${CONFIG.siteUrl}",
        "foundingDate": "2024",
        "areaServed": "Perú"
      }
    }
    </script>
  `;
}

/**
 * Generar meta tags para la página Contacto
 */
function generateContactoMetaTags(): string {
  const title = 'Contacto - SCUTI Company | Agenda tu Consulta Gratuita';
  const description = 'Contáctanos para tu proyecto tecnológico. Desarrollo web, apps móviles y soluciones digitales en Huánuco, Perú. Agenda una consulta gratuita.';
  const contactoUrl = `${CONFIG.siteUrl}/contacto`;
  const imageUrl = `${CONFIG.siteUrl}/logofondonegro.jpeg`;

  return `
    ${generateFavicons()}
    <!-- Primary Meta Tags - Contacto - Generado por Edge Middleware -->
    <title>${title}</title>
    <meta name="title" content="${title}" />
    <meta name="description" content="${description}" />
    <meta name="keywords" content="contacto scuti, consultoria tecnologica peru, agenda reunion, contacto empresa tech huanuco, solicitar servicio, presupuesto desarrollo, desarrollo web peru" />
    <meta name="author" content="SCUTI Company" />
    <link rel="canonical" href="${contactoUrl}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${contactoUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="SCUTI Company" />
    <meta property="og:locale" content="es_PE" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${contactoUrl}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <meta name="twitter:site" content="${CONFIG.twitterHandle}" />

    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "${title}",
      "description": "${description}",
      "url": "${contactoUrl}",
      "mainEntity": {
        "@type": "Organization",
        "name": "SCUTI Company",
        "url": "${CONFIG.siteUrl}",
        "telephone": "+51 973 397 306",
        "email": "gscutic@gmail.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "calles los molles lt-02",
          "addressLocality": "Huánuco",
          "addressCountry": "PE"
        }
      }
    }
    </script>
  `;
}

/**
 * Generar meta tags para la página Política de Privacidad
 */
function generatePrivacidadMetaTags(): string {
  const title = 'Política de Privacidad - SCUTI Company';
  const description = 'Conoce nuestra política de privacidad y cómo protegemos tus datos personales. SCUTI Company cumple con la legislación peruana de protección de datos.';
  const privacidadUrl = `${CONFIG.siteUrl}/privacidad`;
  const imageUrl = `${CONFIG.siteUrl}/logofondonegro.jpeg`;

  return `
    ${generateFavicons()}
    <!-- Primary Meta Tags - Privacidad - Generado por Edge Middleware -->
    <title>${title}</title>
    <meta name="title" content="${title}" />
    <meta name="description" content="${description}" />
    <meta name="keywords" content="política de privacidad, protección de datos, SCUTI Company, datos personales, privacidad peru" />
    <meta name="author" content="SCUTI Company" />
    <link rel="canonical" href="${privacidadUrl}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${privacidadUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="SCUTI Company" />
    <meta property="og:locale" content="es_PE" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${privacidadUrl}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <meta name="twitter:site" content="${CONFIG.twitterHandle}" />
  `;
}

/**
 * Generar meta tags para la página Términos y Condiciones
 */
function generateTerminosMetaTags(): string {
  const title = 'Términos y Condiciones - SCUTI Company';
  const description = 'Lee nuestros términos y condiciones de uso. Información sobre los servicios de desarrollo de software y consultoría tecnológica de SCUTI Company.';
  const terminosUrl = `${CONFIG.siteUrl}/terminos`;
  const imageUrl = `${CONFIG.siteUrl}/logofondonegro.jpeg`;

  return `
    ${generateFavicons()}
    <!-- Primary Meta Tags - Términos - Generado por Edge Middleware -->
    <title>${title}</title>
    <meta name="title" content="${title}" />
    <meta name="description" content="${description}" />
    <meta name="keywords" content="terminos y condiciones, terminos de servicio, SCUTI Company, condiciones de uso, servicios tecnologicos peru" />
    <meta name="author" content="SCUTI Company" />
    <link rel="canonical" href="${terminosUrl}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${terminosUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="SCUTI Company" />
    <meta property="og:locale" content="es_PE" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${terminosUrl}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <meta name="twitter:site" content="${CONFIG.twitterHandle}" />
  `;
}

/**
 * Generar meta tags para un servicio individual (detalle)
 */
function generateServicioDetailMetaTags(servicio: any): string {
  // Prioridad para título: seo.titulo > metaTitle > titulo
  const title = escapeHtml(
    servicio.seo?.titulo || 
    servicio.metaTitle || 
    servicio.titulo || 
    'Servicio'
  );
  
  // Prioridad para descripción: seo.descripcion > metaDescription > descripcionCorta > descripcion
  const description = escapeHtml(
    servicio.seo?.descripcion || 
    servicio.metaDescription || 
    servicio.descripcionCorta || 
    (servicio.descripcion ? servicio.descripcion.substring(0, 160) : 'Servicio profesional de SCUTI Company')
  );
  
  const servicioUrl = `${CONFIG.siteUrl}/servicios/${servicio.slug}`;
  const imageUrl = getServicioImageUrl(servicio);
  
  // ✅ Keywords del servicio - Priorizar seo.palabrasClave configuradas
  const keywords = servicio.seo?.palabrasClave 
    ? servicio.seo.palabrasClave  // Si hay SEO configurado, usarlo directamente
    : [
        ...(servicio.etiquetas || []),
        servicio.categoria?.nombre || '',
        servicio.titulo || ''
      ].filter(Boolean).join(', ');

  // Información de precio
  let priceInfo = '';
  if (servicio.precio && servicio.tipoPrecio === 'fijo') {
    priceInfo = `Precio: ${servicio.moneda || 'PEN'} ${servicio.precio}`;
  } else if (servicio.precioMin && servicio.precioMax && servicio.tipoPrecio === 'rango') {
    priceInfo = `Precio desde ${servicio.moneda || 'PEN'} ${servicio.precioMin}`;
  }

  return `
    ${generateFavicons()}
    <!-- Primary Meta Tags - Servicio Detail - Generado por Edge Middleware -->
    <title>${title} | SCUTI Company Perú</title>
    <meta name="title" content="${title} | SCUTI Company Perú" />
    <meta name="description" content="${description}" />
    <meta name="keywords" content="${escapeHtml(keywords)}" />
    <meta name="author" content="SCUTI Company" />
    <link rel="canonical" href="${servicioUrl}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="product" />
    <meta property="og:url" content="${servicioUrl}" />
    <meta property="og:title" content="${title} | SCUTI Company Perú" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="SCUTI Company" />
    <meta property="og:locale" content="es_PE" />
    ${servicio.precio ? `<meta property="product:price:amount" content="${servicio.precio}" />` : ''}
    ${servicio.moneda ? `<meta property="product:price:currency" content="${servicio.moneda}" />` : ''}
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${servicioUrl}" />
    <meta name="twitter:title" content="${title} | SCUTI Company Perú" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <meta name="twitter:site" content="${CONFIG.twitterHandle}" />
    
    <!-- Schema.org JSON-LD - Service -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "${title}",
      "description": "${description}",
      "url": "${servicioUrl}",
      "image": "${imageUrl}",
      "provider": {
        "@type": "Organization",
        "name": "SCUTI Company",
        "url": "${CONFIG.siteUrl}",
        "logo": "${CONFIG.siteUrl}/logohorizontal.jpeg"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Perú"
      }${servicio.categoria?.nombre ? `,
      "category": "${escapeHtml(servicio.categoria.nombre)}"` : ''}${servicio.precio && servicio.tipoPrecio === 'fijo' ? `,
      "offers": {
        "@type": "Offer",
        "price": "${servicio.precio}",
        "priceCurrency": "${servicio.moneda || 'PEN'}",
        "availability": "https://schema.org/InStock"
      }` : ''}${servicio.rating ? `,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "${servicio.rating}",
        "reviewCount": "${servicio.numeroReviews || 1}"
      }` : ''}
    }
    </script>
  `;
}

/**
 * Generar meta tags para el post
 */
function generateMetaTags(post: any): string {
  // ✅ CORREGIDO: Usar SEO configurado por el usuario
  const title = escapeHtml(post.seo?.metaTitle || post.title);
  const description = escapeHtml(post.seo?.metaDescription || post.excerpt || '');
  const imageUrl = getImageUrl(post.featuredImage);
  const postUrl = `${CONFIG.siteUrl}/blog/${post.slug}`;
  const authorName = escapeHtml(getAuthorName(post.author));
  
  // ✅ Keywords: Priorizar focusKeyphrase + seo.keywords, eliminar duplicados
  const seoKeywords = post.seo?.focusKeyphrase || post.seo?.keywords?.length
    ? [...new Set([post.seo?.focusKeyphrase, ...(post.seo?.keywords || [])].filter(Boolean))]
    : post.tags?.map((t: any) => typeof t === 'string' ? t : t.name) || [];
  const keywords = seoKeywords.join(', ');
  
  const publishedTime = post.publishedAt || post.createdAt;
  const modifiedTime = post.updatedAt || publishedTime;

  return `
    ${generateFavicons()}
    <!-- Primary Meta Tags - Generado por Edge Middleware -->
    <title>${title} | ${CONFIG.siteName}</title>
    <meta name="title" content="${title} | ${CONFIG.siteName}" />
    <meta name="description" content="${description}" />
    <meta name="keywords" content="${escapeHtml(keywords)}" />
    <meta name="author" content="${authorName}" />
    <link rel="canonical" href="${postUrl}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${postUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="${CONFIG.siteName}" />
    <meta property="og:locale" content="es_PE" />
    <meta property="article:published_time" content="${new Date(publishedTime).toISOString()}" />
    <meta property="article:modified_time" content="${new Date(modifiedTime).toISOString()}" />
    <meta property="article:author" content="${authorName}" />
    ${post.category?.name ? `<meta property="article:section" content="${escapeHtml(post.category.name)}" />` : ''}
    ${seoKeywords.map((kw: string) => `<meta property="article:tag" content="${escapeHtml(kw)}" />`).join('\n    ')}
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${postUrl}" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <meta name="twitter:site" content="${CONFIG.twitterHandle}" />
    
    <!-- Schema.org JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "${title}",
      "description": "${description}",
      "image": "${imageUrl}",
      "url": "${postUrl}",
      "datePublished": "${new Date(publishedTime).toISOString()}",
      "dateModified": "${new Date(modifiedTime).toISOString()}",
      "author": {
        "@type": "Person",
        "name": "${authorName}"
      },
      "publisher": {
        "@type": "Organization",
        "name": "SCUTI Company",
        "logo": {
          "@type": "ImageObject",
          "url": "${CONFIG.defaultImage}"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${postUrl}"
      }${seoKeywords.length > 0 ? `,
      "keywords": "${escapeHtml(keywords)}"` : ''}${post.seo?.focusKeyphrase ? `,
      "about": {
        "@type": "Thing",
        "name": "${escapeHtml(post.seo.focusKeyphrase)}"
      }` : ''}
    }
    </script>
  `;
}

/**
 * 🎯 CRÍTICO PARA SEO: Generar contenido visible para páginas CMS
 * Inyecta contenido semántico real en el div#root para crawlers que no ejecutan JS
 * (Facebook, Twitter, LinkedIn, bots antiguos, etc.)
 */
function generateVisibleCmsContent(pageData: any, pageName: string, pageUrl: string): string {
  const seo = pageData?.seo || {};
  const content = pageData?.content || {};
  const title = escapeHtml(seo.metaTitle || pageName);
  const description = escapeHtml(seo.metaDescription || '');

  // Extraer contenido según el tipo de página
  let mainContent = '';

  if (pageName === 'home') {
    const hero = content.hero || {};
    const solutions = content.solutions || {};
    const valueAdded = content.valueAdded || {};

    mainContent = `
      <section>
        ${hero.title ? `<h1>${escapeHtml(hero.title)}</h1>` : `<h1>${title}</h1>`}
        ${hero.subtitle ? `<h2>${escapeHtml(hero.subtitle)}</h2>` : ''}
        ${hero.description ? `<p>${escapeHtml(hero.description)}</p>` : ''}
      </section>
      
      ${solutions.title ? `
      <section>
        <h2>${escapeHtml(solutions.title)}</h2>
        ${solutions.description ? `<p>${escapeHtml(solutions.description)}</p>` : ''}
        ${solutions.items?.length ? `<ul>${solutions.items.map((item: any) => 
          `<li><strong>${escapeHtml(item.title || '')}</strong>${item.description ? ': ' + escapeHtml(item.description) : ''}</li>`
        ).join('')}</ul>` : ''}
      </section>` : ''}
      
      ${valueAdded?.title ? `
      <section>
        <h2>${escapeHtml(valueAdded.title)}</h2>
        ${valueAdded.description ? `<p>${escapeHtml(valueAdded.description)}</p>` : ''}
        ${valueAdded.items?.length ? `<ul>${valueAdded.items.map((item: any) =>
          `<li><strong>${escapeHtml(item.title || '')}</strong>${item.description ? ': ' + escapeHtml(item.description) : ''}</li>`
        ).join('')}</ul>` : ''}
      </section>` : ''}
    `;
  } else if (pageName === 'services' || pageName === 'servicios') {
    const hero = content.hero || {};
    const servicesList = content.services || content.solutions || {};

    mainContent = `
      <section>
        ${hero.title ? `<h1>${escapeHtml(hero.title)}</h1>` : `<h1>Servicios de Desarrollo de Software</h1>`}
        ${hero.subtitle ? `<h2>${escapeHtml(hero.subtitle)}</h2>` : ''}
        ${hero.description ? `<p>${escapeHtml(hero.description)}</p>` : ''}
      </section>
      
      ${servicesList.items?.length ? `
      <section>
        <h2>Nuestros Servicios</h2>
        <ul>${servicesList.items.map((item: any) =>
          `<li><strong>${escapeHtml(item.title || '')}</strong>${item.description ? ': ' + escapeHtml(item.description) : ''}</li>`
        ).join('')}</ul>
      </section>` : ''}
    `;
  } else if (pageName === 'about' || pageName === 'nosotros') {
    const hero = content.hero || {};
    const mission = content.mission || content.valueAdded || {};
    const team = content.team || {};

    mainContent = `
      <section>
        ${hero.title ? `<h1>${escapeHtml(hero.title)}</h1>` : `<h1>Sobre Nosotros - SCUTI Company</h1>`}
        ${hero.subtitle ? `<h2>${escapeHtml(hero.subtitle)}</h2>` : ''}
        ${hero.description ? `<p>${escapeHtml(hero.description)}</p>` : ''}
      </section>
      
      ${mission.title ? `
      <section>
        <h2>${escapeHtml(mission.title)}</h2>
        ${mission.description ? `<p>${escapeHtml(mission.description)}</p>` : ''}
      </section>` : ''}
      
      ${team.title ? `
      <section>
        <h2>${escapeHtml(team.title)}</h2>
        ${team.members?.length ? `<ul>${team.members.map((m: any) =>
          `<li><strong>${escapeHtml(m.name || '')}</strong>${m.role ? ' - ' + escapeHtml(m.role) : ''}</li>`
        ).join('')}</ul>` : ''}
      </section>` : ''}
    `;
  } else if (pageName === 'contact' || pageName === 'contacto') {
    mainContent = `
      <section>
        <h1>Contacto - SCUTI Company</h1>
        <p>${description || 'Contáctanos para una consulta gratuita sobre desarrollo de software e inteligencia artificial.'}</p>
        
        <div itemscope itemtype="https://schema.org/LocalBusiness">
          <h2>Información de Contacto</h2>
          <p><strong>Dirección:</strong> <span itemprop="address">Calles Los Molles Lt-02, Huánuco, Perú</span></p>
          <p><strong>Teléfono:</strong> <a href="tel:+51973397306" itemprop="telephone">+51 973 397 306</a></p>
          <p><strong>Email:</strong> <a href="mailto:contacto@scuticompany.com" itemprop="email">contacto@scuticompany.com</a></p>
          <p><strong>Horario:</strong> <span itemprop="openingHours">Lunes a Viernes, 9:00 - 19:00</span></p>
        </div>
      </section>
    `;
  } else {
    // Página genérica
    mainContent = `
      <section>
        <h1>${title}</h1>
        ${description ? `<p>${description}</p>` : ''}
      </section>
    `;
  }

  return `
    <main class="cms-page-seo" itemscope itemtype="https://schema.org/WebPage">
      <nav aria-label="Breadcrumb">
        <a href="/" data-discover="true">Inicio</a> &gt; 
        <span>${escapeHtml(pageName === 'home' ? 'Inicio' : pageName.charAt(0).toUpperCase() + pageName.slice(1))}</span>
      </nav>
      
      ${mainContent}
      
      <footer>
        <p>&copy; ${new Date().getFullYear()} SCUTI Company. Desarrollo de Software e IA para PYMES en Perú.</p>
      </footer>
      
      <meta itemprop="url" content="${pageUrl}" />
      <meta itemprop="name" content="${title}" />
    </main>
    
    <style>
      .cms-page-seo { max-width: 900px; margin: 2rem auto; padding: 1rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      .cms-page-seo h1 { font-size: 2rem; margin: 1rem 0; color: #1f2937; }
      .cms-page-seo h2 { font-size: 1.5rem; margin: 1.5rem 0 0.5rem; color: #374151; }
      .cms-page-seo nav { font-size: 0.875rem; color: #6b7280; margin-bottom: 1rem; }
      .cms-page-seo nav a { color: #7c3aed; text-decoration: none; }
      .cms-page-seo p { font-size: 1rem; line-height: 1.7; color: #4b5563; margin-bottom: 1rem; }
      .cms-page-seo ul { padding-left: 1.5rem; margin: 0.5rem 0; }
      .cms-page-seo li { margin-bottom: 0.5rem; color: #4b5563; line-height: 1.6; }
      .cms-page-seo footer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 0.875rem; }
      .cms-page-seo a { color: #7c3aed; }
      @media (prefers-color-scheme: dark) {
        .cms-page-seo { background: #111; color: #f9fafb; }
        .cms-page-seo h1, .cms-page-seo h2 { color: #f9fafb; }
        .cms-page-seo p, .cms-page-seo li { color: #d1d5db; }
      }
    </style>
  `;
}

/**
 * 🔧 Helper: Reemplazar el contenido del div#root de forma segura
 * Usa marcadores únicos si están disponibles, fallback a regex de dos niveles
 */
function replaceRootContent(html: string, content: string): string {
  if (html.includes('<!--ROOT-CONTENT-START-->')) {
    return html.replace(
      /<!--ROOT-CONTENT-START-->[\s\S]*?<!--ROOT-CONTENT-END-->/i,
      content
    );
  }
  // Fallback: captura hasta el SEGUNDO </div> para incluir el div externo
  return html.replace(
    /<div id="root">[\s\S]*?<\/div>\s*<\/div>/i,
    `<div id="root">${content}</div>`
  );
}

/**
 * 🎯 CRÍTICO PARA SEO: Generar contenido visible del artículo para crawlers
 * Esto reemplaza el div#root vacío con contenido real del artículo
 * Para que Google vea contenido real en lugar de "Artículo no encontrado"
 */
function generateVisibleArticleContent(post: any): string {
  const title = escapeHtml(post.seo?.metaTitle || post.title);
  const description = escapeHtml(post.seo?.metaDescription || post.excerpt || '');
  const authorName = escapeHtml(getAuthorName(post.author));
  const imageUrl = getImageUrl(post.featuredImage);
  const categoryName = escapeHtml(post.category?.name || 'Blog');
  const postUrl = `${CONFIG.siteUrl}/blog/${post.slug}`;
  
  // Keywords para mostrar - eliminar duplicados
  const seoKeywords = post.seo?.focusKeyphrase || post.seo?.keywords?.length
    ? [...new Set([post.seo?.focusKeyphrase, ...(post.seo?.keywords || [])].filter(Boolean))]
    : post.tags?.map((t: any) => typeof t === 'string' ? t : t.name) || [];
  const keywords = escapeHtml(seoKeywords.join(', '));
  
  // Fecha formateada
  const publishDate = post.publishedAt 
    ? new Date(post.publishedAt).toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) 
    : '';

  // Extraer preview del contenido (primeros 1500 caracteres de texto plano)
  let contentPreview = '';
  if (post.content) {
    contentPreview = post.content
      .replace(/<[^>]*>/g, ' ')  // Remover HTML
      .replace(/\s+/g, ' ')       // Normalizar espacios
      .trim()
      .substring(0, 1500);
    if (contentPreview.length >= 1500) {
      contentPreview += '...';
    }
  }

  return `
    <article itemscope itemtype="https://schema.org/BlogPosting" class="blog-article-seo">
      <header>
        <nav aria-label="Breadcrumb">
          <a href="/" data-discover="true">Inicio</a> &gt; 
          <a href="/blog" data-discover="true">Blog</a> &gt; 
          <span>${categoryName}</span>
        </nav>
        
        <h1 itemprop="headline">${title}</h1>
        
        <div class="article-meta">
          <span itemprop="author" itemscope itemtype="https://schema.org/Person">
            Por <span itemprop="name">${authorName}</span>
          </span>
          ${publishDate ? `<time itemprop="datePublished" datetime="${new Date(post.publishedAt).toISOString()}">${publishDate}</time>` : ''}
          <span>En <span itemprop="articleSection">${categoryName}</span></span>
        </div>
        
        ${description ? `<p itemprop="description" class="article-excerpt">${description}</p>` : ''}
      </header>
      
      ${imageUrl !== CONFIG.defaultImage ? `
        <figure>
          <img itemprop="image" src="${imageUrl}" alt="${title}" width="1200" height="630" loading="lazy" />
        </figure>
      ` : ''}
      
      <div itemprop="articleBody" class="article-content">
        <p>${escapeHtml(contentPreview)}</p>
      </div>
      
      ${keywords ? `
        <footer>
          <strong>Palabras clave:</strong>
          <span itemprop="keywords">${keywords}</span>
        </footer>
      ` : ''}
      
      <meta itemprop="url" content="${postUrl}" />
      <meta itemprop="mainEntityOfPage" content="${postUrl}" />
    </article>
    
    <style>
      .blog-article-seo { max-width: 800px; margin: 2rem auto; padding: 1rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
      .blog-article-seo h1 { font-size: 2rem; margin: 1rem 0; color: #1f2937; }
      .blog-article-seo nav { font-size: 0.875rem; color: #6b7280; margin-bottom: 1rem; }
      .blog-article-seo nav a { color: #7c3aed; text-decoration: none; }
      .blog-article-seo .article-meta { color: #6b7280; font-size: 0.875rem; margin-bottom: 1rem; display: flex; gap: 1rem; flex-wrap: wrap; }
      .blog-article-seo .article-excerpt { font-size: 1.125rem; color: #4b5563; line-height: 1.6; margin-bottom: 1.5rem; }
      .blog-article-seo figure { margin: 1.5rem 0; }
      .blog-article-seo img { width: 100%; height: auto; border-radius: 0.5rem; }
      .blog-article-seo .article-content { font-size: 1rem; line-height: 1.8; color: #374151; }
      .blog-article-seo footer { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; color: #6b7280; }
      @media (prefers-color-scheme: dark) {
        .blog-article-seo { background: #111; color: #f9fafb; }
        .blog-article-seo h1 { color: #f9fafb; }
        .blog-article-seo .article-excerpt { color: #d1d5db; }
        .blog-article-seo .article-content { color: #e5e7eb; }
      }
    </style>
  `;
}

/**
 * Middleware principal
 */
export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Detectar tipo de página
  const isHomePage = /^\/?$/.test(pathname);
  const isServiciosPage = /^\/servicios\/?$/.test(pathname);
  const isNosotrosPage = /^\/nosotros\/?$/.test(pathname);
  const isContactoPage = /^\/contacto\/?$/.test(pathname);
  const isPrivacidadPage = /^\/privacidad\/?$/.test(pathname);
  const isTerminosPage = /^\/terminos\/?$/.test(pathname);
  const isBlogListPage = /^\/blog\/?$/.test(pathname);
  const isProyectosListPage = /^\/proyectos\/?$/.test(pathname);
  const blogPostMatch = pathname.match(/^\/blog\/([^\/]+)$/);
  const servicioDetailMatch = pathname.match(/^\/servicios\/([^\/]+)$/);
  const proyectoDetailMatch = pathname.match(/^\/proyectos\/([^\/]+)$/);

  // Si no es ninguna página que manejamos, continuar normal
  if (!isHomePage && !isServiciosPage && !isNosotrosPage && !isContactoPage && !isPrivacidadPage && !isTerminosPage && !isBlogListPage && !isProyectosListPage && !blogPostMatch && !servicioDetailMatch && !proyectoDetailMatch) {
    return next();
  }

  // Verificar User-Agent para detectar crawlers
  const userAgent = request.headers.get('user-agent') || '';
  const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Googlebot|bingbot|Slackbot|TelegramBot|Discordbot|Applebot|PetalBot|SemrushBot|AhrefsBot|GPTBot|ClaudeBot|PerplexityBot|YandexBot|DuckDuckBot|Baiduspider|MJ12bot|ia_archiver|Bytespider/i.test(userAgent);

  // Si no es un crawler, dejar pasar la request normal
  if (!isCrawler) {
    return next();
  }

  // === CASO 0: Páginas CMS (Home, Servicios, Nosotros, Contacto) ===
  // Prioridad: 1) Datos del CMS (API) → 2) Fallback hardcodeado
  // AHORA: Inyecta meta tags EN <head> Y contenido visible EN <div id="root">
  if (isHomePage || isServiciosPage || isNosotrosPage || isContactoPage) {
    const pageName = isHomePage ? 'home' : isServiciosPage ? 'services' : isNosotrosPage ? 'about' : 'contact';
    const pageSlug = pageName; // slug para el CMS API
    const pageUrl = isHomePage ? CONFIG.siteUrl : `${CONFIG.siteUrl}/${isServiciosPage ? 'servicios' : isNosotrosPage ? 'nosotros' : 'contacto'}`;
    console.log(`[Edge Middleware] Crawler detected for /${pageName}: ${userAgent.substring(0, 50)}`);

    // 1) Obtener datos COMPLETOS del CMS (SEO + contenido)
    const fullPageData = await getFullCmsPageData(pageSlug);
    const cmsSeo = fullPageData?.seo || await getPageSeoData(pageSlug);

    // Obtener el HTML original desde /index.html
    const indexUrl = new URL('/', request.url);
    const response = await fetch(indexUrl.toString(), {
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Vercel-Edge-Middleware-Internal'
      }
    });

    if (!response.ok) {
      console.log(`[Edge Middleware] Failed to fetch index.html: ${response.status}`);
      return next();
    }

    let html = await response.text();

    // 2) Generar meta tags: CMS primero, hardcodeado como fallback
    const fallbackFn = isHomePage ? generateHomeMetaTags
      : isServiciosPage ? generateServiciosMetaTags
      : isNosotrosPage ? generateNosotrosMetaTags
      : generateContactoMetaTags;
    const metaTags = generateCmsPageMetaTags(cmsSeo, pageUrl, pageName, fallbackFn());

    // Reemplazar el contenido del <head>
    html = html.replace(/<title[^>]*>.*?<\/title>/gi, '');
    html = html.replace(/<meta[^>]*property="og:[^"]*"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="twitter:[^"]*"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="description"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="keywords"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="canonical"[^>]*>/gi, '');
    // Limpiar favicons existentes para evitar duplicados
    html = html.replace(/<link[^>]*rel="icon"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="shortcut icon"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="apple-touch-icon"[^>]*>/gi, '');

    // Insertar los nuevos meta tags después de <head>
    html = html.replace(/<head[^>]*>/i, `<head>\n${metaTags}`);

    // 3) 🎯 CRÍTICO: Inyectar contenido visible en <div id="root">
    if (fullPageData) {
      const visibleContent = generateVisibleCmsContent(fullPageData, pageName, pageUrl);
      html = replaceRootContent(html, visibleContent);
      console.log(`[Edge Middleware] ✅ Injected visible content for /${pageName}`);
    }

    // Retornar el HTML modificado
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'X-Robots-Tag': 'index, follow',
        'X-Edge-Middleware': `${pageName}-seo`
      }
    });
  }

  // === CASO 0.5: Páginas estáticas sin CMS (Privacidad, Términos) ===
  // Solo usan fallback hardcodeado (no existen en el CMS)
  if (isPrivacidadPage || isTerminosPage) {
    const pageName = isPrivacidadPage ? 'privacidad' : 'terminos';
    const pageUrl = `${CONFIG.siteUrl}/${pageName}`;
    console.log(`[Edge Middleware] Crawler detected for /${pageName}: ${userAgent.substring(0, 50)}`);

    const indexUrl = new URL('/', request.url);
    const response = await fetch(indexUrl.toString(), {
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Vercel-Edge-Middleware-Internal'
      }
    });

    if (!response.ok) {
      return next();
    }

    let html = await response.text();

    const metaTags = isPrivacidadPage ? generatePrivacidadMetaTags() : generateTerminosMetaTags();

    html = html.replace(/<title[^>]*>.*?<\/title>/gi, '');
    html = html.replace(/<meta[^>]*property="og:[^"]*"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="twitter:[^"]*"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="description"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="keywords"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="canonical"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="icon"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="shortcut icon"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="apple-touch-icon"[^>]*>/gi, '');

    html = html.replace(/<head[^>]*>/i, `<head>\n${metaTags}`);

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'X-Robots-Tag': 'index, follow',
        'X-Edge-Middleware': `${pageName}-seo`
      }
    });
  }

  // === CASO 1: Página del listado del blog ===
  // Prioridad: 1) Datos del CMS (API) → 2) Fallback hardcodeado
  if (isBlogListPage) {
    console.log(`[Edge Middleware] Crawler detected for /blog: ${userAgent.substring(0, 50)}`);

    // 1) Obtener datos SEO del CMS para la página blog
    const cmsSeo = await getPageSeoData('blog');

    // Obtener el HTML original desde /index.html
    const indexUrl = new URL('/', request.url);
    const response = await fetch(indexUrl.toString(), {
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Vercel-Edge-Middleware-Internal'
      }
    });

    if (!response.ok) {
      console.log(`[Edge Middleware] Failed to fetch index.html: ${response.status}`);
      return next();
    }

    let html = await response.text();

    // 2) Generar meta tags: CMS primero, hardcodeado como fallback
    const metaTags = generateCmsPageMetaTags(cmsSeo, `${CONFIG.siteUrl}/blog`, 'blog', generateBlogListMetaTags());

    // Reemplazar el contenido del <head>
    html = html.replace(/<title[^>]*>.*?<\/title>/gi, '');
    html = html.replace(/<meta[^>]*property="og:[^"]*"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="twitter:[^"]*"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="description"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="keywords"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="canonical"[^>]*>/gi, '');
    // Limpiar favicons existentes para evitar duplicados
    html = html.replace(/<link[^>]*rel="icon"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="shortcut icon"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="apple-touch-icon"[^>]*>/gi, '');

    // Insertar los nuevos meta tags después de <head>
    html = html.replace(/<head[^>]*>/i, `<head>\n${metaTags}`);

    // 🎯 Inyectar contenido visible: listado de posts recientes para crawlers
    try {
      const postsResponse = await fetch(
        `${CONFIG.apiUrl}/api/blog/posts?status=published&limit=10&sort=-publishedAt`,
        { headers: { 'Accept': 'application/json', 'User-Agent': 'Vercel-Edge-Middleware' } }
      );
      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        const posts = postsData.data?.posts || postsData.data || [];
        if (posts.length > 0) {
          const postsList = posts.map((p: any) => {
            const pTitle = escapeHtml(p.title || '');
            const pExcerpt = escapeHtml((p.excerpt || p.seo?.metaDescription || '').substring(0, 200));
            const pSlug = p.slug || '';
            return `<li><a href="/blog/${pSlug}"><strong>${pTitle}</strong></a>${pExcerpt ? ` — ${pExcerpt}` : ''}</li>`;
          }).join('');

          const blogContent = `
            <main class="cms-page-seo" itemscope itemtype="https://schema.org/Blog">
              <nav aria-label="Breadcrumb"><a href="/">Inicio</a> &gt; <span>Blog</span></nav>
              <h1>Blog de Tecnología y Software | SCUTI Company</h1>
              <p>Artículos sobre desarrollo de software, inteligencia artificial, automatización y transformación digital para PYMES.</p>
              <h2>Últimos Artículos</h2>
              <ul>${postsList}</ul>
              <meta itemprop="url" content="${CONFIG.siteUrl}/blog" />
            </main>
            <style>.cms-page-seo{max-width:900px;margin:2rem auto;padding:1rem;font-family:system-ui,sans-serif}.cms-page-seo h1{font-size:2rem;margin:1rem 0;color:#1f2937}.cms-page-seo h2{font-size:1.5rem;margin:1.5rem 0 .5rem;color:#374151}.cms-page-seo p{font-size:1rem;line-height:1.7;color:#4b5563}.cms-page-seo ul{padding-left:1.5rem}.cms-page-seo li{margin-bottom:.75rem;color:#4b5563;line-height:1.6}.cms-page-seo a{color:#7c3aed;text-decoration:none}.cms-page-seo nav{font-size:.875rem;color:#6b7280;margin-bottom:1rem}@media(prefers-color-scheme:dark){.cms-page-seo{background:#111;color:#f9fafb}.cms-page-seo h1,.cms-page-seo h2{color:#f9fafb}.cms-page-seo p,.cms-page-seo li{color:#d1d5db}}</style>
          `;
          html = replaceRootContent(html, blogContent);
          console.log(`[Edge Middleware] ✅ Injected ${posts.length} posts for /blog list`);
        }
      }
    } catch (e) {
      console.log('[Edge Middleware] Could not fetch posts for blog list content');
    }

    // Retornar el HTML modificado
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'X-Robots-Tag': 'index, follow',
        'X-Edge-Middleware': 'blog-list-seo'
      }
    });
  }

  // === CASO 2: Servicio individual (detalle) ===
  if (servicioDetailMatch) {
    const servicioSlug = servicioDetailMatch[1];
    
    // No procesar archivos estáticos
    if (servicioSlug.includes('.') || servicioSlug === 'index') {
      return next();
    }

    console.log(`[Edge Middleware] Crawler detected for /servicios/${servicioSlug}: ${userAgent.substring(0, 50)}`);

    // Obtener datos del servicio
    const servicio = await getServicioData(servicioSlug);

    if (!servicio) {
      console.log(`[Edge Middleware] Servicio not found: ${servicioSlug}`);
      return next();
    }

    // Obtener el HTML original desde /index.html
    const indexUrl = new URL('/', request.url);
    const response = await fetch(indexUrl.toString(), {
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Vercel-Edge-Middleware-Internal'
      }
    });
    
    if (!response.ok) {
      console.log(`[Edge Middleware] Failed to fetch index.html: ${response.status}`);
      return next();
    }
    
    let html = await response.text();

    // Generar meta tags del servicio
    const metaTags = generateServicioDetailMetaTags(servicio);

    // Reemplazar el contenido del <head>
    html = html.replace(/<title[^>]*>.*?<\/title>/gi, '');
    html = html.replace(/<meta[^>]*property="og:[^"]*"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="twitter:[^"]*"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="description"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="keywords"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="canonical"[^>]*>/gi, '');
    // Limpiar favicons existentes para evitar duplicados
    html = html.replace(/<link[^>]*rel="icon"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="shortcut icon"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="apple-touch-icon"[^>]*>/gi, '');

    // Insertar los nuevos meta tags después de <head>
    html = html.replace(/<head[^>]*>/i, `<head>\n${metaTags}`);

    // 🎯 Inyectar contenido visible del servicio para crawlers
    const servicioTitle = escapeHtml(servicio.nombre || servicio.title || '');
    const servicioDesc = escapeHtml(servicio.descripcion || servicio.description || '');
    const servicioUrl = `${CONFIG.siteUrl}/servicios/${servicioSlug}`;
    const servicioImage = getServicioImageUrl(servicio);
    
    // Extraer características/features del servicio
    let featuresHtml = '';
    if (servicio.caracteristicas?.length || servicio.features?.length) {
      const features = servicio.caracteristicas || servicio.features || [];
      featuresHtml = `<h2>Características</h2><ul>${features.map((f: any) => {
        const fname = escapeHtml(typeof f === 'string' ? f : (f.titulo || f.name || f.title || ''));
        const fdesc = typeof f === 'object' && f.descripcion ? ` — ${escapeHtml(f.descripcion)}` : '';
        return `<li><strong>${fname}</strong>${fdesc}</li>`;
      }).join('')}</ul>`;
    }

    // Extraer beneficios
    let benefitsHtml = '';
    if (servicio.beneficios?.length) {
      benefitsHtml = `<h2>Beneficios</h2><ul>${servicio.beneficios.map((b: any) =>
        `<li>${escapeHtml(typeof b === 'string' ? b : (b.titulo || b.name || ''))}</li>`
      ).join('')}</ul>`;
    }

    const servicioContent = `
      <main class="cms-page-seo" itemscope itemtype="https://schema.org/Service">
        <nav aria-label="Breadcrumb">
          <a href="/">Inicio</a> &gt; <a href="/servicios">Servicios</a> &gt; <span>${servicioTitle}</span>
        </nav>
        <h1 itemprop="name">${servicioTitle}</h1>
        ${servicioDesc ? `<p itemprop="description">${servicioDesc}</p>` : ''}
        ${servicioImage ? `<img itemprop="image" src="${servicioImage}" alt="${servicioTitle}" width="800" height="450" loading="lazy" style="max-width:100%;height:auto;border-radius:0.5rem;margin:1rem 0" />` : ''}
        ${featuresHtml}
        ${benefitsHtml}
        ${servicio.precio ? `<p><strong>Precio:</strong> <span itemprop="offers" itemscope itemtype="https://schema.org/Offer"><span itemprop="price">${escapeHtml(String(servicio.precio))}</span></span></p>` : ''}
        <meta itemprop="url" content="${servicioUrl}" />
        <meta itemprop="provider" content="SCUTI Company" />
      </main>
      <style>.cms-page-seo{max-width:900px;margin:2rem auto;padding:1rem;font-family:system-ui,sans-serif}.cms-page-seo h1{font-size:2rem;margin:1rem 0;color:#1f2937}.cms-page-seo h2{font-size:1.5rem;margin:1.5rem 0 .5rem;color:#374151}.cms-page-seo p{font-size:1rem;line-height:1.7;color:#4b5563}.cms-page-seo ul{padding-left:1.5rem}.cms-page-seo li{margin-bottom:.5rem;color:#4b5563;line-height:1.6}.cms-page-seo a{color:#7c3aed;text-decoration:none}.cms-page-seo nav{font-size:.875rem;color:#6b7280;margin-bottom:1rem}@media(prefers-color-scheme:dark){.cms-page-seo{background:#111;color:#f9fafb}.cms-page-seo h1,.cms-page-seo h2{color:#f9fafb}.cms-page-seo p,.cms-page-seo li{color:#d1d5db}}</style>
    `;
    html = replaceRootContent(html, servicioContent);
    console.log(`[Edge Middleware] ✅ Injected visible content for /servicios/${servicioSlug}`);

    // Retornar el HTML modificado
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'X-Robots-Tag': 'index, follow',
        'X-Edge-Middleware': 'servicio-detail-seo'
      }
    });
  }

  // === CASO 3: Post individual del blog ===
  if (blogPostMatch) {
    const slug = blogPostMatch[1];
    
    // No procesar archivos estáticos
    if (slug.includes('.') || slug === 'index') {
      return next();
    }

    console.log(`[Edge Middleware] Crawler detected for /blog/${slug}: ${userAgent.substring(0, 50)}`);

    // Obtener datos del post
    const post = await getPostData(slug);

    if (!post) {
      console.log(`[Edge Middleware] Post not found: ${slug}`);
      return next();
    }

    // Obtener el HTML original desde /index.html (no desde la URL actual que da 404)
    const indexUrl = new URL('/', request.url);
    const response = await fetch(indexUrl.toString(), {
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Vercel-Edge-Middleware-Internal'
      }
    });
    
    if (!response.ok) {
      console.log(`[Edge Middleware] Failed to fetch index.html: ${response.status}`);
      return next();
    }
    
    let html = await response.text();

    // Generar meta tags del post
    const metaTags = generateMetaTags(post);

    // Reemplazar el contenido del <head>
    // Eliminar meta tags existentes que vamos a reemplazar
    html = html.replace(/<title[^>]*>.*?<\/title>/gi, '');
    html = html.replace(/<meta[^>]*property="og:[^"]*"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="twitter:[^"]*"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="description"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="keywords"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="canonical"[^>]*>/gi, '');
    // Limpiar favicons existentes para evitar duplicados
    html = html.replace(/<link[^>]*rel="icon"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="shortcut icon"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="apple-touch-icon"[^>]*>/gi, '');

    // Insertar los nuevos meta tags después de <head>
    html = html.replace(/<head[^>]*>/i, `<head>\n${metaTags}`);

    // 🎯 CRÍTICO PARA SEO: Reemplazar el div#root con contenido real del artículo
    // Esto evita que Google vea "Artículo no encontrado" o un div vacío
    const visibleContent = generateVisibleArticleContent(post);
    html = replaceRootContent(html, visibleContent);

    // 🎯 CRÍTICO: Inyectar datos del post como JSON para que React hidrate sin llamar a la API
    // Sin esto, React destruye el contenido visible al hidratarse y muestra "Artículo no encontrado"
    const safePostJson = JSON.stringify(post).replace(/<\/script/gi, '<\\/script');
    const postDataScript = `<script>window.__PRERENDERED_BLOG_POST__=${safePostJson};</script>`;
    html = html.replace('</body>', `${postDataScript}\n</body>`);

    // Retornar el HTML modificado
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'X-Robots-Tag': 'index, follow',
        'X-Edge-Middleware': 'blog-seo'
      }
    });
  }

  // === CASO: Listado de proyectos /proyectos ===
  if (isProyectosListPage) {
    console.log(`[Edge Middleware] Crawler detected for /proyectos: ${userAgent.substring(0, 50)}`);

    const indexUrl = new URL('/', request.url);
    const response = await fetch(indexUrl.toString(), {
      headers: { 'Accept': 'text/html', 'User-Agent': 'Vercel-Edge-Middleware-Internal' }
    });
    if (!response.ok) return next();
    let html = await response.text();

    const proyectosUrl = `${CONFIG.siteUrl}/proyectos`;
    const metaTags = `
    ${generateFavicons()}
    <title>Portafolio de Proyectos | SCUTI Company</title>
    <meta name="description" content="Conoce nuestros proyectos tecnológicos: aplicaciones web, sistemas empresariales, e-commerce e inteligencia artificial desarrollados a medida en Perú." />
    <meta name="keywords" content="portafolio, proyectos, desarrollo de software, sistemas web, SCUTI Company, Perú" />
    <link rel="canonical" href="${proyectosUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${proyectosUrl}" />
    <meta property="og:title" content="Portafolio de Proyectos | SCUTI Company" />
    <meta property="og:description" content="Conoce nuestros proyectos tecnológicos desarrollados a medida en Perú." />
    <meta property="og:image" content="${CONFIG.defaultImage}" />
    <meta property="og:site_name" content="SCUTI Company" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Portafolio de Proyectos | SCUTI Company" />
    <meta name="twitter:description" content="Conoce nuestros proyectos tecnológicos desarrollados a medida en Perú." />
    <meta name="twitter:image" content="${CONFIG.defaultImage}" />
    `;

    html = html.replace(/<title[^>]*>.*?<\/title>/gi, '');
    html = html.replace(/<meta[^>]*property="og:[^"]*"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="twitter:[^"]*"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="description"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="keywords"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="canonical"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="icon"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="shortcut icon"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="apple-touch-icon"[^>]*>/gi, '');
    html = html.replace(/<head[^>]*>/i, `<head>\n${metaTags}`);

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'X-Robots-Tag': 'index, follow',
        'X-Edge-Middleware': 'proyectos-list-seo'
      }
    });
  }

  // === CASO: Detalle de proyecto /proyectos/:slug ===
  if (proyectoDetailMatch) {
    const proyectoSlug = proyectoDetailMatch[1];
    if (proyectoSlug.includes('.') || proyectoSlug === 'index') return next();

    console.log(`[Edge Middleware] Crawler detected for /proyectos/${proyectoSlug}: ${userAgent.substring(0, 50)}`);

    const proyecto = await getProyectoData(proyectoSlug);
    if (!proyecto) {
      console.log(`[Edge Middleware] Proyecto not found: ${proyectoSlug}`);
      return next();
    }

    const indexUrl = new URL('/', request.url);
    const response = await fetch(indexUrl.toString(), {
      headers: { 'Accept': 'text/html', 'User-Agent': 'Vercel-Edge-Middleware-Internal' }
    });
    if (!response.ok) return next();
    let html = await response.text();

    const metaTags = generateProyectoMetaTags(proyecto);

    html = html.replace(/<title[^>]*>.*?<\/title>/gi, '');
    html = html.replace(/<meta[^>]*property="og:[^"]*"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="twitter:[^"]*"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="description"[^>]*>/gi, '');
    html = html.replace(/<meta[^>]*name="keywords"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="canonical"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="icon"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="shortcut icon"[^>]*>/gi, '');
    html = html.replace(/<link[^>]*rel="apple-touch-icon"[^>]*>/gi, '');
    html = html.replace(/<head[^>]*>/i, `<head>\n${metaTags}`);

    // Contenido visible para crawlers
    const nombre = escapeHtml(proyecto.nombre || '');
    const descripcion = escapeHtml(proyecto.descripcionCorta || '');
    const imagen = proyecto.imagenPrincipal?.url ||
      proyecto.imagenPrincipal?.secure_url ||
      (typeof proyecto.imagenPrincipal === 'string' && proyecto.imagenPrincipal.startsWith('http') ? proyecto.imagenPrincipal : null) ||
      '';
    const techs = proyecto.tecnologias?.slice(0, 6).map((t: any) =>
      `<li>${escapeHtml(typeof t === 'string' ? t : t.nombre || '')}</li>`
    ).join('') || '';
    const metricas = proyecto.metricas?.slice(0, 4).map((m: any) =>
      `<li><strong>${escapeHtml(String(m.valor || ''))}</strong> ${escapeHtml(m.nombre || '')}</li>`
    ).join('') || '';

    const visibleContent = `
      <main itemscope itemtype="https://schema.org/SoftwareApplication" style="max-width:900px;margin:2rem auto;padding:1rem;font-family:system-ui,sans-serif">
        <nav aria-label="Breadcrumb" style="font-size:.875rem;color:#6b7280;margin-bottom:1rem">
          <a href="/" style="color:#7c3aed">Inicio</a> &gt;
          <a href="/proyectos" style="color:#7c3aed">Proyectos</a> &gt;
          <span>${nombre}</span>
        </nav>
        <h1 itemprop="name" style="font-size:2rem;font-weight:700;color:#111827;margin-bottom:1rem">${nombre}</h1>
        <p itemprop="description" style="font-size:1rem;line-height:1.7;color:#4b5563;margin-bottom:1.5rem">${descripcion}</p>
        ${imagen ? `<img itemprop="image" src="${imagen}" alt="${nombre}" width="1200" height="630" loading="lazy" style="width:100%;border-radius:12px;margin-bottom:1.5rem" />` : ''}
        ${techs ? `<h2 style="font-size:1.25rem;font-weight:600;color:#374151;margin-bottom:.75rem">Tecnologías utilizadas</h2><ul style="list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1.5rem">${techs}</ul>` : ''}
        ${metricas ? `<h2 style="font-size:1.25rem;font-weight:600;color:#374151;margin-bottom:.75rem">Resultados obtenidos</h2><ul style="list-style:none;padding:0">${metricas}</ul>` : ''}
        <a href="/contacto" style="display:inline-block;background:#7c3aed;color:white;padding:.75rem 1.5rem;border-radius:8px;text-decoration:none;font-weight:600;margin-top:1.5rem">Solicitar Proyecto Similar</a>
      </main>`;

    html = replaceRootContent(html, visibleContent);
    console.log(`[Edge Middleware] ✅ Injected visible content for /proyectos/${proyectoSlug}`);


    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'X-Robots-Tag': 'index, follow',
        'X-Edge-Middleware': 'proyecto-detail-seo'
      }
    });
  }

  // Si llegamos aquí, continuar normalmente
  return next();
}

/**
 * Configuración del middleware
 * Se ejecuta para rutas de blog, servicios y proyectos
 */
export const config = {
  matcher: ['/', '/servicios', '/servicios/:path*', '/nosotros', '/contacto', '/privacidad', '/terminos', '/blog', '/blog/:path*', '/proyectos', '/proyectos/:path*']
};
