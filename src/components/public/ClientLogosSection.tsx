import React, { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { useTheme } from '../../contexts/ThemeContext';
import type { 
  ClientLogosContent, 
  ClientLogo, 
  ClientLogosDesignStyles
} from '../../types/cms';

interface ClientLogosSectionProps {
  data?: ClientLogosContent;
}

const ClientLogosSection: React.FC<ClientLogosSectionProps> = ({ data }) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [clickedLogos, setClickedLogos] = useState<Set<number>>(new Set());
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  const sectionRef = useRef<HTMLElement>(null);
  const autoRotateRef = useRef<number | null>(null);

  // Obtener configuración de logos desde CMS
  const getLogosStyles = (): ClientLogosDesignStyles => {
    const defaultStyles: ClientLogosDesignStyles = {
      logoMaxWidth: '120px',
      logoMaxHeight: '80px',
      logoOpacity: theme === 'light' ? '0.7' : '0.8',
      logoHoverOpacity: '1',
      logoFilter: theme === 'light' ? 'grayscale(0%)' : 'brightness(0) invert(1)',
      logoHoverFilter: theme === 'light' ? 'grayscale(0%)' : 'brightness(0) invert(1)',
      logoBackground: 'transparent',
      logoPadding: '1rem',
      logosBorderRadius: '0.5rem',
      logosGap: '2rem',
      logosPerRow: 4,
      logosAlignment: 'center',
      floatAnimation: true,
      floatIntensity: 'normal',
      mouseTracking: true,
      mouseIntensity: 'normal',
      hoverScale: 1.15,
      hoverRotation: true,
      carouselEnabled: true,
      carouselSpeed: 3000,
      logosToShowDesktop: 6,
      logosToShowTablet: 4,
      logosToShowMobile: 3
    };

    if (data?.logosDesign && data.logosDesign[theme]) {
      return { ...defaultStyles, ...data.logosDesign[theme] };
    }
    return defaultStyles;
  };

  const logosStyles = getLogosStyles();

  // Determinar cuántos logos mostrar según el tamaño de pantalla y configuración CMS
  const getLogosToShow = () => {
    if (windowWidth < 640) return logosStyles.logosToShowMobile ?? 3;
    if (windowWidth < 1024) return logosStyles.logosToShowTablet ?? 4;
    return logosStyles.logosToShowDesktop ?? 6;
  };

  const logosToShow = getLogosToShow();

  // Detectar cambios de tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animación al cargar
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Rotación automática del carrusel
  useEffect(() => {
    if (!data?.logos || data.logos.length <= logosToShow) {
      return; // No rotar si hay pocos logos
    }

    // Solo activar si el carrusel está habilitado (por defecto true)
    const carouselEnabled = logosStyles.carouselEnabled !== false;
    if (!carouselEnabled) {
      return;
    }

    const carouselSpeed = logosStyles.carouselSpeed || 3000;

    const startAutoRotate = () => {
      autoRotateRef.current = window.setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const maxIndex = data.logos!.length - logosToShow;
          return prevIndex >= maxIndex ? 0 : prevIndex + 1;
        });
      }, carouselSpeed);
    };

    startAutoRotate();

    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    };
  }, [data?.logos, logosToShow, logosStyles.carouselEnabled, logosStyles.carouselSpeed]);

  // Función para manejar el clic en un logo (efecto torbellino)
  const handleLogoClick = (index: number) => {
    setClickedLogos(prev => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });

    // Restaurar el logo después de 2.5 segundos (tiempo para completar la animación de torbellino)
    setTimeout(() => {
      setClickedLogos(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }, 2500);
  };

  // Si no hay datos o la sección está marcada como no visible, no renderizar
  if (!data || data.visible === false) {
    return null;
  }

  // Si no hay logos, no renderizar
  if (!data.logos || data.logos.length === 0) {
    return null;
  }

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

  const textStyles = getTextStyles();
  const backgroundImage = getBackgroundImage();

  // Configuración de animaciones desde CMS (valores seguros por defecto)
  const floatEnabled = logosStyles?.floatAnimation !== false;
  const hoverScale = logosStyles?.hoverScale ?? 1.15;

  // Estilos para cada logo - SIN contenedor de tarjeta
  const logoContainerStyles = {
    maxWidth: logosStyles.logoMaxWidth,
    height: data.logosHeight || '60px',
    opacity: logosStyles.logoOpacity,
    filter: logosStyles.logoFilter,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', // Transición suave
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  // Estilos para hover - Solo crecer, sin levantarse
  const logoHoverStyles = {
    opacity: logosStyles.logoHoverOpacity,
    filter: logosStyles.logoHoverFilter,
    transform: `scale(${hoverScale})` // Solo escala, sin translateY
  };

  return (
    <section 
      ref={sectionRef}
      className="relative overflow-hidden w-full"
      style={{ 
        background: 'transparent', // Sin fondo
        border: 'none', // Sin borde
        boxShadow: 'none', // Sin sombra
        padding: '0', // Sin padding en la sección
        margin: '0',
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

          {/* Carrusel de logos */}
          <div className="relative overflow-hidden">
            <div 
              className={`flex transition-transform duration-700 ease-in-out ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                transform: `translateX(-${currentIndex * (100 / logosToShow)}%)`,
                gap: logosStyles.logosGap
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
                      className={`flex-shrink-0 transition-all duration-1000 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                      }`}
                      style={{
                        width: `${100 / logosToShow}%`,
                        animationName: isVisible && floatEnabled && !clickedLogos.has(index)
                          ? `float${logosStyles?.floatIntensity === 'subtle' ? 'Subtle' : logosStyles?.floatIntensity === 'strong' ? 'Strong' : ''}` 
                          : 'none',
                        animationDuration: isVisible && floatEnabled && !clickedLogos.has(index) ? `${3 + (index % 3)}s` : '0s',
                        animationTimingFunction: 'ease-in-out',
                        animationIterationCount: 'infinite',
                        animationDelay: `${index * 0.2}s`,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '0 1rem'
                      }}
                    >
                      <LogoComponent>
                        <div
                          onClick={() => handleLogoClick(index)}
                          style={{
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative'
                          }}
                        >
                          {/* Círculo de torbellino */}
                          {clickedLogos.has(index) && (
                            <div
                              style={{
                                position: 'absolute',
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                                border: '4px solid transparent',
                                borderTopColor: '#8B5CF6',
                                borderRightColor: '#06B6D4',
                                borderBottomColor: '#A78BFA',
                                borderLeftColor: '#22D3EE',
                                animation: 'spin-vortex 1.5s cubic-bezier(0.6, 0.04, 0.98, 0.335) forwards',
                                zIndex: 5,
                                pointerEvents: 'none',
                                boxShadow: '0 0 30px rgba(139, 92, 246, 0.6), inset 0 0 30px rgba(6, 182, 212, 0.4)',
                                opacity: 0
                              }}
                            />
                          )}
                          
                          {/* Segundo círculo para efecto más denso */}
                          {clickedLogos.has(index) && (
                            <div
                              style={{
                                position: 'absolute',
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                border: '3px dashed transparent',
                                borderTopColor: '#22D3EE',
                                borderRightColor: '#A78BFA',
                                borderBottomColor: '#06B6D4',
                                borderLeftColor: '#8B5CF6',
                                animation: 'spin-vortex-reverse 1.3s cubic-bezier(0.6, 0.04, 0.98, 0.335) forwards',
                                zIndex: 4,
                                pointerEvents: 'none',
                                opacity: 0
                              }}
                            />
                          )}

                          <img
                            src={logo.imageUrl}
                            alt={logo.alt || logo.name}
                            className={`transition-all duration-300 ${clickedLogos.has(index) ? 'logo-spinning' : ''}`}
                            style={{
                              maxWidth: logosStyles.logoMaxWidth,
                              height: data.logosHeight || '60px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transformOrigin: 'center',
                              willChange: 'transform, opacity, filter',
                              position: 'relative',
                              zIndex: 10,
                              // Solo aplicar estilos base cuando NO está en animación
                              ...(clickedLogos.has(index) ? {} : {
                                opacity: logoContainerStyles.opacity,
                                filter: logoContainerStyles.filter,
                                transition: 'all 0.3s ease'
                              })
                            }}
                            onMouseEnter={(e) => {
                              if (clickedLogos.has(index)) return;
                              // Aplicar transformación de crecimiento suave
                              e.currentTarget.style.opacity = logoHoverStyles.opacity;
                              e.currentTarget.style.filter = logoHoverStyles.filter;
                              e.currentTarget.style.transform = `scale(${hoverScale})`;
                              e.currentTarget.style.zIndex = '10';
                              e.currentTarget.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'; // Efecto bounce suave
                            }}
                            onMouseLeave={(e) => {
                              if (clickedLogos.has(index)) return;
                              e.currentTarget.style.opacity = logoContainerStyles.opacity as string;
                              e.currentTarget.style.filter = logoContainerStyles.filter as string;
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.zIndex = '1';
                              e.currentTarget.style.transition = 'all 0.3s ease';
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
      </div>
    </section>
  );
};

// Agregar estilos de animación flotante y torbellino - Se crean dinámicamente
if (typeof document !== 'undefined' && !document.getElementById('client-logos-animations')) {
  const style = document.createElement('style');
  style.id = 'client-logos-animations';
  style.textContent = `
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-15px);
      }
    }
    
    @keyframes floatSubtle {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-8px);
      }
    }
    
    @keyframes floatStrong {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-20px);
      }
    }
    
    @keyframes spin-vortex {
      0% {
        transform: rotate(0deg) scale(0.5);
        opacity: 0;
      }
      20% {
        opacity: 1;
      }
      100% {
        transform: rotate(1440deg) scale(2.5);
        opacity: 0;
      }
    }
    
    @keyframes spin-vortex-reverse {
      0% {
        transform: rotate(0deg) scale(0.6);
        opacity: 0;
      }
      20% {
        opacity: 0.8;
      }
      100% {
        transform: rotate(-1440deg) scale(2);
        opacity: 0;
      }
    }
    
    @keyframes logo-vortex-spin {
      0% {
        transform: scale(1) translateY(0px) rotateZ(0deg);
        opacity: 1;
        filter: blur(0px) brightness(1);
      }
      25% {
        transform: scale(0.85) translateY(40px) rotateZ(360deg);
        opacity: 0.95;
        filter: blur(2px) brightness(0.95);
      }
      50% {
        transform: scale(0.65) translateY(85px) rotateZ(720deg);
        opacity: 0.8;
        filter: blur(5px) brightness(0.85);
      }
      75% {
        transform: scale(0.4) translateY(140px) rotateZ(1080deg);
        opacity: 0.5;
        filter: blur(10px) brightness(0.6);
      }
      100% {
        transform: scale(0.1) translateY(200px) rotateZ(1440deg);
        opacity: 0;
        filter: blur(15px) brightness(0.3);
      }
    }
    
    .logo-spinning {
      animation: logo-vortex-spin 2s linear forwards !important;
    }
  `;
  document.head.appendChild(style);
}

export default ClientLogosSection;