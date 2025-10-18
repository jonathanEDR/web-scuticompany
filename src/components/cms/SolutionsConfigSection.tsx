import React from 'react';
import RichTextEditorWithTheme from '../RichTextEditorWithTheme';
import ManagedImageSelector from '../ManagedImageSelector';
import type { PageData } from '../../types/cms';

interface SolutionsConfigSectionProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
  updateTextStyle: (section: 'hero' | 'solutions', field: string, mode: 'light' | 'dark', color: string) => void;
}

const SolutionsConfigSection: React.FC<SolutionsConfigSectionProps> = ({
  pageData,
  updateContent,
  updateTextStyle
}) => {


  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
        💡 Sección de Soluciones
      </h2>

      {/* Título y descripción de la sección */}
      <div className="space-y-4 mb-8">
        <div>
          <RichTextEditorWithTheme
            label="Título de la Sección"
            value={pageData.content.solutions.title}
            onChange={(html) => updateContent('solutions.title', html)}
            placeholder="Nuestras Soluciones"
            themeColors={{
              light: pageData.content.solutions.styles?.light?.titleColor || '',
              dark: pageData.content.solutions.styles?.dark?.titleColor || ''
            }}
            onThemeColorChange={(mode, color) => updateTextStyle('solutions', 'titleColor', mode, color)}
          />
        </div>

        <div>
          <RichTextEditorWithTheme
            label="Descripción de la Sección"
            value={pageData.content.solutions.description}
            onChange={(html) => updateContent('solutions.description', html)}
            placeholder="Conoce las soluciones que ofrecemos..."
            themeColors={{
              light: pageData.content.solutions.styles?.light?.descriptionColor || '',
              dark: pageData.content.solutions.styles?.dark?.descriptionColor || ''
            }}
            onThemeColorChange={(mode, color) => updateTextStyle('solutions', 'descriptionColor', mode, color)}
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
                currentImage={typeof pageData.content.solutions.backgroundImage === 'string' 
                  ? pageData.content.solutions.backgroundImage 
                  : pageData.content.solutions.backgroundImage?.light}
                onImageSelect={(url: string) => updateContent('solutions.backgroundImage.light', url)}
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
                currentImage={typeof pageData.content.solutions.backgroundImage === 'string' 
                  ? pageData.content.solutions.backgroundImage 
                  : pageData.content.solutions.backgroundImage?.dark}
                onImageSelect={(url: string) => updateContent('solutions.backgroundImage.dark', url)}
                darkMode={true}
              />
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default SolutionsConfigSection;