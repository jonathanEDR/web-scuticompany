import React from 'react';
import CollapsibleSection from '../../ui/CollapsibleSection';
import type { ContactFormSectionProps } from '../types/ContactFormTypes';

interface FieldsSectionProps extends ContactFormSectionProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Sección de configuración de campos del formulario
 */
const FieldsSection: React.FC<FieldsSectionProps> = ({
  contactForm,
  updateContent,
  isOpen,
  onToggle
}) => {
  return (
    <CollapsibleSection
      title="Configuración de Campos"
      icon="📝"
      isOpen={isOpen}
      onToggle={onToggle}
      badge="Formulario"
    >
      <div className="space-y-4">
      
      {/* Campo Nombre */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-3">👤 Campo Nombre</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Etiqueta
            </label>
            <input
              type="text"
              value={contactForm.fields?.nombreLabel || ''}
              onChange={(e) => updateContent('contactForm.fields.nombreLabel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Nombre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Placeholder
            </label>
            <input
              type="text"
              value={contactForm.fields?.nombrePlaceholder || ''}
              onChange={(e) => updateContent('contactForm.fields.nombrePlaceholder', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Tu nombre completo"
            />
          </div>
        </div>
        <div className="mt-3">
          <label className="flex items-center text-sm text-gray-700 dark:text-gray-200">
            <input
              type="checkbox"
              checked={contactForm.fields?.nombreRequired ?? true}
              onChange={(e) => updateContent('contactForm.fields.nombreRequired', e.target.checked)}
              className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            Campo obligatorio
          </label>
        </div>
      </div>

      {/* Campo Celular */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-3">📱 Campo Celular</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Etiqueta
            </label>
            <input
              type="text"
              value={contactForm.fields?.celularLabel || ''}
              onChange={(e) => updateContent('contactForm.fields.celularLabel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Celular / Teléfono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Placeholder
            </label>
            <input
              type="text"
              value={contactForm.fields?.celularPlaceholder || ''}
              onChange={(e) => updateContent('contactForm.fields.celularPlaceholder', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="+51 999 999 999"
            />
          </div>
        </div>
        <div className="mt-3">
          <label className="flex items-center text-sm text-gray-700 dark:text-gray-200">
            <input
              type="checkbox"
              checked={contactForm.fields?.celularRequired ?? true}
              onChange={(e) => updateContent('contactForm.fields.celularRequired', e.target.checked)}
              className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            Campo obligatorio
          </label>
        </div>
      </div>

      {/* Campo Correo */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-3">✉️ Campo Correo</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Etiqueta
            </label>
            <input
              type="text"
              value={contactForm.fields?.correoLabel || ''}
              onChange={(e) => updateContent('contactForm.fields.correoLabel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Correo Electrónico"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Placeholder
            </label>
            <input
              type="text"
              value={contactForm.fields?.correoPlaceholder || ''}
              onChange={(e) => updateContent('contactForm.fields.correoPlaceholder', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="tu@email.com"
            />
          </div>
        </div>
        <div className="mt-3">
          <label className="flex items-center text-sm text-gray-700 dark:text-gray-200">
            <input
              type="checkbox"
              checked={contactForm.fields?.correoRequired ?? true}
              onChange={(e) => updateContent('contactForm.fields.correoRequired', e.target.checked)}
              className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            Campo obligatorio
          </label>
        </div>
      </div>

      {/* Campo Mensaje */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-3">💬 Campo Mensaje</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Etiqueta
            </label>
            <input
              type="text"
              value={contactForm.fields?.mensajeLabel || ''}
              onChange={(e) => updateContent('contactForm.fields.mensajeLabel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Cuéntanos sobre tu proyecto"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Placeholder
            </label>
            <input
              type="text"
              value={contactForm.fields?.mensajePlaceholder || ''}
              onChange={(e) => updateContent('contactForm.fields.mensajePlaceholder', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Describe tu proyecto, necesidades o consulta..."
            />
          </div>
        </div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center text-sm text-gray-700 dark:text-gray-200">
              <input
                type="checkbox"
                checked={contactForm.fields?.mensajeRequired ?? true}
                onChange={(e) => updateContent('contactForm.fields.mensajeRequired', e.target.checked)}
                className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              Campo obligatorio
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Filas del textarea
            </label>
            <input
              type="number"
              min="3"
              max="10"
              value={contactForm.fields?.mensajeRows || 5}
              onChange={(e) => updateContent('contactForm.fields.mensajeRows', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Términos y Condiciones */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
        <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-3">📋 Términos y Condiciones</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Texto de aceptación
            </label>
            <input
              type="text"
              value={contactForm.fields?.termsText || ''}
              onChange={(e) => updateContent('contactForm.fields.termsText', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Acepto la Política de Privacidad y Términos de Servicio"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Enlace a términos
              </label>
              <input
                type="text"
                value={contactForm.fields?.termsLink || ''}
                onChange={(e) => updateContent('contactForm.fields.termsLink', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="/terminos"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center text-sm text-gray-700 dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={contactForm.fields?.termsRequired ?? true}
                  onChange={(e) => updateContent('contactForm.fields.termsRequired', e.target.checked)}
                  className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                Aceptación obligatoria
              </label>
            </div>
          </div>
        </div>
      </div>
      </div>
    </CollapsibleSection>
  );
};

export default FieldsSection;