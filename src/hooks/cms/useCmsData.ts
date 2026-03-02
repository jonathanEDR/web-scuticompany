import { useState, useEffect } from 'react';
import { getPageBySlug, updatePage, clearCache } from '../../services/cmsApi';
import { useTheme } from '../../contexts/ThemeContext';
import { SITE_CONFIG } from '../../config/siteConfig';
import { cms } from '../../utils/contentManagementCache';
import type { PageData, MessageState } from '../../types/cms';

// Valores por defecto mínimos para fallback (cuando no hay conexión con BD)
const FALLBACK_BACKGROUND_IMAGES = {
  light: '',
  dark: ''
};

const FALLBACK_HERO_STYLES = {
  light: { titleColor: '', subtitleColor: '', descriptionColor: '' },
  dark: { titleColor: '', subtitleColor: '', descriptionColor: '' }
};

export const useCmsData = (pageSlug: string = 'home') => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [message, setMessage] = useState<MessageState | null>(null);
  const { setThemeConfig } = useTheme();

  // Cargar datos de la página especificada
  useEffect(() => {
    loadPageData();
  }, [pageSlug]); // 🔥 Recargar cuando cambie el slug

  // Sincronizar el tema con el contexto cuando cambian los datos
  useEffect(() => {
    if (pageData?.theme) {
      setThemeConfig(pageData.theme as any);
    }
  }, [pageData?.theme, setThemeConfig]);

  const loadPageData = async () => {
    try {
      setLoading(true);
      
      let data: PageData;
      
      // 1️⃣ Intentar cargar del cache primero
      const cachedData = cms.getPages<PageData>(pageSlug);
      if (cachedData) {
        data = cachedData;
        setPageData(data);
        setLoading(false);
        return;
      }
      
      // 2️⃣ Si no hay cache, obtener de la API
      try {
        data = await getPageBySlug(pageSlug);
        
        // 3️⃣ Guardar en cache
        cms.setPages<PageData>(data, pageSlug);
      } catch (apiError) {
        console.warn(`⚠️ No se pudo conectar con la base de datos para "${pageSlug}", usando configuración predeterminada`);
        
        // 🔥 NUEVO: Configuración de fallback ESPECÍFICA por página
        // Obtener nombre de página según el slug
        const getPageName = (slug: string): string => {
          switch (slug) {
            case 'home': return 'Página de Inicio';
            case 'about': return 'Sobre Nosotros';
            case 'services': return 'Servicios';
            case 'contact': return 'Contacto';
            case 'blog': return 'Blog - Noticias';
            case 'blog-post-detail': return 'Detalle de Post del Blog';
            case 'servicio-detail': return 'Detalle de Servicio';
            case 'proyectos': return 'Portafolio de Proyectos';
            case 'proyecto-detail': return 'Detalle de Proyecto';
            default: return 'Página';
          }
        };

        // 🔥 NUEVO: SEO específico por página - ✅ Usando configuración centralizada
        const getSeoForPage = (slug: string) => {
          const { siteName, siteDescription, images, seo } = SITE_CONFIG;
          
          switch (slug) {
            case 'home':
              return {
                focusKeyphrase: 'transformación digital',
                metaTitle: `${siteName} - Transformamos tu empresa con tecnología inteligente`,
                metaDescription: siteDescription,
                keywords: seo.defaultKeywords,
                ogTitle: `${siteName} - Tecnología Inteligente`,
                ogDescription: 'Transformamos procesos con soluciones digitales y modelos de IA personalizados',
                ogImage: images.ogDefault,
                twitterCard: 'summary_large_image'
              };
            case 'services':
              return {
                focusKeyphrase: 'servicios tecnológicos',
                metaTitle: `Nuestros Servicios${seo.titleSuffix}`,
                metaDescription: 'Consultoría IT, Proyectos Tecnológicos e Inteligencia Artificial para impulsar tu negocio',
                keywords: ['servicios', 'consultoría', 'tecnología', 'software', 'inteligencia artificial'],
                ogTitle: `Servicios${seo.titleSuffix}`,
                ogDescription: 'Descubre nuestras soluciones tecnológicas diseñadas para transformar tu empresa',
                ogImage: images.ogServices,
                twitterCard: 'summary_large_image'
              };
            case 'about':
              return {
                focusKeyphrase: 'empresa tecnológica',
                metaTitle: `Sobre Nosotros${seo.titleSuffix}`,
                metaDescription: `Conoce más sobre ${siteName}, nuestra misión, visión y el equipo de expertos en tecnología`,
                keywords: ['sobre nosotros', 'equipo', 'misión', 'visión', siteName],
                ogTitle: `Sobre Nosotros${seo.titleSuffix}`,
                ogDescription: `Conoce más sobre ${siteName} y nuestro equipo`,
                ogImage: images.ogDefault,
                twitterCard: 'summary_large_image'
              };
            case 'contact':
              return {
                focusKeyphrase: 'contacto',
                metaTitle: `Contacto${seo.titleSuffix}`,
                metaDescription: 'Contáctanos para conocer más sobre nuestras soluciones tecnológicas',
                keywords: ['contacto', siteName, 'consulta', 'soporte'],
                ogTitle: `Contacto${seo.titleSuffix}`,
                ogDescription: 'Ponte en contacto con nuestro equipo',
                ogImage: images.ogDefault,
                twitterCard: 'summary_large_image'
              };
            case 'blog':
              return {
                focusKeyphrase: 'blog tecnología',
                metaTitle: `Blog ${siteName} - Noticias y Tendencias Tecnológicas`,
                metaDescription: 'Mantente informado con las últimas noticias y tendencias del sector tecnológico. Contenido curado por expertos.',
                keywords: ['blog', 'noticias tecnológicas', 'tendencias tech', 'desarrollo web', 'programación', 'AI'],
                ogTitle: `Blog ${siteName} - Noticias Tecnológicas`,
                ogDescription: 'Las últimas noticias y tendencias del sector tecnológico',
                ogImage: images.ogBlog,
                twitterCard: 'summary_large_image'
              };
            case 'proyectos':
              return {
                focusKeyphrase: 'portafolio proyectos tecnológicos',
                metaTitle: `Portafolio de Proyectos${seo.titleSuffix}`,
                metaDescription: 'Conoce los proyectos y sistemas que hemos desarrollado. Soluciones tecnológicas a medida para empresas.',
                keywords: ['portafolio', 'proyectos', 'sistemas web', 'desarrollo software', 'soluciones tecnológicas'],
                ogTitle: `Portafolio de Proyectos${seo.titleSuffix}`,
                ogDescription: 'Proyectos tecnológicos que transforman negocios',
                ogImage: images.ogDefault,
                twitterCard: 'summary_large_image'
              };
            case 'blog-post-detail':
              return {
                focusKeyphrase: 'artículo tecnología',
                metaTitle: 'Artículo del Blog - SCUTI Company',
                metaDescription: 'Lee nuestros artículos sobre tecnología, desarrollo de software e inteligencia artificial.',
                keywords: ['blog', 'artículo', 'tecnología', 'software', 'inteligencia artificial'],
                ogTitle: 'Blog - SCUTI Company',
                ogDescription: 'Contenido educativo sobre tecnología y desarrollo',
                ogImage: images.ogDefault,
                twitterCard: 'summary_large_image'
              };
            case 'proyecto-detail':
              return {
                focusKeyphrase: 'proyecto tecnológico',
                metaTitle: `Proyecto${seo.titleSuffix}`,
                metaDescription: 'Conoce los detalles de este proyecto tecnológico desarrollado por SCUTI Company.',
                keywords: ['proyecto', 'desarrollo', 'software', 'portafolio', 'solución tecnológica'],
                ogTitle: `Proyecto${seo.titleSuffix}`,
                ogDescription: 'Detalle de proyecto tecnológico desarrollado a medida',
                ogImage: images.ogDefault,
                twitterCard: 'summary_large_image'
              };
            default:
              return {
                focusKeyphrase: 'scuti company',
                metaTitle: 'SCUTI Company',
                metaDescription: 'Soluciones tecnológicas inteligentes',
                keywords: ['tecnología', 'software'],
                ogTitle: 'SCUTI Company',
                ogDescription: 'Soluciones tecnológicas',
                ogImage: images.ogDefault,
                twitterCard: 'summary_large_image'
              };
          }
        };

        // Hero específico por página (fallback mínimo)
        const getHeroForPage = (slug: string) => {
          const { siteName } = SITE_CONFIG;
          const baseHero = {
            backgroundImage: FALLBACK_BACKGROUND_IMAGES,
            styles: FALLBACK_HERO_STYLES
          };

          switch (slug) {
            case 'home':
              return {
                title: 'Bienvenido',
                subtitle: 'Configura tu página desde el CMS',
                description: 'Esta es una configuración temporal. Actualiza el contenido desde el administrador.',
                ctaText: 'Comenzar',
                ctaLink: '/servicios',
                backgroundImageAlt: 'Hero background',
                ...baseHero
              };
            case 'services':
              return {
                title: 'Nuestros Servicios',
                subtitle: 'Soluciones inteligentes para tu negocio',
                description: 'Descubre nuestras soluciones tecnológicas.',
                ctaText: 'Ver Servicios',
                ctaLink: '/servicios',
                backgroundImageAlt: 'Servicios',
                ...baseHero
              };
            case 'about':
              return {
                title: 'Sobre Nosotros',
                subtitle: 'Conoce nuestra historia',
                description: 'Somos un equipo apasionado por la tecnología.',
                ctaText: 'Conocer más',
                ctaLink: '/nosotros',
                backgroundImageAlt: 'Equipo',
                ...baseHero
              };
            case 'contact':
              return {
                title: 'Contáctanos',
                subtitle: 'Estamos aquí para ayudarte',
                description: 'Ponte en contacto con nosotros.',
                ctaText: 'Enviar mensaje',
                ctaLink: '/contacto',
                backgroundImageAlt: 'Contacto',
                ...baseHero
              };
            case 'blog':
              return {
                title: 'Blog',
                subtitle: 'Noticias y tendencias tecnológicas',
                description: 'Contenido curado por expertos.',
                ctaText: 'Ver Noticias',
                ctaLink: '/blog',
                backgroundImageAlt: 'Blog',
                ...baseHero
              };
            case 'proyectos':
              return {
                title: 'Proyectos que transforman negocios',
                subtitle: 'Nuestro Portafolio',
                description: 'Soluciones tecnológicas a medida que impulsan el crecimiento de nuestros clientes',
                ctaText: 'Contáctanos',
                ctaLink: '/contacto',
                backgroundImageAlt: 'Portafolio de Proyectos',
                ...baseHero
              };
            case 'proyecto-detail':
              return {
                title: 'Detalle de Proyecto',
                subtitle: 'Portafolio',
                description: 'Conoce los detalles de este proyecto',
                ctaText: 'Contactar',
                ctaLink: '/contacto',
                backgroundImageAlt: 'Detalle de Proyecto',
                ...baseHero
              };
            default:
              return {
                title: siteName,
                subtitle: 'Tecnología Inteligente',
                description: 'Transformamos empresas con soluciones digitales.',
                ctaText: 'Comenzar',
                ctaLink: '/',
                backgroundImageAlt: siteName,
                ...baseHero
              };
          }
        };

        // 🔥 NUEVO: Content específico por página
        // SOLO HOME tiene solutions, valueAdded, clientLogos
        const getContentForPage = (slug: string) => {
          const baseContent = {
            hero: getHeroForPage(slug)
          };

          // SOLO para HOME: agregar solutions (fallback mínimo)
          if (slug === 'home') {
            return {
              ...baseContent,
              solutions: {
                title: 'Nuestras Soluciones',
                description: 'Configura las soluciones desde el CMS',
                backgroundImage: FALLBACK_BACKGROUND_IMAGES,
                backgroundImageAlt: 'Soluciones',
                items: [],
                cardsDesign: {
                  light: {
                    background: '#ffffff',
                    border: '#e2e8f0',
                    borderWidth: '1px',
                    shadow: '0 1px 3px rgba(0,0,0,0.1)',
                    hoverBackground: '#f8fafc',
                    hoverBorder: '#8b5cf6',
                    hoverShadow: '0 4px 12px rgba(139,92,246,0.15)',
                    iconGradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                    iconBackground: '#f8fafc',
                    iconColor: '#8b5cf6',
                    titleColor: '#1e293b',
                    descriptionColor: '#64748b',
                    linkColor: '#8b5cf6'
                  },
                  dark: {
                    background: '#1e293b',
                    border: '#334155',
                    borderWidth: '1px',
                    shadow: '0 1px 3px rgba(0,0,0,0.3)',
                    hoverBackground: '#334155',
                    hoverBorder: '#a78bfa',
                    hoverShadow: '0 4px 12px rgba(167,139,250,0.25)',
                    iconGradient: 'linear-gradient(135deg, #A78BFA, #22D3EE)',
                    iconBackground: '#334155',
                    iconColor: '#a78bfa',
                    titleColor: '#f8fafc',
                    descriptionColor: '#cbd5e1',
                    linkColor: '#a78bfa'
                  }
                }
              }
            };
          }

          // ✅ Para SERVICES: solo hero (servicios se cargan de otra tabla)
          if (slug === 'services') {
            return baseContent;
          }

          // ✅ Para ABOUT: hero + campos de misión/visión
          if (slug === 'about') {
            return {
              ...baseContent,
              mission: 'Nuestra misión es transformar empresas con tecnología inteligente.',
              vision: 'Ser líderes en soluciones tecnológicas innovadoras.'
            };
          }

          // ✅ Para BLOG: hero + configuración específica del blog
          if (slug === 'blog') {
            return {
              ...baseContent,
              blogHero: {
                title: 'Blog',
                titleHighlight: 'Tech',
                subtitle: 'Las últimas noticias y tendencias tecnológicas',
                backgroundImage: '', // Imagen de fondo (vacío = usar gradiente)
                backgroundOverlay: 0.5, // Oscurecer imagen
                gradientFrom: '#3b82f6',
                gradientTo: '#9333ea',
                showStats: true,
                stats: {
                  articlesLabel: 'Artículos',
                  readersCount: '15K+',
                  readersLabel: 'Lectores'
                },
                search: {
                  placeholder: 'Buscar noticias...',
                  buttonText: 'Buscar'
                },
                styles: {
                  light: {
                    titleColor: '#ffffff',
                    titleHighlightColor: '#fde047',
                    subtitleColor: '#bfdbfe',
                    statsValueColor: '#ffffff',
                    statsLabelColor: '#bfdbfe'
                  },
                  dark: {
                    titleColor: '#ffffff',
                    titleHighlightColor: '#fde047',
                    subtitleColor: '#bfdbfe',
                    statsValueColor: '#ffffff',
                    statsLabelColor: '#bfdbfe'
                  }
                }
              }
            };
          }

          // ✅ Para PROYECTOS: hero + portfolio grid + CTA section config
          if (slug === 'proyectos') {
            return {
              ...baseContent,
              portfolio: {
                sectionTitle: 'Nuestros Proyectos',
                backgroundImage: FALLBACK_BACKGROUND_IMAGES,
                backgroundOpacity: 0,
              },
              portfolioCardDesign: {
                light: {
                  cardBg: '#ffffff',
                  cardBorder: 'rgba(229,231,235,0.8)',
                  cardHoverBorder: '#d8b4fe',
                  cardRadius: '16',
                  cardShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  cardHoverShadow: '0 25px 50px rgba(147,51,234,0.15)',
                  imageHeight: '224',
                  titleColor: '#111827',
                  descriptionColor: '#4b5563',
                  tagBg: '#faf5ff',
                  tagText: '#7e22ce',
                  tagBorder: '#f3e8ff',
                  metricsValueColor: '#9333ea',
                  metricsLabelColor: '#9ca3af',
                  buttonBg: 'linear-gradient(to right, #faf5ff, #eef2ff)',
                  buttonText: '#7e22ce',
                  buttonBorder: 'rgba(196,181,253,0.5)',
                  accentFrom: '#9333ea',
                  accentTo: '#4f46e5',
                },
                dark: {
                  cardBg: 'rgba(17,24,39,0.8)',
                  cardBorder: 'rgba(255,255,255,0.1)',
                  cardHoverBorder: 'rgba(168,85,247,0.4)',
                  cardRadius: '16',
                  cardShadow: '0 4px 6px rgba(0,0,0,0.2)',
                  cardHoverShadow: '0 25px 50px rgba(0,0,0,0.5)',
                  imageHeight: '224',
                  titleColor: '#ffffff',
                  descriptionColor: '#9ca3af',
                  tagBg: 'rgba(147,51,234,0.1)',
                  tagText: '#d8b4fe',
                  tagBorder: 'rgba(147,51,234,0.2)',
                  metricsValueColor: '#c084fc',
                  metricsLabelColor: '#6b7280',
                  buttonBg: 'linear-gradient(to right, rgba(147,51,234,0.2), rgba(79,70,229,0.2))',
                  buttonText: '#d8b4fe',
                  buttonBorder: 'rgba(147,51,234,0.2)',
                  accentFrom: '#9333ea',
                  accentTo: '#4f46e5',
                },
              },
              solutions: {
                title: '¿Tienes un proyecto en mente?',
                description: 'Conversemos sobre cómo podemos ayudarte a hacerlo realidad',
                backgroundImage: FALLBACK_BACKGROUND_IMAGES,
                backgroundImageAlt: '',
                items: []
              },
              ctaSection: {
                backgroundImage: { light: '', dark: '' },
                backgroundOpacity: 0.85,
                bgColor: { light: '#faf5ff', dark: 'rgba(255,255,255,0.05)' },
                titleColor: { light: '#111827', dark: '#ffffff' },
                descriptionColor: { light: '#4b5563', dark: '#9ca3af' },
                buttonGradientFrom: '#9333ea',
                buttonGradientTo: '#4f46e5',
                buttonText: '#ffffff',
              },
              filterDesign: {
                activeBgFrom: '#9333ea',
                activeBgTo: '#4f46e5',
                activeText: '#ffffff',
                activeShadow: '0 10px 15px rgba(147,51,234,0.25)',
                inactiveBg: { light: '#ffffff', dark: 'rgba(255,255,255,0.05)' },
                inactiveText: { light: '#4b5563', dark: '#9ca3af' },
                inactiveBorder: { light: '#e5e7eb', dark: 'rgba(255,255,255,0.1)' },
                borderRadius: '12',
              }
            };
          }

          // ✅ Para PROYECTO DETALLE: configuración completa de la página individual
          if (slug === 'proyecto-detail') {
            return {
              ...baseContent,
              proyectoDetailConfig: {
                hero: {
                  showBreadcrumb: true,
                  showDecoBlobs: true,
                  showAccentLine: true,
                  showMetaInfo: true,
                  showTechStack: true,
                  buttons: {
                    showConsultar: true,
                    consultarText: 'Consultar',
                    consultarLink: '/contacto',
                    demoText: 'Ver Demo',
                    accederText: 'Acceder al Sistema',
                    style: 'outline',
                  },
                },
                description: {
                  sectionTitle: 'Sobre el proyecto',
                  accentGradientFrom: '#9333ea',
                  accentGradientTo: '#4f46e5',
                  showImpactHighlight: true,
                  impactTitle: 'Impacto del proyecto',
                  showFullTechGrid: true,
                  fullTechGridThreshold: 5,
                },
                results: {
                  sectionTitle: 'Resultados clave',
                  showFichaTecnica: true,
                  fichaTecnicaTitle: 'Ficha técnica',
                  showAccessLinks: true,
                  accessLinksTitle: 'Acceso directo',
                  metricValueColor: { light: '#9333ea', dark: '#c084fc' },
                },
                cta: {
                  show: true,
                  dividerText: '¿Listo para empezar?',
                  title: 'Desarrollamos la solución ideal',
                  titleHighlight: 'para tu negocio',
                  subtitle: 'Cada proyecto que creamos está diseñado para generar resultados reales. Hablemos de tus objetivos.',
                  primaryButtonText: 'Iniciar conversación',
                  primaryButtonLink: '/contacto',
                  primaryGradientFrom: '#9333ea',
                  primaryGradientTo: '#4f46e5',
                  secondaryButtonText: '← Ver más proyectos',
                  secondaryButtonLink: '/proyectos',
                },
              },
            };
          }

          // ✅ Para CONTACT, SERVICES y otras páginas: solo hero
          return baseContent;
        };

        // Usar configuración predeterminada ESPECÍFICA como fallback
        data = {
          pageSlug: pageSlug,
          pageName: getPageName(pageSlug),
          content: getContentForPage(pageSlug),
          seo: getSeoForPage(pageSlug),
          theme: {
            default: 'dark' as const,
            lightMode: {
              primary: '#8b5cf6',
              secondary: '#06b6d4',
              background: '#ffffff',
              text: '#1e293b',
              textSecondary: '#64748b',
              cardBg: '#f8fafc',
              border: '#e2e8f0',
              buttons: {
                ctaPrimary: {
                  text: 'Comenzar Ahora',
                  background: 'linear-gradient(90deg, #8B5CF6, #06B6D4, #8B5CF6)',
                  textColor: '#FFFFFF',
                  borderColor: 'transparent'
                },
                contact: {
                  text: 'Contactar',
                  background: 'transparent',
                  textColor: '#8B5CF6',
                  borderColor: 'linear-gradient(90deg, #8B5CF6, #06B6D4)'
                },
                dashboard: {
                  text: 'Dashboard',
                  background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)',
                  textColor: '#FFFFFF',
                  borderColor: 'transparent'
                }
              }
            },
            darkMode: {
              primary: '#a78bfa',
              secondary: '#22d3ee',
              background: '#0f172a',
              text: '#f8fafc',
              textSecondary: '#cbd5e1',
              cardBg: '#1e293b',
              border: '#334155',
              buttons: {
                ctaPrimary: {
                  text: 'Comenzar Ahora',
                  background: 'linear-gradient(90deg, #A78BFA, #22D3EE, #A78BFA)',
                  textColor: '#111827',
                  borderColor: 'transparent'
                },
                contact: {
                  text: 'Contactar',
                  background: 'transparent',
                  textColor: '#A78BFA',
                  borderColor: 'linear-gradient(90deg, #A78BFA, #22D3EE)'
                },
                dashboard: {
                  text: 'Dashboard',
                  background: 'linear-gradient(90deg, #A78BFA, #22D3EE)',
                  textColor: '#111827',
                  borderColor: 'transparent'
                }
              }
            }
          },
          isPublished: true,
          lastUpdated: new Date().toISOString(),
          updatedBy: 'sistema'
        };
      }
      
      // Migrar backgroundImage de string a objeto si es necesario
      if (typeof data.content.hero.backgroundImage === 'string') {
        const oldValue = data.content.hero.backgroundImage;
        data.content.hero.backgroundImage = {
          light: oldValue || '',
          dark: oldValue || ''
        };
      }

      // Solo migrar solutions si existe (solo HOME tiene solutions)
      if (data.content.solutions && typeof data.content.solutions.backgroundImage === 'string') {
        const oldValue = data.content.solutions.backgroundImage;
        data.content.solutions.backgroundImage = {
          light: oldValue || '',
          dark: oldValue || ''
        };
      }

      // Asegurar que los estilos existen con valores predeterminados
      if (!data.content.hero.styles) {
        data.content.hero.styles = FALLBACK_HERO_STYLES;
      }
      
      // 🔥 CORREGIDO: Solo asegurar estilos de solutions si existe
      if (data.content.solutions && !data.content.solutions.styles) {
        data.content.solutions.styles = {
          light: { titleColor: '', descriptionColor: '' },
          dark: { titleColor: '', descriptionColor: '' }
        };
      }
      
      // Asegurar que los botones tengan valores por defecto si no existen
      // Sincronizados con la configuración actual de MongoDB
      if (data.theme) {
        // Valores por defecto para modo claro
        if (!data.theme.lightMode.buttons) {
          data.theme.lightMode.buttons = {
            ctaPrimary: {
              text: 'Comenzar Ahora',
              background: 'linear-gradient(90deg, #8B5CF6, #06B6D4, #8B5CF6)',
              textColor: '#FFFFFF',
              borderColor: 'transparent'
            },
            contact: {
              text: 'Contactar',
              background: 'transparent',
              textColor: '#8B5CF6',
              borderColor: 'linear-gradient(90deg, #8B5CF6, #06B6D4)'
            },
            dashboard: {
              text: 'Dashboard',
              background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)',
              textColor: '#FFFFFF',
              borderColor: 'transparent'
            }
          };
        }
        if (!data.theme.lightMode.buttons.ctaPrimary) {
          data.theme.lightMode.buttons.ctaPrimary = {
            text: 'Comenzar Ahora',
            background: 'linear-gradient(90deg, #8B5CF6, #06B6D4, #8B5CF6)',
            textColor: '#FFFFFF',
            borderColor: 'transparent'
          };
        }
        if (!data.theme.lightMode.buttons.contact) {
          data.theme.lightMode.buttons.contact = {
            text: 'Contactar',
            background: 'transparent',
            textColor: '#8B5CF6',
            borderColor: 'linear-gradient(90deg, #8B5CF6, #06B6D4)'
          };
        }
        if (!data.theme.lightMode.buttons.dashboard) {
          data.theme.lightMode.buttons.dashboard = {
            text: 'Dashboard',
            background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)',
            textColor: '#FFFFFF',
            borderColor: 'transparent'
          };
        }

        // Valores por defecto para modo oscuro
        if (!data.theme.darkMode.buttons) {
          data.theme.darkMode.buttons = {
            ctaPrimary: {
              text: 'Comenzar Ahora',
              background: 'linear-gradient(90deg, #A78BFA, #22D3EE, #A78BFA)',
              textColor: '#111827',
              borderColor: 'transparent'
            },
            contact: {
              text: 'Contactar',
              background: 'transparent',
              textColor: '#A78BFA',
              borderColor: 'linear-gradient(90deg, #A78BFA, #22D3EE)'
            },
            dashboard: {
              text: 'Dashboard',
              background: 'linear-gradient(90deg, #A78BFA, #22D3EE)',
              textColor: '#111827',
              borderColor: 'transparent'
            }
          };
        }
        if (!data.theme.darkMode.buttons.ctaPrimary) {
          data.theme.darkMode.buttons.ctaPrimary = {
            text: 'Comenzar Ahora',
            background: 'linear-gradient(90deg, #A78BFA, #22D3EE, #A78BFA)',
            textColor: '#111827',
            borderColor: 'transparent'
          };
        }
        if (!data.theme.darkMode.buttons.contact) {
          data.theme.darkMode.buttons.contact = {
            text: 'Contactar',
            background: 'transparent',
            textColor: '#A78BFA',
            borderColor: 'linear-gradient(90deg, #A78BFA, #22D3EE)'
          };
        }
        if (!data.theme.darkMode.buttons.dashboard) {
          data.theme.darkMode.buttons.dashboard = {
            text: 'Dashboard',
            background: 'linear-gradient(90deg, #A78BFA, #22D3EE)',
            textColor: '#111827',
            borderColor: 'transparent'
          };
        }
      }
      
      setPageData(data);
    } catch (error) {
      console.error('Error al cargar página:', error);
      setMessage({ type: 'error', text: 'Error al cargar la página' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!pageData) return;
    
    try {
      setSaving(true);
      
      await updatePage(pageSlug, {
        content: pageData.content,
        seo: pageData.seo,
        theme: pageData.theme,
        isPublished: pageData.isPublished
      });
      
      // ✅ ACTUALIZADO: Invalidar cache viejo y guardar datos frescos
      cms.invalidatePages(pageSlug);
      // Guardar los datos actuales en cache para evitar cargar datos viejos
      cms.setPages<PageData>(pageData, pageSlug);
      
      // 🔧 MANTENER: Limpiar caché para forzar que la página pública use datos frescos
      clearCache(`page-${pageSlug}`);
      
      setMessage({ type: 'success', text: '✅ Cambios guardados correctamente' });
      
      // Notificar a la página pública sobre la actualización
      window.dispatchEvent(new CustomEvent('cmsUpdate', {
        detail: { 
          timestamp: Date.now(),
          section: 'all',
          action: 'save'
        }
      }));
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('❌ [useCmsData] Error al guardar:', error);
      setMessage({ type: 'error', text: '❌ Error al guardar cambios' });
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    pageData,
    message,
    setPageData,
    setMessage,
    setThemeConfig,
    loadPageData,
    handleSave
  };
};