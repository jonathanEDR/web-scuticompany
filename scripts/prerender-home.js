/**
 * 🚀 Pre-rendering dinámico para Home Page con datos del CMS
 *
 * Este script genera HTML estático para la página Home durante el build,
 * inyectando los meta tags SEO configurados en el CMS para que Google
 * los indexe correctamente sin depender de JavaScript.
 *
 * Funcionalidad:
 * - Obtiene datos de la página Home desde el CMS API
 * - Inyecta meta tags SEO, focusKeyphrase, keywords, Schema.org
 * - Actualiza dist/index.html con el contenido SEO del CMS
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '../dist');

// Configuración
const rawApiUrl = process.env.VITE_API_URL || process.env.API_URL || 'https://web-scuticompany-back.onrender.com';
const baseApiUrl = rawApiUrl.replace(/\/api\/?$/, '');

const CONFIG = {
  apiUrl: baseApiUrl,
  siteUrl: 'https://scuticompany.com',
  siteName: 'SCUTI Company',
  defaultImage: 'https://scuticompany.com/logofondonegro.jpeg',
  locale: 'es_PE'
};

// Debug: mostrar configuración
console.log('═'.repeat(60));
console.log('🏠 PRERENDER-HOME: CONFIGURACIÓN');
console.log('═'.repeat(60));
console.log(`   API URL: ${CONFIG.apiUrl}`);
console.log(`   Site URL: ${CONFIG.siteUrl}`);
console.log('═'.repeat(60));

/**
 * Fetch wrapper con timeout y retry
 */
async function fetchWithRetry(url, options = {}, retries = 5) {
  console.log(`   🔗 Fetching: ${url}`);

  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Vercel-Build-Home-Prerender/1.0'
        },
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeout);

      console.log(`   📊 Response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorBody = await response.text().catch(() => 'No body');
        console.log(`   📄 Error body: ${errorBody.substring(0, 200)}`);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.warn(`   ⚠️ Intento ${i + 1}/${retries} fallido: ${error.message}`);
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 2000 * (i + 1)));
    }
  }
}

/**
 * Obtener datos de la página Home desde el CMS
 */
async function getHomePageData() {
  console.log(`\n📡 Obteniendo datos del CMS para Home...`);

  try {
    const data = await fetchWithRetry(`${CONFIG.apiUrl}/api/cms/pages/home`);

    if (!data.success || !data.data) {
      console.warn('   ⚠️ No se encontraron datos del CMS, usando defaults');
      return null;
    }

    console.log('   ✅ Datos del CMS obtenidos correctamente');
    return data.data;
  } catch (error) {
    console.error(`   ❌ Error obteniendo datos del CMS: ${error.message}`);
    return null;
  }
}

/**
 * Escape HTML para evitar XSS en meta tags
 */
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Inyectar meta tags SEO en el HTML
 */
function injectSeoTags(html, seo) {
  let result = html;

  // Extraer datos SEO con fallbacks
  const title = escapeHtml(seo.metaTitle || `${CONFIG.siteName} - Desarrollo de Software e IA`);
  const description = escapeHtml(seo.metaDescription || 'Desarrollo de software a medida, inteligencia artificial y automatización para PYMES en Perú');
  const focusKeyphrase = escapeHtml(seo.focusKeyphrase || '');
  const keywords = seo.keywords?.length
    ? escapeHtml([seo.focusKeyphrase, ...seo.keywords].filter(Boolean).join(', '))
    : escapeHtml(seo.focusKeyphrase || 'desarrollo de software, inteligencia artificial, PYMES, Perú');
  const ogTitle = escapeHtml(seo.ogTitle || seo.metaTitle || title);
  const ogDescription = escapeHtml(seo.ogDescription || seo.metaDescription || description);
  const ogImage = seo.ogImage || CONFIG.defaultImage;
  const canonicalUrl = `${CONFIG.siteUrl}/`;

  console.log('\n📝 Inyectando meta tags SEO:');
  console.log(`   📌 Title: ${title.substring(0, 60)}...`);
  console.log(`   📌 Focus Keyphrase: ${focusKeyphrase || '(no configurado)'}`);
  console.log(`   📌 Keywords: ${keywords.substring(0, 50)}...`);

  // Reemplazar <title>
  result = result.replace(
    /<title[^>]*>.*?<\/title>/i,
    `<title>${title}</title>`
  );

  // Reemplazar o agregar meta description
  if (result.includes('<meta name="description"')) {
    result = result.replace(
      /<meta name="description"[^>]*>/i,
      `<meta name="description" content="${description}" data-rh="true" />`
    );
  } else {
    result = result.replace(
      '</head>',
      `<meta name="description" content="${description}" data-rh="true" />\n</head>`
    );
  }

  // Reemplazar o agregar meta keywords (con focusKeyphrase incluido)
  if (result.includes('<meta name="keywords"')) {
    result = result.replace(
      /<meta name="keywords"[^>]*>/i,
      `<meta name="keywords" content="${keywords}" data-rh="true" />`
    );
  } else {
    result = result.replace(
      '</head>',
      `<meta name="keywords" content="${keywords}" data-rh="true" />\n</head>`
    );
  }

  // Agregar meta tag dedicado para focusKeyphrase (si existe)
  if (focusKeyphrase) {
    result = result.replace(
      '</head>',
      `<meta name="article:tag" content="${focusKeyphrase}" data-rh="true" />\n</head>`
    );
  }

  // Reemplazar canonical
  if (result.includes('<link rel="canonical"')) {
    result = result.replace(
      /<link rel="canonical"[^>]*>/i,
      `<link rel="canonical" href="${canonicalUrl}" data-rh="true" />`
    );
  }

  // Open Graph tags
  if (result.includes('<meta property="og:title"')) {
    result = result.replace(
      /<meta property="og:title"[^>]*>/i,
      `<meta property="og:title" content="${ogTitle}" data-rh="true" />`
    );
  }

  if (result.includes('<meta property="og:description"')) {
    result = result.replace(
      /<meta property="og:description"[^>]*>/i,
      `<meta property="og:description" content="${ogDescription}" data-rh="true" />`
    );
  }

  if (result.includes('<meta property="og:url"')) {
    result = result.replace(
      /<meta property="og:url"[^>]*>/i,
      `<meta property="og:url" content="${canonicalUrl}" data-rh="true" />`
    );
  }

  // Twitter tags
  if (result.includes('<meta name="twitter:title"')) {
    result = result.replace(
      /<meta name="twitter:title"[^>]*>/i,
      `<meta name="twitter:title" content="${ogTitle}" data-rh="true" />`
    );
  }

  if (result.includes('<meta name="twitter:description"')) {
    result = result.replace(
      /<meta name="twitter:description"[^>]*>/i,
      `<meta name="twitter:description" content="${ogDescription}" data-rh="true" />`
    );
  }

  return result;
}

/**
 * Main: Pre-renderizar Home con datos del CMS
 */
async function main() {
  console.log('\n🏠 Iniciando pre-render de Home Page...\n');

  // Verificar que existe dist/index.html
  const indexPath = path.join(distPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('❌ No se encontró dist/index.html. Ejecuta "npm run build" primero.');
    process.exit(1);
  }

  // Leer el HTML original
  let html = fs.readFileSync(indexPath, 'utf-8');
  console.log(`📄 Leído: dist/index.html (${(html.length / 1024).toFixed(1)} KB)`);

  // Obtener datos del CMS
  const pageData = await getHomePageData();

  if (pageData?.seo) {
    // Inyectar SEO del CMS
    html = injectSeoTags(html, pageData.seo);
    console.log('\n✅ Meta tags SEO del CMS inyectados correctamente');

    // Verificar que los tags se inyectaron bien
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    const descMatch = html.match(/<meta name="description" content="([^"]*?)"/i);
    console.log(`   🔍 Verificación post-inyección:`);
    console.log(`      Title en HTML: ${titleMatch?.[1]?.substring(0, 60) || 'NO ENCONTRADO'}...`);
    console.log(`      Description en HTML: ${descMatch?.[1]?.substring(0, 60) || 'NO ENCONTRADO'}...`);
  } else {
    console.warn('\n⚠️ ADVERTENCIA: No hay datos SEO del CMS disponibles.');
    console.warn('   Los meta tags en dist/index.html mantendrán los valores por defecto de index.html.');
    console.warn('   Google indexará estos valores por defecto hasta el próximo build exitoso.');
    console.warn('   Asegúrate de que el API esté disponible durante el build: ' + CONFIG.apiUrl);
  }

  // Guardar el HTML actualizado
  fs.writeFileSync(indexPath, html);
  console.log(`\n💾 Guardado: dist/index.html (${(html.length / 1024).toFixed(1)} KB)`);

  console.log('\n🎉 Pre-render de Home completado exitosamente!');
  console.log('═'.repeat(60));
}

// Ejecutar
main().catch(error => {
  console.error('\n❌ Error en pre-render de Home:', error.message);
  // No hacer exit(1) para no romper el build si falla
  console.log('⚠️ Continuando sin pre-render de Home...');
});
