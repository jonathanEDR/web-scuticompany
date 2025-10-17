import { useState, useEffect } from 'react';
import { getPageBySlug, updatePage } from '../../services/cmsApi';
import { useTheme } from '../../contexts/ThemeContext';
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
      const data = await getPageBySlug('home');
      
      // Migrar backgroundImage de string a objeto si es necesario
      if (typeof data.content.hero.backgroundImage === 'string') {
        const oldValue = data.content.hero.backgroundImage;
        data.content.hero.backgroundImage = {
          light: '',
          dark: oldValue || ''
        };
      }
      
      if (typeof data.content.solutions.backgroundImage === 'string') {
        const oldValue = data.content.solutions.backgroundImage;
        data.content.solutions.backgroundImage = {
          light: '',
          dark: oldValue || ''
        };
      }
      
      // Asegurar que los estilos existen
      if (!data.content.hero.styles) {
        data.content.hero.styles = {
          light: { titleColor: '', subtitleColor: '', descriptionColor: '' },
          dark: { titleColor: '', subtitleColor: '', descriptionColor: '' }
        };
      }
      
      if (!data.content.solutions.styles) {
        data.content.solutions.styles = {
          light: { titleColor: '', descriptionColor: '' },
          dark: { titleColor: '', descriptionColor: '' }
        };
      }
      
      // Asegurar que los botones tengan valores por defecto si no existen
      if (data.theme) {
        // Valores por defecto para modo claro
        if (!data.theme.lightMode.buttons) {
          data.theme.lightMode.buttons = {};
        }
        if (!data.theme.lightMode.buttons.ctaPrimary) {
          data.theme.lightMode.buttons.ctaPrimary = {
            background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
            textColor: '#FFFFFF',
            borderColor: 'transparent'
          };
        }
        if (!data.theme.lightMode.buttons.contact) {
          data.theme.lightMode.buttons.contact = {
            background: 'transparent',
            textColor: '#8B5CF6',
            borderColor: 'linear-gradient(90deg, #8B5CF6, #06B6D4)'
          };
        }
        if (!data.theme.lightMode.buttons.dashboard) {
          data.theme.lightMode.buttons.dashboard = {
            background: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
            textColor: '#FFFFFF',
            borderColor: 'transparent'
          };
        }
        
        // Valores por defecto para modo oscuro
        if (!data.theme.darkMode.buttons) {
          data.theme.darkMode.buttons = {};
        }
        if (!data.theme.darkMode.buttons.ctaPrimary) {
          data.theme.darkMode.buttons.ctaPrimary = {
            background: 'linear-gradient(135deg, #A78BFA, #22D3EE)',
            textColor: '#111827',
            borderColor: 'transparent'
          };
        }
        if (!data.theme.darkMode.buttons.contact) {
          data.theme.darkMode.buttons.contact = {
            background: 'transparent',
            textColor: '#A78BFA',
            borderColor: 'linear-gradient(90deg, #A78BFA, #22D3EE)'
          };
        }
        if (!data.theme.darkMode.buttons.dashboard) {
          data.theme.darkMode.buttons.dashboard = {
            background: 'linear-gradient(135deg, #22D3EE, #60A5FA)',
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
      
      setMessage({ type: 'success', text: '✅ Cambios guardados correctamente' });
      
      // Notificar a la página pública sobre la actualización
      window.dispatchEvent(new CustomEvent('cmsUpdate'));
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('❌ Error al guardar:', error);
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
    loadPageData,
    handleSave
  };
};