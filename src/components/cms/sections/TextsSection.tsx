import React from 'react';
import RichTextEditor from '../../RichTextEditor';
import CollapsibleSection from '../../ui/CollapsibleSection';
import type { ContactFormSectionProps } from '../types/ContactFormTypes';

interface TextsSectionProps extends ContactFormSectionProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Sección de configuración de textos principales del formulario
 */
const TextsSection: React.FC<TextsSectionProps> = ({
  contactForm,
  updateContent,
  isOpen,
  onToggle
}) => {
  return (
    <CollapsibleSection
      title="Textos Principales"
      icon="📋"
      isOpen={isOpen}
      onToggle={onToggle}
      badge="Básico"
    >
      <div className="space-y-4">
        {/* Layout compacto con grid para pantallas grandes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Título Principal con Rich Text Editor */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2 text-sm">✏️ Título Principal</h4>
            <RichTextEditor
              value={contactForm.title || ''}
              onChange={(value) => updateContent('contactForm.title', value)}
              placeholder="Contáctanos"
              label="Título del formulario"
            />
          </div>
          
          {/* Subtítulo con Rich Text Editor */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2 text-sm">🏷️ Subtítulo</h4>
            <RichTextEditor
              value={contactForm.subtitle || ''}
              onChange={(value) => updateContent('contactForm.subtitle', value)}
              placeholder="Estamos aquí para ayudarte"
              label="Subtítulo del formulario"
            />
          </div>
        </div>
        
        {/* Descripción con Rich Text Editor - ancho completo pero más compacta */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2 text-sm">📝 Descripción</h4>
          <RichTextEditor
            value={contactForm.description || ''}
            onChange={(value) => updateContent('contactForm.description', value)}
            placeholder="¿Tienes un proyecto en mente? Cuéntanos sobre él y te responderemos pronto."
            label="Descripción del formulario"
          />
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default TextsSection;