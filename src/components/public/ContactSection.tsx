import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useContactForm } from '../../hooks/useContactForm';
import SimpleGoogleMap from './SimpleGoogleMap';

interface ContactFormData {
  title: string;
  subtitle: string;
  description: string;
  cardsDesign?: {
    light: {
      background: string;
      border: string;
      borderWidth: string;
      shadow: string;
      hoverBackground: string;
      hoverBorder: string;
      hoverShadow: string;
      iconGradient: string;
      iconBackground: string;
      iconColor: string;
      titleColor: string;
      descriptionColor: string;
      linkColor: string;
      cardMinWidth?: string;
      cardMaxWidth?: string;
      cardMinHeight?: string;
      cardPadding?: string;
      cardsAlignment?: 'left' | 'center' | 'right';
      iconBorderEnabled?: boolean;
      iconAlignment?: 'left' | 'center' | 'right';
    };
    dark: {
      background: string;
      border: string;
      borderWidth: string;
      shadow: string;
      hoverBackground: string;
      hoverBorder: string;
      hoverShadow: string;
      iconGradient: string;
      iconBackground: string;
      iconColor: string;
      titleColor: string;
      descriptionColor: string;
      linkColor: string;
      cardMinWidth?: string;
      cardMaxWidth?: string;
      cardMinHeight?: string;
      cardPadding?: string;
      cardsAlignment?: 'left' | 'center' | 'right';
      iconBorderEnabled?: boolean;
      iconAlignment?: 'left' | 'center' | 'right';
    };
  };
  fields: {
    nombreLabel: string;
    nombrePlaceholder: string;
    nombreRequired: boolean;
    celularLabel: string;
    celularPlaceholder: string;
    celularRequired: boolean;
    correoLabel: string;
    correoPlaceholder: string;
    correoRequired: boolean;
    mensajeLabel: string;
    mensajePlaceholder: string;
    mensajeRequired: boolean;
    mensajeRows: number;
    termsText: string;
    termsLink: string;
    termsRequired: boolean;
  };
  button: {
    text: string;
    loadingText: string;
  };
  messages: {
    success: string;
    error: string;
  };
  backgroundImage?: {
    light?: string;
    dark?: string;
  };
  backgroundImageAlt?: string;
  styles: {
    light: {
      titleColor: string;
      subtitleColor: string;
      descriptionColor: string;
      formBackground: string;
      formBorder: string;
      formShadow: string;
      inputBackground: string;
      inputBorder: string;
      inputText: string;
      inputPlaceholder: string;
      inputFocusBorder: string;
      labelColor: string;
      buttonBackground: string;
      buttonText: string;
      buttonHoverBackground: string;
      successColor: string;
      errorColor: string;
    };
    dark: {
      titleColor: string;
      subtitleColor: string;
      descriptionColor: string;
      formBackground: string;
      formBorder: string;
      formShadow: string;
      inputBackground: string;
      inputBorder: string;
      inputText: string;
      inputPlaceholder: string;
      inputFocusBorder: string;
      labelColor: string;
      buttonBackground: string;
      buttonText: string;
      buttonHoverBackground: string;
      successColor: string;
      errorColor: string;
    };
  };
  layout: {
    maxWidth: string;
    padding: string;
    borderRadius: string;
    gap: string;
  };
  map?: {
    enabled: boolean;
    googleMapsUrl: string;
    latitude: number;
    longitude: number;
    zoom: number;
    height: string;
    companyName: string;
    address: string;
    markerColor: string;
    pulseColor: string;
  };
  enabled: boolean;
}

interface ContactSectionProps {
  data?: ContactFormData;
}

const ContactSection = ({ data }: ContactSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const { theme: currentTheme } = useTheme();

  // Obtener imagen de fondo según el tema actual
  const currentBackground = data?.backgroundImage?.[currentTheme === 'light' ? 'light' : 'dark'];

  // Usar hook del formulario
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
  } = useContactForm();

  // Obtener estilos según el tema activo
  const currentStyles = data?.styles?.[currentTheme === 'light' ? 'light' : 'dark'];
  const currentCardsDesign = data?.cardsDesign?.[currentTheme === 'light' ? 'light' : 'dark'];
  // currentBackground ya está declarado arriba con los logs
  


  // Animación de entrada
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Si el formulario está deshabilitado, no renderizar
  if (data && !data.enabled) {
    return null;
  }

  // Estilos de la sección con imagen de fondo
  const sectionStyles = {
    backgroundImage: currentBackground ? `url(${currentBackground})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  return (
    <section
      id="contacto"
      className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden"
      style={sectionStyles}
    >
      {/* Overlay removido para mostrar imagen de fondo sin filtros */}
      
      {/* Fondo por defecto si no hay imagen */}
      {!currentBackground && (
        <div 
          className="absolute inset-0"
          style={{
            background: currentTheme === 'light'
              ? 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
              : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          }}
        />
      )}

      {/* Contenido */}
      <div 
        className={`
          relative z-10 w-full transition-all duration-1000
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        `}
        style={{ maxWidth: data?.map?.enabled ? '1400px' : (data?.layout?.maxWidth || '600px') }}
      >
        {/* Cabecera */}
        <div className="text-center mb-8">
          {data?.subtitle && (
            <p 
              className="text-sm font-semibold tracking-wider uppercase mb-2"
              style={{ color: currentStyles?.subtitleColor || '#6b7280' }}
            >
              {data.subtitle}
            </p>
          )}
          
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: currentStyles?.titleColor || currentCardsDesign?.titleColor || '#1f2937' }}
          >
            {data?.title || 'Contáctanos'}
          </h2>
          
          {data?.description && (
            <p 
              className="text-lg"
              style={{ color: currentStyles?.descriptionColor || currentCardsDesign?.descriptionColor || '#4b5563' }}
            >
              {data.description}
            </p>
          )}
        </div>

        {/* Contenido principal: Formulario + Mapa */}
        <div className={`grid gap-8 ${data?.map?.enabled ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} items-start`}>
          
          {/* Formulario */}
          <div 
            className="transition-all duration-300 hover:shadow-lg"
            style={{
              background: currentCardsDesign?.background || currentStyles?.formBackground || 'rgba(255, 255, 255, 0.95)',
              border: `${currentCardsDesign?.borderWidth || '1px'} solid ${currentCardsDesign?.border || currentStyles?.formBorder || 'rgba(0, 0, 0, 0.1)'}`,
              borderRadius: data?.layout?.borderRadius || '1rem',
              boxShadow: currentCardsDesign?.shadow || currentStyles?.formShadow || '0 10px 40px rgba(0, 0, 0, 0.1)',
              padding: currentCardsDesign?.cardPadding || data?.layout?.padding || '3rem',
              minWidth: currentCardsDesign?.cardMinWidth || 'auto',
              maxWidth: currentCardsDesign?.cardMaxWidth || 'none',
              minHeight: currentCardsDesign?.cardMinHeight || 'auto',
            }}
            onMouseEnter={(e) => {
              if (currentCardsDesign?.hoverBackground) {
                e.currentTarget.style.background = currentCardsDesign.hoverBackground;
              }
              if (currentCardsDesign?.hoverBorder) {
                e.currentTarget.style.borderColor = currentCardsDesign.hoverBorder;
              }
              if (currentCardsDesign?.hoverShadow) {
                e.currentTarget.style.boxShadow = currentCardsDesign.hoverShadow;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = currentCardsDesign?.background || currentStyles?.formBackground || 'rgba(255, 255, 255, 0.95)';
              e.currentTarget.style.borderColor = currentCardsDesign?.border || currentStyles?.formBorder || 'rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.boxShadow = currentCardsDesign?.shadow || currentStyles?.formShadow || '0 10px 40px rgba(0, 0, 0, 0.1)';
            }}
          >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo: Nombre */}
            <div>
              <label 
                htmlFor="nombre"
                className="block text-sm font-medium mb-2"
                style={{ color: currentStyles?.labelColor || '#374151' }}
              >
                {data?.fields?.nombreLabel || 'Nombre'}
                {data?.fields?.nombreRequired && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                placeholder={data?.fields?.nombrePlaceholder || 'Tu nombre completo'}
                required={data?.fields?.nombreRequired}
                disabled={isLoading || isSuccess}
                className="w-full px-4 py-3 rounded-lg transition-all duration-300 outline-none focus:ring-2"
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
                htmlFor="celular"
                className="block text-sm font-medium mb-2"
                style={{ color: currentStyles?.labelColor || '#374151' }}
              >
                {data?.fields?.celularLabel || 'Celular / Teléfono'}
                {data?.fields?.celularRequired && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="tel"
                id="celular"
                value={formData.celular}
                onChange={(e) => handleChange('celular', e.target.value)}
                placeholder={data?.fields?.celularPlaceholder || '+51 999 999 999'}
                required={data?.fields?.celularRequired}
                disabled={isLoading || isSuccess}
                className="w-full px-4 py-3 rounded-lg transition-all duration-300 outline-none focus:ring-2"
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
                htmlFor="correo"
                className="block text-sm font-medium mb-2"
                style={{ color: currentStyles?.labelColor || '#374151' }}
              >
                {data?.fields?.correoLabel || 'Correo Electrónico'}
                {data?.fields?.correoRequired && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="email"
                id="correo"
                value={formData.correo}
                onChange={(e) => handleChange('correo', e.target.value)}
                placeholder={data?.fields?.correoPlaceholder || 'tu@email.com'}
                required={data?.fields?.correoRequired}
                disabled={isLoading || isSuccess}
                className="w-full px-4 py-3 rounded-lg transition-all duration-300 outline-none focus:ring-2"
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
                htmlFor="mensaje"
                className="block text-sm font-medium mb-2"
                style={{ color: currentStyles?.labelColor || '#374151' }}
              >
                {data?.fields?.mensajeLabel || 'Cuéntanos sobre tu proyecto'}
                {data?.fields?.mensajeRequired && <span className="text-red-500 ml-1">*</span>}
              </label>
              <textarea
                id="mensaje"
                value={formData.mensaje}
                onChange={(e) => handleChange('mensaje', e.target.value)}
                placeholder={data?.fields?.mensajePlaceholder || 'Describe tu proyecto, necesidades o consulta...'}
                required={data?.fields?.mensajeRequired}
                disabled={isLoading || isSuccess}
                rows={data?.fields?.mensajeRows || 5}
                className="w-full px-4 py-3 rounded-lg transition-all duration-300 outline-none focus:ring-2 resize-none"
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
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleChange('acceptTerms', e.target.checked)}
                  disabled={isLoading || isSuccess}
                  className="mt-1 mr-3 h-4 w-4 rounded"
                  style={{
                    accentColor: currentStyles?.inputFocusBorder || '#8B5CF6',
                  }}
                />
                <label 
                  htmlFor="acceptTerms"
                  className="text-sm"
                  style={{ color: currentStyles?.labelColor || '#374151' }}
                >
                  {data.fields.termsText || 'Acepto la Política de Privacidad y Términos de Servicio'}
                  {data.fields.termsLink && (
                    <Link 
                      to={data.fields.termsLink} 
                      className="ml-1 underline hover:opacity-80"
                      style={{ color: currentStyles?.inputFocusBorder || '#8B5CF6' }}
                    >
                      Ver términos
                    </Link>
                  )}
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

            {/* Botón de envío */}
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                background: currentStyles?.buttonBackground || 'linear-gradient(90deg, #8B5CF6, #06B6D4)',
                color: currentStyles?.buttonText || '#ffffff',
              }}
            >
              {isLoading 
                ? (data?.button?.loadingText || 'Enviando...')
                : isSuccess
                ? '✓ Enviado'
                : (data?.button?.text || 'ENVIAR')
              }
            </button>
          </form>
          </div>

          {/* Mapa de Google (solo si está habilitado) */}
          {data?.map?.enabled && (
            <div className="flex items-center lg:sticky lg:top-8">
              <SimpleGoogleMap
                googleMapsUrl={data.map.googleMapsUrl || ''}
                height={data.map.height || '400px'}
                companyName={data.map.companyName || 'Nuestra Ubicación'}
                address={data.map.address || ''}
                borderRadius={data?.layout?.borderRadius || '1rem'}
              />
            </div>
          )}
          
          {/* Debug: Mostrar si el mapa NO está habilitado */}
          {!data?.map?.enabled && (
            <div className="w-full bg-yellow-200 border-2 border-yellow-500 p-4 text-sm">
              DEBUG: Mapa NO habilitado. data.map = {JSON.stringify(data?.map)}
            </div>
          )}

        </div>

      </div>
    </section>
  );
};

export default ContactSection;
