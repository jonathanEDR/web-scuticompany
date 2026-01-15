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
  twitterHandle: '@scuticompany'
};

// Cache en memoria para evitar llamadas repetidas a la API
const postCache = new Map<string, { data: any; timestamp: number }>();
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
    <!-- Primary Meta Tags - Blog Listing - Generado por Edge Middleware -->
    <title>${title} | ${CONFIG.siteName}</title>
    <meta name="title" content="${title} | ${CONFIG.siteName}" />
    <meta name="description" content="${description}" />
    <meta name="keywords" content="blog tecnología, desarrollo software, inteligencia artificial, IA para PYMES, transformación digital, automatización empresarial, software a medida" />
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

  // Verificar si es la página del listado del blog (/blog o /blog/)
  const isBlogListPage = /^\/blog\/?$/.test(pathname);
  
  // Verificar si es un post individual (/blog/slug)
  const blogPostMatch = pathname.match(/^\/blog\/([^\/]+)$/);
  
  // Si no es ni el listado ni un post, continuar normal
  if (!isBlogListPage && !blogPostMatch) {
    return next();
  }

  // Verificar User-Agent para detectar crawlers
  const userAgent = request.headers.get('user-agent') || '';
  const isCrawler = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Googlebot|bingbot|Slackbot|TelegramBot|Discordbot|Applebot|PetalBot|SemrushBot|AhrefsBot/i.test(userAgent);

  // Si no es un crawler, dejar pasar la request normal
  if (!isCrawler) {
    return next();
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

  // === CASO 2: Post individual del blog ===
  const slug = blogPostMatch![1];
  
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

/**
 * Configuración del middleware
 * Solo se ejecuta para rutas de blog
 */
export const config = {
  matcher: '/blog/:path*'
};
