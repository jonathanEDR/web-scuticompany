/**
 * 📁 Tipos TypeScript para el módulo de Proyectos
 */

// ============================================
// TIPOS DE PROYECTO
// ============================================

export interface Tecnologia {
  nombre: string;
  icono?: string;
  color?: string;
}

export interface Metrica {
  nombre: string;
  valor: string;
  icono?: string;
  descripcion?: string;
}

export interface ProyectoSEO {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  keywords?: string[];
}

// ============================================
// TIPOS COMERCIALES (Sistema en venta)
// ============================================

export interface ModuloSistema {
  nombre: string;
  descripcion?: string;
  icono?: string;
}

export interface BeneficioSistema {
  titulo: string;
  descripcion?: string;
  icono?: string;
}

export type PlanPeriodo = 'unico' | 'mensual' | 'anual';

export interface PlanSistema {
  nombre: string;
  precio: number | null;
  moneda?: string;
  periodo: PlanPeriodo;
  descripcion?: string;
  caracteristicas: string[];
  destacado?: boolean;
}

export interface FaqSistema {
  pregunta: string;
  respuesta: string;
}

export const PLAN_PERIODOS: Record<PlanPeriodo, string> = {
  unico: 'Pago único',
  mensual: '/mes',
  anual: '/año'
};

export interface Proyecto {
  _id: string;
  nombre: string;
  slug: string;
  descripcionCorta: string;
  descripcionCompleta: string;
  contenidoFormato: 'html' | 'markdown';
  
  // Visual
  imagenPrincipal: string;
  imagenes: string[];
  icono: string;
  colorPrincipal: string;
  logoCliente: string;
  
  // URLs
  urlDemo: string;
  urlRepositorio: string;
  
  // Metadata
  tecnologias: Tecnologia[];
  categoria: ProyectoCategoria;
  industria: string;
  etiquetas: string[];
  
  // Estado
  estado: ProyectoEstado;
  visibleEnPortfolio: boolean;
  destacado: boolean;
  fechaLanzamiento: string | null;
  fechaFinalizacion: string | null;
  
  // Datos opcionales del proyecto
  clienteNombre?: string;
  fechaInicio?: string;
  fechaFin?: string;
  
  // Comercial (sistema en venta)
  rubro?: string;
  problemasQueResuelve?: string[];
  beneficios?: BeneficioSistema[];
  modulos?: ModuloSistema[];
  planes?: PlanSistema[];
  precioDesde?: number | null;
  monedaPrecio?: string;
  urlVideo?: string;
  faqs?: FaqSistema[];

  // Resultados
  resultados: {
    descripcion: string;
    metricas: Metrica[];
  };
  
  // SEO
  seo: ProyectoSEO;
  
  // Auditoría
  createdBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  orden: number;
  vistas: number;

  // Virtuals
  esPublico?: boolean;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export type ProyectoCategoria = 'web' | 'mobile' | 'desktop' | 'api' | 'ecommerce' | 'crm' | 'erp' | 'saas' | 'landing' | 'otro';

export type ProyectoEstado = 'en_desarrollo' | 'activo' | 'mantenimiento' | 'completado' | 'archivado';

// ============================================
// TIPOS DE REQUEST/RESPONSE
// ============================================

export interface CreateProyectoRequest {
  nombre: string;
  slug?: string;
  descripcionCorta: string;
  descripcionCompleta: string;
  contenidoFormato?: 'html' | 'markdown';
  imagenPrincipal?: string;
  imagenes?: string[];
  icono?: string;
  colorPrincipal?: string;
  logoCliente?: string;
  urlDemo?: string;
  urlRepositorio?: string;
  tecnologias?: Tecnologia[];
  categoria?: ProyectoCategoria;
  industria?: string;
  etiquetas?: string[];
  estado?: ProyectoEstado;
  visibleEnPortfolio?: boolean;
  destacado?: boolean;
  fechaLanzamiento?: string;
  fechaFinalizacion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  clienteNombre?: string;
  rubro?: string;
  problemasQueResuelve?: string[];
  beneficios?: BeneficioSistema[];
  modulos?: ModuloSistema[];
  planes?: PlanSistema[];
  precioDesde?: number | null;
  monedaPrecio?: string;
  urlVideo?: string;
  faqs?: FaqSistema[];
  resultados?: {
    descripcion: string;
    metricas: Metrica[];
  };
  seo?: ProyectoSEO;
  orden?: number;
}

export type UpdateProyectoRequest = Partial<CreateProyectoRequest>;

export interface ProyectoFilters {
  categoria?: ProyectoCategoria;
  estado?: ProyectoEstado;
  visibleEnPortfolio?: boolean;
  destacado?: boolean;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface ProyectoStatsResponse {
  total: number;
  activos: number;
  enDesarrollo?: number;
  enPortfolio: number;
  destacados?: number;
  totalVistas?: number;
  porCategoria?: {
    categoria: string;
    count: number;
  }[];
  // Allow extra fields from backend
  [key: string]: any;
}

export interface CategoriaProyecto {
  value: string;
  label: string;
  count: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// ============================================
// CONSTANTES
// ============================================

export const PROYECTO_CATEGORIAS: Record<ProyectoCategoria, { label: string; icon: string; color: string }> = {
  web: { label: 'Web', icon: 'Globe', color: '#3B82F6' },
  mobile: { label: 'Mobile', icon: 'Smartphone', color: '#8B5CF6' },
  desktop: { label: 'Desktop', icon: 'Monitor', color: '#6366F1' },
  api: { label: 'API', icon: 'Zap', color: '#F59E0B' },
  ecommerce: { label: 'E-commerce', icon: 'ShoppingCart', color: '#10B981' },
  crm: { label: 'CRM', icon: 'Briefcase', color: '#EF4444' },
  erp: { label: 'ERP', icon: 'Building2', color: '#F97316' },
  saas: { label: 'SaaS', icon: 'Cloud', color: '#06B6D4' },
  landing: { label: 'Landing', icon: 'FileText', color: '#EC4899' },
  otro: { label: 'Otro', icon: 'Package', color: '#6B7280' }
};

export const PROYECTO_ESTADOS: Record<ProyectoEstado, { label: string; icon: string; color: string; bgColor: string }> = {
  en_desarrollo: { label: 'En desarrollo', icon: 'Hammer', color: '#F59E0B', bgColor: 'bg-yellow-100 text-yellow-800' },
  activo: { label: 'Activo', icon: 'CheckCircle2', color: '#10B981', bgColor: 'bg-green-100 text-green-800' },
  mantenimiento: { label: 'Mantenimiento', icon: 'Wrench', color: '#6366F1', bgColor: 'bg-indigo-100 text-indigo-800' },
  completado: { label: 'Completado', icon: 'Flag', color: '#3B82F6', bgColor: 'bg-blue-100 text-blue-800' },
  archivado: { label: 'Archivado', icon: 'Package', color: '#6B7280', bgColor: 'bg-gray-100 text-gray-800' }
};
