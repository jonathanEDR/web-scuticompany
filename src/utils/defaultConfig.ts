
/**
 * Configuración predeterminada para el frontend
 * Se usa como fallback cuando no hay conexión con la base de datos
 */

// Helper para codificar URLs correctamente
const encodeImagePath = (path: string): string => {
  // Separar la ruta en partes
  const parts = path.split('/');
  // Codificar solo el nombre del archivo (última parte)
  const filename = parts[parts.length - 1];
  const encodedFilename = encodeURIComponent(filename);
  parts[parts.length - 1] = encodedFilename;
  return parts.join('/');
};

export interface DefaultImageConfig {
  light: string;
  dark: string;
}

export interface DefaultHeroConfig {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: DefaultImageConfig;
  backgroundImageAlt: string;
  styles: {
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

export interface DefaultSolutionsConfig {
  title: string;
  subtitle: string;
  backgroundImage: DefaultImageConfig;
  backgroundImageAlt: string;
  cards: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    iconLight?: string;
    iconDark?: string;
  }>;
}

export interface DefaultThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    textSecondary: string;
    card: string;
    border: string;
  };
}

// Mapeo de imágenes públicas según numeración:
// HERO SECTION:
//   - 1.webp = tema oscuro/negro
//   - 9.webp = tema claro/blanco
// SOLUTIONS SECTION:
//   - 2.webp = tema oscuro/negro
//   - 10.webp = tema claro/blanco

export const getHeroBackgroundImages = (): DefaultImageConfig => ({
  light: '/9.webp',    // Imagen 9 para tema claro
  dark: '/1.webp'      // Imagen 1 para tema oscuro
});

export const getSolutionsBackgroundImages = (): DefaultImageConfig => ({
  light: '/10.webp',   // Imagen 10 para tema claro
  dark: '/2.webp'      // Imagen 2 para tema oscuro
});

// Configuración predeterminada para Hero Section
export const DEFAULT_HERO_CONFIG: DefaultHeroConfig = {
  title: 'Transformamos tu empresa con tecnología inteligente',
  subtitle: 'Innovamos para que tu empresa avance al ritmo de la tecnología.',
  description: 'Transformamos procesos con <strong>soluciones digitales</strong>, <strong>proyectos de software</strong> y <strong>modelos de IA</strong> personalizados.',
  ctaText: 'Conoce nuestros servicios',
  ctaLink: '/servicios',
  backgroundImage: getHeroBackgroundImages(),
  backgroundImageAlt: 'Scuti Company - Tecnología inteligente',
  styles: {
    light: {
      titleColor: '#1e293b',
      subtitleColor: '#475569', 
      descriptionColor: '#64748b'
    },
    dark: {
      titleColor: '#f8fafc',
      subtitleColor: '#e2e8f0',
      descriptionColor: '#cbd5e1'
    }
  }
};

// Configuración predeterminada para Solutions Section  
export const DEFAULT_SOLUTIONS_CONFIG: DefaultSolutionsConfig = {
  title: 'Soluciones', // Título según maqueta
  subtitle: 'En el dinámico entorno empresarial de hoy, la tecnología es la columna vertebral del éxito. Impulsa la innovación, seguridad y el crecimiento de tu negocio.',
  backgroundImage: getSolutionsBackgroundImages(),
  backgroundImageAlt: 'Scuti Company - Soluciones tecnológicas',
  cards: [
    {
      id: '1',
      title: 'Consultoría TI',
      description: 'Diagnóstico tecnológico, optimización de procesos y asesoríaen transformación digital.',
      icon: 'code',
      iconLight: encodeImagePath('/ICONOS/ICONO_1_FONDO_BLANCO.png'),
      iconDark: encodeImagePath('/ICONOS/ICONO_1_FONDO_NEGRO.png')
    },
    {
      id: '2', 
      title: 'Proyectos Tecnológicos',
      description: 'Planificación, desarrollo e implementación de software ysistemas.',
      icon: 'brain',
      iconLight: encodeImagePath('/ICONOS/ICONO_2_FONDO_BLANCO.png'),
      iconDark: encodeImagePath('/ICONOS/ICONO_2_FONDO_NEGRO.png')
    },
    {
      id: '3',
      title: 'Inteligencia Artificial',
      description: 'Soluciones de automatización,análisis predictivo y modelos personalizados.',
      icon: 'digital',
      iconLight: encodeImagePath('/ICONOS/ICONO_3_FONDO_BLANCO.png'),
      iconDark: encodeImagePath('/ICONOS/ICONO_3_FONDO_NEGRO.png')
    }
  ]
};

// Configuración predeterminada de tema
export const DEFAULT_THEME_CONFIG: DefaultThemeConfig = {
  colors: {
    primary: '#8b5cf6',      // Purple
    secondary: '#06b6d4',    // Cyan
    background: '#0f172a',   // Slate-900
    text: '#f8fafc',         // Slate-50
    textSecondary: '#cbd5e1', // Slate-300
    card: '#1e293b',         // Slate-800
    border: '#334155'        // Slate-700
  }
};

// Función para obtener todas las imágenes disponibles
export const getAllAvailableImages = () => {
  const images = [];
  
  // Imágenes 1-3 (disponibles actualmente)
  for (let i = 1; i <= 3; i++) {
    images.push({
      id: i,
      light: `/ICONOS/ICONO ${i} FONDO BLANCO.png`,
      dark: `/ICONOS/ICONO ${i} FONDO NEGRO.png`,
      section: i === 1 ? 'hero' : i === 2 ? 'solutions' : 'other'
    });
  }
  
  return images;
};

// Función para seleccionar imagen por ID
export const getImageById = (imageId: number): DefaultImageConfig | null => {
  if (imageId < 1 || imageId > 3) return null;
  
  return {
    light: `/ICONOS/ICONO ${imageId} FONDO BLANCO.png`,
    dark: `/ICONOS/ICONO ${imageId} FONDO NEGRO.png`
  };
};

// Exportación de configuración completa por defecto
export const DEFAULT_PAGE_CONFIG = {
  hero: DEFAULT_HERO_CONFIG,
  solutions: DEFAULT_SOLUTIONS_CONFIG,
  theme: DEFAULT_THEME_CONFIG
};