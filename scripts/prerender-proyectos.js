/**
 * 🗂️ Pre-rendering dinámico para Proyectos / Portafolio
 *
 * Este script genera HTML estático para cada proyecto durante el build,
 * permitiendo que Google y herramientas SEO indexen correctamente el contenido.
 *
 * Sigue el mismo patrón exitoso de prerender-services.js
 *
 * Funcionalidad:
 * - Obtiene todos los proyectos del portafolio público desde la API
 * - Genera HTML con meta tags SEO, Schema.org JSON-LD y contenido visible
 * - Crea archivos estáticos en dist/proyectos/{slug}/index.html
 * - También genera dist/proyectos/index.html para la página de listado
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '../dist');

// ─── Configuración ──────────────────────────────────────────────────────────

console.log('═'.repeat(60));
console.log('🗂️  PRERENDER-PROYECTOS: CONFIGURACIÓN');
console.log('═'.repeat(60));
console.log(`   VITE_API_URL (raw): ${process.env.VITE_API_URL || '(not set)'}`);
console.log(`   API_URL (raw):      ${process.env.API_URL || '(not set)'}`);
console.log(`   NODE_ENV:           ${process.env.NODE_ENV || '(not set)'}`);

let rawApiUrl = process.env.VITE_API_URL || process.env.API_URL || 'https://web-scuticompany-back.onrender.com';
const baseApiUrl = rawApiUrl.replace(/\/api\/?$/, '');

console.log(`   Base URL:           ${baseApiUrl}`);
console.log('═'.repeat(60));

const CONFIG = {
  apiUrl: baseApiUrl,
  siteUrl: process.env.VITE_SITE_URL || 'https://scuticompany.com',
  siteName: process.env.VITE_SITE_NAME || 'SCUTI Company',
  defaultImage: `${process.env.VITE_SITE_URL || 'https://scuticompany.com'}/logofondonegro.jpeg`,
  twitterHandle: '@scuticompany',
  locale: 'es_PE'
};

// ─── Helpers ────────────────────────────────────────────────────────────────

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
          'User-Agent': 'Vercel-Build-Prerender/1.0'
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
      await new Promise(r => setTimeout(r, 3000 * (i + 1)));
    }
  }
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function truncate(text, maxLength = 160) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

function getImageUrl(image) {
  if (!image) return CONFIG.defaultImage;
  if (typeof image === 'string') {
    if (image.startsWith('http')) return image;
    return `https://res.cloudinary.com/ds54wlchi/image/upload/${image}`;
  }
  if (image.url) return image.url;
  if (image.secure_url) return image.secure_url;
  return CONFIG.defaultImage;
}

function getCategoryLabel(cat) {
  if (!cat) return 'Proyectos';
  const labels = {
    'web': 'Desarrollo Web',
    'movil': 'Desarrollo Móvil',
    'ecommerce': 'E-Commerce',
    'sistema': 'Sistema Empresarial',
    'ia': 'Inteligencia Artificial',
    'automatizacion': 'Automatización',
    'otro': 'Proyecto Tecnológico'
  };
  return labels[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
}

// ─── Fetch proyectos ─────────────────────────────────────────────────────────

async function getAllProyectos() {
  console.log(`\n📡 Conectando a API: ${CONFIG.apiUrl}`);

  try {
    const data = await fetchWithRetry(`${CONFIG.apiUrl}/api/proyectos?limit=1000`);

    if (!data.success || !data.data) {
      console.warn('   ⚠️ Respuesta inesperada de la API:', JSON.stringify(data).substring(0, 200));
      return [];
    }

    const proyectos = Array.isArray(data.data) ? data.data : [];
    console.log(`   ✅ ${proyectos.length} proyectos encontrados`);
    return proyectos;
  } catch (error) {
    console.error(`   ❌ Error obteniendo proyectos: ${error.message}`);
    return [];
  }
}

// ─── Schema.org ──────────────────────────────────────────────────────────────

function generateProjectSchema(proyecto) {
  const projectUrl = `${CONFIG.siteUrl}/proyectos/${proyecto.slug}`;
  const imageUrl = getImageUrl(proyecto.imagenPrincipal);
  const categoryLabel = getCategoryLabel(proyecto.categoria);

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": proyecto.nombre,
    "description": proyecto.descripcionCorta || truncate(stripHtml(proyecto.descripcionCompleta), 200),
    "url": projectUrl,
    "image": imageUrl,
    "applicationCategory": categoryLabel,
    "creator": {
      "@type": "Organization",
      "name": "SCUTI Company",
      "url": CONFIG.siteUrl,
      "logo": CONFIG.defaultImage,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "PE",
        "addressLocality": "Huánuco"
      }
    },
    "keywords": proyecto.tecnologias?.map(t => t.nombre || t).join(', ') || categoryLabel
  };
}

function generateBreadcrumbSchema(proyecto) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": CONFIG.siteUrl },
      { "@type": "ListItem", "position": 2, "name": "Proyectos", "item": `${CONFIG.siteUrl}/proyectos` },
      { "@type": "ListItem", "position": 3, "name": proyecto.nombre, "item": `${CONFIG.siteUrl}/proyectos/${proyecto.slug}` }
    ]
  };
}

// ─── Visible HTML content ────────────────────────────────────────────────────

function generateVisibleContent(proyecto) {
  const imageUrl = getImageUrl(proyecto.imagenPrincipal);
  const categoryLabel = getCategoryLabel(proyecto.categoria);
  const description = proyecto.descripcionCorta || truncate(stripHtml(proyecto.descripcionCompleta), 500);

  // Tecnologías
  const techList = proyecto.tecnologias?.slice(0, 8).map(t => {
    const nombre = typeof t === 'string' ? t : t.nombre || '';
    return `<li class="tech-tag">${escapeHtml(nombre)}</li>`;
  }).join('') || '';

  // Métricas / Resultados
  const metricsList = proyecto.metricas?.slice(0, 4).map(m => {
    const nombre = typeof m === 'string' ? m : m.nombre || '';
    const valor = typeof m === 'object' ? m.valor || '' : '';
    return `<li class="metric-item"><strong>${escapeHtml(valor)}</strong> ${escapeHtml(nombre)}</li>`;
  }).join('') || '';

  return `
    <article itemscope itemtype="https://schema.org/SoftwareApplication" class="project-content">
      <header>
        <nav aria-label="Breadcrumb" class="breadcrumb">
          <a href="/" data-discover="true">Inicio</a> &gt;
          <a href="/proyectos" data-discover="true">Proyectos</a> &gt;
          <span>${escapeHtml(proyecto.nombre)}</span>
        </nav>

        <div class="project-category">
          <span class="category-badge">${escapeHtml(categoryLabel)}</span>
          ${proyecto.destacado ? '<span class="featured-badge">★ Destacado</span>' : ''}
        </div>

        <h1 itemprop="name" class="project-title">${escapeHtml(proyecto.nombre)}</h1>

        <p itemprop="description" class="project-description">${escapeHtml(description)}</p>
      </header>

      ${proyecto.imagenPrincipal ? `
        <figure class="project-image">
          <img
            itemprop="image"
            src="${imageUrl}"
            alt="${escapeHtml(proyecto.nombre)}"
            loading="lazy"
            width="1200"
            height="630"
          />
        </figure>
      ` : ''}

      <div class="project-details">
        ${techList ? `
          <section class="project-tech">
            <h2>Tecnologías utilizadas</h2>
            <ul class="tech-list">${techList}</ul>
          </section>
        ` : ''}

        ${metricsList ? `
          <section class="project-metrics">
            <h2>Resultados obtenidos</h2>
            <ul class="metrics-list">${metricsList}</ul>
          </section>
        ` : ''}
      </div>

      <div class="project-cta">
        <a href="/contacto" class="cta-button">💬 Solicitar Proyecto Similar</a>
        <a href="/proyectos" class="cta-link">← Ver todos los proyectos</a>
      </div>

      <meta itemprop="url" content="${CONFIG.siteUrl}/proyectos/${proyecto.slug}" />
      <meta itemprop="applicationCategory" content="${escapeHtml(categoryLabel)}" />
    </article>

    <style>
      .project-content {
        max-width: 900px;
        margin: 0 auto;
        padding: 2rem;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      }
      .breadcrumb {
        font-size: 0.875rem;
        color: #6b7280;
        margin-bottom: 1rem;
      }
      .breadcrumb a { color: #8b5cf6; text-decoration: none; }
      .project-category { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
      .category-badge {
        background: #8b5cf6; color: white;
        padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem;
      }
      .featured-badge {
        background: #fbbf24; color: #92400e;
        padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem;
      }
      .project-title {
        font-size: 2rem; font-weight: 700; color: #111827;
        line-height: 1.2; margin-bottom: 1rem;
      }
      .project-description { font-size: 1.125rem; color: #4b5563; line-height: 1.7; margin-bottom: 1.5rem; }
      .project-image img { width: 100%; border-radius: 12px; margin-bottom: 2rem; }
      .project-tech h2, .project-metrics h2 { font-size: 1.25rem; font-weight: 600; color: #374151; margin-bottom: 0.75rem; }
      .tech-list { list-style: none; padding: 0; display: flex; flex-wrap: wrap; gap: 0.5rem; }
      .tech-tag {
        background: #f3f4f6; color: #374151;
        padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem;
      }
      .metrics-list { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
      .metric-item { background: #faf5ff; padding: 1rem; border-radius: 8px; color: #374151; }
      .metric-item strong { display: block; font-size: 1.5rem; color: #7c3aed; }
      .project-cta { margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap; }
      .cta-button {
        background: #7c3aed; color: white;
        padding: 0.75rem 1.5rem; border-radius: 8px;
        text-decoration: none; font-weight: 600;
      }
      .cta-link { color: #7c3aed; text-decoration: none; padding: 0.75rem 1rem; display: inline-flex; align-items: center; }
    </style>
  `;
}

// ─── HTML page builder ───────────────────────────────────────────────────────

function buildHtmlPage(indexHtml, proyecto) {
  const projectUrl = `${CONFIG.siteUrl}/proyectos/${proyecto.slug}`;
  const imageUrl = getImageUrl(proyecto.imagenPrincipal);
  const description = truncate(proyecto.descripcionCorta || stripHtml(proyecto.descripcionCompleta), 160);
  const title = `${proyecto.nombre} - SCUTI Company`;
  const categoryLabel = getCategoryLabel(proyecto.categoria);
  const keywords = [categoryLabel, 'SCUTI Company', 'desarrollo de software', 'proyecto tecnológico',
    ...(proyecto.tecnologias?.slice(0, 5).map(t => t.nombre || t) || [])
  ].join(', ');

  const schemaProject = JSON.stringify(generateProjectSchema(proyecto));
  const schemaBreadcrumb = JSON.stringify(generateBreadcrumbSchema(proyecto));
  const visibleContent = generateVisibleContent(proyecto);

  let result = indexHtml;

  // Title
  result = result.replace(/<title[^>]*>.*?<\/title>/, `<title data-rh="true">${escapeHtml(title)}</title>`);
  // Meta description
  result = result.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escapeHtml(description)}" data-rh="true" />`);
  // Meta keywords
  result = result.replace(/<meta name="keywords"[^>]*>/, `<meta name="keywords" content="${escapeHtml(keywords)}" data-rh="true" />`);
  // Canonical
  result = result.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${projectUrl}" data-rh="true" />`);
  // og:title
  result = result.replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${escapeHtml(title)}" data-rh="true" />`);
  // og:description
  result = result.replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${escapeHtml(description)}" data-rh="true" />`);
  // og:url
  result = result.replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${projectUrl}" data-rh="true" />`);
  // og:image
  result = result.replace(/<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${imageUrl}" data-rh="true" />`);
  // og:type
  result = result.replace(/<meta property="og:type"[^>]*>/, `<meta property="og:type" content="website" data-rh="true" />`);
  // twitter:title
  result = result.replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${escapeHtml(title)}" data-rh="true" />`);
  // twitter:description
  result = result.replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${escapeHtml(description)}" data-rh="true" />`);
  // twitter:image
  result = result.replace(/<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${imageUrl}" data-rh="true" />`);

  // Inject Schema.org + visible content before </body>
  const schemaBlock = `
  <!-- Schema.org - Proyecto -->
  <script type="application/ld+json">${schemaProject}</script>
  <script type="application/ld+json">${schemaBreadcrumb}</script>

  <!-- Contenido visible para bots SEO (oculto visualmente cuando JS carga) -->
  <noscript id="seo-content">${visibleContent}</noscript>
`;

  result = result.replace('</body>', `${schemaBlock}</body>`);

  return result;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🗂️  Pre-renderizando páginas de Proyectos...\n');

  if (!fs.existsSync(distPath)) {
    console.error('❌ No se encontró el directorio dist. Ejecuta el build de Vite primero.');
    process.exit(1);
  }

  const indexHtmlPath = path.join(distPath, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('❌ No se encontró dist/index.html.');
    process.exit(1);
  }

  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
  const proyectos = await getAllProyectos();

  if (proyectos.length === 0) {
    console.warn('⚠️ No se encontraron proyectos. Creando solo la página de listado estática.');
  }

  let generated = 0;
  let failed = 0;

  // Generar página de listado /proyectos/index.html
  const proyectosDir = path.join(distPath, 'proyectos');
  if (!fs.existsSync(proyectosDir)) {
    fs.mkdirSync(proyectosDir, { recursive: true });
  }

  const listadoHtml = (() => {
    const url = `${CONFIG.siteUrl}/proyectos`;
    const title = 'Portafolio de Proyectos - SCUTI Company';
    const description = 'Conoce nuestros proyectos tecnológicos: aplicaciones web, sistemas empresariales, e-commerce e inteligencia artificial desarrollados por SCUTI Company.';
    let html = indexHtml;
    html = html.replace(/<title[^>]*>.*?<\/title>/, `<title data-rh="true">${title}</title>`);
    html = html.replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${description}" data-rh="true" />`);
    html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" data-rh="true" />`);
    html = html.replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${title}" data-rh="true" />`);
    html = html.replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${description}" data-rh="true" />`);
    html = html.replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" data-rh="true" />`);
    html = html.replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${title}" data-rh="true" />`);
    html = html.replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${description}" data-rh="true" />`);
    return html;
  })();

  fs.writeFileSync(path.join(proyectosDir, 'index.html'), listadoHtml);
  console.log('✅ /proyectos/index.html');

  // Generar página de detalle para cada proyecto
  for (const proyecto of proyectos) {
    if (!proyecto.slug) {
      console.warn(`   ⚠️ Proyecto sin slug ignorado: ${proyecto.nombre || proyecto._id}`);
      failed++;
      continue;
    }

    try {
      const slugDir = path.join(proyectosDir, proyecto.slug);
      if (!fs.existsSync(slugDir)) {
        fs.mkdirSync(slugDir, { recursive: true });
      }

      const html = buildHtmlPage(indexHtml, proyecto);
      fs.writeFileSync(path.join(slugDir, 'index.html'), html);

      console.log(`✅ /proyectos/${proyecto.slug}/index.html`);
      console.log(`   📄 ${proyecto.nombre}`);
      console.log(`   🔗 ${CONFIG.siteUrl}/proyectos/${proyecto.slug}\n`);
      generated++;
    } catch (err) {
      console.error(`   ❌ Error generando /proyectos/${proyecto.slug}: ${err.message}`);
      failed++;
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('📊 RESUMEN PRERENDER PROYECTOS');
  console.log('═'.repeat(60));
  console.log(`   ✅ Generados: ${generated + 1} (listado + ${generated} detalles)`);
  if (failed > 0) console.log(`   ❌ Errores:   ${failed}`);
  console.log('═'.repeat(60));
  console.log('\n🎉 Pre-renderizado de proyectos completado!');
}

main().catch(error => {
  console.error('\n❌ Error fatal:', error.message);
  process.exit(1);
});
