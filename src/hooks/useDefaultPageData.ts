
/**
 * Hook para obtener datos de página con configuración predeterminada
 * Se usa en páginas públicas para garantizar funcionamiento sin conexión a BD
 */

import { useState, useEffect } from 'react';
import { DEFAULT_PAGE_CONFIG } from '../utils/defaultConfig';
import { getImageWithFallback } from '../utils/imageMapper';
import { useTheme } from '../contexts/ThemeContext';

export interface UseDefaultPageDataReturn {
  heroData: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    backgroundImage?: {
      light?: string;
      dark?: string;
    };
    backgroundImageAlt?: string;
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
  };
  solutionsData: {
    title: string;
    description: string;
    backgroundImage?: {
      light?: string;
      dark?: string;
    };
    backgroundImageAlt?: string;
    items: Array<{
      title: string;
      description: string;
      icon: string;
      gradient: string;
    }>;
  };
  currentBackgroundImageHero: string;
  currentBackgroundImageSolutions: string;
  loading: boolean;
}

export const useDefaultPageData = (): UseDefaultPageDataReturn => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);

  // Datos Hero con imágenes predeterminadas
  const heroData = {
    ...DEFAULT_PAGE_CONFIG.hero,
    backgroundImage: {
      light: DEFAULT_PAGE_CONFIG.hero.backgroundImage.light,
      dark: DEFAULT_PAGE_CONFIG.hero.backgroundImage.dark
    }
  };

  // Datos Solutions con imágenes predeterminadas
  const solutionsData = {
    title: DEFAULT_PAGE_CONFIG.solutions.title,
    description: DEFAULT_PAGE_CONFIG.solutions.subtitle,
    backgroundImage: {
      light: DEFAULT_PAGE_CONFIG.solutions.backgroundImage.light,
      dark: DEFAULT_PAGE_CONFIG.solutions.backgroundImage.dark
    },
    backgroundImageAlt: DEFAULT_PAGE_CONFIG.solutions.backgroundImageAlt,
    items: DEFAULT_PAGE_CONFIG.solutions.cards.map(card => ({
      title: card.title,
      description: card.description,
      icon: card.icon,
      gradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)'
    }))
  };

  // Obtener imágenes según tema actual con fallback
  const currentBackgroundImageHero = getImageWithFallback(1, 'hero', theme as 'light' | 'dark');
  const currentBackgroundImageSolutions = getImageWithFallback(2, 'solutions', theme as 'light' | 'dark');

  useEffect(() => {
    // Simular carga mínima para transiciones suaves
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return {
    heroData,
    solutionsData,
    currentBackgroundImageHero,
    currentBackgroundImageSolutions,
    loading
  };
};

export default useDefaultPageData;