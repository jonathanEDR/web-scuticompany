import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Tipos para los colores del tema
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  textSecondary: string;
  cardBg: string;
  border: string;
}

interface ButtonTheme {
  // Formato antiguo (para compatibilidad)
  bg?: string;
  text?: string;
  border?: string;
  hover?: string;
  hoverText?: string;
  // Formato nuevo simplificado
  background?: string;
  textColor?: string;
  borderColor?: string;
}

export interface ExtendedThemeColors extends ThemeColors {
  buttons?: {
    ctaPrimary?: ButtonTheme;
    contact?: ButtonTheme;
    dashboard?: ButtonTheme;
  };
}

export interface ThemeConfig {
  default: 'light' | 'dark';
  lightMode: ExtendedThemeColors;
  darkMode: ExtendedThemeColors;
}

interface ThemeContextType {
  theme: 'light' | 'dark';
  colors: ExtendedThemeColors;
  themeConfig: ThemeConfig | null;
  toggleTheme: () => void;
  setThemeConfig: (config: ThemeConfig) => void;
  isPublicPage: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Temas por defecto
const defaultThemeConfig: ThemeConfig = {
  default: 'light',
  lightMode: {
    primary: '#8B5CF6',
    secondary: '#06B6D4',
    background: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    cardBg: '#F9FAFB',
    border: '#E5E7EB',
    buttons: {
      ctaPrimary: { bg: '#8B5CF6', text: '#FFFFFF', hover: '#7C3AED', border: 'transparent' },
      contact: { bg: '#10B981', text: '#FFFFFF', hover: '#059669', border: '#10B981' },
      dashboard: { bg: '#06B6D4', text: '#FFFFFF', hover: '#0891B2', border: 'transparent' }
    }
  },
  darkMode: {
    primary: '#A78BFA',
    secondary: '#22D3EE',
    background: '#111827',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    cardBg: '#1F2937',
    border: '#374151',
    buttons: {
      ctaPrimary: { bg: '#A78BFA', text: '#111827', hover: '#8B5CF6', border: 'transparent' },
      contact: { bg: '#34D399', text: '#111827', hover: '#10B981', border: '#34D399' },
      dashboard: { bg: '#22D3EE', text: '#111827', hover: '#06B6D4', border: 'transparent' }
    }
  }
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(defaultThemeConfig);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Obtener tema guardado o usar el del sistema
    const savedTheme = localStorage.getItem('scuti-theme') as 'light' | 'dark';
    if (savedTheme) {
      return savedTheme;
    }

    // Detectar preferencia del sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  });

  // Detectar si estamos en una página pública (REACTIVO - se actualiza con cada render)
  const [isPublicPage, setIsPublicPage] = useState(!window.location.pathname.startsWith('/dashboard'));

  // Actualizar isPublicPage cuando cambie la ubicación
  useEffect(() => {
    const updatePageType = () => {
      const isDashboard = window.location.pathname.startsWith('/dashboard');
      setIsPublicPage(!isDashboard);
      console.log('📍 Ubicación detectada:', window.location.pathname, '- Página pública:', !isDashboard);
    };

    // Verificar inmediatamente
    updatePageType();

    // Escuchar cambios en el historial (navegación con botones del navegador)
    window.addEventListener('popstate', updatePageType);

    // Interceptar pushState y replaceState de React Router
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function(...args) {
      originalPushState.apply(this, args);
      updatePageType();
    };

    window.history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      updatePageType();
    };

    return () => {
      window.removeEventListener('popstate', updatePageType);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  // Aplicar tema al documento
  useEffect(() => {
    const root = document.documentElement;

    // Guardar preferencia siempre
    localStorage.setItem('scuti-theme', theme);

    // NUEVO: Aplicar clase 'dark' GLOBALMENTE para Tailwind (dashboard + público)
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Solo aplicar CSS variables en páginas públicas (mantiene funcionalidad CMS)
    if (isPublicPage) {
      const colors = theme === 'light' ? themeConfig.lightMode : themeConfig.darkMode;

      // Aplicar variables CSS
      root.style.setProperty('--color-primary', colors.primary);
      root.style.setProperty('--color-secondary', colors.secondary);
      root.style.setProperty('--color-background', colors.background);
      root.style.setProperty('--color-text', colors.text);
      root.style.setProperty('--color-text-secondary', colors.textSecondary);
      root.style.setProperty('--color-card-bg', colors.cardBg);
      root.style.setProperty('--color-border', colors.border);

      // Aplicar variables de botones (NUEVO FORMATO SIMPLIFICADO)
      if (colors.buttons) {
        // Botón CTA Principal
        if (colors.buttons.ctaPrimary) {
          root.style.setProperty('--color-cta-bg', colors.buttons.ctaPrimary.background || colors.buttons.ctaPrimary.bg || 'transparent');
          root.style.setProperty('--color-cta-text', colors.buttons.ctaPrimary.textColor || colors.buttons.ctaPrimary.text || '#8B5CF6');
          root.style.setProperty('--color-cta-border', colors.buttons.ctaPrimary.borderColor || colors.buttons.ctaPrimary.border || 'transparent');
          root.style.setProperty('--color-cta-hover-bg', colors.buttons.ctaPrimary.hover || colors.buttons.ctaPrimary.background || 'transparent');
        }

        // Botón Contacto (FORMATO SIMPLIFICADO)
        if (colors.buttons.contact) {
          root.style.setProperty('--color-contact-bg', colors.buttons.contact.background || colors.buttons.contact.bg || 'transparent');
          root.style.setProperty('--color-contact-text', colors.buttons.contact.textColor || colors.buttons.contact.text || '#8B5CF6');
          root.style.setProperty('--color-contact-border', colors.buttons.contact.borderColor || colors.buttons.contact.border || 'transparent');
          root.style.setProperty('--color-contact-hover-bg', colors.buttons.contact.hover || colors.buttons.contact.borderColor || 'transparent');
          root.style.setProperty('--color-contact-hover-text', colors.buttons.contact.hoverText || '#FFFFFF');
        }

        // Botón Dashboard
        if (colors.buttons.dashboard) {
          root.style.setProperty('--color-dashboard-bg', colors.buttons.dashboard.background || colors.buttons.dashboard.bg || 'transparent');
          root.style.setProperty('--color-dashboard-text', colors.buttons.dashboard.textColor || colors.buttons.dashboard.text || '#FFFFFF');
          root.style.setProperty('--color-dashboard-border', colors.buttons.dashboard.borderColor || colors.buttons.dashboard.border || 'transparent');
          root.style.setProperty('--color-dashboard-hover-bg', colors.buttons.dashboard.hover || colors.buttons.dashboard.background || 'transparent');
        }
      }
    }
  }, [theme, themeConfig, isPublicPage]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const handleSetThemeConfig = (config: ThemeConfig) => {
    setThemeConfig(config);
  };

  const colors = theme === 'light' ? themeConfig.lightMode : themeConfig.darkMode;

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      colors, 
      themeConfig,
      toggleTheme, 
      setThemeConfig: handleSetThemeConfig,
      isPublicPage 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};
