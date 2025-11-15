/**
 * Tipos para el sistema SCUTI AI
 */

export type CategoryType = 'blog' | 'servicios' | 'seo' | 'agenda';

export interface QuickAction {
  icon: string;
  label: string;
  prompt: string;
  color?: string;
}

export interface CategoryConfig {
  id: CategoryType;
  title: string;
  description: string;
  emoji: string;
  bgColor: string;
  actions: QuickAction[];
}

export const CATEGORY_CONFIGS: Record<CategoryType, CategoryConfig> = {
  blog: {
    id: 'blog',
    title: 'Contenido & Blog',
    description: 'Crea, gestiona y optimiza tus artículos',
    emoji: '✍️',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    actions: [
      { 
        icon: '✍️', 
        label: 'Crear nuevo blog', 
        prompt: 'mostrar contenido',
        color: 'bg-blue-100 dark:bg-blue-800/30 hover:bg-blue-200 dark:hover:bg-blue-800/50'
      },
      { 
        icon: '📝', 
        label: 'Ver blogs publicados', 
        prompt: 'mostrar blog',
        color: 'bg-blue-100 dark:bg-blue-800/30 hover:bg-blue-200 dark:hover:bg-blue-800/50'
      }
    ]
  },
  
  servicios: {
    id: 'servicios',
    title: 'Servicios',
    description: 'Gestiona tu portafolio de servicios',
    emoji: '💼',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    actions: [
      { 
        icon: '➕', 
        label: 'Crear servicio', 
        prompt: 'crear nuevo servicio',
        color: 'bg-purple-100 dark:bg-purple-800/30 hover:bg-purple-200 dark:hover:bg-purple-800/50'
      },
      { 
        icon: '📋', 
        label: 'Ver servicios', 
        prompt: 'mostrar servicios',
        color: 'bg-purple-100 dark:bg-purple-800/30 hover:bg-purple-200 dark:hover:bg-purple-800/50'
      },
      { 
        icon: '✏️', 
        label: 'Editar servicio', 
        prompt: 'editar servicio',
        color: 'bg-blue-100 dark:bg-blue-800/30 hover:bg-blue-200 dark:hover:bg-blue-800/50'
      },
      { 
        icon: '📊', 
        label: 'Analizar portafolio', 
        prompt: 'analizar mi portafolio de servicios',
        color: 'bg-green-100 dark:bg-green-800/30 hover:bg-green-200 dark:hover:bg-green-800/50'
      },
      { 
        icon: '🎨', 
        label: 'Optimizar presentación', 
        prompt: 'optimizar presentación de servicios',
        color: 'bg-pink-100 dark:bg-pink-800/30 hover:bg-pink-200 dark:hover:bg-pink-800/50'
      }
    ]
  },
  
  seo: {
    id: 'seo',
    title: 'SEO',
    description: 'Optimiza tu presencia en buscadores',
    emoji: '🔍',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    actions: [
      { 
        icon: '🔍', 
        label: 'Auditoría SEO completa', 
        prompt: 'realizar auditoría seo completa',
        color: 'bg-green-100 dark:bg-green-800/30 hover:bg-green-200 dark:hover:bg-green-800/50'
      },
      { 
        icon: '📈', 
        label: 'Analizar keywords', 
        prompt: 'analizar keywords de mi sitio',
        color: 'bg-blue-100 dark:bg-blue-800/30 hover:bg-blue-200 dark:hover:bg-blue-800/50'
      },
      { 
        icon: '🎯', 
        label: 'Optimizar página', 
        prompt: 'optimizar seo de una página',
        color: 'bg-purple-100 dark:bg-purple-800/30 hover:bg-purple-200 dark:hover:bg-purple-800/50'
      },
      { 
        icon: '📊', 
        label: 'Métricas SEO', 
        prompt: 'mostrar métricas seo',
        color: 'bg-orange-100 dark:bg-orange-800/30 hover:bg-orange-200 dark:hover:bg-orange-800/50'
      },
      { 
        icon: '🔗', 
        label: 'Análisis de enlaces', 
        prompt: 'analizar estructura de enlaces',
        color: 'bg-teal-100 dark:bg-teal-800/30 hover:bg-teal-200 dark:hover:bg-teal-800/50'
      }
    ]
  },
  
  agenda: {
    id: 'agenda',
    title: 'Agenda',
    description: 'Organiza eventos y reuniones',
    emoji: '📅',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    actions: [
      { 
        icon: '📅', 
        label: 'Ver mis eventos', 
        prompt: 'mostrar eventos',
        color: 'bg-pink-100 dark:bg-pink-800/30 hover:bg-pink-200 dark:hover:bg-pink-800/50'
      },
      { 
        icon: '📆', 
        label: 'Eventos de hoy', 
        prompt: 'mostrar eventos de hoy',
        color: 'bg-blue-100 dark:bg-blue-800/30 hover:bg-blue-200 dark:hover:bg-blue-800/50'
      },
      { 
        icon: '🗓️', 
        label: 'Próximos eventos', 
        prompt: 'mostrar próximos eventos',
        color: 'bg-purple-100 dark:bg-purple-800/30 hover:bg-purple-200 dark:hover:bg-purple-800/50'
      }
    ]
  }
};
