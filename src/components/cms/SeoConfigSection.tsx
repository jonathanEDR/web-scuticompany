import React from 'react';
import { CmsInput, CmsTextarea, CmsSelect } from './shared';
import type { PageData } from '../../types/cms';

interface SeoConfigSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
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

      {/* Banner de Preview en Tiempo Real */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-2.5 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-purple-800 dark:text-purple-200">
            🎯 Preview en Tiempo Real
          </span>
        </div>
        <p className="text-[11px] text-purple-600 dark:text-purple-300 mt-0.5">
          Los cambios se aplican inmediatamente en el título de la pestaña del navegador. Guarda para aplicar en el sitio público.
        </p>
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
                label="Twitter Card"
                value={pageData.seo.twitterCard || 'summary_large_image'}
                onChange={(e) => handleSeoFieldUpdate('twitterCard', e.target.value)}
                focusColor="purple"
                options={[
                  { value: 'summary', label: 'Summary' },
                  { value: 'summary_large_image', label: 'Summary Large Image' },
                  { value: 'app', label: 'App' },
                  { value: 'player', label: 'Player' },
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
              placeholder="URL de la imagen para redes sociales"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoConfigSection;