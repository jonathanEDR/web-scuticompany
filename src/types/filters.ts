/**
 * 🔍 TIPOS DE FILTROS
 * Definiciones TypeScript para el sistema de filtros avanzados
 */

export interface PriceRange {
  min: number;
  max: number;
}

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface ServicioFilters {
  // Búsqueda general
  search?: string;
  
  // Categorías
  categorias?: string[];
  
  // Rango de precio
  precioMin?: number;
  precioMax?: number;
  tipoPrecio?: ('fijo' | 'desde' | 'personalizado')[];
  
  // Estado
  estado?: ('activo' | 'inactivo' | 'borrador')[];
  activo?: boolean;
  destacado?: boolean;
  visibleEnWeb?: boolean;
  
  // Características
  caracteristicas?: string[];
  etiquetas?: string[];
  
  // Fechas
  fechaCreacionDesde?: Date | null;
  fechaCreacionHasta?: Date | null;
  fechaActualizacionDesde?: Date | null;
  fechaActualizacionHasta?: Date | null;
  
  // Otros
  conPaquetes?: boolean;
  conImagenes?: boolean;
}

export interface SortOption {
  field: string;
  order: 'asc' | 'desc';
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { field: 'createdAt', order: 'desc', label: 'Más recientes' },
  { field: 'createdAt', order: 'asc', label: 'Más antiguos' },
  { field: 'titulo', order: 'asc', label: 'Nombre (A-Z)' },
  { field: 'titulo', order: 'desc', label: 'Nombre (Z-A)' },
  { field: 'precio', order: 'asc', label: 'Precio menor' },
  { field: 'precio', order: 'desc', label: 'Precio mayor' },
  { field: 'destacado', order: 'desc', label: 'Destacados primero' },
];

export const CATEGORIAS_OPTIONS = [
  { value: 'desarrollo', label: 'Desarrollo Web', color: '#8B5CF6' },
  { value: 'diseno', label: 'Diseño', color: '#EC4899' },
  { value: 'marketing', label: 'Marketing Digital', color: '#F59E0B' },
  { value: 'seo', label: 'SEO', color: '#10B981' },
  { value: 'hosting', label: 'Hosting', color: '#3B82F6' },
  { value: 'consultoria', label: 'Consultoría', color: '#6366F1' },
  { value: 'otro', label: 'Otro', color: '#6B7280' },
];

export const TIPO_PRECIO_OPTIONS = [
  { value: 'fijo', label: 'Precio Fijo', icon: '💰' },
  { value: 'desde', label: 'Desde', icon: '📊' },
  { value: 'personalizado', label: 'Personalizado', icon: '✨' },
];

export const ESTADO_OPTIONS = [
  { value: 'activo', label: 'Activo', color: 'green' },
  { value: 'inactivo', label: 'Inactivo', color: 'red' },
  { value: 'borrador', label: 'Borrador', color: 'gray' },
];
