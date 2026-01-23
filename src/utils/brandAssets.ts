/**
 * SCUTI AI Brand Assets
 * Constantes para mantener consistencia de marca en toda la aplicación
 */

// URLs de la mascota/logo de SCUTI AI
export const SCUTI_AI_MASCOT = {
  // Imagen principal PNG (robot mascota)
  png: 'https://res.cloudinary.com/ds54wlchi/image/upload/v1761502909/web-scuti/uze3gepsrrjpe43uobxj.png',

  // Iconos SVG para diferentes temas
  svg: {
    light: 'https://res.cloudinary.com/ds54wlchi/raw/upload/v1763671179/web-scuti/1763671179440_0ewgahyuyttq.svg',
    dark: 'https://res.cloudinary.com/ds54wlchi/raw/upload/v1763671191/web-scuti/1763671191111_ajz1q6thw3t.svg'
  },

  // Alt text para accesibilidad
  alt: 'SCUTI AI Asistente',

  // Fallback local
  fallback: '/FAVICON.png'
};

// Colores de marca SCUTI AI
export const SCUTI_AI_COLORS = {
  primary: {
    from: '#3B82F6', // blue-500
    to: '#8B5CF6',   // purple-500
  },
  gradient: 'linear-gradient(to bottom right, #3B82F6, #8B5CF6)',
  gradientHover: 'linear-gradient(to bottom right, #2563EB, #7C3AED)',
};

// Tamaños predefinidos para el avatar de SCUTI AI
export const SCUTI_AI_SIZES = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
  '2xl': 'w-20 h-20',
};

export default SCUTI_AI_MASCOT;
