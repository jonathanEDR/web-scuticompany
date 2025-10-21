import { useState, useEffect } from 'react';
import { getPageBySlug, updatePage, clearCache } from '../../services/cmsApi';
import { useTheme } from '../../contexts/ThemeContext';
import { DEFAULT_PAGE_CONFIG } from '../../utils/defaultConfig';
import type { PageData, MessageState } from '../../types/cms';

export const useCmsData = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [message, setMessage] = useState<MessageState | null>(null);
  const { setThemeConfig } = useTheme();

  // Cargar datos de la página Home
  useEffect(() => {
    if (!pageData) {
      loadPageData();
    }
  }, [pageData]);

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
      
      // Intentar cargar datos desde la API
      try {
        data = await getPageBySlug('home');
      } catch (apiError) {
        console.warn('⚠️ No se pudo conectar con la base de datos, usando configuración predeterminada');
        
        // Usar configuración predeterminada como fallback
        data = {
          pageSlug: 'home',
          pageName: 'Página de Inicio',
          content: {
            hero: {
              title: DEFAULT_PAGE_CONFIG.hero.title,
              subtitle: DEFAULT_PAGE_CONFIG.hero.subtitle,
              description: DEFAULT_PAGE_CONFIG.hero.description,
              ctaText: DEFAULT_PAGE_CONFIG.hero.ctaText,
              ctaLink: DEFAULT_PAGE_CONFIG.hero.ctaLink,
              backgroundImage: DEFAULT_PAGE_CONFIG.hero.backgroundImage,
              backgroundImageAlt: DEFAULT_PAGE_CONFIG.hero.backgroundImageAlt,
              styles: DEFAULT_PAGE_CONFIG.hero.styles
            },
            solutions: {
              title: DEFAULT_PAGE_CONFIG.solutions.title,
              description: DEFAULT_PAGE_CONFIG.solutions.subtitle,
              backgroundImage: DEFAULT_PAGE_CONFIG.solutions.backgroundImage,
              backgroundImageAlt: DEFAULT_PAGE_CONFIG.solutions.backgroundImageAlt,
              items: DEFAULT_PAGE_CONFIG.solutions.cards.map(card => ({
                title: card.title,
                description: card.description,
                icon: card.icon,
                gradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)'
              })),
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
          },
          seo: {
            metaTitle: 'Scuti Company - Transformamos tu empresa con tecnología inteligente',
            metaDescription: 'Soluciones digitales, desarrollo de software y modelos de IA personalizados para impulsar tu negocio',
            keywords: ['tecnología', 'software', 'inteligencia artificial', 'transformación digital'],
            ogTitle: 'Scuti Company - Tecnología Inteligente',
            ogDescription: 'Transformamos procesos con soluciones digitales y modelos de IA personalizados',
            ogImage: DEFAULT_PAGE_CONFIG.hero.backgroundImage.dark,
            twitterCard: 'summary_large_image'
          },
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
          light: DEFAULT_PAGE_CONFIG.hero.backgroundImage.light,
          dark: oldValue || DEFAULT_PAGE_CONFIG.hero.backgroundImage.dark
        };
      }
      
      if (typeof data.content.solutions.backgroundImage === 'string') {
        const oldValue = data.content.solutions.backgroundImage;
        data.content.solutions.backgroundImage = {
          light: DEFAULT_PAGE_CONFIG.solutions.backgroundImage.light,
          dark: oldValue || DEFAULT_PAGE_CONFIG.solutions.backgroundImage.dark
        };
      }
      
      // Asegurar que los estilos existen con valores predeterminados
      if (!data.content.hero.styles) {
        data.content.hero.styles = DEFAULT_PAGE_CONFIG.hero.styles;
      }
      
      if (!data.content.solutions.styles) {
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
      
      await updatePage('home', {
        content: pageData.content,
        seo: pageData.seo,
        theme: pageData.theme,
        isPublished: pageData.isPublished
      });
      
      // 🔧 CORRECCIÓN: Limpiar caché para forzar que la página pública use datos frescos
      clearCache('page-home');
      
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