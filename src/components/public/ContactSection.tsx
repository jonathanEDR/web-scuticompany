import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useContactForm } from '../../hooks/useContactForm';
import SimpleGoogleMap from './SimpleGoogleMap';
import type { Categoria } from '../../services/categoriasApi';

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
    categoriaLabel?: string;
    categoriaPlaceholder?: string;
    categoriaRequired?: boolean;
    categoriaEnabled?: boolean;
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
    width?: string;  // 🆕 NUEVO - Ancho personalizado
    aspectRatio?: 'square' | 'landscape' | 'portrait' | 'custom'; // 🆕 NUEVO - Proporción
    alignment?: 'left' | 'center' | 'right' | 'full'; // 🆕 NUEVO - Alineación
    containerSize?: 'small' | 'medium' | 'large' | 'xl'; // 🆕 NUEVO - Tamaño predefinido
    companyName: string;
    address: string;
    markerColor: string;
    pulseColor: string;
    customLogo?: string; // 🆕 NUEVO - URL del logo personalizado
    logoSize?: 'small' | 'medium' | 'large'; // 🆕 NUEVO - Tamaño del logo
    showCompanyName?: boolean; // 🆕 NUEVO - Mostrar nombre de empresa
    borderRadius?: string; // 🆕 NUEVO - Radio de borde personalizado
    shadow?: 'none' | 'small' | 'medium' | 'large'; // 🆕 NUEVO - Sombra
    markerBackground?: string; // 🆕 NUEVO - Color de fondo del marcador
    markerBorderColor?: string; // 🆕 NUEVO - Color del borde del marcador
    markerBorderWidth?: string; // 🆕 NUEVO - Grosor del borde del marcador
    markerStyle?: 'solid' | 'gradient' | 'custom'; // 🆕 NUEVO - Estilo del fondo
    pulseIntensity?: 'none' | 'low' | 'medium' | 'high' | 'extreme'; // 🆕 NUEVO - Intensidad del pulso
    pulseSpeed?: 'slow' | 'normal' | 'fast' | 'ultra'; // 🆕 NUEVO - Velocidad del pulso
    hoverEffect?: 'none' | 'glow' | 'electric' | 'rainbow' | 'shake'; // 🆕 NUEVO - Efecto al hacer hover
    animationEnabled?: boolean; // 🆕 NUEVO - Habilitar/deshabilitar animaciones
  };
  enabled: boolean;
}

interface ContactSectionProps {
  data?: ContactFormData;
  categorias?: Categoria[];
}

const ContactSection = ({ data, categorias = [] }: ContactSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<string>('');
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
      className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden"
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
          relative z-10 w-full transition-all duration-1000 px-2 sm:px-4
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        `}
        style={{ maxWidth: data?.map?.enabled ? '1400px' : (data?.layout?.maxWidth || '600px') }}
      >
        {/* Cabecera */}
        <div className="text-center mb-8">
          {data?.subtitle && (
            <p 
              className="text-xs font-semibold tracking-wider uppercase mb-2"
              style={{ color: currentStyles?.subtitleColor || '#6b7280' }}
            >
              {data.subtitle}
            </p>
          )}
          
          <h2 
            className="text-2xl md:text-3xl font-bold mb-3"
            style={{ color: currentStyles?.titleColor || currentCardsDesign?.titleColor || '#1f2937' }}
          >
            {data?.title || 'Contáctanos'}
          </h2>
          
          {data?.description && (
            <p 
              className="text-sm max-w-2xl mx-auto"
              style={{ color: currentStyles?.descriptionColor || currentCardsDesign?.descriptionColor || '#4b5563' }}
            >
              {data.description}
            </p>
          )}
        </div>

        {/* Contenido principal: Formulario + Mapa */}
        <div className={`grid gap-6 lg:gap-4 ${data?.map?.enabled ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-lg mx-auto'} items-start justify-items-center`}>
          
          {/* Formulario */}
          <div 
            className="w-full max-w-md mx-auto transition-all duration-300 hover:shadow-lg"
            style={{
              background: currentCardsDesign?.background || currentStyles?.formBackground || 'rgba(255, 255, 255, 0.95)',
              border: `${currentCardsDesign?.borderWidth || '1px'} solid ${currentCardsDesign?.border || currentStyles?.formBorder || 'rgba(0, 0, 0, 0.1)'}`,
              borderRadius: data?.layout?.borderRadius || '0.75rem',
              boxShadow: currentCardsDesign?.shadow || currentStyles?.formShadow || '0 8px 32px rgba(0, 0, 0, 0.1)',
              padding: currentCardsDesign?.cardPadding || data?.layout?.padding || '1.5rem',
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
          <form id="formulario" onSubmit={handleSubmit} className="space-y-4">
            {/* Campo: Nombre */}
            <div>
              <label 
                htmlFor="nombre"
                className="block text-xs font-medium mb-1"
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
                className="w-full px-3 py-2 text-sm rounded-md transition-all duration-300 outline-none focus:ring-2"
                style={{
                  background: currentStyles?.inputBackground || '#ffffff',
                  border: `1px solid ${errors.nombre ? '#ef4444' : currentStyles?.inputBorder || '#e5e7eb'}`,
                  color: currentStyles?.inputText || '#1f2937',
                }}
              />
              {errors.nombre && (
                <p className="mt-1 text-xs" style={{ color: currentStyles?.errorColor || '#ef4444' }}>
                  {errors.nombre}
                </p>
              )}
            </div>

            {/* Campo: Celular */}
            <div>
              <label 
                htmlFor="celular"
                className="block text-xs font-medium mb-1"
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
                className="w-full px-3 py-2 text-sm rounded-md transition-all duration-300 outline-none focus:ring-2"
                style={{
                  background: currentStyles?.inputBackground || '#ffffff',
                  border: `1px solid ${errors.celular ? '#ef4444' : currentStyles?.inputBorder || '#e5e7eb'}`,
                  color: currentStyles?.inputText || '#1f2937',
                }}
              />
              {errors.celular && (
                <p className="mt-1 text-xs" style={{ color: currentStyles?.errorColor || '#ef4444' }}>
                  {errors.celular}
                </p>
              )}
            </div>

            {/* Campo: Correo */}
            <div>
              <label 
                htmlFor="correo"
                className="block text-xs font-medium mb-1"
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
                className="w-full px-3 py-2 text-sm rounded-md transition-all duration-300 outline-none focus:ring-2"
                style={{
                  background: currentStyles?.inputBackground || '#ffffff',
                  border: `1px solid ${errors.correo ? '#ef4444' : currentStyles?.inputBorder || '#e5e7eb'}`,
                  color: currentStyles?.inputText || '#1f2937',
                }}
              />
              {errors.correo && (
                <p className="mt-1 text-xs" style={{ color: currentStyles?.errorColor || '#ef4444' }}>
                  {errors.correo}
                </p>
              )}
            </div>

            {/* Campo: Categoría de Interés (opcional) */}
            {data?.fields?.categoriaEnabled && categorias.length > 0 && (
              <div>
                <label 
                  htmlFor="categoria"
                  className="block text-xs font-medium mb-1"
                  style={{ color: currentStyles?.labelColor || '#374151' }}
                >
                  {data?.fields?.categoriaLabel || 'Servicio de Interés'}
                  {data?.fields?.categoriaRequired && <span className="text-red-500 ml-1">*</span>}
                </label>
                <select
                  id="categoria"
                  value={selectedCategoria}
                  onChange={(e) => {
                    setSelectedCategoria(e.target.value);
                    handleChange('categoria', e.target.value);
                    
                    // Actualizar el mensaje con la categoría seleccionada
                    if (e.target.value) {
                      const categoria = categorias.find(c => c.slug === e.target.value);
                      if (categoria) {
                        const mensajeBase = formData.mensaje.replace(/Estoy interesado en: .+?\.\s*/g, '');
                        const nuevoMensaje = `Estoy interesado en: ${categoria.nombre}. ${mensajeBase}`.trim();
                        handleChange('mensaje', nuevoMensaje);
                      }
                    }
                  }}
                  required={data?.fields?.categoriaRequired}
                  disabled={isLoading || isSuccess}
                  className="w-full px-3 py-2 text-sm rounded-md transition-all duration-300 outline-none focus:ring-2"
                  style={{
                    background: currentStyles?.inputBackground || '#ffffff',
                    border: `1px solid ${currentStyles?.inputBorder || '#e5e7eb'}`,
                    color: currentStyles?.inputText || '#1f2937',
                  }}
                >
                  <option value="">
                    {data?.fields?.categoriaPlaceholder || 'Selecciona un tipo de servicio'}
                  </option>
                  {categorias.map(categoria => (
                    <option key={categoria._id} value={categoria.slug}>
                      {categoria.icono} {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Campo: Mensaje */}
            <div>
              <label 
                htmlFor="mensaje"
                className="block text-xs font-medium mb-1"
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
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-md transition-all duration-300 outline-none focus:ring-2 resize-none"
                style={{
                  background: currentStyles?.inputBackground || '#ffffff',
                  border: `1px solid ${errors.mensaje ? '#ef4444' : currentStyles?.inputBorder || '#e5e7eb'}`,
                  color: currentStyles?.inputText || '#1f2937',
                }}
              />
              {errors.mensaje && (
                <p className="mt-1 text-xs" style={{ color: currentStyles?.errorColor || '#ef4444' }}>
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
                  className="mt-0.5 mr-2 h-3 w-3 rounded"
                  style={{
                    accentColor: currentStyles?.inputFocusBorder || '#8B5CF6',
                  }}
                />
                <label 
                  htmlFor="acceptTerms"
                  className="text-xs"
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
              <p className="text-xs" style={{ color: currentStyles?.errorColor || '#ef4444' }}>
                {errors.acceptTerms}
              </p>
            )}

            {/* Mensajes de estado */}
            {isSuccess && successMessage && (
              <div 
                className="p-3 rounded-md text-center font-medium animate-fade-in text-sm"
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
                className="p-3 rounded-md text-center font-medium animate-fade-in text-sm"
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
              className="w-full py-3 rounded-md font-semibold text-sm transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
            <div className="flex items-start lg:sticky lg:top-4">
              <SimpleGoogleMap
                googleMapsUrl={data.map.googleMapsUrl || ''}
                height={data.map.height || '400px'}
                width={data.map.width}
                aspectRatio={data.map.aspectRatio || 'landscape'}
                alignment={data.map.alignment || 'center'}
                containerSize={data.map.containerSize || 'medium'}
                companyName={data.map.companyName || 'Scuti Company S.A.C'}
                address={data.map.address || 'calles los molles It-02, Huánuco, Perú'}
                customLogo={data.map.customLogo}
                logoSize={data.map.logoSize || 'medium'}
                borderRadius={data.map.borderRadius || data?.layout?.borderRadius || '1rem'}
                shadow={data.map.shadow || 'medium'}
                markerBackground={data.map.markerBackground || '#ef4444'}
                markerBorderColor={data.map.markerBorderColor || '#ffffff'}
                markerBorderWidth={data.map.markerBorderWidth || '4px'}
                markerStyle={data.map.markerStyle || 'gradient'}
                pulseIntensity={data.map.pulseIntensity || 'medium'}
                pulseSpeed={data.map.pulseSpeed || 'normal'}
                hoverEffect={data.map.hoverEffect === 'electric' ? 'thunder' : (data.map.hoverEffect || 'glow')}
                animationEnabled={data.map.animationEnabled !== false}
              />
            </div>
          )}


        </div>

      </div>
    </section>
  );
};

export default ContactSection;
