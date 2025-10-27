# 🎨 PLAN DE IMPLEMENTACIÓN FRONTEND - MÓDULO DE SERVICIOS

## 🎯 OBJETIVO
Integrar completamente el módulo de servicios del backend en el frontend, creando una experiencia de usuario completa tanto para administradores como para usuarios finales.

---

## 📊 ANÁLISIS DE LO IMPLEMENTADO EN BACKEND

### ✅ Backend Completado:

#### **Modelos**:
- ✅ `Servicio.js` - Modelo completo con 30+ campos
- ✅ `PaqueteServicio.js` - Paquetes/Planes de servicios
- ✅ Sistema de roles y permisos integrado

#### **Controladores**:
- ✅ `servicioController.js` - CRUD completo + búsqueda avanzada
- ✅ `paqueteController.js` - Gestión de paquetes
- ✅ `servicioStatsController.js` - Dashboard y analytics

#### **Endpoints Disponibles** (17 principales):
```
ESTADÍSTICAS Y DASHBOARD:
GET  /api/servicios/dashboard           → Dashboard completo
GET  /api/servicios/stats               → Estadísticas generales
GET  /api/servicios/stats/ventas        → Estadísticas de ventas
GET  /api/servicios/stats/conversion    → Métricas de conversión

CRUD BÁSICO:
GET  /api/servicios                     → Listar servicios (con filtros avanzados)
POST /api/servicios                     → Crear servicio
GET  /api/servicios/:id                 → Obtener un servicio
PUT  /api/servicios/:id                 → Actualizar servicio
DELETE /api/servicios/:id               → Eliminar servicio

ACCIONES ESPECIALES:
POST   /api/servicios/:id/duplicar      → Duplicar servicio
PATCH  /api/servicios/:id/estado        → Cambiar estado
DELETE /api/servicios/:id/soft          → Soft delete
PATCH  /api/servicios/:id/restaurar     → Restaurar eliminado
PATCH  /api/servicios/bulk/estado       → Cambiar estado masivo
GET    /api/servicios/top/vendidos      → Top servicios
GET    /api/servicios/destacados        → Servicios destacados
GET    /api/servicios/buscar            → Búsqueda avanzada

PAQUETES:
GET  /api/servicios/:id/paquetes        → Obtener paquetes
POST /api/servicios/:id/paquetes        → Crear paquete
```

#### **Sistema de Permisos**:
```javascript
SUPER_ADMIN/ADMIN → Acceso total
MODERATOR → Crear y editar solo sus servicios
CLIENT/USER → Solo lectura de servicios públicos
```

---

## 🏗️ ARQUITECTURA FRONTEND A IMPLEMENTAR

```
frontend/src/
├── services/
│   └── serviciosApi.ts         [NUEVO] - Cliente API para servicios
│
├── types/
│   └── servicios.ts            [NUEVO] - Tipos TypeScript
│
├── hooks/
│   ├── useServicios.ts         [NUEVO] - Hook principal
│   ├── useServicioStats.ts     [NUEVO] - Hook para estadísticas
│   └── usePaquetes.ts          [NUEVO] - Hook para paquetes
│
├── pages/
│   ├── admin/
│   │   ├── ServiciosManagement.tsx      [NUEVO] - Página principal admin
│   │   ├── ServicioDashboard.tsx        [NUEVO] - Dashboard de servicios
│   │   └── ServicioForm.tsx             [NUEVO] - Crear/Editar servicio
│   │
│   └── public/
│       └── ServicesPublic.tsx           [EXISTE] - Mejorar para usar nueva API
│
└── components/
    ├── servicios/
    │   ├── ServicioCard.tsx             [NUEVO] - Card de servicio
    │   ├── ServicioList.tsx             [NUEVO] - Lista de servicios
    │   ├── ServicioFilters.tsx          [NUEVO] - Filtros avanzados
    │   ├── ServicioModal.tsx            [NUEVO] - Modal detalle
    │   ├── ServicioFormFields.tsx       [NUEVO] - Formulario campos
    │   ├── PaqueteCard.tsx              [NUEVO] - Card de paquete
    │   ├── PaqueteForm.tsx              [NUEVO] - Formulario paquete
    │   ├── EstadoBadge.tsx              [NUEVO] - Badge de estado
    │   ├── CategoriaBadge.tsx           [NUEVO] - Badge de categoría
    │   └── ServicioStats.tsx            [NUEVO] - Widgets de stats
    │
    └── dashboard/
        └── ServiciosDashboardWidget.tsx [NUEVO] - Widget para dashboard
```

---

## 📋 FASES DE IMPLEMENTACIÓN

### **FASE 1: Configuración Base** ⭐ [PRIORIDAD ALTA] ✅ COMPLETADA
**Tiempo estimado**: 2-3 horas
**Completada el**: 26 de Octubre, 2025

#### 1.1 Crear Tipos TypeScript (`types/servicios.ts`)

```typescript
// Tipos principales
export interface Servicio {
  _id: string;
  titulo: string;
  descripcion: string;
  descripcionCorta?: string;
  
  // Visual
  icono: string;
  iconoType: 'emoji' | 'url' | 'icon-name';
  colorIcono: string;
  colorFondo: string;
  orden: number;
  
  // Pricing
  precio?: number;
  precioMin?: number;
  precioMax?: number;
  tipoPrecio: 'fijo' | 'rango' | 'paquetes' | 'personalizado' | 'suscripcion';
  moneda: 'USD' | 'MXN' | 'EUR';
  
  // Duración
  duracion?: {
    valor: number;
    unidad: 'horas' | 'días' | 'semanas' | 'meses' | 'años';
  };
  
  // Estado y categoría
  estado: 'activo' | 'desarrollo' | 'pausado' | 'descontinuado' | 'agotado';
  categoria: 'desarrollo' | 'diseño' | 'marketing' | 'consultoría' | 'mantenimiento' | 'otro';
  
  // Features
  caracteristicas: string[];
  tecnologias?: string[];
  etiquetas: string[];
  
  // Gestión
  destacado: boolean;
  activo: boolean;
  visibleEnWeb: boolean;
  requiereContacto: boolean;
  esPlantilla: boolean;
  
  // Relaciones
  responsable?: string; // User ID
  departamento?: string;
  
  // Métricas
  vecesVendido: number;
  ingresoTotal: number;
  rating?: number;
  
  // SEO
  metaTitle?: string;
  metaDescription?: string;
  slug: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  
  // Relación virtual
  paquetes?: PaqueteServicio[];
}

export interface PaqueteServicio {
  _id: string;
  servicioId: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  precioOriginal?: number;
  moneda: 'USD' | 'MXN' | 'EUR';
  tipoFacturacion: 'unico' | 'mensual' | 'trimestral' | 'anual';
  
  caracteristicas: {
    texto: string;
    incluido: boolean;
    descripcion?: string;
    icono?: string;
  }[];
  
  limitaciones?: {
    tipo: 'cantidad' | 'tiempo' | 'feature' | 'otro';
    descripcion: string;
    valor?: any;
  }[];
  
  orden: number;
  destacado: boolean;
  disponible: boolean;
  vecesVendido: number;
  
  createdAt: string;
  updatedAt: string;
}

// Filtros
export interface ServicioFilters {
  categoria?: string;
  estado?: string;
  destacado?: boolean;
  activo?: boolean;
  visibleEnWeb?: boolean;
  etiqueta?: string;
  precioMin?: number;
  precioMax?: number;
  tipoPrecio?: string;
  departamento?: string;
  responsable?: string;
  search?: string;
}

// Paginación
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
}

// Respuestas API
export interface ServiciosResponse {
  success: boolean;
  data: Servicio[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ServicioResponse {
  success: boolean;
  data: Servicio;
}

// Dashboard Stats
export interface ServicioDashboardStats {
  resumen: {
    serviciosActivos: number;
    serviciosEnDesarrollo: number;
    serviciosPausados: number;
    totalServicios: number;
  };
  ingresos: {
    mes: number;
    anio: number;
    promedioPorServicio: number;
  };
  topServicios: {
    servicio: Servicio;
    ventas: number;
    ingresos: number;
  }[];
  ventasPorMes: {
    mes: string;
    ventas: number;
    ingresos: number;
  }[];
  paquetesMasPopulares: {
    paquete: PaqueteServicio;
    servicio: Servicio;
    ventas: number;
  }[];
}
```

---

#### 1.2 Crear Servicio API (`services/serviciosApi.ts`)

```typescript
import axios from 'axios';
import { getBackendUrl } from '../utils/apiConfig';
import type {
  Servicio,
  ServiciosResponse,
  ServicioResponse,
  ServicioFilters,
  PaginationParams,
  ServicioDashboardStats,
  PaqueteServicio
} from '../types/servicios';

const API_BASE_URL = getBackendUrl();

// Cliente axios configurado
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/servicios`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
apiClient.interceptors.request.use(async (config) => {
  // Obtener token de Clerk si existe
  const token = await window.Clerk?.session?.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================
// SERVICIOS - CRUD BÁSICO
// ============================================

export const serviciosApi = {
  // Obtener todos los servicios con filtros
  getAll: async (
    filters?: ServicioFilters,
    pagination?: PaginationParams
  ): Promise<ServiciosResponse> => {
    const params = { ...filters, ...pagination };
    const { data } = await apiClient.get('/', { params });
    return data;
  },

  // Obtener un servicio por ID o slug
  getById: async (id: string, includePaquetes = true): Promise<ServicioResponse> => {
    const { data } = await apiClient.get(`/${id}`, {
      params: { includePaquetes }
    });
    return data;
  },

  // Crear servicio
  create: async (servicioData: Partial<Servicio>): Promise<ServicioResponse> => {
    const { data } = await apiClient.post('/', servicioData);
    return data;
  },

  // Actualizar servicio
  update: async (id: string, servicioData: Partial<Servicio>): Promise<ServicioResponse> => {
    const { data } = await apiClient.put(`/${id}`, servicioData);
    return data;
  },

  // Eliminar servicio
  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.delete(`/${id}`);
    return data;
  },

  // Soft delete
  softDelete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.delete(`/${id}/soft`);
    return data;
  },

  // Restaurar eliminado
  restore: async (id: string): Promise<ServicioResponse> => {
    const { data } = await apiClient.patch(`/${id}/restaurar`);
    return data;
  },

  // ============================================
  // ACCIONES ESPECIALES
  // ============================================

  // Duplicar servicio
  duplicate: async (id: string): Promise<ServicioResponse> => {
    const { data } = await apiClient.post(`/${id}/duplicar`);
    return data;
  },

  // Cambiar estado
  changeStatus: async (
    id: string,
    estado: string
  ): Promise<ServicioResponse> => {
    const { data } = await apiClient.patch(`/${id}/estado`, { estado });
    return data;
  },

  // Cambiar estado masivo
  bulkChangeStatus: async (
    ids: string[],
    estado: string
  ): Promise<{ success: boolean; updated: number }> => {
    const { data } = await apiClient.patch('/bulk/estado', { ids, estado });
    return data;
  },

  // ============================================
  // BÚSQUEDA Y FILTROS
  // ============================================

  // Buscar servicios
  search: async (query: string): Promise<ServiciosResponse> => {
    const { data } = await apiClient.get('/buscar', { params: { q: query } });
    return data;
  },

  // Servicios destacados
  getFeatured: async (): Promise<ServiciosResponse> => {
    const { data } = await apiClient.get('/destacados');
    return data;
  },

  // Top servicios vendidos
  getTopSelling: async (limit = 5): Promise<ServiciosResponse> => {
    const { data } = await apiClient.get('/top/vendidos', { params: { limit } });
    return data;
  },

  // Por categoría
  getByCategory: async (categoria: string): Promise<ServiciosResponse> => {
    const { data } = await apiClient.get(`/categoria/${categoria}`);
    return data;
  },

  // ============================================
  // ESTADÍSTICAS Y DASHBOARD
  // ============================================

  // Dashboard completo
  getDashboard: async (): Promise<{ success: boolean; data: ServicioDashboardStats }> => {
    const { data } = await apiClient.get('/dashboard');
    return data;
  },

  // Estadísticas generales
  getStats: async (): Promise<any> => {
    const { data } = await apiClient.get('/stats');
    return data;
  },

  // Estadísticas de ventas
  getSalesStats: async (): Promise<any> => {
    const { data } = await apiClient.get('/stats/ventas');
    return data;
  },

  // Métricas de conversión
  getConversionMetrics: async (): Promise<any> => {
    const { data } = await apiClient.get('/stats/conversion');
    return data;
  },

  // ============================================
  // PAQUETES
  // ============================================

  // Obtener paquetes de un servicio
  getPaquetes: async (servicioId: string): Promise<{ success: boolean; data: PaqueteServicio[] }> => {
    const { data } = await apiClient.get(`/${servicioId}/paquetes`);
    return data;
  },

  // Crear paquete
  createPaquete: async (
    servicioId: string,
    paqueteData: Partial<PaqueteServicio>
  ): Promise<{ success: boolean; data: PaqueteServicio }> => {
    const { data } = await apiClient.post(`/${servicioId}/paquetes`, paqueteData);
    return data;
  },
};

export default serviciosApi;
```

---

### **FASE 2: Hooks Personalizados** ⭐ [PRIORIDAD ALTA]
**Tiempo estimado**: 2-3 horas

#### 2.1 Hook Principal (`hooks/useServicios.ts`)

```typescript
import { useState, useEffect, useCallback } from 'react';
import { serviciosApi } from '../services/serviciosApi';
import type {
  Servicio,
  ServicioFilters,
  PaginationParams
} from '../types/servicios';

export const useServicios = (
  initialFilters?: ServicioFilters,
  initialPagination?: PaginationParams
) => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });

  const [filters, setFilters] = useState<ServicioFilters>(initialFilters || {});

  // Cargar servicios
  const fetchServicios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await serviciosApi.getAll(filters, {
        page: pagination.page,
        limit: pagination.limit,
        ...initialPagination
      });

      setServicios(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Error al cargar servicios');
      console.error('Error fetching servicios:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  // Cargar al montar y cuando cambien filtros
  useEffect(() => {
    fetchServicios();
  }, [fetchServicios]);

  // Crear servicio
  const createServicio = async (data: Partial<Servicio>) => {
    try {
      setLoading(true);
      await serviciosApi.create(data);
      await fetchServicios(); // Recargar lista
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar servicio
  const updateServicio = async (id: string, data: Partial<Servicio>) => {
    try {
      setLoading(true);
      await serviciosApi.update(id, data);
      await fetchServicios();
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar servicio
  const deleteServicio = async (id: string) => {
    try {
      setLoading(true);
      await serviciosApi.delete(id);
      await fetchServicios();
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Duplicar servicio
  const duplicateServicio = async (id: string) => {
    try {
      setLoading(true);
      await serviciosApi.duplicate(id);
      await fetchServicios();
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Cambiar estado
  const changeStatus = async (id: string, estado: string) => {
    try {
      await serviciosApi.changeStatus(id, estado);
      await fetchServicios();
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return {
    servicios,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    createServicio,
    updateServicio,
    deleteServicio,
    duplicateServicio,
    changeStatus,
    refresh: fetchServicios
  };
};
```

#### 2.2 Hook de Estadísticas (`hooks/useServicioStats.ts`)

```typescript
import { useState, useEffect } from 'react';
import { serviciosApi } from '../services/serviciosApi';
import type { ServicioDashboardStats } from '../types/servicios';

export const useServicioStats = () => {
  const [stats, setStats] = useState<ServicioDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await serviciosApi.getDashboard();
      setStats(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refresh: fetchStats };
};
```

#### 2.3 Hook de Paquetes (`hooks/usePaquetes.ts`)

```typescript
import { useState, useEffect } from 'react';
import { serviciosApi } from '../services/serviciosApi';
import type { PaqueteServicio } from '../types/servicios';

export const usePaquetes = (servicioId: string) => {
  const [paquetes, setPaquetes] = useState<PaqueteServicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaquetes = async () => {
    try {
      setLoading(true);
      const response = await serviciosApi.getPaquetes(servicioId);
      setPaquetes(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (servicioId) {
      fetchPaquetes();
    }
  }, [servicioId]);

  const createPaquete = async (data: Partial<PaqueteServicio>) => {
    try {
      await serviciosApi.createPaquete(servicioId, data);
      await fetchPaquetes();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  return { paquetes, loading, error, createPaquete, refresh: fetchPaquetes };
};
```

---

### **FASE 2: Componentes Reutilizables** ⭐ [PRIORIDAD ALTA] ✅ COMPLETADA
**Tiempo estimado**: 4-5 horas
**Completada el**: 26 de Octubre, 2025

#### 3.1 Card de Servicio (`components/servicios/ServicioCard.tsx`)

```typescript
import React from 'react';
import { Link } from 'react-router-dom';
import type { Servicio } from '../../types/servicios';
import { EstadoBadge } from './EstadoBadge';
import { CategoriaBadge } from './CategoriaBadge';

interface ServicioCardProps {
  servicio: Servicio;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  showActions?: boolean;
}

export const ServicioCard: React.FC<ServicioCardProps> = ({
  servicio,
  onEdit,
  onDelete,
  onDuplicate,
  showActions = false
}) => {
  const formatPrice = () => {
    if (servicio.tipoPrecio === 'paquetes') {
      return `${servicio.moneda} $${servicio.precioMin} - $${servicio.precioMax}`;
    }
    if (servicio.tipoPrecio === 'fijo') {
      return `${servicio.moneda} $${servicio.precio}`;
    }
    return 'Precio personalizado';
  };

  return (
    <div
      className="rounded-lg border border-gray-700 overflow-hidden hover:border-purple-500 transition-all"
      style={{ backgroundColor: servicio.colorFondo + '20' }}
    >
      {/* Header con icono */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="text-4xl p-3 rounded-lg"
              style={{ backgroundColor: servicio.colorIcono + '20' }}
            >
              {servicio.icono}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {servicio.titulo}
              </h3>
              <div className="flex gap-2 mt-2">
                <CategoriaBadge categoria={servicio.categoria} />
                <EstadoBadge estado={servicio.estado} />
              </div>
            </div>
          </div>

          {servicio.destacado && (
            <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full font-semibold">
              ⭐ Destacado
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <p className="text-gray-300 mb-4 line-clamp-3">
          {servicio.descripcionCorta || servicio.descripcion}
        </p>

        {/* Precio */}
        <div className="mb-4">
          <span className="text-2xl font-bold text-purple-400">
            {formatPrice()}
          </span>
        </div>

        {/* Características */}
        {servicio.caracteristicas && servicio.caracteristicas.length > 0 && (
          <ul className="space-y-2 mb-4">
            {servicio.caracteristicas.slice(0, 3).map((car, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                <span className="text-green-400">✓</span>
                {car}
              </li>
            ))}
          </ul>
        )}

        {/* Métricas */}
        <div className="flex gap-4 text-sm text-gray-400 mb-4">
          <span>💰 {servicio.vecesVendido} ventas</span>
          {servicio.rating && <span>⭐ {servicio.rating}/5</span>}
        </div>

        {/* Acciones */}
        {showActions ? (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit?.(servicio._id)}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
            >
              Editar
            </button>
            <button
              onClick={() => onDuplicate?.(servicio._id)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              📋
            </button>
            <button
              onClick={() => onDelete?.(servicio._id)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
            >
              🗑️
            </button>
          </div>
        ) : (
          <Link
            to={`/servicios/${servicio.slug}`}
            className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            Ver detalles
          </Link>
        )}
      </div>
    </div>
  );
};
```

#### 3.2 Filtros Avanzados (`components/servicios/ServicioFilters.tsx`)

```typescript
import React from 'react';
import type { ServicioFilters } from '../../types/servicios';

interface ServicioFiltersProps {
  filters: ServicioFilters;
  onChange: (filters: ServicioFilters) => void;
  onReset: () => void;
}

export const ServicioFilters: React.FC<ServicioFiltersProps> = ({
  filters,
  onChange,
  onReset
}) => {
  const updateFilter = (key: keyof ServicioFilters, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Filtros</h3>
        <button
          onClick={onReset}
          className="text-sm text-gray-400 hover:text-white"
        >
          Limpiar filtros
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Categoría
          </label>
          <select
            value={filters.categoria || ''}
            onChange={(e) => updateFilter('categoria', e.target.value || undefined)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
          >
            <option value="">Todas</option>
            <option value="desarrollo">Desarrollo</option>
            <option value="diseño">Diseño</option>
            <option value="marketing">Marketing</option>
            <option value="consultoría">Consultoría</option>
            <option value="mantenimiento">Mantenimiento</option>
          </select>
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Estado
          </label>
          <select
            value={filters.estado || ''}
            onChange={(e) => updateFilter('estado', e.target.value || undefined)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
          >
            <option value="">Todos</option>
            <option value="activo">Activo</option>
            <option value="desarrollo">En desarrollo</option>
            <option value="pausado">Pausado</option>
            <option value="descontinuado">Descontinuado</option>
          </select>
        </div>

        {/* Precio mínimo */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Precio mínimo
          </label>
          <input
            type="number"
            value={filters.precioMin || ''}
            onChange={(e) => updateFilter('precioMin', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="0"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
          />
        </div>

        {/* Precio máximo */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Precio máximo
          </label>
          <input
            type="number"
            value={filters.precioMax || ''}
            onChange={(e) => updateFilter('precioMax', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="10000"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
          />
        </div>
      </div>

      {/* Switches */}
      <div className="flex gap-6 mt-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.destacado || false}
            onChange={(e) => updateFilter('destacado', e.target.checked || undefined)}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-300">Solo destacados</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.activo === undefined ? false : filters.activo}
            onChange={(e) => updateFilter('activo', e.target.checked || undefined)}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-300">Solo activos</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.visibleEnWeb || false}
            onChange={(e) => updateFilter('visibleEnWeb', e.target.checked || undefined)}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-300">Visibles en web</span>
        </label>
      </div>
    </div>
  );
};
```

#### 3.3 Badges (`components/servicios/EstadoBadge.tsx` y `CategoriaBadge.tsx`)

```typescript
// EstadoBadge.tsx
import React from 'react';

const estadoConfig = {
  activo: { label: 'Activo', color: 'bg-green-500' },
  desarrollo: { label: 'En desarrollo', color: 'bg-blue-500' },
  pausado: { label: 'Pausado', color: 'bg-yellow-500' },
  descontinuado: { label: 'Descontinuado', color: 'bg-red-500' },
  agotado: { label: 'Agotado', color: 'bg-gray-500' }
};

export const EstadoBadge: React.FC<{ estado: string }> = ({ estado }) => {
  const config = estadoConfig[estado as keyof typeof estadoConfig] || estadoConfig.activo;
  
  return (
    <span className={`text-xs ${config.color} text-white px-2 py-1 rounded-full font-semibold`}>
      {config.label}
    </span>
  );
};

// CategoriaBadge.tsx
const categoriaConfig = {
  desarrollo: { label: 'Desarrollo', icon: '💻', color: 'bg-blue-600' },
  diseño: { label: 'Diseño', icon: '🎨', color: 'bg-pink-600' },
  marketing: { label: 'Marketing', icon: '📊', color: 'bg-green-600' },
  consultoría: { label: 'Consultoría', icon: '💼', color: 'bg-purple-600' },
  mantenimiento: { label: 'Mantenimiento', icon: '🔧', color: 'bg-orange-600' },
  otro: { label: 'Otro', icon: '📦', color: 'bg-gray-600' }
};

export const CategoriaBadge: React.FC<{ categoria: string }> = ({ categoria }) => {
  const config = categoriaConfig[categoria as keyof typeof categoriaConfig] || categoriaConfig.otro;
  
  return (
    <span className={`text-xs ${config.color} text-white px-2 py-1 rounded-full font-semibold`}>
      {config.icon} {config.label}
    </span>
  );
};
```

---

### **FASE 4: Páginas de Administración** ⭐ [PRIORIDAD ALTA] ✅ COMPLETADA
**Tiempo estimado**: 6-8 horas
**Completada el**: 26 de Octubre, 2025

#### 4.1 Dashboard de Servicios (`pages/admin/ServicioDashboard.tsx`) ✅

#### 4.2 Gestión de Servicios (`pages/admin/ServiciosManagement.tsx`) ✅

#### 4.3 Formulario de Servicio (`pages/admin/ServicioForm.tsx`) ✅

```typescript
import React from 'react';
import { useServicioStats } from '../../hooks/useServicioStats';
import { ServicioStats } from '../../components/servicios/ServicioStats';

export const ServicioDashboard: React.FC = () => {
  const { stats, loading, error } = useServicioStats();

  if (loading) return <div>Cargando estadísticas...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stats) return null;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        Dashboard de Servicios
      </h1>

      {/* Resumen en Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-700 p-6 rounded-lg">
          <div className="text-white text-opacity-80 text-sm mb-2">Servicios Activos</div>
          <div className="text-4xl font-bold text-white">
            {stats.resumen.serviciosActivos}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-lg">
          <div className="text-white text-opacity-80 text-sm mb-2">En Desarrollo</div>
          <div className="text-4xl font-bold text-white">
            {stats.resumen.serviciosEnDesarrollo}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-6 rounded-lg">
          <div className="text-white text-opacity-80 text-sm mb-2">Ingresos del Mes</div>
          <div className="text-4xl font-bold text-white">
            ${stats.ingresos.mes.toLocaleString()}
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-700 p-6 rounded-lg">
          <div className="text-white text-opacity-80 text-sm mb-2">Ingresos del Año</div>
          <div className="text-4xl font-bold text-white">
            ${stats.ingresos.anio.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Top Servicios */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-bold text-white mb-4">
          Top 5 Servicios Más Vendidos
        </h2>
        <div className="space-y-4">
          {stats.topServicios.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{item.servicio.icono}</span>
                <div>
                  <div className="font-semibold text-white">{item.servicio.titulo}</div>
                  <div className="text-sm text-gray-400">{item.ventas} ventas</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-green-400">
                  ${item.ingresos.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfica de Ventas por Mes */}
      {/* TODO: Implementar con recharts o similar */}
    </div>
  );
};
```

#### 4.2 Gestión de Servicios (`pages/admin/ServiciosManagement.tsx`)

```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServicios } from '../../hooks/useServicios';
import { ServicioCard } from '../../components/servicios/ServicioCard';
import { ServicioFilters } from '../../components/servicios/ServicioFilters';

export const ServiciosManagement: React.FC = () => {
  const navigate = useNavigate();
  const {
    servicios,
    loading,
    error,
    pagination,
    filters,
    setFilters,
    deleteServicio,
    duplicateServicio,
    refresh
  } = useServicios();

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const handleEdit = (id: string) => {
    navigate(`/dashboard/servicios/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este servicio?')) {
      await deleteServicio(id);
    }
  };

  const handleDuplicate = async (id: string) => {
    if (confirm('¿Duplicar este servicio?')) {
      await duplicateServicio(id);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">
          Gestión de Servicios
        </h1>
        <button
          onClick={() => navigate('/dashboard/servicios/create')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          + Crear Servicio
        </button>
      </div>

      {/* Filtros */}
      <ServicioFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters({})}
      />

      {/* Toggle View Mode */}
      <div className="flex justify-end mb-4 gap-2">
        <button
          onClick={() => setViewMode('grid')}
          className={`px-4 py-2 rounded-lg ${
            viewMode === 'grid' ? 'bg-purple-600' : 'bg-gray-700'
          }`}
        >
          🔲 Grid
        </button>
        <button
          onClick={() => setViewMode('table')}
          className={`px-4 py-2 rounded-lg ${
            viewMode === 'table' ? 'bg-purple-600' : 'bg-gray-700'
          }`}
        >
          📋 Tabla
        </button>
      </div>

      {/* Loading */}
      {loading && <div className="text-center text-gray-400">Cargando...</div>}

      {/* Error */}
      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicios.map((servicio) => (
            <ServicioCard
              key={servicio._id}
              servicio={servicio}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              showActions
            />
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Servicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Ventas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {servicios.map((servicio) => (
                <tr key={servicio._id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{servicio.icono}</span>
                      <span className="text-white font-medium">{servicio.titulo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-300">{servicio.categoria}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-300">{servicio.estado}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-300">${servicio.precio || servicio.precioMin}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-300">{servicio.vecesVendido}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(servicio._id)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDuplicate(servicio._id)}
                        className="text-green-400 hover:text-green-300"
                      >
                        📋
                      </button>
                      <button
                        onClick={() => handleDelete(servicio._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {/* TODO: Implementar componente de paginación */}
        </div>
      )}
    </div>
  );
};
```

#### 4.3 Formulario de Servicio (`pages/admin/ServicioForm.tsx`)

```typescript
// Este será un formulario completo con todos los campos
// Se implementará en la siguiente fase debido a su complejidad
```

---

### **FASE 5: Integración con Rutas** ⭐ [PRIORIDAD MEDIA] ✅ COMPLETADA
**Tiempo estimado**: 1-2 horas
**Completada el**: 26 de Octubre, 2025

✅ Actualizado `App.tsx` con las siguientes rutas:
- `/dashboard/servicios/dashboard` → ServicioDashboard (estadísticas y métricas)
- `/dashboard/servicios` → ServiciosManagement (CRUD principal)
- `/dashboard/servicios/create` → ServicioForm (crear)
- `/dashboard/servicios/edit/:id` → ServicioForm (editar)

✅ Protección de rutas con:
- `DashboardRoute` para autenticación
- `RoleBasedRoute` para ADMIN, MODERATOR, SUPER_ADMIN

✅ Actualizado `Sidebar.tsx`:
- Agregado "Módulo Servicios" 🚀 en navegación
- Visible solo para roles administrativos
- Enlace directo a `/dashboard/servicios`

---

### **FASE 6: Vista Pública de Servicios** ⭐ [PRIORIDAD MEDIA]
**Tiempo estimado**: 3-4 horas

Mejorar `pages/public/ServicesPublic.tsx` para usar la nueva API:

```typescript
import React, { useState } from 'react';
import { useServicios } from '../../hooks/useServicios';
import { ServicioCard } from '../../components/servicios/ServicioCard';

export const ServicesPublic: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const { servicios, loading } = useServicios({
    categoria: selectedCategory || undefined,
    activo: true,
    visibleEnWeb: true
  });

  return (
    <div className="min-h-screen bg-gray-900 py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-bold text-white text-center mb-4">
          Nuestros Servicios
        </h1>
        <p className="text-xl text-gray-400 text-center mb-12">
          Soluciones profesionales para tu negocio
        </p>

        {/* Filtro de categorías */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-6 py-2 rounded-lg ${
              selectedCategory === '' ? 'bg-purple-600' : 'bg-gray-700'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setSelectedCategory('desarrollo')}
            className={`px-6 py-2 rounded-lg ${
              selectedCategory === 'desarrollo' ? 'bg-purple-600' : 'bg-gray-700'
            }`}
          >
            💻 Desarrollo
          </button>
          {/* Más botones de categorías */}
        </div>

        {/* Grid de servicios */}
        {loading ? (
          <div className="text-center text-gray-400">Cargando servicios...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicios.map((servicio) => (
              <ServicioCard key={servicio._id} servicio={servicio} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
```

---

### **FASE 7: Testing y Polish** ⭐ [PRIORIDAD BAJA]
**Tiempo estimado**: 2-3 horas

- Probar todos los endpoints
- Verificar permisos por rol
- Validación de formularios
- Manejo de errores
- Loading states
- Responsive design
- Accesibilidad

---

## 🚀 ROADMAP DE IMPLEMENTACIÓN

### **Sprint 1 (2-3 días)**: Fundación
- ✅ Fase 1: Tipos y API Service
- ✅ Fase 2: Hooks personalizados
- ✅ Fase 3: Componentes básicos (Cards, Badges)

### **Sprint 2 (3-4 días)**: Dashboard Admin
- ✅ Fase 4: Páginas de administración
- ✅ Dashboard de estadísticas
- ✅ Lista de servicios con filtros

### **Sprint 3 (2-3 días)**: Formularios y Edición
- ✅ Formulario completo de servicio
- ✅ Gestión de paquetes
- ✅ Validaciones

### **Sprint 4 (1-2 días)**: Vista Pública
- ✅ Fase 6: Mejorar página pública
- ✅ Detalle de servicio
- ✅ Catálogo con filtros

### **Sprint 5 (1 día)**: Polish
- ✅ Fase 5: Integración de rutas
- ✅ Fase 7: Testing y refinamientos
- ✅ Responsive design
- ✅ Optimización de rendimiento

---

## 📦 DEPENDENCIAS A INSTALAR (Si no existen)

```powershell
cd frontend
npm install @tanstack/react-query   # Para caché de datos (opcional)
npm install recharts                 # Para gráficas
npm install react-hook-form          # Para formularios complejos
npm install zod                      # Para validación de schemas
npm install sonner                   # Para toasts/notificaciones
```

---

## ✅ CHECKLIST DE CALIDAD

### Funcionalidad:
- [ ] CRUD completo funciona
- [ ] Filtros avanzados funcionan
- [ ] Dashboard muestra estadísticas correctas
- [ ] Permisos por rol se respetan
- [ ] Vista pública funciona sin autenticación

### UX/UI:
- [ ] Loading states en todas las acciones
- [ ] Mensajes de error claros
- [ ] Confirmaciones antes de eliminar
- [ ] Responsive en móvil
- [ ] Accesibilidad (keyboard navigation)

### Rendimiento:
- [ ] Lazy loading de páginas
- [ ] Paginación implementada
- [ ] Caché de datos (con react-query)
- [ ] Imágenes optimizadas

### Código:
- [ ] TypeScript sin errores
- [ ] Código limpio y comentado
- [ ] Componentes reutilizables
- [ ] Hooks bien estructurados

---

## 🎯 PRIORIDADES INMEDIATAS

### 🔥 HACER PRIMERO:
1. **Fase 1** - Tipos y API Service (base de todo)
2. **Fase 2** - Hooks (lógica de negocio)
3. **Fase 3** - Componentes básicos (ServicioCard, Badges)
4. **Fase 4.2** - Página de gestión admin
5. **Fase 4.1** - Dashboard de estadísticas

### ⏳ HACER DESPUÉS:
6. Formulario completo de creación/edición
7. Vista pública mejorada
8. Gestión de paquetes
9. Testing y refinamientos

---

## 💡 NOTAS IMPORTANTES

1. **Autenticación**: Ya está integrada con Clerk, solo agregar interceptor en serviciosApi.ts
2. **Permisos**: Usar PermissionGuard y RoleBasedRoute existentes
3. **Diseño**: Seguir el mismo estilo de las páginas admin existentes (LeadsManagement, UsersManagement)
4. **API URL**: Usar `getBackendUrl()` del utils existente
5. **Estados Loading**: Usar componentes de loading existentes
6. **Notificaciones**: Considerar instalar `sonner` para toasts elegantes

---

## 📚 ARCHIVOS DE REFERENCIA

Para mantener consistencia, revisar estos archivos existentes:
- `frontend/src/services/adminService.ts` - Estructura de servicios
- `frontend/src/pages/admin/LeadsManagement.tsx` - Estructura de página admin
- `frontend/src/components/crm/LeadCard.tsx` - Estructura de cards
- `frontend/src/hooks/` - Estructura de hooks custom

---

## 🎨 MOCKUP RÁPIDO

### Dashboard de Servicios:
```
┌─────────────────────────────────────────────────────┐
│ Dashboard de Servicios                     [+ Crear]│
├─────────────────────────────────────────────────────┤
│ [Activos: 12] [Desarrollo: 5] [Ingresos: $45k]     │
├─────────────────────────────────────────────────────┤
│ Filtros: [Categoría ▼] [Estado ▼] [Precio]  [Reset]│
├─────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ 🌐 Desarro│  │ 📱 App   │  │ 🔍 SEO   │          │
│  │ Web       │  │ Móvil    │  │ Marketing│          │
│  │ $1.2k-5k  │  │ $3k-10k  │  │ $800-3k  │          │
│  │[Edit][Del]│  │[Edit][Del]│  │[Edit][Del]│        │
│  └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────────────────────────────────────┘
```

---

**Creado**: 26 de Octubre, 2025  
**Última actualización**: 26 de Octubre, 2025  
**Versión**: 1.0  
**Autor**: GitHub Copilot  
**Estado**: Listo para implementación

---

## 🚀 SIGUIENTE PASO

**¿Listo para comenzar?**

Sugerencia: Empezar con **Fase 1** creando los tipos TypeScript y el servicio API base. Una vez tengas eso, todo lo demás fluirá naturalmente.

```powershell
# Crear archivos base
New-Item frontend\src\types\servicios.ts
New-Item frontend\src\services\serviciosApi.ts
New-Item frontend\src\hooks\useServicios.ts
```

¿Quieres que te ayude a implementar alguna fase específica primero?
