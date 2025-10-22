import React, { useState } from 'react';
import RichTextEditorWithTheme from '../RichTextEditorWithTheme';
import ManagedImageSelector from '../ManagedImageSelector';
import type { PageData } from '../../types/cms';

interface HeroConfigSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
  updateTextStyle: (section: 'hero' | 'solutions', field: string, mode: 'light' | 'dark', color: string) => void;
}

const HeroConfigSection: React.FC<HeroConfigSectionProps> = ({
  pageData,
  updateContent,
  updateTextStyle
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
      {/* Encabezado colapsable */}
      <button
        type="button"
        className="w-full flex items-center justify-between text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded transition-colors"
        onClick={() => setCollapsed((prev) => !prev)}
        aria-expanded={!collapsed}
        aria-controls="hero-section-content"
        style={{ cursor: 'pointer' }}
      >
        <span className="flex items-center">
          🚀 Hero Section
        </span>
        <span className="ml-2 text-lg">
          {collapsed ? '▼ Mostrar' : '▲ Ocultar'}
        </span>
      </button>

      {/* Contenido colapsable */}
      {!collapsed && (
        <div id="hero-section-content">
          <div className="space-y-4">
            <div>
              <RichTextEditorWithTheme
                label="Título Principal"
                value={pageData.content.hero.title}
                onChange={(html) => updateContent('hero.title', html)}
                placeholder="Transformamos tu empresa..."
                themeColors={{
                  light: pageData.content.hero.styles?.light?.titleColor || '',
                  dark: pageData.content.hero.styles?.dark?.titleColor || ''
                }}
                onThemeColorChange={(mode, color) => updateTextStyle('hero', 'titleColor', mode, color)}
              />
            </div>

            <div>
              <RichTextEditorWithTheme
                label="Subtítulo"
                value={pageData.content.hero.subtitle}
                onChange={(html) => updateContent('hero.subtitle', html)}
                placeholder="Innovamos para que tu empresa..."
                themeColors={{
                  light: pageData.content.hero.styles?.light?.subtitleColor || '',
                  dark: pageData.content.hero.styles?.dark?.subtitleColor || ''
                }}
                onThemeColorChange={(mode, color) => updateTextStyle('hero', 'subtitleColor', mode, color)}
              />
            </div>

            <div>
              <RichTextEditorWithTheme
                label="Descripción"
                value={pageData.content.hero.description}
                onChange={(html) => updateContent('hero.description', html)}
                placeholder="Transformamos procesos con..."
                themeColors={{
                  light: pageData.content.hero.styles?.light?.descriptionColor || '',
                  dark: pageData.content.hero.styles?.dark?.descriptionColor || ''
                }}
                onThemeColorChange={(mode, color) => updateTextStyle('hero', 'descriptionColor', mode, color)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Texto del Botón
                </label>
                <input
                  type="text"
                  value={pageData.content.hero.ctaText}
                  onChange={(e) => updateContent('hero.ctaText', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Conoce nuestros servicios"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Enlace del Botón
                </label>
                <input
                  type="text"
                  value={pageData.content.hero.ctaLink}
                  onChange={(e) => updateContent('hero.ctaLink', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="#servicios"
                />
              </div>
            </div>

            {/* Imágenes de Fondo del Hero por Tema */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">🖼️ Imágenes de Fondo del Hero</h4>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {/* Imagen para Tema Claro */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center mb-3">
                    <div className="bg-white rounded-full p-2 mr-3 shadow-sm">
                      <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-gray-800">🌞 Tema Claro</h5>
                      <p className="text-xs text-gray-600">Apariencia diurna</p>
                    </div>
                  </div>
                  <ManagedImageSelector
                    label="Imagen de Fondo (Claro)"
                    description="Tamaño recomendado: 1920x1080px"
                    currentImage={typeof pageData.content.hero.backgroundImage === 'string' 
                      ? pageData.content.hero.backgroundImage 
                      : pageData.content.hero.backgroundImage?.light}
                    onImageSelect={(url) => updateContent('hero.backgroundImage.light', url)}
                    hideButtonArea={!!(typeof pageData.content.hero.backgroundImage === 'string' 
                      ? pageData.content.hero.backgroundImage 
                      : pageData.content.hero.backgroundImage?.light)}
                  />
                </div>

                {/* Imagen para Tema Oscuro */}
                <div className="bg-gradient-to-br from-slate-900 to-gray-900 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center mb-3">
                    <div className="bg-gray-800 rounded-full p-2 mr-3 shadow-sm">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white">🌙 Tema Oscuro</h5>
                      <p className="text-xs text-gray-400">Apariencia nocturna</p>
                    </div>
                  </div>
                  <ManagedImageSelector
                    label="Imagen de Fondo (Oscuro)"
                    description="Tamaño recomendado: 1920x1080px"
                    currentImage={typeof pageData.content.hero.backgroundImage === 'string' 
                      ? pageData.content.hero.backgroundImage 
                      : pageData.content.hero.backgroundImage?.dark}
                    onImageSelect={(url) => updateContent('hero.backgroundImage.dark', url)}
                    darkMode={true}
                    hideButtonArea={!!(typeof pageData.content.hero.backgroundImage === 'string' 
                      ? pageData.content.hero.backgroundImage 
                      : pageData.content.hero.backgroundImage?.dark)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroConfigSection;