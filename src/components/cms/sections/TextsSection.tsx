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
      <div className="space-y-6">
        {/* Título Principal con Rich Text Editor */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-4">✏️ Título Principal</h4>
          <RichTextEditor
            value={contactForm.title || ''}
            onChange={(value) => updateContent('contactForm.title', value)}
            placeholder="Contáctanos"
            label="Contenido del título (admite formato rich text)"
          />
        </div>
        
        {/* Subtítulo con Rich Text Editor */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-4">🏷️ Subtítulo</h4>
          <RichTextEditor
            value={contactForm.subtitle || ''}
            onChange={(value) => updateContent('contactForm.subtitle', value)}
            placeholder="Estamos aquí para ayudarte"
            label="Contenido del subtítulo (admite formato rich text)"
          />
        </div>
        
        {/* Descripción con Rich Text Editor */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-4">📝 Descripción</h4>
          <RichTextEditor
            value={contactForm.description || ''}
            onChange={(value) => updateContent('contactForm.description', value)}
            placeholder="¿Tienes un proyecto en mente? Cuéntanos sobre él y te responderemos pronto."
            label="Contenido de la descripción (admite formato rich text)"
          />
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default TextsSection;