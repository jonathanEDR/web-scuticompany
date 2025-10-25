
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
  contactFormData: {
    title: string;
    subtitle: string;
    description: string;
    backgroundImage?: {
      light?: string;
      dark?: string;
    };
    backgroundImageAlt?: string;
    fields?: {
      nombreLabel?: string;
      nombrePlaceholder?: string;
      nombreRequired?: boolean;
      celularLabel?: string;
      celularPlaceholder?: string;
      celularRequired?: boolean;
      correoLabel?: string;
      correoPlaceholder?: string;
      correoRequired?: boolean;
      mensajeLabel?: string;
      mensajePlaceholder?: string;
      mensajeRequired?: boolean;
      mensajeRows?: number;
      termsText?: string;
      termsLink?: string;
      termsRequired?: boolean;
    };
    button?: {
      text?: string;
      loadingText?: string;
    };
    messages?: {
      success?: string;
      error?: string;
    };
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

  // Datos Contact Form con configuración predeterminada
  const contactFormData = {
    title: DEFAULT_PAGE_CONFIG.contactForm.title,
    subtitle: DEFAULT_PAGE_CONFIG.contactForm.subtitle,
    description: DEFAULT_PAGE_CONFIG.contactForm.description,
    backgroundImage: DEFAULT_PAGE_CONFIG.contactForm.backgroundImage ? {
      light: DEFAULT_PAGE_CONFIG.contactForm.backgroundImage.light,
      dark: DEFAULT_PAGE_CONFIG.contactForm.backgroundImage.dark
    } : undefined,
    backgroundImageAlt: DEFAULT_PAGE_CONFIG.contactForm.backgroundImageAlt,
    fields: {
      nombreLabel: 'Nombre',
      nombrePlaceholder: 'Tu nombre completo',
      nombreRequired: true,
      celularLabel: 'Celular / Teléfono',
      celularPlaceholder: '+51 999 999 999',
      celularRequired: true,
      correoLabel: 'Correo Electrónico',
      correoPlaceholder: 'tu@email.com',
      correoRequired: true,
      mensajeLabel: 'Cuéntanos sobre tu proyecto',
      mensajePlaceholder: 'Describe tu proyecto, necesidades o consulta...',
      mensajeRequired: true,
      mensajeRows: 5,
      termsText: 'Acepto la Política de Privacidad y Términos de Servicio',
      termsLink: '/terminos',
      termsRequired: true,
    },
    button: {
      text: 'ENVIAR',
      loadingText: 'Enviando...',
    },
    messages: {
      success: '¡Gracias por contactarnos! Te responderemos pronto.',
      error: 'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.',
    },
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
    contactFormData,
    currentBackgroundImageHero,
    currentBackgroundImageSolutions,
    loading
  };
};

export default useDefaultPageData;