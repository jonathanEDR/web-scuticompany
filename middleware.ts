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
  
  // Keywords del servicio
  const keywords = [
    ...(servicio.etiquetas || []),
    servicio.categoria?.nombre || '',
    servicio.seo?.palabrasClave || ''
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
  const title = escapeHtml(post.title);
  const description = escapeHtml(post.excerpt || '');
  const imageUrl = getImageUrl(post.featuredImage);
  const postUrl = `${CONFIG.siteUrl}/blog/${post.slug}`;
  const authorName = escapeHtml(getAuthorName(post.author));
  const keywords = post.tags?.map((t: any) => typeof t === 'string' ? t : t.name).join(', ') || '';
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
    ${post.tags?.map((t: any) => `<meta property="article:tag" content="${escapeHtml(typeof t === 'string' ? t : t.name)}" />`).join('\n    ') || ''}
    
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
      }
    }
    </script>
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
  const isBlogListPage = /^\/blog\/?$/.test(pathname);
  const blogPostMatch = pathname.match(/^\/blog\/([^\/]+)$/);
  const servicioDetailMatch = pathname.match(/^\/servicios\/([^\/]+)$/);
  
  // Si no es ninguna página que manejamos, continuar normal
  if (!isHomePage && !isServiciosPage && !isNosotrosPage && !isBlogListPage && !blogPostMatch && !servicioDetailMatch) {
    return next();
  }

  // Verificar User-Agent para detectar crawlers
  const userAgent = request.headers.get('user-agent') || '';
  const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Googlebot|bingbot|Slackbot|TelegramBot|Discordbot|Applebot|PetalBot|SemrushBot|AhrefsBot/i.test(userAgent);

  // Si no es un crawler, dejar pasar la request normal
  if (!isCrawler) {
    return next();
  }

  // === CASO 0: Páginas estáticas (Home, Servicios, Nosotros) ===
  if (isHomePage || isServiciosPage || isNosotrosPage) {
    const pageName = isHomePage ? 'home' : isServiciosPage ? 'servicios' : 'nosotros';
    console.log(`[Edge Middleware] Crawler detected for /${pageName}: ${userAgent.substring(0, 50)}`);
    
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

    // Generar meta tags según la página
    let metaTags: string;
    if (isHomePage) {
      metaTags = generateHomeMetaTags();
    } else if (isServiciosPage) {
      metaTags = generateServiciosMetaTags();
    } else {
      metaTags = generateNosotrosMetaTags();
    }

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

  // === CASO 1: Página del listado del blog ===
  if (isBlogListPage) {
    console.log(`[Edge Middleware] Crawler detected for /blog: ${userAgent.substring(0, 50)}`);
    
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

    // Generar meta tags para el listado del blog
    const metaTags = generateBlogListMetaTags();

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

  // Si llegamos aquí, continuar normalmente
  return next();
}

/**
 * Configuración del middleware
 * Se ejecuta para rutas de blog y servicios
 */
export const config = {
  matcher: ['/', '/servicios', '/servicios/:path*', '/nosotros', '/blog', '/blog/:path*']
};
