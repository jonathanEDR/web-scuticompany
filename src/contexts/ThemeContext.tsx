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

export interface ThemeConfig {
  default: 'light' | 'dark';
  lightMode: ThemeColors;
  darkMode: ThemeColors;
}

interface ThemeContextType {
  theme: 'light' | 'dark';
  colors: ThemeColors;
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
    border: '#E5E7EB'
  },
  darkMode: {
    primary: '#A78BFA',
    secondary: '#22D3EE',
    background: '#111827',
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    cardBg: '#1F2937',
    border: '#374151'
  }
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(defaultThemeConfig);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Obtener tema guardado o usar el del sistema
    const savedTheme = localStorage.getItem('scuti-theme') as 'light' | 'dark';
    if (savedTheme) return savedTheme;
    
    // Detectar preferencia del sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  // Detectar si estamos en una página pública
  const isPublicPage = !window.location.pathname.startsWith('/dashboard');

  // Aplicar tema al documento SOLO en páginas públicas
  useEffect(() => {
    if (!isPublicPage) return; // No aplicar en dashboard
    
    const root = document.documentElement;
    const colors = theme === 'light' ? themeConfig.lightMode : themeConfig.darkMode;
    
    // Aplicar variables CSS
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-text-secondary', colors.textSecondary);
    root.style.setProperty('--color-card-bg', colors.cardBg);
    root.style.setProperty('--color-border', colors.border);
    
    // Añadir/quitar clase dark SOLO en páginas públicas
    if (theme === 'dark') {
      root.classList.add('public-dark');
    } else {
      root.classList.remove('public-dark');
    }
    
    // Guardar preferencia
    localStorage.setItem('scuti-theme', theme);
  }, [theme, themeConfig]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const colors = theme === 'light' ? themeConfig.lightMode : themeConfig.darkMode;

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      colors, 
      themeConfig,
      toggleTheme, 
      setThemeConfig,
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
