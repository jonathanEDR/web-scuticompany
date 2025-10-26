import React, { useState } from 'react';
import CollapsibleSection from '../../ui/CollapsibleSection';
import type { ContactFormSectionProps } from '../types/ContactFormTypes';

interface ColorsSectionProps extends ContactFormSectionProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Sección de configuración de colores por tema del formulario
 */
const ColorsSection: React.FC<ColorsSectionProps> = ({
  contactForm,
  updateContent,
  isOpen,
  onToggle
}) => {
  // Estado para el selector de tema para colores
  const [activeColorTheme, setActiveColorTheme] = useState<'light' | 'dark'>('light');

  return (
    <CollapsibleSection
      title="Colores por Tema"
      icon="🎨"
      isOpen={isOpen}
      onToggle={onToggle}
      badge="Estilo"
    >
      <div className="space-y-4">
        {/* Selector de Tema para Colores - más compacto */}
        <div className="flex items-center justify-center">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
            <button
              onClick={() => setActiveColorTheme('light')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all duration-200 text-sm ${
                activeColorTheme === 'light'
                  ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              🌞 Claro
            </button>
            <button
              onClick={() => setActiveColorTheme('dark')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all duration-200 text-sm ${
                activeColorTheme === 'dark'
                  ? 'bg-gray-800 text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              🌙 Oscuro
            </button>
          </div>
        </div>
        
        {/* Configuración de Colores según el tema activo */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-3 text-sm">
            {activeColorTheme === 'light' ? '🌞 Colores para Tema Claro' : '🌙 Colores para Tema Oscuro'}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Color del Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color del Título
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={contactForm.styles?.[activeColorTheme]?.titleColor || (activeColorTheme === 'light' ? '#1f2937' : '#ffffff')}
                  onChange={(e) => updateContent(`contactForm.styles.${activeColorTheme}.titleColor`, e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={contactForm.styles?.[activeColorTheme]?.titleColor || (activeColorTheme === 'light' ? '#1f2937' : '#ffffff')}
                  onChange={(e) => updateContent(`contactForm.styles.${activeColorTheme}.titleColor`, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder={activeColorTheme === 'light' ? '#1f2937' : '#ffffff'}
                />
              </div>
            </div>

            {/* Color del Subtítulo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color del Subtítulo
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={contactForm.styles?.[activeColorTheme]?.subtitleColor || (activeColorTheme === 'light' ? '#6b7280' : '#d1d5db')}
                  onChange={(e) => updateContent(`contactForm.styles.${activeColorTheme}.subtitleColor`, e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={contactForm.styles?.[activeColorTheme]?.subtitleColor || (activeColorTheme === 'light' ? '#6b7280' : '#d1d5db')}
                  onChange={(e) => updateContent(`contactForm.styles.${activeColorTheme}.subtitleColor`, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder={activeColorTheme === 'light' ? '#6b7280' : '#d1d5db'}
                />
              </div>
            </div>

            {/* Color de la Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color de la Descripción
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={contactForm.styles?.[activeColorTheme]?.descriptionColor || (activeColorTheme === 'light' ? '#4b5563' : '#9ca3af')}
                  onChange={(e) => updateContent(`contactForm.styles.${activeColorTheme}.descriptionColor`, e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={contactForm.styles?.[activeColorTheme]?.descriptionColor || (activeColorTheme === 'light' ? '#4b5563' : '#9ca3af')}
                  onChange={(e) => updateContent(`contactForm.styles.${activeColorTheme}.descriptionColor`, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder={activeColorTheme === 'light' ? '#4b5563' : '#9ca3af'}
                />
              </div>
            </div>
          </div>
          
          {/* Botón de restablecer colores por defecto */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                // Restablecer colores por defecto para el tema activo
                const defaultColors = activeColorTheme === 'light' 
                  ? { titleColor: '#1f2937', subtitleColor: '#6b7280', descriptionColor: '#4b5563' }
                  : { titleColor: '#ffffff', subtitleColor: '#d1d5db', descriptionColor: '#9ca3af' };
                
                Object.entries(defaultColors).forEach(([key, value]) => {
                  updateContent(`contactForm.styles.${activeColorTheme}.${key}`, value);
                });
              }}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 text-sm"
            >
              🔄 Restablecer Colores por Defecto
            </button>
          </div>

          {/* Vista previa de colores */}
          <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              👁️ Vista Previa - {activeColorTheme === 'light' ? 'Tema Claro' : 'Tema Oscuro'}
            </h5>
            <div className="space-y-2">
              <div 
                className="text-sm font-medium"
                style={{ 
                  color: contactForm.styles?.[activeColorTheme]?.subtitleColor || (activeColorTheme === 'light' ? '#6b7280' : '#d1d5db')
                }}
              >
                Subtítulo de ejemplo
              </div>
              <div 
                className="text-xl font-bold"
                style={{ 
                  color: contactForm.styles?.[activeColorTheme]?.titleColor || (activeColorTheme === 'light' ? '#1f2937' : '#ffffff')
                }}
              >
                Título Principal de Ejemplo
              </div>
              <div 
                className="text-base"
                style={{ 
                  color: contactForm.styles?.[activeColorTheme]?.descriptionColor || (activeColorTheme === 'light' ? '#4b5563' : '#9ca3af')
                }}
              >
                Esta es una descripción de ejemplo para mostrar cómo se verán los colores en la página pública.
              </div>
            </div>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default ColorsSection;