import React, { useMemo } from 'react';
import { CmsInput, CmsTextarea, CmsSelect } from './shared';
import type { PageData } from '../../types/cms';

interface SeoConfigSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
}

// ═══════════════════════════════════════════════════════
// SEO Score Calculator
// ═══════════════════════════════════════════════════════
interface SeoCheck {
  label: string;
  passed: boolean;
  weight: number;
  hint: string;
}

function calculateSeoScore(pageData: PageData): { score: number; checks: SeoCheck[] } {
  const seo = pageData.seo;
  const focusKeyphrase = (seo.focusKeyphrase || '').toLowerCase().trim();
  const metaTitle = seo.metaTitle || '';
  const metaDescription = seo.metaDescription || '';

  const checks: SeoCheck[] = [
    {
      label: 'Meta título definido',
      passed: metaTitle.length > 0,
      weight: 15,
      hint: 'Agrega un título SEO descriptivo',
    },
    {
      label: 'Título 50-60 caracteres',
      passed: metaTitle.length >= 30 && metaTitle.length <= 60,
      weight: 10,
      hint: `Actual: ${metaTitle.length} caracteres. Ideal: 50-60`,
    },
    {
      label: 'Meta descripción definida',
      passed: metaDescription.length > 0,
      weight: 15,
      hint: 'Agrega una meta descripción atractiva',
    },
    {
      label: 'Descripción 120-160 caracteres',
      passed: metaDescription.length >= 80 && metaDescription.length <= 160,
      weight: 10,
      hint: `Actual: ${metaDescription.length} caracteres. Ideal: 120-160`,
    },
    {
      label: 'Focus keyphrase definida',
      passed: focusKeyphrase.length > 0,
      weight: 10,
      hint: 'Define una palabra clave principal para posicionar',
    },
    {
      label: 'Keyphrase en título',
      passed: !!focusKeyphrase && metaTitle.toLowerCase().includes(focusKeyphrase),
      weight: 10,
      hint: 'Incluye la keyphrase en el meta título',
    },
    {
      label: 'Keyphrase en descripción',
      passed: !!focusKeyphrase && metaDescription.toLowerCase().includes(focusKeyphrase),
      weight: 5,
      hint: 'Incluye la keyphrase en la meta descripción',
    },
    {
      label: 'Palabras clave configuradas',
      passed: (seo.keywords || []).filter((k: string) => k.trim()).length >= 2,
      weight: 5,
      hint: 'Agrega al menos 2 palabras clave',
    },
    {
      label: 'Imagen OG configurada',
      passed: !!(seo.ogImage),
      weight: 10,
      hint: 'Agrega una imagen para redes sociales (1200x630px)',
    },
    {
      label: 'URL canónica o robots configurado',
      passed: !!(seo.canonicalUrl) || seo.robots === 'index, follow',
      weight: 10,
      hint: 'Configura la URL canónica o asegura robots = index,follow',
    },
  ];

  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const earnedWeight = checks.filter(c => c.passed).reduce((sum, c) => sum + c.weight, 0);
  const score = Math.round((earnedWeight / totalWeight) * 100);

  return { score, checks };
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-500';
  if (score >= 50) return 'text-yellow-500';
  return 'text-red-500';
}

function getScoreBg(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excelente';
  if (score >= 60) return 'Bueno';
  if (score >= 40) return 'Necesita mejoras';
  return 'Deficiente';
}

const SeoConfigSection: React.FC<SeoConfigSectionProps> = ({
  pageData,
  updateContent
}) => {
  // Verificar si la palabra clave principal aparece en el título/descripción
  const focusKeyphrase = (pageData.seo.focusKeyphrase || '').toLowerCase().trim();
  const metaTitle = (pageData.seo.metaTitle || '').toLowerCase();
  const metaDescription = (pageData.seo.metaDescription || '').toLowerCase();

  const isInTitle = focusKeyphrase && metaTitle.includes(focusKeyphrase);
  const isInDescription = focusKeyphrase && metaDescription.includes(focusKeyphrase);
  const isInKeywords = focusKeyphrase && (pageData.seo.keywords || []).some(
    (kw: string) => kw.toLowerCase().includes(focusKeyphrase)
  );

  // SEO Score
  const { score, checks } = useMemo(() => calculateSeoScore(pageData), [pageData]);

  const addKeyword = () => {
    const currentKeywords = pageData.seo.keywords || [];
    console.log('🔍 [SEO] Agregando keyword');
    updateContent('seo.keywords', [...currentKeywords, '']);
  };

  const removeKeyword = (index: number) => {
    const currentKeywords = pageData.seo.keywords || [];
    const updatedKeywords = currentKeywords.filter((_: any, i: number) => i !== index);
    console.log('🔍 [SEO] Removiendo keyword en índice:', index);
    updateContent('seo.keywords', updatedKeywords);
  };

  const updateKeyword = (index: number, value: string) => {
    const currentKeywords = [...(pageData.seo.keywords || [])];
    currentKeywords[index] = value;
    console.log('🔍 [SEO] Actualizando keyword:', value);
    updateContent('seo.keywords', currentKeywords);
  };

  // 🔥 NUEVO: Función helper para actualizar campos SEO con logging
  const handleSeoFieldUpdate = (field: string, value: string) => {
    console.log(`🔍 [SEO] Actualizando ${field}:`, value);
    updateContent(`seo.${field}`, value);
  };

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 border border-gray-100 dark:border-gray-700/50">
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center">
        🔍 Configuración SEO
      </h2>

      {/* ═══ SEO Score Indicator ═══ */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800/80 dark:to-gray-800/60 border border-purple-200 dark:border-gray-700 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              📊 Puntuación SEO
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              score >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' :
              score >= 50 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' :
              'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
            }`}>
              {getScoreLabel(score)}
            </span>
          </div>
          <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${getScoreBg(score)}`}
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Checks list (collapsed by default, expandable) */}
        <details className="group">
          <summary className="cursor-pointer text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 select-none">
            Ver {checks.filter(c => !c.passed).length} mejoras pendientes
          </summary>
          <div className="mt-2 space-y-1">
            {checks.map((check, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-xs">
                <span className={`mt-0.5 flex-shrink-0 ${check.passed ? 'text-green-500' : 'text-red-400'}`}>
                  {check.passed ? '✓' : '✗'}
                </span>
                <div>
                  <span className={check.passed ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300 font-medium'}>
                    {check.label}
                  </span>
                  {!check.passed && (
                    <span className="text-gray-400 dark:text-gray-500 ml-1">— {check.hint}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </details>
      </div>

      <div className="space-y-3">
        {/* Palabra Clave Principal (Focus Keyphrase) */}
        <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
            🎯 Palabra Clave Principal
          </h3>

          <div className="space-y-2">
            <CmsInput
              label="Focus Keyphrase"
              value={pageData.seo.focusKeyphrase || ''}
              onChange={(e) => handleSeoFieldUpdate('focusKeyphrase', e.target.value)}
              focusColor="amber"
              placeholder="Ej: desarrollo web, marketing digital, etc."
              maxLength={100}
              hint="La palabra clave principal para posicionar esta página"
            />

            {/* Indicadores de uso de la keyword */}
            {focusKeyphrase && (
              <div className="bg-white dark:bg-gray-800 rounded-md p-2 border border-amber-200 dark:border-amber-700">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Verificación de uso:
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isInTitle ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                      {isInTitle ? '✓' : '✗'}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {isInTitle ? 'En título' : 'No en título'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isInDescription ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                      {isInDescription ? '✓' : '✗'}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {isInDescription ? 'En descripción' : 'No en descripción'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${isInKeywords ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                      {isInKeywords ? '✓' : '!'}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {isInKeywords ? 'En keywords' : 'Agregar a keywords'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Meta Tags Básicos */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
            📝 Meta Tags Básicos
          </h3>
          
          <div className="space-y-2">
            <CmsInput
              label="Título (Title)"
              value={pageData.seo.metaTitle || ''}
              onChange={(e) => handleSeoFieldUpdate('metaTitle', e.target.value)}
              focusColor="blue"
              placeholder="Título de la página (50-60 caracteres)"
              maxLength={60}
              charCount={{ current: (pageData.seo.metaTitle || '').length, max: 60 }}
            />

            <CmsTextarea
              label="Descripción (Meta Description)"
              value={pageData.seo.metaDescription || ''}
              onChange={(e) => handleSeoFieldUpdate('metaDescription', e.target.value)}
              rows={2}
              focusColor="blue"
              placeholder="Descripción para resultados de búsqueda (150-160 caracteres)"
              maxLength={160}
              charCount={{ current: (pageData.seo.metaDescription || '').length, max: 160 }}
            />
          </div>
        </div>

        {/* ═══ Google SERP Preview ═══ */}
        <div className="bg-gray-50 dark:bg-gray-900/40 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-1.5">
            🔍 Vista Previa en Google
          </h3>
          <div className="bg-white dark:bg-white rounded-lg p-4 font-['Arial',sans-serif] shadow-sm">
            {/* URL breadcrumb */}
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-blue-600">S</span>
              </div>
              <div className="text-xs text-[#202124] truncate">
                scuticompany.com › {pageData.pageSlug || 'pagina'}
              </div>
            </div>
            {/* Title */}
            <div className="mb-0.5">
              <span className="text-lg text-[#1a0dab] leading-snug hover:underline cursor-pointer">
                {(pageData.seo.metaTitle || '').length > 60
                  ? (pageData.seo.metaTitle || '').substring(0, 57) + '...'
                  : pageData.seo.metaTitle || 'Sin título - Agrega un meta título'}
              </span>
            </div>
            {/* Description */}
            <div className="text-[13px] text-[#4d5156] leading-relaxed">
              {(pageData.seo.metaDescription || '').length > 160
                ? (pageData.seo.metaDescription || '').substring(0, 157) + '...'
                : pageData.seo.metaDescription || 'Sin descripción - Agrega una meta descripción para atraer clics desde Google.'}
            </div>
          </div>
        </div>

        {/* Palabras Clave */}
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
            🏷️ Palabras Clave
          </h3>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Palabras clave relevantes para el contenido
              </p>
              <button
                onClick={addKeyword}
                className="px-2 py-0.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors duration-200"
              >
                ➕ Agregar
              </button>
            </div>
            
            <div className="space-y-1.5">
              {(pageData.seo.keywords || []).map((keyword: string, index: number) => (
                <div key={index} className="flex gap-1.5">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => updateKeyword(index, e.target.value)}
                    className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                    placeholder="palabra clave"
                  />
                  <button
                    onClick={() => removeKeyword(index)}
                    className="px-1.5 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
            
            {(!pageData.seo.keywords || pageData.seo.keywords.length === 0) && (
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                No hay palabras clave configuradas
              </p>
            )}
          </div>
        </div>

        {/* Configuración Técnica SEO */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-200 dark:border-indigo-800">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
            ⚙️ Configuración Técnica
          </h3>
          
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <CmsInput
                label="URL Canónica"
                type="url"
                value={pageData.seo.canonicalUrl || ''}
                onChange={(e) => handleSeoFieldUpdate('canonicalUrl', e.target.value)}
                focusColor="indigo"
                placeholder="https://scuticompany.com/..."
                hint="Deja vacío para usar la URL actual"
              />
              
              <CmsSelect
                label="Robots (Indexación)"
                value={pageData.seo.robots || 'index, follow'}
                onChange={(e) => handleSeoFieldUpdate('robots', e.target.value)}
                focusColor="indigo"
                options={[
                  { value: 'index, follow', label: '✅ Index, Follow (Recomendado)' },
                  { value: 'index, nofollow', label: 'Index, No Follow' },
                  { value: 'noindex, follow', label: 'No Index, Follow' },
                  { value: 'noindex, nofollow', label: '🚫 No Index, No Follow' },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Open Graph (Redes Sociales) */}
        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
            📱 Open Graph (Redes Sociales)
          </h3>
          
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <CmsInput
                label="Título (og:title)"
                value={pageData.seo.ogTitle || ''}
                onChange={(e) => handleSeoFieldUpdate('ogTitle', e.target.value)}
                focusColor="purple"
                placeholder="Título para redes sociales"
              />
              
              <CmsSelect
                label="Tipo (og:type)"
                value={pageData.seo.ogType || 'website'}
                onChange={(e) => handleSeoFieldUpdate('ogType', e.target.value)}
                focusColor="purple"
                options={[
                  { value: 'website', label: 'Website' },
                  { value: 'article', label: 'Article' },
                  { value: 'product', label: 'Product' },
                  { value: 'profile', label: 'Profile' },
                ]}
              />
            </div>

            <CmsTextarea
              label="Descripción (og:description)"
              value={pageData.seo.ogDescription || ''}
              onChange={(e) => handleSeoFieldUpdate('ogDescription', e.target.value)}
              rows={2}
              focusColor="purple"
              placeholder="Descripción para redes sociales"
            />

            <CmsInput
              label="Imagen (og:image)"
              type="url"
              value={pageData.seo.ogImage || ''}
              onChange={(e) => handleSeoFieldUpdate('ogImage', e.target.value)}
              focusColor="purple"
              placeholder="URL de la imagen (1200x630px recomendado)"
            />
          </div>
        </div>

        {/* Twitter Card */}
        <div className="bg-sky-50 dark:bg-sky-900/20 p-3 rounded-lg border border-sky-200 dark:border-sky-800">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
            🐦 Twitter Card
          </h3>
          
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <CmsSelect
                label="Tipo de Card"
                value={pageData.seo.twitterCard || 'summary_large_image'}
                onChange={(e) => handleSeoFieldUpdate('twitterCard', e.target.value)}
                focusColor="sky"
                options={[
                  { value: 'summary', label: 'Summary' },
                  { value: 'summary_large_image', label: 'Summary Large Image' },
                  { value: 'app', label: 'App' },
                  { value: 'player', label: 'Player' },
                ]}
              />
              
              <CmsInput
                label="Título Twitter"
                value={pageData.seo.twitterTitle || ''}
                onChange={(e) => handleSeoFieldUpdate('twitterTitle', e.target.value)}
                focusColor="sky"
                placeholder="Deja vacío para usar og:title"
              />
            </div>

            <CmsTextarea
              label="Descripción Twitter"
              value={pageData.seo.twitterDescription || ''}
              onChange={(e) => handleSeoFieldUpdate('twitterDescription', e.target.value)}
              rows={2}
              focusColor="sky"
              placeholder="Deja vacío para usar og:description"
            />

            <CmsInput
              label="Imagen Twitter"
              type="url"
              value={pageData.seo.twitterImage || ''}
              onChange={(e) => handleSeoFieldUpdate('twitterImage', e.target.value)}
              focusColor="sky"
              placeholder="Deja vacío para usar og:image"
            />
          </div>
        </div>

        {/* ═══ Social Preview (OG + Twitter) ═══ */}
        <div className="bg-gray-50 dark:bg-gray-900/40 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-1.5">
            📲 Vista Previa en Redes Sociales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Facebook/OG Preview */}
            <div>
              <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Facebook / Open Graph</p>
              <div className="bg-white dark:bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm">
                {/* Image placeholder */}
                <div className="w-full h-28 bg-gray-200 flex items-center justify-center overflow-hidden">
                  {(pageData.seo.ogImage) ? (
                    <img
                      src={pageData.seo.ogImage}
                      alt="OG Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <span className="text-xs text-gray-400">Sin imagen OG (1200×630)</span>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="text-[10px] text-[#606770] uppercase tracking-wider">scuticompany.com</p>
                  <p className="text-sm font-semibold text-[#1d2129] leading-tight mt-0.5 line-clamp-2">
                    {pageData.seo.ogTitle || pageData.seo.metaTitle || 'Título de la página'}
                  </p>
                  <p className="text-xs text-[#606770] mt-0.5 line-clamp-2">
                    {pageData.seo.ogDescription || pageData.seo.metaDescription || 'Descripción de la página'}
                  </p>
                </div>
              </div>
            </div>

            {/* Twitter Preview */}
            <div>
              <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Twitter / X</p>
              <div className="bg-white dark:bg-white rounded-2xl border border-gray-300 overflow-hidden shadow-sm">
                {/* Image */}
                <div className="w-full h-28 bg-gray-200 flex items-center justify-center overflow-hidden">
                  {(pageData.seo.twitterImage || pageData.seo.ogImage) ? (
                    <img
                      src={pageData.seo.twitterImage || pageData.seo.ogImage || ''}
                      alt="Twitter Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <span className="text-xs text-gray-400">Sin imagen</span>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="text-sm font-semibold text-[#0f1419] leading-tight line-clamp-2">
                    {pageData.seo.twitterTitle || pageData.seo.ogTitle || pageData.seo.metaTitle || 'Título de la página'}
                  </p>
                  <p className="text-xs text-[#536471] mt-0.5 line-clamp-2">
                    {pageData.seo.twitterDescription || pageData.seo.ogDescription || pageData.seo.metaDescription || 'Descripción de la página'}
                  </p>
                  <p className="text-xs text-[#536471] mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    scuticompany.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoConfigSection;