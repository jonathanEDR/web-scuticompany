import React from 'react';
import type { PageData } from '../../types/cms';
import ManagedImageSelector from '../ManagedImageSelector';
import { useTheme } from '../../contexts/ThemeContext';

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
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-2">
            📋 Textos Principales
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Título Principal
              </label>
              <input
                type="text"
                value={contactForm.title || ''}
                onChange={(e) => updateContent('contactForm.title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Contáctanos"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Subtítulo
              </label>
              <input
                type="text"
                value={contactForm.subtitle || ''}
                onChange={(e) => updateContent('contactForm.subtitle', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Estamos aquí para ayudarte"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Descripción
              </label>
              <textarea
                value={contactForm.description || ''}
                onChange={(e) => updateContent('contactForm.description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                placeholder="¿Tienes un proyecto en mente? Cuéntanos sobre él y te responderemos pronto."
              />
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