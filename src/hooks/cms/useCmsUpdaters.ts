import type { PageData, PageSeo, ButtonStyle } from '../../types/cms';

export const useCmsUpdaters = (pageData: PageData | null, setPageData: (data: PageData) => void) => {
  
  const updateContent = (field: string, value: any) => {
    if (!pageData) return;

    const keys = field.split('.');
    const newData = { ...pageData };
    let current: any = newData.content;

    for (let i = 0; i < keys.length - 1; i++) {
      // Si no existe el objeto, crearlo
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      // Si es un string (formato anterior) y necesitamos convertir a objeto
      if (typeof current[keys[i]] === 'string' && keys[i] === 'backgroundImage') {
        current[keys[i]] = { dark: current[keys[i]] }; // Mover string existente a dark
      }
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setPageData(newData);
  };

  const updateTextStyle = (section: 'hero' | 'solutions', field: string, mode: 'light' | 'dark', color: string) => {
    if (!pageData) return;

    setPageData({
      ...pageData,
      content: {
        ...pageData.content,
        [section]: {
          ...pageData.content[section],
          styles: {
            ...pageData.content[section].styles,
            [mode]: {
              ...pageData.content[section].styles?.[mode],
              [field]: color
            }
          }
        }
      }
    });
  };

  const updateSeo = (field: keyof PageSeo, value: any) => {
    if (!pageData) return;
    
    setPageData({
      ...pageData,
      seo: {
        ...pageData.seo,
        [field]: value
      }
    });
  };

  const updateTheme = (mode: 'lightMode' | 'darkMode', field: string, value: string) => {
    if (!pageData || !pageData.theme) return;
    
    setPageData({
      ...pageData,
      theme: {
        ...pageData.theme,
        [mode]: {
          ...pageData.theme[mode],
          [field]: value
        }
      }
    });
  };

  const updateThemeDefault = (value: 'light' | 'dark') => {
    if (!pageData || !pageData.theme) return;
    
    setPageData({
      ...pageData,
      theme: {
        ...pageData.theme,
        default: value
      }
    });
  };

  const updateSimpleButtonStyle = (mode: 'lightMode' | 'darkMode', buttonType: 'ctaPrimary' | 'contact' | 'dashboard', style: ButtonStyle) => {
    if (!pageData || !pageData.theme) return;

    // Asegurar que la estructura existe
    const currentTheme = { ...pageData.theme };
    if (!currentTheme[mode].buttons) {
      currentTheme[mode].buttons = {
        ctaPrimary: { background: 'transparent', textColor: '#8B5CF6', borderColor: 'transparent' },
        contact: { background: 'transparent', textColor: '#8B5CF6', borderColor: '#8B5CF6' },
        dashboard: { background: '#8B5CF6', textColor: '#FFFFFF', borderColor: 'transparent' }
      };
    }

    const newPageData = {
      ...pageData,
      theme: {
        ...currentTheme,
        [mode]: {
          ...currentTheme[mode],
          buttons: {
            ...currentTheme[mode].buttons,
            [buttonType]: style
          }
        }
      }
    };
    
    setPageData(newPageData);
  };

  return {
    updateContent,
    updateTextStyle,
    updateSeo,
    updateTheme,
    updateThemeDefault,
    updateSimpleButtonStyle
  };
};