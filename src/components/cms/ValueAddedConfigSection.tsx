import React from 'react';
import RichTextEditorWithTheme from '../RichTextEditorWithTheme';
import ManagedImageSelector from '../ManagedImageSelector';
import ValueAddedLogosEditor from './ValueAddedLogosEditor';
import LogosBarDesignSection from './LogosBarDesignSection';
import type { PageData } from '../../types/cms';

interface ValueAddedConfigSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
  updateTextStyle: (section: 'hero' | 'solutions' | 'valueAdded', field: string, mode: 'light' | 'dark', color: string) => void;
}

const ValueAddedConfigSection: React.FC<ValueAddedConfigSectionProps> = ({
  pageData,
  updateContent,
  updateTextStyle
}) => {

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
        ⭐ Sección Valor Agregado
      </h2>

      {/* Título y descripción de la sección */}
      <div className="space-y-4 mb-8">
        <div>
          <RichTextEditorWithTheme
            label="Título de la Sección"
            value={pageData.content.valueAdded?.title || 'Valor agregado'}
            onChange={(html) => updateContent('valueAdded.title', html)}
            placeholder="Valor agregado"
            themeColors={{
              light: pageData.content.valueAdded?.styles?.light?.titleColor || '',
              dark: pageData.content.valueAdded?.styles?.dark?.titleColor || ''
            }}
            onThemeColorChange={(mode, color) => updateTextStyle('valueAdded', 'titleColor', mode, color)}
          />
        </div>

        <div>
          <RichTextEditorWithTheme
            label="Descripción de la Sección"
            value={pageData.content.valueAdded?.description || ''}
            onChange={(html) => updateContent('valueAdded.description', html)}
            placeholder="Describe el valor agregado que ofreces..."
            themeColors={{
              light: pageData.content.valueAdded?.styles?.light?.descriptionColor || '',
              dark: pageData.content.valueAdded?.styles?.dark?.descriptionColor || ''
            }}
            onThemeColorChange={(mode, color) => updateTextStyle('valueAdded', 'descriptionColor', mode, color)}
          />
        </div>

        {/* Imágenes de Fondo por Tema */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">🖼️ Imágenes de Fondo</h4>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Imagen para Tema Claro */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center mb-3">
                <div className="bg-white rounded-full p-2 mr-3 shadow-sm">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-sm font-bold text-gray-800">🌞 Tema Claro</h5>
                  <p className="text-xs text-gray-600">Fondo para modo día</p>
                </div>
              </div>
              <ManagedImageSelector
                label="Imagen de Fondo (Claro)"
                description="Tamaño recomendado: 1920x1080px"
                currentImage={typeof pageData.content.valueAdded?.backgroundImage === 'string' 
                  ? pageData.content.valueAdded?.backgroundImage 
                  : pageData.content.valueAdded?.backgroundImage?.light}
                onImageSelect={(url: string) => updateContent('valueAdded.backgroundImage.light', url)}
              />
            </div>

            {/* Imagen para Tema Oscuro */}
            <div className="bg-gradient-to-br from-slate-900 to-gray-900 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center mb-3">
                <div className="bg-gray-800 rounded-full p-2 mr-3 shadow-sm">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white">🌙 Tema Oscuro</h5>
                  <p className="text-xs text-gray-400">Fondo para modo noche</p>
                </div>
              </div>
              <ManagedImageSelector
                label="Imagen de Fondo (Oscuro)"
                description="Tamaño recomendado: 1920x1080px"
                currentImage={typeof pageData.content.valueAdded?.backgroundImage === 'string' 
                  ? pageData.content.valueAdded?.backgroundImage 
                  : pageData.content.valueAdded?.backgroundImage?.dark}
                onImageSelect={(url: string) => updateContent('valueAdded.backgroundImage.dark', url)}
              />
            </div>
          </div>

          {/* Texto alternativo para accesibilidad */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📝 Texto alternativo (Alt Text)
            </label>
            <input
              type="text"
              value={pageData.content.valueAdded?.backgroundImageAlt || ''}
              onChange={(e) => updateContent('valueAdded.backgroundImageAlt', e.target.value)}
              placeholder="Describe la imagen para accesibilidad"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Mejora la accesibilidad y SEO describiendo qué muestra la imagen
            </p>
          </div>

          {/* Toggle para mostrar/ocultar iconos */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  👁️ Mostrar Iconos en Tarjetas
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Controla si se muestran los iconos en las tarjetas de valor agregado
                </p>
              </div>
              <button
                type="button"
                onClick={() => updateContent('valueAdded.showIcons', !(pageData.content.valueAdded?.showIcons ?? true))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                  pageData.content.valueAdded?.showIcons !== false
                    ? 'bg-purple-600'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                    pageData.content.valueAdded?.showIcons !== false
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="mt-2 text-xs">
              <span className={`px-2 py-1 rounded ${
                pageData.content.valueAdded?.showIcons !== false
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {pageData.content.valueAdded?.showIcons !== false ? '✅ Iconos visibles' : '🚫 Iconos ocultos'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Editor de Logos */}
      <div className="mt-8">
        <ValueAddedLogosEditor
          logos={pageData.content.valueAdded?.logos || []}
          onUpdate={(logos) => updateContent('valueAdded.logos', logos)}
        />
      </div>

      {/* Diseño de la Barra de Logos */}
      <div className="mt-8">
        <LogosBarDesignSection
          pageData={pageData}
          updateContent={updateContent}
        />
      </div>
    </div>
  );
};

export default ValueAddedConfigSection;