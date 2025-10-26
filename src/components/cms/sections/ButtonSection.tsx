import React from 'react';
import type { ContactFormSectionProps } from '../types/ContactFormTypes';

interface ButtonSectionProps extends ContactFormSectionProps {
  // Esta sección no usa CollapsibleSection porque no estaba envuelta
}

/**
 * Sección de configuración del botón del formulario
 */
const ButtonSection: React.FC<ButtonSectionProps> = ({
  contactForm,
  updateContent
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-2">
        🔘 Configuración del Botón
      </h3>
      
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Texto del botón
            </label>
            <input
              type="text"
              value={contactForm.button?.text || ''}
              onChange={(e) => updateContent('contactForm.button.text', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="ENVIAR"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Texto mientras envía
            </label>
            <input
              type="text"
              value={contactForm.button?.loadingText || ''}
              onChange={(e) => updateContent('contactForm.button.loadingText', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Enviando..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonSection;