import type { RequestContext } from '@vercel/edge';

// Tu token de Prerender.io
const PRERENDER_TOKEN = 'ZgHVzSytVJ1ro5YK9vY1';

// Bots de búsqueda que necesitan prerendering
const BOT_USER_AGENTS = [
  'googlebot',
  'bingbot', 
  'yandex',
  'baiduspider',
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'slackbot',
  'telegrambot',
  'discordbot',
  'applebot',
  'pinterest',
  'redditbot',
  'chrome-lighthouse',
  'google-inspectiontool',
  'ahrefsbot',
  'semrushbot',
  'dotbot',
  'rogerbot',
  'embedly',
  'quora',
  'outbrain',
  'vkshare',
  'flipboard',
  'tumblr',
  'bitlybot',
  'nuzzel',
  'petalbot',
];

function isBot(userAgent: string): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot));
}

function shouldPrerender(request: Request): boolean {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // No prerenderizar archivos estáticos
  if (/\.(js|css|xml|png|jpg|jpeg|gif|pdf|ico|svg|woff2?|ttf|mp4|webp|webm|json|map|txt)$/i.test(pathname)) {
    return false;
  }
  
  // No prerenderizar rutas de API
  if (pathname.startsWith('/api/')) {
    return false;
  }
  
  // No prerenderizar assets
  if (pathname.startsWith('/assets/')) {
    return false;
  }
  
  return true;
}

export default async function middleware(request: Request, context: RequestContext) {
  const userAgent = request.headers.get('user-agent') || '';
  
  // Si ya viene de Prerender, no hacer loop
  if (request.headers.get('X-Prerender')) {
    return context.next();
  }
  
  // Solo prerenderizar para bots y si la ruta lo permite
  if (isBot(userAgent) && shouldPrerender(request)) {
    try {
      const prerenderUrl = `https://service.prerender.io/${request.url}`;
      
      const prerenderResponse = await fetch(prerenderUrl, {
        method: request.method,
        headers: {
          'X-Prerender-Token': PRERENDER_TOKEN,
          'User-Agent': userAgent,
        },
        redirect: 'follow',
      });
      
      if (prerenderResponse.ok) {
        const html = await prerenderResponse.text();
        
        return new Response(html, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'X-Prerender': 'true',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        });
      }
    } catch (error) {
      console.error('[Prerender] Error:', error);
    }
  }
  
  // Para usuarios normales o si prerender falla, continuar normal
  return context.next();
}

export const config = {
  matcher: [
    /*
     * Aplicar a todas las rutas excepto:
     * - Archivos estáticos (_next, assets, etc.)
     * - API routes
     * - Archivos con extensión
     */
    '/((?!_next/static|_next/image|assets|api|favicon|.*\\..*).*)',
  ],
};
