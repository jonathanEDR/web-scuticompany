import React from 'react';
import ManagedImageSelector from '../../ManagedImageSelector';
import type { ContactFormSectionProps } from '../types/ContactFormTypes';

interface BackgroundImageSectionProps extends ContactFormSectionProps {
  // Esta sección no usa CollapsibleSection porque no estaba envuelta
}

/**
 * Sección de configuración de imagen de fondo del formulario
 */
const BackgroundImageSection: React.FC<BackgroundImageSectionProps> = ({
  contactForm,
  updateContent,
  isDark
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-2">
        🖼️ Imagen de Fondo
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Imagen para Tema Claro */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Imagen - Tema Claro
          </label>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <ManagedImageSelector
              currentImage={contactForm.backgroundImage?.light || ''}
              onImageSelect={(imageUrl) => updateContent('contactForm.backgroundImage.light', imageUrl)}
              label="Fondo Tema Claro"
              description="Imagen que se mostrará cuando esté activo el tema claro"
              darkMode={isDark}
            />
          </div>
        </div>

        {/* Imagen para Tema Oscuro */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Imagen - Tema Oscuro
          </label>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <ManagedImageSelector
              currentImage={contactForm.backgroundImage?.dark || ''}
              onImageSelect={(imageUrl) => updateContent('contactForm.backgroundImage.dark', imageUrl)}
              label="Fondo Tema Oscuro"
              description="Imagen que se mostrará cuando esté activo el tema oscuro"
              darkMode={isDark}
            />
          </div>
        </div>
      </div>

      {/* Alt Text de la Imagen */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Alt Text de la Imagen
        </label>
        <input
          type="text"
          value={contactForm.backgroundImageAlt || ''}
          onChange={(e) => updateContent('contactForm.backgroundImageAlt', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          placeholder="Descripción de la imagen de fondo para accesibilidad"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Este texto será utilizado por lectores de pantalla y cuando la imagen no pueda cargarse
        </p>
      </div>

      {/* Consejos e Información */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center">
          💡 Sistema de Gestión de Imágenes
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
          <div>
            <p className="font-medium mb-2">✨ Características:</p>
            <ul className="space-y-1 text-xs">
              <li>• Galería organizada por categorías</li>
              <li>• Subida con optimización automática</li>
              <li>• Compresión inteligente de imágenes</li>
              <li>• Seguimiento de uso en el sitio</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">📋 Recomendaciones:</p>
            <ul className="space-y-1 text-xs">
              <li>• Resolución mínima: 1920x1080px</li>
              <li>• Formatos: .jpg, .webp, .png</li>
              <li>• Contraste adecuado con el texto</li>
              <li>• Tamaño máximo recomendado: 2MB</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundImageSection;