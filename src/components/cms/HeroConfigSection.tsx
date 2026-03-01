import React, { useState } from 'react';
import RichTextEditorCompact from '../RichTextEditorCompact';
import ManagedImageSelector from '../ManagedImageSelector';
import { CmsInput } from './shared';
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
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 border border-gray-100 dark:border-gray-700/50">
      {/* Encabezado colapsable */}
      <button
        type="button"
        className="w-full flex items-center justify-between text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 focus:outline-none focus:ring-1 focus:ring-purple-500 rounded transition-colors"
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
          {/* Layout principal con 2 columnas: Contenido y Imágenes */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            
            {/* Columna izquierda: Editores de texto (2/3) */}
            <div className="xl:col-span-2 space-y-3">
              
              {/* Título Principal */}
              <div>
                <RichTextEditorCompact
                  label="Título Principal"
                  value={pageData.content.hero.title}
                  onChange={(html: string) => updateContent('hero.title', html)}
                  placeholder="Transformamos tu empresa..."
                  themeColors={{
                    light: pageData.content.hero.styles?.light?.titleColor || '',
                    dark: pageData.content.hero.styles?.dark?.titleColor || ''
                  }}
                  onThemeColorChange={(mode: 'light' | 'dark', color: string) => updateTextStyle('hero', 'titleColor', mode, color)}
                />
              </div>

              {/* Subtítulo */}
              <div>
                <RichTextEditorCompact
                  label="Subtítulo"
                  value={pageData.content.hero.subtitle}
                  onChange={(html: string) => updateContent('hero.subtitle', html)}
                  placeholder="Innovamos para que tu empresa..."
                  themeColors={{
                    light: pageData.content.hero.styles?.light?.subtitleColor || '',
                    dark: pageData.content.hero.styles?.dark?.subtitleColor || ''
                  }}
                  onThemeColorChange={(mode: 'light' | 'dark', color: string) => updateTextStyle('hero', 'subtitleColor', mode, color)}
                />
              </div>

              {/* Descripción */}
              <div>
                <RichTextEditorCompact
                  label="Descripción"
                  value={pageData.content.hero.description}
                  onChange={(html: string) => updateContent('hero.description', html)}
                  placeholder="Transformamos procesos con..."
                  themeColors={{
                    light: pageData.content.hero.styles?.light?.descriptionColor || '',
                    dark: pageData.content.hero.styles?.dark?.descriptionColor || ''
                  }}
                  onThemeColorChange={(mode: 'light' | 'dark', color: string) => updateTextStyle('hero', 'descriptionColor', mode, color)}
                />
              </div>

              {/* Configuración del botón CTA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <CmsInput
                  label="Texto del Botón"
                  value={pageData.content.hero.ctaText}
                  onChange={(e) => updateContent('hero.ctaText', e.target.value)}
                  focusColor="purple"
                  placeholder="Conoce nuestros servicios"
                />
                <CmsInput
                  label="Enlace del Botón"
                  value={pageData.content.hero.ctaLink}
                  onChange={(e) => updateContent('hero.ctaLink', e.target.value)}
                  focusColor="purple"
                  placeholder="#servicios"
                />
              </div>
            </div>

            {/* Columna derecha: Imágenes de Fondo (1/3) */}
            <div className="xl:col-span-1">
              <h4 className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                🖼️ Imágenes de Fondo
              </h4>
              <div className="space-y-3">
                
                {/* Imágenes claro/oscuro lado a lado */}
                <div className="flex gap-3 justify-center">
                  <div>
                    <label className="block text-[9px] font-medium text-gray-500 dark:text-gray-400 mb-1 text-center">☀️ Claro</label>
                    <ManagedImageSelector
                      sidebar
                      label="Fondo Claro"
                      currentImage={typeof pageData.content.hero.backgroundImage === 'string' 
                        ? pageData.content.hero.backgroundImage 
                        : pageData.content.hero.backgroundImage?.light}
                      onImageSelect={(url) => updateContent('hero.backgroundImage.light', url)}
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-medium text-gray-500 dark:text-gray-400 mb-1 text-center">🌙 Oscuro</label>
                    <ManagedImageSelector
                      sidebar
                      darkMode
                      label="Fondo Oscuro"
                      currentImage={typeof pageData.content.hero.backgroundImage === 'string' 
                        ? pageData.content.hero.backgroundImage 
                        : pageData.content.hero.backgroundImage?.dark}
                      onImageSelect={(url) => updateContent('hero.backgroundImage.dark', url)}
                    />
                  </div>
                </div>

                {/* Opacidad compacta */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    🎚️ Opacidad: {Math.round(((pageData.content.hero as any).backgroundOpacity || 0.8) * 100)}%
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={((pageData.content.hero as any).backgroundOpacity || 0.8) * 100}
                    onChange={(e) => updateContent('hero.backgroundOpacity', parseInt(e.target.value) / 100)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                    <span>5%</span>
                    <span>100%</span>
                  </div>
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