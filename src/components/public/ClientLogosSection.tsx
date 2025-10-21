import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { useTheme } from '../../contexts/ThemeContext';
import type { 
  ClientLogosContent, 
  ClientLogo, 
  ClientLogosSectionDesignStyles, 
  ClientLogosDesignStyles
} from '../../types/cms';

interface ClientLogosSectionProps {
  data?: ClientLogosContent;
}

const ClientLogosSection: React.FC<ClientLogosSectionProps> = ({ data }) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  // Animación al cargar
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Si no hay datos o la sección está marcada como no visible, no renderizar
  if (!data || data.visible === false) {
    return null;
  }

  // Valores por defecto para la sección
  const defaultSectionStyles: { light: ClientLogosSectionDesignStyles; dark: ClientLogosSectionDesignStyles } = {
    light: {
      background: 'transparent', // Sin fondo por defecto, solo el configurado en CMS
      borderColor: 'transparent',
      borderWidth: '0px',
      borderRadius: '0px',
      shadow: 'none',
      padding: '3rem',
      margin: '0' // Sin margen para cubrir completamente
    },
    dark: {
      background: 'transparent', // Sin fondo por defecto, solo el configurado en CMS
      borderColor: 'transparent',
      borderWidth: '0px',
      borderRadius: '0px',
      shadow: 'none',
      padding: '3rem',
      margin: '0' // Sin margen para cubrir completamente
    }
  };

  // Valores por defecto para los logos
  const defaultLogosStyles: { light: ClientLogosDesignStyles; dark: ClientLogosDesignStyles } = {
    light: {
      logoMaxWidth: '120px',
      logoMaxHeight: '80px',
      logoOpacity: '0.7',
      logoHoverOpacity: '1',
      logoFilter: 'grayscale(0%)',
      logoHoverFilter: 'grayscale(0%)',
      logoBackground: 'transparent',
      logoPadding: '1rem',
      logosBorderRadius: '0.5rem',
      logosGap: '2rem',
      logosPerRow: 4,
      logosAlignment: 'center'
    },
    dark: {
      logoMaxWidth: '120px',
      logoMaxHeight: '80px',
      logoOpacity: '0.8',
      logoHoverOpacity: '1',
      logoFilter: 'brightness(0) invert(1)',
      logoHoverFilter: 'brightness(0) invert(1)',
      logoBackground: 'transparent',
      logoPadding: '1rem',
      logosBorderRadius: '0.5rem',
      logosGap: '2rem',
      logosPerRow: 4,
      logosAlignment: 'center'
    }
  };

  // Obtener estilos actuales de la sección
  const getSectionStyles = (): ClientLogosSectionDesignStyles => {
    if (data.sectionDesign && data.sectionDesign[theme]) {
      return { ...defaultSectionStyles[theme], ...data.sectionDesign[theme] };
    }
    return defaultSectionStyles[theme];
  };

  // Obtener estilos actuales de los logos
  const getLogosStyles = (): ClientLogosDesignStyles => {
    if (data.logosDesign && data.logosDesign[theme]) {
      return { ...defaultLogosStyles[theme], ...data.logosDesign[theme] };
    }
    return defaultLogosStyles[theme];
  };

  // Obtener estilos de texto
  const getTextStyles = () => {
    if (data.styles && data.styles[theme]) {
      return data.styles[theme];
    }
    return {
      titleColor: theme === 'light' ? '#1F2937' : '#FFFFFF',
      descriptionColor: theme === 'light' ? '#4B5563' : '#D1D5DB'
    };
  };

  // Obtener imagen de fondo (ahora es una sola imagen)
  const getBackgroundImage = () => {
    return data.backgroundImage || null;
  };

  const sectionStyles = getSectionStyles();
  const logosStyles = getLogosStyles();
  const textStyles = getTextStyles();
  const backgroundImage = getBackgroundImage();

  // Si no hay logos, no renderizar
  if (!data.logos || data.logos.length === 0) {
    return null;
  }

  // Estilos para cada logo
  const logoContainerStyles = {
    maxWidth: logosStyles.logoMaxWidth,
    height: data.logosHeight || '60px', // Altura específica desde CMS
    padding: logosStyles.logoPadding,
    background: logosStyles.logoBackground,
    borderRadius: logosStyles.logosBorderRadius,
    opacity: logosStyles.logoOpacity,
    filter: logosStyles.logoFilter,
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  // Estilos para hover
  const logoHoverStyles = {
    opacity: logosStyles.logoHoverOpacity,
    filter: logosStyles.logoHoverFilter,
    transform: 'scale(1.05)'
  };

  return (
    <section 
      className="relative overflow-hidden w-full"
      style={{ 
        background: sectionStyles.background,
        border: `${sectionStyles.borderWidth} solid ${sectionStyles.borderColor}`,
        borderRadius: sectionStyles.borderRadius,
        boxShadow: sectionStyles.shadow,
        padding: sectionStyles.padding,
        margin: '0', // Sin márgenes para cubrir completamente
        paddingTop: data.sectionPaddingY || '4rem',
        paddingBottom: data.sectionPaddingY || '4rem',
        minHeight: data.sectionHeight || 'auto'
      }}
    >
      {/* Imagen de fondo si existe - aplicada directamente a la sección */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={backgroundImage}
            alt={data.backgroundImageAlt || 'Client logos background'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Título y descripción - Solo se muestran si showText es true */}
          {data.showText !== false && (
            <div className="text-center mb-12">
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
                style={{ color: textStyles.titleColor }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(data.title || 'Nuestros clientes')
                }}
              />
              {data.description && (
                <p 
                  className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
                  style={{ color: textStyles.descriptionColor }}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(data.description)
                  }}
                />
              )}
            </div>
          )}

          {/* Grid de logos - Sin contenedor extra */}
          <div 
            className={`client-logos-grid transition-all duration-1000 delay-300 grid gap-4 sm:gap-6 md:gap-8 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            } ${data.showText === false ? 'mt-8' : ''} 
            grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 
            justify-items-center`}
            style={{
              gap: logosStyles.logosGap,
              justifyItems: logosStyles.logosAlignment
            }}
          >
            {data.logos
                .sort((a: ClientLogo, b: ClientLogo) => (a.order || 0) - (b.order || 0))
                .map((logo: ClientLogo, index: number) => {
                  const LogoComponent = ({ children }: { children: React.ReactNode }) => {
                    if (logo.link) {
                      return (
                        <a
                          href={logo.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block group cursor-pointer"
                          title={logo.name}
                        >
                          {children}
                        </a>
                      );
                    }
                    return <div className="block group">{children}</div>;
                  };

                  return (
                    <div
                      key={`client-logo-${index}-${logo.name || 'logo'}`}
                      className={`transition-all duration-1000 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                      }`}
                      style={{
                        animationDelay: `${index * 100 + 500}ms`
                      }}
                    >
                      <LogoComponent>
                        <div
                          style={{
                            ...logoContainerStyles,
                            background: logo.background && logo.background !== 'transparent' ? logo.background : logosStyles.logoBackground
                          }}
                          className="transition-all duration-300 hover:opacity-100 hover:scale-105"
                          onMouseEnter={(e) => {
                            const target = e.currentTarget;
                            target.style.opacity = logoHoverStyles.opacity;
                            target.style.filter = logoHoverStyles.filter;
                            target.style.transform = logoHoverStyles.transform;
                          }}
                          onMouseLeave={(e) => {
                            const target = e.currentTarget;
                            target.style.opacity = logoContainerStyles.opacity as string;
                            target.style.filter = logoContainerStyles.filter as string;
                            target.style.transform = 'scale(1)';
                          }}
                        >
                          <img
                            src={logo.imageUrl}
                            alt={logo.alt || logo.name}
                            className="w-full h-full object-contain"
                            style={{
                              maxWidth: '100%',
                              maxHeight: '100%'
                            }}
                            loading="lazy"
                          />
                        </div>
                      </LogoComponent>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientLogosSection;