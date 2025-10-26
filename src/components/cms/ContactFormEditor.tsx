import React, { useState } from 'react';
import type { PageData } from '../../types/cms';
import ManagedImageSelector from '../ManagedImageSelector';
import RichTextEditor from '../RichTextEditor';
import { useTheme } from '../../contexts/ThemeContext';
import { parseGoogleMapsLink } from '../../utils/googleMapsUtils';
import GoogleMapsHelper from './GoogleMapsHelper';

interface ContactFormEditorProps {
  pageData: PageData;
  updateContent: (field: string, value: any) => void;
}

const ContactFormEditor: React.FC<ContactFormEditorProps> = ({
  pageData,
  updateContent
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const contactForm = pageData.content.contactForm;
  
  // Estado para el selector de tema para colores
  const [activeColorTheme, setActiveColorTheme] = useState<'light' | 'dark'>('light');

  // SOLUCIÓN: Inicializar styles automáticamente si no existen
  React.useEffect(() => {
    if (contactForm && !contactForm.styles) {
      // Forzar la creación de la estructura de styles
      updateContent('contactForm.styles.light.titleColor', '#1f2937');
    }
  }, [contactForm, updateContent]);

  if (!contactForm) {
    return (
      <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
        <div className="text-center text-gray-500 dark:text-gray-400">
          No se encontró configuración del formulario de contacto
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
        📝 Editor del Formulario de Contacto
      </h2>
      
      <div className="space-y-8">
        {/* Textos Principales */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-2">
            📋 Textos Principales
          </h3>
          
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

        {/* Colores por Tema */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-2">
              🎨 Colores por Tema
            </h3>
            
            {/* Selector de Tema para Colores */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setActiveColorTheme('light')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeColorTheme === 'light'
                    ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                🌞 Tema Claro
              </button>
              <button
                onClick={() => setActiveColorTheme('dark')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeColorTheme === 'dark'
                    ? 'bg-gray-800 text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                🌙 Tema Oscuro
              </button>
            </div>
          </div>
          
          {/* Configuración de Colores según el tema activo */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-4">
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

        {/* Configuración de Campos */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-2">
            📝 Configuración de Campos
          </h3>
          
          {/* Campo Nombre */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-3">👤 Campo Nombre</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Etiqueta
                </label>
                <input
                  type="text"
                  value={contactForm.fields?.nombreLabel || ''}
                  onChange={(e) => updateContent('contactForm.fields.nombreLabel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Nombre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Placeholder
                </label>
                <input
                  type="text"
                  value={contactForm.fields?.nombrePlaceholder || ''}
                  onChange={(e) => updateContent('contactForm.fields.nombrePlaceholder', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Etiqueta
                </label>
                <input
                  type="text"
                  value={contactForm.fields?.celularLabel || ''}
                  onChange={(e) => updateContent('contactForm.fields.celularLabel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Celular / Teléfono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Placeholder
                </label>
                <input
                  type="text"
                  value={contactForm.fields?.celularPlaceholder || ''}
                  onChange={(e) => updateContent('contactForm.fields.celularPlaceholder', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Etiqueta
                </label>
                <input
                  type="text"
                  value={contactForm.fields?.correoLabel || ''}
                  onChange={(e) => updateContent('contactForm.fields.correoLabel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Correo Electrónico"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Placeholder
                </label>
                <input
                  type="text"
                  value={contactForm.fields?.correoPlaceholder || ''}
                  onChange={(e) => updateContent('contactForm.fields.correoPlaceholder', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Etiqueta
                </label>
                <input
                  type="text"
                  value={contactForm.fields?.mensajeLabel || ''}
                  onChange={(e) => updateContent('contactForm.fields.mensajeLabel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Cuéntanos sobre tu proyecto"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Placeholder
                </label>
                <input
                  type="text"
                  value={contactForm.fields?.mensajePlaceholder || ''}
                  onChange={(e) => updateContent('contactForm.fields.mensajePlaceholder', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Filas del textarea
                </label>
                <input
                  type="number"
                  min="3"
                  max="10"
                  value={contactForm.fields?.mensajeRows || 5}
                  onChange={(e) => updateContent('contactForm.fields.mensajeRows', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Términos y Condiciones */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-3">📋 Términos y Condiciones</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Texto de aceptación
                </label>
                <input
                  type="text"
                  value={contactForm.fields?.termsText || ''}
                  onChange={(e) => updateContent('contactForm.fields.termsText', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Acepto la Política de Privacidad y Términos de Servicio"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Enlace a términos
                  </label>
                  <input
                    type="text"
                    value={contactForm.fields?.termsLink || ''}
                    onChange={(e) => updateContent('contactForm.fields.termsLink', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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

        {/* Configuración del Botón */}
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

        {/* Mensajes de Respuesta */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-2">
            💬 Mensajes de Respuesta
          </h3>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Mensaje de éxito
              </label>
              <textarea
                value={contactForm.messages?.success || ''}
                onChange={(e) => updateContent('contactForm.messages.success', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                placeholder="¡Gracias por contactarnos! Te responderemos pronto."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Mensaje de error
              </label>
              <textarea
                value={contactForm.messages?.error || ''}
                onChange={(e) => updateContent('contactForm.messages.error', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                placeholder="Hubo un error al enviar el mensaje. Por favor, intenta nuevamente."
              />
            </div>
          </div>
        </div>

        {/* Imagen de Fondo */}
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

        {/* Configuración del Mapa */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
            🗺️ Configuración del Mapa
          </h3>
          
          <div className="space-y-4">
            {/* Habilitar/Deshabilitar mapa */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Mostrar Mapa de Ubicación
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Muestra un mapa interactivo junto al formulario
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={contactForm.map?.enabled || false}
                  onChange={(e) => updateContent('contactForm.map.enabled', e.target.checked)}
                  className="sr-only"
                />
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  contactForm.map?.enabled
                    ? 'bg-green-600' 
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    contactForm.map?.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
              </label>
            </div>

            {/* Configuraciones del mapa (solo si está habilitado) */}
            {contactForm.map?.enabled && (
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                
                {/* Enlace de Google Maps */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    🔗 Enlace de Google Maps
                  </label>
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={contactForm.map?.googleMapsUrl || ''}
                      onChange={(e) => {
                        const url = e.target.value;
                        updateContent('contactForm.map.googleMapsUrl', url);
                        
                        // Extraer coordenadas automáticamente si el enlace es válido
                        if (url) {
                          const result = parseGoogleMapsLink(url);
                          if (result.isValid && result.coordinates) {
                            updateContent('contactForm.map.latitude', result.coordinates.latitude);
                            updateContent('contactForm.map.longitude', result.coordinates.longitude);
                            if (result.coordinates.companyName) {
                              updateContent('contactForm.map.companyName', result.coordinates.companyName);
                            }
                          }
                        }
                      }}
                      className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="https://www.google.com/maps/place/Tu+Empresa/@-12.0464,-77.0428,17z"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Pega aquí el enlace de tu negocio desde Google Maps. Las coordenadas se extraerán automáticamente.
                    </p>
                  </div>
                  
                  {/* Helper con guía paso a paso */}
                  <GoogleMapsHelper 
                    onUrlChange={(url) => {
                      updateContent('contactForm.map.googleMapsUrl', url);
                      const result = parseGoogleMapsLink(url);
                      if (result.isValid && result.coordinates) {
                        updateContent('contactForm.map.latitude', result.coordinates.latitude);
                        updateContent('contactForm.map.longitude', result.coordinates.longitude);
                        if (result.coordinates.companyName) {
                          updateContent('contactForm.map.companyName', result.coordinates.companyName);
                        }
                      }
                    }}
                  />
                </div>

                {/* Vista de coordenadas extraídas (solo lectura) */}
                {(contactForm.map?.latitude && contactForm.map?.longitude) && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                    <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2 flex items-center">
                      ✅ Coordenadas Detectadas
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-green-700 dark:text-green-300 font-medium">Latitud:</span>
                        <span className="ml-2 text-green-900 dark:text-green-100">{contactForm.map.latitude}</span>
                      </div>
                      <div>
                        <span className="text-green-700 dark:text-green-300 font-medium">Longitud:</span>
                        <span className="ml-2 text-green-900 dark:text-green-100">{contactForm.map.longitude}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Información de la ubicación */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Nombre de la Empresa
                    </label>
                    <input
                      type="text"
                      value={contactForm.map?.companyName || ''}
                      onChange={(e) => updateContent('contactForm.map.companyName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Nombre de tu empresa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={contactForm.map?.address || ''}
                      onChange={(e) => updateContent('contactForm.map.address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Dirección completa"
                    />
                  </div>
                </div>

                {/* Configuraciones visuales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Zoom del Mapa
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="20"
                      value={contactForm.map?.zoom || 15}
                      onChange={(e) => updateContent('contactForm.map.zoom', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Nivel: {contactForm.map?.zoom || 15}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Altura del Mapa
                    </label>
                    <select
                      value={contactForm.map?.height || '400px'}
                      onChange={(e) => updateContent('contactForm.map.height', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="300px">Pequeña (300px)</option>
                      <option value="400px">Mediana (400px)</option>
                      <option value="500px">Grande (500px)</option>
                      <option value="600px">Extra Grande (600px)</option>
                    </select>
                  </div>
                </div>

                {/* Colores del marcador */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Color del Marcador
                    </label>
                    <input
                      type="color"
                      value={contactForm.map?.markerColor || '#8B5CF6'}
                      onChange={(e) => updateContent('contactForm.map.markerColor', e.target.value)}
                      className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Color del Pulso (Radar)
                    </label>
                    <input
                      type="color"
                      value={contactForm.map?.pulseColor || '#8B5CF6'}
                      onChange={(e) => updateContent('contactForm.map.pulseColor', e.target.value)}
                      className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Guía paso a paso */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-sm">
              <h4 className="text-blue-800 dark:text-blue-200 font-medium mb-3 flex items-center">
                � Cómo configurar tu mapa en 3 pasos:
              </h4>
              <div className="space-y-3 text-blue-700 dark:text-blue-300">
                <div className="flex items-start gap-2">
                  <span className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                  <div>
                    <p className="font-medium">Busca tu negocio en Google Maps</p>
                    <p className="text-xs">Ve a maps.google.com y busca tu empresa</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                  <div>
                    <p className="font-medium">Copia el enlace de la ubicación</p>
                    <p className="text-xs">Haz clic en "Compartir" y copia el enlace</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                  <div>
                    <p className="font-medium">Pega el enlace aquí arriba</p>
                    <p className="text-xs">Las coordenadas se configurarán automáticamente</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vista Previa */}
        <div className="bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
            👀 Vista Previa del Formulario
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
            <div className="text-center mb-6">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {contactForm.title || 'Título del formulario'}
              </h4>
              <h5 className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                {contactForm.subtitle || 'Subtítulo del formulario'}
              </h5>
              <p className="text-gray-600 dark:text-gray-400">
                {contactForm.description || 'Descripción del formulario'}
              </p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  {contactForm.fields?.nombreLabel || 'Nombre'} 
                  {contactForm.fields?.nombreRequired && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  disabled
                  placeholder={contactForm.fields?.nombrePlaceholder || 'Placeholder del nombre'}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  {contactForm.fields?.celularLabel || 'Celular'}
                  {contactForm.fields?.celularRequired && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  disabled
                  placeholder={contactForm.fields?.celularPlaceholder || 'Placeholder del celular'}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  {contactForm.fields?.correoLabel || 'Correo'}
                  {contactForm.fields?.correoRequired && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="email"
                  disabled
                  placeholder={contactForm.fields?.correoPlaceholder || 'Placeholder del correo'}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  {contactForm.fields?.mensajeLabel || 'Mensaje'}
                  {contactForm.fields?.mensajeRequired && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  disabled
                  rows={contactForm.fields?.mensajeRows || 5}
                  placeholder={contactForm.fields?.mensajePlaceholder || 'Placeholder del mensaje'}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 resize-none"
                />
              </div>
              
              {contactForm.fields?.termsRequired && (
                <div>
                  <label className="flex items-start text-sm text-gray-700 dark:text-gray-200">
                    <input
                      type="checkbox"
                      disabled
                      className="mr-2 h-4 w-4 mt-1 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span>
                      {contactForm.fields?.termsText || 'Texto de términos y condiciones'}
                    </span>
                  </label>
                </div>
              )}
              
              <button
                disabled
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors cursor-not-allowed opacity-75"
              >
                {contactForm.button?.text || 'Texto del botón'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactFormEditor;