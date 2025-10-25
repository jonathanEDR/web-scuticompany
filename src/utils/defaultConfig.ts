
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
  styles?: {
    light?: {
      titleColor?: string;
      descriptionColor?: string;
    };
    dark?: {
      titleColor?: string;
      descriptionColor?: string;
    };
  };
}

export interface DefaultValueAddedConfig {
  title: string;
  subtitle?: string;
  backgroundImage: DefaultImageConfig;
  backgroundImageAlt: string;
  showIcons?: boolean; // Opción para mostrar/ocultar iconos
  cards: Array<{
    id: string;
    title: string;
    description: string;
    icon?: string;
    iconLight?: string;
    iconDark?: string;
    gradient?: string;
  }>;
  cardsDesign?: {
    light: any;
    dark: any;
  };
}

export interface DefaultContactConfig {
  title: string;
  subtitle: string;
  description: string;
  fields: {
    nombre: {
      label: string;
      placeholder: string;
    };
    celular: {
      label: string;
      placeholder: string;
    };
    correo: {
      label: string;
      placeholder: string;
    };
    mensaje: {
      label: string;
      placeholder: string;
    };
  };
  submitButton: {
    text: string;
    loadingText: string;
  };
  termsText: string;
  successMessage: string;
  errorMessage: string;
  backgroundImage?: DefaultImageConfig;
  backgroundImageAlt?: string;
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

export const getValueAddedBackgroundImages = (): DefaultImageConfig => ({
  light: '/11.webp',   // Imagen 11 para tema claro
  dark: '/3.webp'      // Imagen 3 para tema oscuro
});

export const getContactBackgroundImages = (): DefaultImageConfig => ({
  light: '/12.webp',   // Imagen 12 para tema claro
  dark: '/4.webp'      // Imagen 4 para tema oscuro
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
  styles: {
    light: {
      titleColor: '#333333', // Color específico maqueta tema claro
      descriptionColor: '#7528ee' // Violeta específico maqueta
    },
    dark: {
      titleColor: '#FFFFFF', // Blanco para tema oscuro
      descriptionColor: '#D1D5DB' // Gris claro para tema oscuro
    }
  },
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

// Configuración predeterminada para Value Added Section
export const DEFAULT_VALUE_ADDED_CONFIG: DefaultValueAddedConfig = {
  title: 'Valor agregado',
  subtitle: '',
  showIcons: true, // Por defecto mostrar iconos
  backgroundImage: getValueAddedBackgroundImages(),
  backgroundImageAlt: 'Valor agregado Scuti Company',
  cards: [
    {
      id: '1',
      title: 'Garantía',
      description: 'Nuestros servicios cuentan con garantía de atención y de soporte técnico.',
      iconLight: encodeImagePath('/ICONOS/ICONO_1_FONDO_BLANCO.png'),
      iconDark: encodeImagePath('/ICONOS/ICONO_1_FONDO_NEGRO.png'),
      gradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)'
    },
    {
      id: '2',
      title: 'Asesoría comercial',
      description: 'Nuestra asesoría comercial evalúa cada requerimiento y propone la solución con las mejores herramientas de TI.',
      iconLight: encodeImagePath('/ICONOS/ICONO_2_FONDO_BLANCO.png'),
      iconDark: encodeImagePath('/ICONOS/ICONO_2_FONDO_NEGRO.png'),
      gradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)'
    },
    {
      id: '3',
      title: 'Personal calificado',
      description: 'Nuestros ingenieros cuentan con certificaciones y títulos realizados que respalda la experiencia sobre los servicios que ofrecemos.',
      iconLight: encodeImagePath('/ICONOS/ICONO_3_FONDO_BLANCO.png'),
      iconDark: encodeImagePath('/ICONOS/ICONO_3_FONDO_NEGRO.png'),
      gradient: 'linear-gradient(135deg, #8B5CF6, #06B6D4)'
    }
  ]
};

// Configuración predeterminada para Contact Form
export const DEFAULT_CONTACT_CONFIG: DefaultContactConfig = {
  title: 'Contáctanos',
  subtitle: 'Escríbenos',
  description: 'Déjanos tus datos y nos pondremos en contacto contigo para brindarte la mejor asesoría.',
  fields: {
    nombre: {
      label: 'Nombre completo',
      placeholder: 'Ingresa tu nombre completo'
    },
    celular: {
      label: 'Número de celular',
      placeholder: 'Ingresa tu número de celular'
    },
    correo: {
      label: 'Correo electrónico',
      placeholder: 'Ingresa tu correo electrónico'
    },
    mensaje: {
      label: 'Mensaje',
      placeholder: 'Escribe tu mensaje aquí...'
    }
  },
  submitButton: {
    text: 'Enviar mensaje',
    loadingText: 'Enviando...'
  },
  termsText: 'Al enviar este formulario, acepto los términos y condiciones de privacidad.',
  successMessage: '¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.',
  errorMessage: 'Error al enviar el mensaje. Por favor, inténtalo nuevamente.',
  backgroundImage: getContactBackgroundImages(),
  backgroundImageAlt: 'Fondo de contacto Scuti Company'
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
  valueAdded: DEFAULT_VALUE_ADDED_CONFIG,
  contactForm: DEFAULT_CONTACT_CONFIG,
  theme: DEFAULT_THEME_CONFIG
};