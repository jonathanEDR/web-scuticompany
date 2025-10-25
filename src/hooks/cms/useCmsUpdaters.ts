import type { PageData, PageSeo, ButtonStyle } from '../../types/cms';
import type { ThemeConfig } from '../../contexts/ThemeContext';

export const useCmsUpdaters = (
  pageData: PageData | null, 
  setPageData: (data: PageData) => void,
  setThemeConfig?: (config: ThemeConfig) => void
) => {
  
  const updateContent = (field: string, value: any) => {
    if (!pageData) {
      return;
    }
    
    const keys = field.split('.');
    // Hacer una copia profunda para evitar mutaciones
    const newData = structuredClone(pageData);
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

  const updateTextStyle = (section: 'hero' | 'solutions' | 'valueAdded' | 'clientLogos', field: string, mode: 'light' | 'dark', color: string) => {
    if (!pageData) return;

    const currentSection = pageData.content[section];
    if (!currentSection) return;

    // 🎯 Manejar estilos de items individuales (e.g., "items.0.titleColor")
    if (field.includes('items.')) {
      const [, itemIndex, itemField] = field.split('.');
      const index = parseInt(itemIndex, 10);
      
      if ((section === 'solutions' || section === 'valueAdded') && 'items' in currentSection && currentSection.items && currentSection.items[index]) {
        const updatedItems = [...currentSection.items];
        const item = updatedItems[index] as any; // Type cast para manejar estilos
        
        // Asegurar que el item tiene la estructura de estilos
        if (!item.styles) {
          item.styles = {
            light: { titleColor: '', descriptionColor: '' },
            dark: { titleColor: '', descriptionColor: '' }
          };
        }
        
        if (!item.styles[mode]) {
          item.styles[mode] = { titleColor: '', descriptionColor: '' };
        }
        
        // Actualizar el color específico
        item.styles[mode][itemField as 'titleColor' | 'descriptionColor'] = color;
        
        setPageData({
          ...pageData,
          content: {
            ...pageData.content,
            [section]: {
              ...currentSection,
              items: updatedItems
            } as any
          }
        });
      }
      return;
    }

    // 🎯 Manejar estilos de sección general (comportamiento original)
    setPageData({
      ...pageData,
      content: {
        ...pageData.content,
        [section]: {
          ...currentSection,
          styles: {
            ...currentSection.styles,
            [mode]: {
              ...currentSection.styles?.[mode],
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
    
    const newTheme = {
      ...pageData.theme,
      [mode]: {
        ...pageData.theme[mode],
        [field]: value
      }
    };
    
    const newPageData = {
      ...pageData,
      theme: newTheme
    };
    
    setPageData(newPageData);
    
    // IMPORTANTE: Actualizar ThemeContext
    if (setThemeConfig) {
      setThemeConfig(newTheme as ThemeConfig);
    }
  };

  const updateThemeDefault = (value: 'light' | 'dark') => {
    if (!pageData || !pageData.theme) return;
    
    const newTheme = {
      ...pageData.theme,
      default: value
    };
    
    const newPageData = {
      ...pageData,
      theme: newTheme
    };
    
    setPageData(newPageData);
    
    // IMPORTANTE: Actualizar ThemeContext
    if (setThemeConfig) {
      setThemeConfig(newTheme as ThemeConfig);
    }
  };

  const updateSimpleButtonStyle = (mode: 'lightMode' | 'darkMode', buttonType: 'ctaPrimary' | 'contact' | 'dashboard' | 'viewMore', style: ButtonStyle) => {
    if (!pageData || !pageData.theme) return;

    

    // Asegurar que la estructura existe
    const currentTheme = { ...pageData.theme };
    if (!currentTheme[mode].buttons) {
      currentTheme[mode].buttons = {
        ctaPrimary: { text: 'Conoce nuestros servicios', background: 'transparent', textColor: '#8B5CF6', borderColor: 'transparent' },
        contact: { text: 'CONTÁCTANOS', background: 'transparent', textColor: '#8B5CF6', borderColor: '#8B5CF6' },
        dashboard: { text: 'Ir al Dashboard', background: '#8B5CF6', textColor: '#FFFFFF', borderColor: 'transparent' },
        viewMore: { text: 'Ver más...', background: 'linear-gradient(135deg, #01c2cc 0%, #7528ee 100%)', textColor: '#FFFFFF', borderColor: 'transparent' }
      };
    }

    const newTheme = {
      ...currentTheme,
      [mode]: {
        ...currentTheme[mode],
        buttons: {
          ...currentTheme[mode].buttons,
          [buttonType]: style
        }
      }
    };

    const newPageData = {
      ...pageData,
      theme: newTheme
    };
    
    // Actualizar pageData
    setPageData(newPageData);
    
    // IMPORTANTE: También actualizar el ThemeContext inmediatamente
    if (setThemeConfig) {
      
      setThemeConfig(newTheme as ThemeConfig);
    }
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
