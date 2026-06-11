/**
 * 🗺️ Generador del Índice de Sitemaps
 *
 * IMPORTANTE: Los sitemaps de contenido dinámico (blog, servicios, proyectos)
 * ya NO se generan estáticamente en el build. Se sirven en tiempo real desde
 * el backend a través de rewrites en vercel.json:
 *
 *   /sitemap-blog.xml      → backend /api/blog/sitemap.xml
 *   /sitemap-services.xml  → backend /api/servicios/sitemap.xml
 *   /sitemap-proyectos.xml → backend /api/proyectos/sitemap.xml
 *
 * Motivo: los archivos estáticos en dist/ tienen PRECEDENCIA sobre los
 * rewrites de Vercel. Generarlos en el build los dejaba congelados hasta el
 * siguiente deploy, y los posts/servicios nuevos no aparecían en el sitemap
 * (causa de "Rastreada: actualmente sin indexar" en Search Console).
 *
 * Este script solo:
 *  1. Genera el índice sitemap.xml (referencias a los 4 sitemaps hijos)
 *  2. Elimina de dist/ cualquier sitemap dinámico estático que bloquearía los rewrites
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '../dist');

const CONFIG = {
  siteUrl: process.env.VITE_SITE_URL || 'https://scuticompany.com'
};

/**
 * Formatear fecha para sitemap (YYYY-MM-DD)
 */
function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

/**
 * Generar el índice principal sitemap.xml
 */
function generateSitemapIndex() {
  console.log('\n📋 Generando índice de sitemaps (sitemap.xml)...');

  const today = formatDate(new Date());

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Sitemap de paginas estaticas -->
  <sitemap>
    <loc>${CONFIG.siteUrl}/sitemap-pages.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>

  <!-- Sitemap del blog (dinamico - servido por el backend) -->
  <sitemap>
    <loc>${CONFIG.siteUrl}/sitemap-blog.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>

  <!-- Sitemap de servicios (dinamico - servido por el backend) -->
  <sitemap>
    <loc>${CONFIG.siteUrl}/sitemap-services.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>

  <!-- Sitemap de proyectos (dinamico - servido por el backend) -->
  <sitemap>
    <loc>${CONFIG.siteUrl}/sitemap-proyectos.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>

</sitemapindex>`;

  fs.writeFileSync(path.join(distPath, 'sitemap.xml'), sitemapIndex);
  console.log('   ✅ sitemap.xml generado');
}

/**
 * Eliminar sitemaps dinámicos estáticos de dist/
 * Si existen como archivo, Vercel los sirve y los rewrites al backend nunca aplican.
 */
function removeStaleDynamicSitemaps() {
  const dynamicSitemaps = ['sitemap-blog.xml', 'sitemap-services.xml', 'sitemap-proyectos.xml'];

  for (const file of dynamicSitemaps) {
    const filePath = path.join(distPath, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`   🧹 Eliminado dist/${file} (se sirve dinámico vía rewrite)`);
    }
  }
}

function main() {
  if (!fs.existsSync(distPath)) {
    console.error('❌ Error: No se encontró el directorio dist.');
    process.exit(1);
  }

  generateSitemapIndex();
  removeStaleDynamicSitemaps();

  console.log('\n🎉 Índice de sitemaps actualizado.');
  console.log('   - sitemap.xml (índice, estático)');
  console.log('   - sitemap-pages.xml (estático, en public/)');
  console.log('   - sitemap-blog.xml / sitemap-services.xml / sitemap-proyectos.xml (dinámicos, backend)');
}

main();
