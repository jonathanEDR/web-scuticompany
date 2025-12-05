import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';
import FloatingChatWidget from '../../components/floating-chat/FloatingChatWidget';
import { useSeo } from '../../hooks/useSeo';
import { useTheme } from '../../contexts/ThemeContext';
import { getPageBySlug } from '../../services/cmsApi';

/**
 * 🏢 Página Nosotros/About
 * Carga contenido dinámico desde el CMS incluyendo imágenes de fondo
 */

/**
 * Función para limpiar HTML y extraer solo el texto
 * Elimina etiquetas HTML pero preserva el contenido
 */
const stripHtmlTags = (html: string): string => {
  if (!html) return '';
  // Crear un elemento temporal para extraer el texto
  const tmp = document.createElement('div');
  tmp.innerHTML = DOMPurify.sanitize(html);
  return tmp.textContent || tmp.innerText || '';
};

// Tipos de alineación soportados
type TextAlignment = 'left' | 'center' | 'right';

interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: {
    light?: string;
    dark?: string;
  };
  backgroundImageAlt?: string;
  backgroundOpacity?: number;
  textAlign?: TextAlignment; // Alineación del texto: left, center, right
  styles?: {
    light: {
      titleColor?: string;
      subtitleColor?: string;
      descriptionColor?: string;
    };
    dark: {
      titleColor?: string;
      subtitleColor?: string;
      descriptionColor?: string;
    };
  };
}

interface SectionContent {
  title: string;
  description: string;
  textAlign?: TextAlignment;
  fontFamily?: string;
  image?: {
    light?: string;
    dark?: string;
  };
  imageAlt?: string;
}

interface ValueItem {
  title: string;
  description: string;
  image?: {
    light?: string;
    dark?: string;
  };
  imageAlt?: string;
  icon?: string;
}

interface ValuesContent {
  title: string;
  subtitle?: string;
  items: ValueItem[];
  textAlign?: TextAlignment;
  fontFamily?: string;
  carouselConfig?: {
    itemsPerView?: number;
    autoplay?: boolean;
    autoplaySpeed?: number;
  };
}

interface PageContent {
  hero: HeroContent;
  mission: SectionContent;
  vision: SectionContent;
  values?: ValuesContent;
}

const About = () => {
  const [pageData, setPageData] = useState<{ content: PageContent } | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { theme } = useTheme();

  // 🎯 SEO dinámico con fallbacks
  const { SeoHelmet } = useSeo({
    pageName: 'about',
    fallbackTitle: 'Nosotros - SCUTI Company',
    fallbackDescription: 'Conoce más sobre SCUTI Company, nuestra historia, misión y el equipo de expertos en desarrollo de software.'
  });

  // Cargar datos de la página About desde CMS
  useEffect(() => {
    const loadPageData = async () => {
      try {
        const data = await getPageBySlug('about');
        console.log('📄 Datos de About cargados:', data);
        setPageData(data);
      } catch (error) {
        console.error('Error cargando página About:', error);
        // Usar datos de fallback
        setPageData({
          content: {
            hero: {
              title: 'Sobre Nosotros',
              subtitle: 'Conoce nuestra historia y misión',
              description: 'SCUTI Company es una empresa líder en desarrollo de software y soluciones tecnológicas innovadoras en Perú.',
              backgroundImage: {
                light: '',
                dark: ''
              }
            },
            mission: {
              title: 'Nuestra Misión',
              description: 'Transformar empresas a través de la tecnología inteligente, creando soluciones digitales personalizadas que impulsen el crecimiento y la eficiencia.'
            },
            vision: {
              title: 'Nuestra Visión',
              description: 'Ser la empresa de referencia en desarrollo de software en Latinoamérica, reconocida por la calidad, innovación y impacto de nuestras soluciones.'
            },
            values: {
              title: 'Nuestros Valores',
              items: [
                { title: 'Innovación', description: 'Buscamos constantemente nuevas formas de resolver problemas' },
                { title: 'Calidad', description: 'Entregamos soluciones robustas y bien construidas' },
                { title: 'Compromiso', description: 'Nos dedicamos al éxito de nuestros clientes' },
                { title: 'Transparencia', description: 'Mantenemos comunicación clara y honesta' }
              ]
            }
          }
        });
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, []);

  // 🎠 Autoplay del carrusel de valores
  useEffect(() => {
    const values = pageData?.content?.values;
    if (!values?.carouselConfig?.autoplay || !values.items?.length) return;

    const itemsPerView = values.carouselConfig.itemsPerView || 3;
    const totalSlides = Math.ceil(values.items.length / itemsPerView);
    if (totalSlides <= 1) return;

    const autoplaySpeed = (values.carouselConfig.autoplaySpeed || 5) * 1000;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, autoplaySpeed);

    return () => clearInterval(interval);
  }, [pageData?.content?.values]);

  // Obtener imagen de fondo según el tema
  const getBackgroundImage = () => {
    const bgImage = pageData?.content?.hero?.backgroundImage;
    if (!bgImage) return null;
    
    if (typeof bgImage === 'string') return bgImage;
    
    return theme === 'light' 
      ? (bgImage.light || bgImage.dark) 
      : (bgImage.dark || bgImage.light);
  };

  const backgroundImage = getBackgroundImage();
  // Usar el valor del CMS directamente, solo usar fallback si es undefined/null
  const backgroundOpacity = pageData?.content?.hero?.backgroundOpacity !== undefined 
    ? pageData.content.hero.backgroundOpacity 
    : 1;

  if (loading) {
    return (
      <div className={`min-h-screen w-full overflow-x-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <PublicHeader />
        <main className="container mx-auto px-4 py-32">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className={`h-12 rounded w-1/2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`h-6 rounded w-3/4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`h-4 rounded w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`h-4 rounded w-5/6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  const { hero, mission, vision, values } = pageData?.content || {};

  // Obtener colores personalizados del CMS o usar defaults
  const getHeroStyles = () => {
    const styles = hero?.styles;
    const currentStyles = theme === 'light' ? styles?.light : styles?.dark;
    
    return {
      titleColor: currentStyles?.titleColor || (theme === 'dark' ? '#FFFFFF' : '#1F2937'),
      subtitleColor: currentStyles?.subtitleColor || (theme === 'dark' ? '#A78BFA' : '#8B5CF6'),
      descriptionColor: currentStyles?.descriptionColor || (theme === 'dark' ? '#D1D5DB' : '#4B5563')
    };
  };

  const heroStyles = getHeroStyles();

  return (
    <>
      {/* 🎯 SEO automático */}
      <SeoHelmet />

      <div className={`min-h-screen w-full overflow-x-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <PublicHeader />
        
        {/* 🎨 Hero Section con imagen de fondo del CMS */}
        <section 
          className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
          style={{
            backgroundColor: theme === 'dark' ? '#111827' : '#F9FAFB'
          }}
        >
          {/* Imagen de fondo */}
          {backgroundImage && (
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500"
              style={{
                backgroundImage: `url(${backgroundImage})`,
                opacity: backgroundOpacity
              }}
              aria-label={hero?.backgroundImageAlt || 'About background'}
            />
          )}
          
          {/* Overlay gradient para legibilidad - SOLO si la opacidad es menor a 1 */}
          {backgroundOpacity < 1 && (
            <div 
              className="absolute inset-0 transition-all duration-500"
              style={{
                background: theme === 'dark'
                  ? `linear-gradient(180deg, rgba(17, 24, 39, ${0.7 - backgroundOpacity * 0.5}) 0%, rgba(17, 24, 39, ${0.9 - backgroundOpacity * 0.5}) 100%)`
                  : `linear-gradient(180deg, rgba(249, 250, 251, ${0.7 - backgroundOpacity * 0.5}) 0%, rgba(249, 250, 251, ${0.9 - backgroundOpacity * 0.5}) 100%)`
              }}
            />
          )}
          
          {/* Contenido del Hero - Alineación configurable */}
          <div 
            className={`relative z-10 container mx-auto px-4 py-32 ${
              (hero?.textAlign || 'left') === 'left' ? 'text-left' : 
              (hero?.textAlign || 'left') === 'right' ? 'text-right' : 
              'text-center'
            }`} 
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <h1 
              className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-colors duration-300 ${
                (hero?.textAlign || 'left') === 'center' ? 'mx-auto' : ''
              }`}
              style={{ 
                color: heroStyles.titleColor, 
                fontFamily: "'Montserrat', sans-serif",
                maxWidth: (hero?.textAlign || 'left') !== 'center' ? '800px' : undefined
              }}
            >
              {stripHtmlTags(hero?.title || 'Sobre Nosotros')}
            </h1>
            
            {hero?.subtitle && (
              <h2 
                className={`text-xl md:text-2xl font-medium mb-6 transition-colors duration-300 ${
                  (hero?.textAlign || 'left') === 'center' ? 'mx-auto' : ''
                }`}
                style={{ 
                  color: heroStyles.subtitleColor, 
                  fontFamily: "'Montserrat', sans-serif",
                  maxWidth: (hero?.textAlign || 'left') !== 'center' ? '700px' : undefined
                }}
              >
                {stripHtmlTags(hero.subtitle)}
              </h2>
            )}
            
            {hero?.description && (
              <p 
                className={`text-lg md:text-xl leading-relaxed transition-colors duration-300 ${
                  (hero?.textAlign || 'left') === 'center' ? 'max-w-3xl mx-auto' : 'max-w-2xl'
                }`}
                style={{ 
                  color: heroStyles.descriptionColor, 
                  fontFamily: "'Montserrat', sans-serif" 
                }}
              >
                {stripHtmlTags(hero.description)}
              </p>
            )}
          </div>
        </section>
        
        {/* 📋 Secciones de Contenido */}
        <main className="container mx-auto px-4 py-16 md:py-24" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          <div className="max-w-6xl mx-auto space-y-20 md:space-y-32">
            
            {/* 🎯 Misión - Texto izquierda, Imagen derecha */}
            {mission?.title && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
                {/* Contenido de texto */}
                <div 
                  className="order-2 lg:order-1 space-y-6"
                  style={{ fontFamily: `'${mission.fontFamily || 'Montserrat'}', sans-serif` }}
                >
                  <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
                    theme === 'dark' 
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                      : 'bg-purple-100 text-purple-700 border border-purple-200'
                  }`}>
                    {stripHtmlTags(mission.title) || 'Nuestra Misión'}
                  </div>
                  <p className={`text-lg md:text-xl leading-relaxed ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {stripHtmlTags(mission.description)}
                  </p>
                </div>
                
                {/* Imagen */}
                <div className="order-1 lg:order-2">
                  <div 
                    className={`relative overflow-hidden rounded-3xl aspect-[4/3] transition-all duration-500 group shadow-2xl ${
                      theme === 'dark' 
                        ? 'shadow-purple-500/10' 
                        : 'shadow-purple-500/20'
                    }`}
                  >
                    {(() => {
                      const missionImage = mission.image 
                        ? (theme === 'dark' ? mission.image.dark || mission.image.light : mission.image.light || mission.image.dark)
                        : null;
                      
                      return missionImage ? (
                        <img 
                          src={missionImage}
                          alt={mission.imageAlt || 'Nuestra Misión'}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        // Placeholder visual cuando no hay imagen
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                            theme === 'dark' 
                              ? 'bg-gradient-to-br from-purple-500/20 to-cyan-500/20' 
                              : 'bg-gradient-to-br from-purple-200 to-cyan-200'
                          }`}>
                            <svg className={`w-12 h-12 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          {/* Decoraciones */}
                          <div className={`absolute top-4 right-4 w-16 h-16 rounded-full opacity-30 ${
                            theme === 'dark' ? 'bg-purple-500' : 'bg-purple-300'
                          }`}></div>
                          <div className={`absolute bottom-8 left-8 w-12 h-12 rounded-full opacity-20 ${
                            theme === 'dark' ? 'bg-cyan-500' : 'bg-cyan-300'
                          }`}></div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}
            
            {/* 👁️ Visión - Imagen izquierda, Texto derecha */}
            {vision?.title && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
                {/* Imagen */}
                <div className="order-1">
                  <div 
                    className={`relative overflow-hidden rounded-3xl aspect-[4/3] transition-all duration-500 group shadow-2xl ${
                      theme === 'dark' 
                        ? 'shadow-cyan-500/10' 
                        : 'shadow-cyan-500/20'
                    }`}
                  >
                    {(() => {
                      const visionImage = vision.image 
                        ? (theme === 'dark' ? vision.image.dark || vision.image.light : vision.image.light || vision.image.dark)
                        : null;
                      
                      return visionImage ? (
                        <img 
                          src={visionImage}
                          alt={vision.imageAlt || 'Nuestra Visión'}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        // Placeholder visual cuando no hay imagen
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                            theme === 'dark' 
                              ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20' 
                              : 'bg-gradient-to-br from-cyan-200 to-purple-200'
                          }`}>
                            <svg className={`w-12 h-12 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </div>
                          {/* Decoraciones */}
                          <div className={`absolute top-8 left-4 w-16 h-16 rounded-full opacity-30 ${
                            theme === 'dark' ? 'bg-cyan-500' : 'bg-cyan-300'
                          }`}></div>
                          <div className={`absolute bottom-4 right-8 w-12 h-12 rounded-full opacity-20 ${
                            theme === 'dark' ? 'bg-purple-500' : 'bg-purple-300'
                          }`}></div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                
                {/* Contenido de texto */}
                <div 
                  className="order-2 space-y-6"
                  style={{ fontFamily: `'${vision.fontFamily || 'Montserrat'}', sans-serif` }}
                >
                  <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
                    theme === 'dark' 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                      : 'bg-cyan-100 text-cyan-700 border border-cyan-200'
                  }`}>
                    {stripHtmlTags(vision.title) || 'Nuestra Visión'}
                  </div>
                  <p className={`text-lg md:text-xl leading-relaxed ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {stripHtmlTags(vision.description)}
                  </p>
                </div>
              </div>
            )}
            
            {/* ⭐ Valores - Carrusel */}
            {values?.title && values?.items && values.items.length > 0 && (() => {
              const itemsPerView = values.carouselConfig?.itemsPerView || 3;
              const totalSlides = Math.ceil(values.items.length / itemsPerView);
              const valuesFontFamily = values.fontFamily || 'Montserrat';
              
              const visibleItems = values.items.slice(
                currentSlide * itemsPerView,
                currentSlide * itemsPerView + itemsPerView
              );

              return (
                <div className="py-12">
                  {/* Título y subtítulo */}
                  <div className="text-center mb-16">
                    <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6 ${
                      theme === 'dark' 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}>
                      Lo que nos define
                    </div>
                    <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`} style={{ fontFamily: `'${valuesFontFamily}', sans-serif` }}>
                      {stripHtmlTags(values.title)}
                    </h2>
                    {values.subtitle && (
                      <p className={`text-lg max-w-2xl mx-auto ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`} style={{ fontFamily: `'${valuesFontFamily}', sans-serif` }}>
                        {stripHtmlTags(values.subtitle)}
                      </p>
                    )}
                  </div>

                  {/* Carrusel Container */}
                  <div className="relative">
                    {/* Cards del Carrusel */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 lg:px-8">
                      {visibleItems.map((value, index) => {
                        const valueImage = value.image
                          ? (theme === 'dark' ? value.image.dark || value.image.light : value.image.light || value.image.dark)
                          : null;

                        return (
                          <div
                            key={currentSlide * itemsPerView + index}
                            className={`group relative overflow-hidden rounded-3xl transition-all duration-500 transform hover:scale-[1.02] ${
                              theme === 'dark'
                                ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/50 shadow-xl shadow-black/20'
                                : 'bg-white/80 backdrop-blur-sm shadow-xl border border-gray-100 hover:shadow-2xl hover:border-purple-300'
                            }`}
                            style={{ 
                              animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                              minHeight: '340px'
                            }}
                          >
                            {/* Imagen de fondo o gradiente */}
                            <div className="absolute inset-0 overflow-hidden rounded-3xl">
                              {valueImage ? (
                                <img
                                  src={valueImage}
                                  alt={value.imageAlt || value.title}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                              ) : (
                                /* Gradiente decorativo cuando no hay imagen */
                                <div className={`absolute inset-0 ${
                                  theme === 'dark'
                                    ? 'bg-gradient-to-br from-purple-900/40 via-gray-900/60 to-cyan-900/40'
                                    : 'bg-gradient-to-br from-purple-50 via-white to-cyan-50'
                                }`} />
                              )}
                            </div>

                            {/* Contenido de la tarjeta - Posicionado sobre la imagen */}
                            <div className={`relative z-10 p-8 h-full flex flex-col justify-end ${
                              valueImage ? 'bg-gradient-to-t from-black/70 via-black/30 to-transparent' : ''
                            }`}>
                              {/* Título */}
                              <h3 className={`text-2xl font-bold mb-3 transition-colors duration-300 ${
                                valueImage 
                                  ? 'text-white drop-shadow-lg' 
                                  : (theme === 'dark' ? 'text-white' : 'text-gray-900')
                              }`} style={{ fontFamily: `'${valuesFontFamily}', sans-serif` }}>
                                {stripHtmlTags(value.title)}
                              </h3>

                              {/* Descripción */}
                              <p className={`text-base leading-relaxed ${
                                valueImage 
                                  ? 'text-white/90 drop-shadow-md' 
                                  : (theme === 'dark' ? 'text-gray-300' : 'text-gray-600')
                              }`} style={{ fontFamily: `'${valuesFontFamily}', sans-serif` }}>
                                {stripHtmlTags(value.description)}
                              </p>

                              {/* Línea decorativa inferior */}
                              <div className={`mt-6 h-1 w-0 group-hover:w-full transition-all duration-500 rounded-full ${
                                theme === 'dark'
                                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500'
                                  : 'bg-gradient-to-r from-purple-600 to-cyan-600'
                              }`} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Indicadores de página */}
                  {totalSlides > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                      {Array.from({ length: totalSlides }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentSlide(idx)}
                          className={`transition-all duration-300 rounded-full ${
                            idx === currentSlide
                              ? `w-8 h-3 ${theme === 'dark' ? 'bg-purple-500' : 'bg-purple-600'}`
                              : `w-3 h-3 ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'}`
                          }`}
                          aria-label={`Ir a página ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
            
          </div>
        </main>
        
        <PublicFooter />
        
        {/* 💬 Chatbot de Ventas Flotante */}
        <FloatingChatWidget />
      </div>
    </>
  );
};

export default About;