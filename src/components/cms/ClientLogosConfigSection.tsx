import React, { useState } from 'react';
import RichTextEditorWithTheme from '../RichTextEditorWithTheme';
import ManagedImageSelector from '../ManagedImageSelector';
import ClientLogosEditor from './ClientLogosEditor';
import ClientLogosDesignSection from './ClientLogosDesignSection';
import type { PageData, ClientLogo } from '../../types/cms';

interface ClientLogosConfigSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
  updateTextStyle: (section: 'hero' | 'solutions' | 'valueAdded' | 'clientLogos', field: string, mode: 'light' | 'dark', color: string) => void;
}

const ClientLogosConfigSection: React.FC<ClientLogosConfigSectionProps> = ({
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
        aria-controls="client-logos-section-content"
        style={{ cursor: 'pointer' }}
      >
        <span className="flex items-center">
          🏢 Sección Logos de Clientes
        </span>
        <span className="ml-2 text-lg">
          {collapsed ? '▼ Mostrar' : '▲ Ocultar'}
        </span>
      </button>

      {/* Contenido colapsable */}
      {!collapsed && (
        <div id="client-logos-section-content">
          {/* Controles de visibilidad */}
          <div className="mb-6 space-y-4">
            {/* Control de visibilidad de la sección */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
              <div>
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Mostrar sección de logos de clientes
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Controla si la sección de logos de clientes aparece en el sitio web
                </p>
              </div>
              <button
                onClick={() => updateContent('clientLogos.visible', !(pageData.content.clientLogos?.visible ?? true))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  pageData.content.clientLogos?.visible !== false ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    pageData.content.clientLogos?.visible !== false ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Control para mostrar/ocultar texto */}
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <div>
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Mostrar título y descripción
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Desactiva para mostrar solo los logos sin texto
                </p>
              </div>
              <button
                onClick={() => updateContent('clientLogos.showText', !(pageData.content.clientLogos?.showText ?? true))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  pageData.content.clientLogos?.showText !== false ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    pageData.content.clientLogos?.showText !== false ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Título y descripción de la sección */}
          <div className="space-y-4 mb-8">
            <div>
              <RichTextEditorWithTheme
                label="Título de la Sección"
                value={pageData.content.clientLogos?.title || 'Nuestros clientes'}
                onChange={(html) => updateContent('clientLogos.title', html)}
                placeholder="Nuestros clientes"
                themeColors={{
                  light: pageData.content.clientLogos?.styles?.light?.titleColor || '',
                  dark: pageData.content.clientLogos?.styles?.dark?.titleColor || ''
                }}
                onThemeColorChange={(mode, color) => updateTextStyle('clientLogos', 'titleColor', mode, color)}
              />
            </div>

            <div>
              <RichTextEditorWithTheme
                label="Descripción de la Sección"
                value={pageData.content.clientLogos?.description || ''}
                onChange={(html) => updateContent('clientLogos.description', html)}
                placeholder="Empresas que confían en nosotros..."
                themeColors={{
                  light: pageData.content.clientLogos?.styles?.light?.descriptionColor || '',
                  dark: pageData.content.clientLogos?.styles?.dark?.descriptionColor || ''
                }}
                onThemeColorChange={(mode, color) => updateTextStyle('clientLogos', 'descriptionColor', mode, color)}
              />
            </div>
          </div>

          {/* Configuración de imagen de fondo única */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              🖼️ Imagen de Fondo
            </h3>
            <div className="space-y-4">
              {/* Imagen de fondo única */}
              <div>
                <ManagedImageSelector
                  label="Imagen de Fondo de la Sección"
                  currentImage={pageData.content.clientLogos?.backgroundImage || ''}
                  onImageSelect={(imageUrl) => updateContent('clientLogos.backgroundImage', imageUrl)}
                  description="Imagen que se mostrará como fondo de la sección (funciona en ambos temas)"
                  hideButtonArea={!!pageData.content.clientLogos?.backgroundImage}
                />
              </div>

              {/* Texto alternativo para la imagen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Texto alternativo para la imagen
                </label>
                <input
                  type="text"
                  value={pageData.content.clientLogos?.backgroundImageAlt || ''}
                  onChange={(e) => updateContent('clientLogos.backgroundImageAlt', e.target.value)}
                  placeholder="Client logos background"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Texto descriptivo para accesibilidad (screen readers)
                </p>
              </div>
            </div>
          </div>

          {/* Configuración de diseño y espaciado */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              📐 Diseño y Espaciado
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Espaciado vertical de la sección */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Espaciado Vertical de la Sección
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="0.5"
                    value={parseFloat((pageData.content.clientLogos?.sectionPaddingY || '4rem').replace('rem', ''))}
                    onChange={(e) => updateContent('clientLogos.sectionPaddingY', `${e.target.value}rem`)}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {pageData.content.clientLogos?.sectionPaddingY || '4rem'} ({Math.round(parseFloat((pageData.content.clientLogos?.sectionPaddingY || '4rem').replace('rem', '')) * 16)}px)
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Controla el espacio arriba y abajo de la sección
                </p>
              </div>

              {/* Altura de los logos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Altura de los Logos
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="30"
                    max="120"
                    step="5"
                    value={parseInt((pageData.content.clientLogos?.logosHeight || '60px').replace('px', ''))}
                    onChange={(e) => updateContent('clientLogos.logosHeight', `${e.target.value}px`)}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {pageData.content.clientLogos?.logosHeight || '60px'}
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Altura específica para todos los logos
                </p>
              </div>
            </div>
          </div>

          {/* Editor de logos */}
          <div className="mb-8">
            <ClientLogosEditor
              logos={pageData.content.clientLogos?.logos || []}
              onUpdate={(updatedLogos: ClientLogo[]) => updateContent('clientLogos.logos', updatedLogos)}
            />
          </div>

          {/* Configuración de diseño */}
          <div className="mb-8">
            <ClientLogosDesignSection
              pageData={pageData}
              updateContent={updateContent}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientLogosConfigSection;