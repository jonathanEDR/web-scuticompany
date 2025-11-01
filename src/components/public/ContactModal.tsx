/**
 * 💬 MODAL DE CONTACTO/COTIZACIÓN
 * Modal que contiene el formulario de contacto para solicitar cotizaciones
 * Reutiliza el componente ContactSection pero adaptado para modal
 */

import React, { useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useQuoteForm } from '../../hooks/useQuoteForm';
import { Modal } from '../common/Modal';

interface ContactModalData {
  title?: string;
  subtitle?: string;
  description?: string;
  fields?: {
    nombreLabel?: string;
    nombrePlaceholder?: string;
    nombreRequired?: boolean;
    celularLabel?: string;
    celularPlaceholder?: string;
    celularRequired?: boolean;
    correoLabel?: string;
    correoPlaceholder?: string;
    correoRequired?: boolean;
    mensajeLabel?: string;
    mensajePlaceholder?: string;
    mensajeRequired?: boolean;
    termsText?: string;
    termsRequired?: boolean;
  };
  button?: {
    text?: string;
    loadingText?: string;
  };
  messages?: {
    success?: string;
    error?: string;
  };
  styles?: {
    light?: {
      titleColor?: string;
      subtitleColor?: string;
      descriptionColor?: string;
      formBackground?: string;
      formBorder?: string;
      inputBackground?: string;
      inputBorder?: string;
      inputText?: string;
      inputFocusBorder?: string;
      labelColor?: string;
      buttonBackground?: string;
      buttonText?: string;
      successColor?: string;
      errorColor?: string;
    };
    dark?: {
      titleColor?: string;
      subtitleColor?: string;
      descriptionColor?: string;
      formBackground?: string;
      formBorder?: string;
      inputBackground?: string;
      inputBorder?: string;
      inputText?: string;
      inputFocusBorder?: string;
      labelColor?: string;
      buttonBackground?: string;
      buttonText?: string;
      successColor?: string;
      errorColor?: string;
    };
  };
}

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  servicioInfo?: {
    titulo?: string;
    descripcionCorta?: string;
    precio?: string;
    duracion?: string;
    categoria?: string;
  };
  data?: ContactModalData;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  servicioInfo,
  data = {}
}) => {
  const { theme: currentTheme } = useTheme();

  // Usar hook del formulario para cotización
  const {
    formData,
    errors,
    isLoading,
    isSuccess,
    isError,
    successMessage,
    errorMessage,
    handleChange,
    handleSubmit,
    resetForm,
    initializeMessage,
  } = useQuoteForm(() => {
    // Callback cuando se envía exitosamente - cerrar modal
    setTimeout(() => {
      onClose();
    }, 2000);
  });

  // Obtener estilos según el tema activo
  const currentStyles = data?.styles?.[currentTheme === 'light' ? 'light' : 'dark'];

  // Pre-llenar el mensaje con información del servicio cuando se abre el modal
  useEffect(() => {
    if (isOpen && servicioInfo?.titulo) {
      const mensajePrefijo = `Hola, estoy interesado en el servicio "${servicioInfo.titulo}"`;
      const mensajeCompleto = servicioInfo.descripcionCorta 
        ? `${mensajePrefijo}. ${servicioInfo.descripcionCorta}. Me gustaría recibir más información y una cotización personalizada.`
        : `${mensajePrefijo}. Me gustaría recibir más información y una cotización personalizada.`;
      
      initializeMessage(mensajeCompleto);
      
      // También configurar la categoría si está disponible
      if (servicioInfo.categoria) {
        handleChange('categoria', servicioInfo.categoria);
      }
    }
  }, [isOpen, servicioInfo?.titulo, servicioInfo?.categoria, initializeMessage, handleChange]);

  // Resetear formulario cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const modalTitle = data.title || (servicioInfo?.titulo 
    ? `Solicitar Cotización - ${servicioInfo.titulo}` 
    : 'Solicitar Cotización');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      size="md"
      className="contact-modal"
    >
      <div className="space-y-6">
        {/* Cabecera del modal */}
        <div className="text-center">
          {data?.subtitle && (
            <p 
              className="text-sm font-semibold tracking-wider uppercase mb-2"
              style={{ color: currentStyles?.subtitleColor || '#6b7280' }}
            >
              {data.subtitle}
            </p>
          )}
          
          {data?.description && (
            <p 
              className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto"
              style={{ color: currentStyles?.descriptionColor || '#4b5563' }}
            >
              {data.description}
            </p>
          )}

          {/* Información del servicio */}
          {servicioInfo && (
            <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700/50">
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                {servicioInfo.titulo}
              </h4>
              {servicioInfo.descripcionCorta && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {servicioInfo.descripcionCorta}
                </p>
              )}
              {(servicioInfo.precio || servicioInfo.duracion) && (
                <div className="flex gap-4 mt-2 text-xs">
                  {servicioInfo.precio && (
                    <span className="text-purple-600 dark:text-purple-400 font-medium">
                      💰 {servicioInfo.precio}
                    </span>
                  )}
                  {servicioInfo.duracion && (
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      ⏱️ {servicioInfo.duracion}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo: Nombre */}
          <div>
            <label 
              htmlFor="modal-nombre"
              className="block text-sm font-medium mb-2"
              style={{ color: currentStyles?.labelColor || '#374151' }}
            >
              {data?.fields?.nombreLabel || 'Nombre'}
              {(data?.fields?.nombreRequired !== false) && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              id="modal-nombre"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              placeholder={data?.fields?.nombrePlaceholder || 'Tu nombre completo'}
              required={data?.fields?.nombreRequired !== false}
              disabled={isLoading || isSuccess}
              className="w-full px-4 py-3 text-sm rounded-lg transition-all duration-300 outline-none focus:ring-2 focus:ring-purple-500"
              style={{
                background: currentStyles?.inputBackground || '#ffffff',
                border: `1px solid ${errors.nombre ? '#ef4444' : currentStyles?.inputBorder || '#e5e7eb'}`,
                color: currentStyles?.inputText || '#1f2937',
              }}
            />
            {errors.nombre && (
              <p className="mt-1 text-sm" style={{ color: currentStyles?.errorColor || '#ef4444' }}>
                {errors.nombre}
              </p>
            )}
          </div>

          {/* Campo: Celular */}
          <div>
            <label 
              htmlFor="modal-celular"
              className="block text-sm font-medium mb-2"
              style={{ color: currentStyles?.labelColor || '#374151' }}
            >
              {data?.fields?.celularLabel || 'Celular / Teléfono'}
              {(data?.fields?.celularRequired !== false) && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="tel"
              id="modal-celular"
              value={formData.celular}
              onChange={(e) => handleChange('celular', e.target.value)}
              placeholder={data?.fields?.celularPlaceholder || '+51 999 999 999'}
              required={data?.fields?.celularRequired !== false}
              disabled={isLoading || isSuccess}
              className="w-full px-4 py-3 text-sm rounded-lg transition-all duration-300 outline-none focus:ring-2 focus:ring-purple-500"
              style={{
                background: currentStyles?.inputBackground || '#ffffff',
                border: `1px solid ${errors.celular ? '#ef4444' : currentStyles?.inputBorder || '#e5e7eb'}`,
                color: currentStyles?.inputText || '#1f2937',
              }}
            />
            {errors.celular && (
              <p className="mt-1 text-sm" style={{ color: currentStyles?.errorColor || '#ef4444' }}>
                {errors.celular}
              </p>
            )}
          </div>

          {/* Campo: Correo */}
          <div>
            <label 
              htmlFor="modal-correo"
              className="block text-sm font-medium mb-2"
              style={{ color: currentStyles?.labelColor || '#374151' }}
            >
              {data?.fields?.correoLabel || 'Correo Electrónico'}
              {(data?.fields?.correoRequired !== false) && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="email"
              id="modal-correo"
              value={formData.correo}
              onChange={(e) => handleChange('correo', e.target.value)}
              placeholder={data?.fields?.correoPlaceholder || 'tu@email.com'}
              required={data?.fields?.correoRequired !== false}
              disabled={isLoading || isSuccess}
              className="w-full px-4 py-3 text-sm rounded-lg transition-all duration-300 outline-none focus:ring-2 focus:ring-purple-500"
              style={{
                background: currentStyles?.inputBackground || '#ffffff',
                border: `1px solid ${errors.correo ? '#ef4444' : currentStyles?.inputBorder || '#e5e7eb'}`,
                color: currentStyles?.inputText || '#1f2937',
              }}
            />
            {errors.correo && (
              <p className="mt-1 text-sm" style={{ color: currentStyles?.errorColor || '#ef4444' }}>
                {errors.correo}
              </p>
            )}
          </div>

          {/* Campo: Mensaje */}
          <div>
            <label 
              htmlFor="modal-mensaje"
              className="block text-sm font-medium mb-2"
              style={{ color: currentStyles?.labelColor || '#374151' }}
            >
              {data?.fields?.mensajeLabel || 'Cuéntanos sobre tu proyecto'}
              {(data?.fields?.mensajeRequired !== false) && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              id="modal-mensaje"
              value={formData.mensaje}
              onChange={(e) => handleChange('mensaje', e.target.value)}
              placeholder={data?.fields?.mensajePlaceholder || 'Describe tu proyecto, necesidades o consulta...'}
              required={data?.fields?.mensajeRequired !== false}
              disabled={isLoading || isSuccess}
              rows={4}
              className="w-full px-4 py-3 text-sm rounded-lg transition-all duration-300 outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              style={{
                background: currentStyles?.inputBackground || '#ffffff',
                border: `1px solid ${errors.mensaje ? '#ef4444' : currentStyles?.inputBorder || '#e5e7eb'}`,
                color: currentStyles?.inputText || '#1f2937',
              }}
            />
            {errors.mensaje && (
              <p className="mt-1 text-sm" style={{ color: currentStyles?.errorColor || '#ef4444' }}>
                {errors.mensaje}
              </p>
            )}
          </div>

          {/* Campo: Términos */}
          {data?.fields?.termsRequired && (
            <div className="flex items-start">
              <input
                type="checkbox"
                id="modal-acceptTerms"
                checked={formData.acceptTerms}
                onChange={(e) => handleChange('acceptTerms', e.target.checked)}
                disabled={isLoading || isSuccess}
                className="mt-1 mr-3 h-4 w-4 rounded"
                style={{
                  accentColor: currentStyles?.inputFocusBorder || '#8B5CF6',
                }}
              />
              <label 
                htmlFor="modal-acceptTerms"
                className="text-sm"
                style={{ color: currentStyles?.labelColor || '#374151' }}
              >
                {data.fields.termsText || 'Acepto la Política de Privacidad y Términos de Servicio'}
              </label>
            </div>
          )}
          {errors.acceptTerms && (
            <p className="text-sm" style={{ color: currentStyles?.errorColor || '#ef4444' }}>
              {errors.acceptTerms}
            </p>
          )}

          {/* Mensajes de estado */}
          {isSuccess && successMessage && (
            <div 
              className="p-4 rounded-lg text-center font-medium animate-fade-in"
              style={{
                background: currentStyles?.successColor ? `${currentStyles.successColor}15` : 'rgba(16, 185, 129, 0.1)',
                color: currentStyles?.successColor || '#10b981',
                border: `1px solid ${currentStyles?.successColor || '#10b981'}`,
              }}
            >
              ✅ {data?.messages?.success || successMessage}
            </div>
          )}

          {isError && errorMessage && !isSuccess && (
            <div 
              className="p-4 rounded-lg text-center font-medium animate-fade-in"
              style={{
                background: currentStyles?.errorColor ? `${currentStyles.errorColor}15` : 'rgba(239, 68, 68, 0.1)',
                color: currentStyles?.errorColor || '#ef4444',
                border: `1px solid ${currentStyles?.errorColor || '#ef4444'}`,
              }}
            >
              ❌ {data?.messages?.error || errorMessage}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                background: currentStyles?.buttonBackground || 'linear-gradient(90deg, #8B5CF6, #06B6D4)',
                color: currentStyles?.buttonText || '#ffffff',
              }}
            >
              {isLoading 
                ? (data?.button?.loadingText || 'Enviando...')
                : isSuccess
                ? '✓ Enviado'
                : (data?.button?.text || 'Enviar Solicitud')
              }
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ContactModal;