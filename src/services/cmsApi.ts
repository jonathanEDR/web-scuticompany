const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ========== CACHE IMPLEMENTATION ==========
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class RequestCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // ⚡ 10 minutos (aumentado de 5)

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  clear(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    // Limpiar entradas que coincidan con el patrón
    const keys = Array.from(this.cache.keys());
    keys.forEach(key => {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    });
  }

  // ⚡ Nuevo: Obtener datos aunque estén expirados (para fallback)
  getStale<T>(key: string): T | null {
    const entry = this.cache.get(key);
    return entry ? entry.data : null;
  }
}

const cache = new RequestCache();

// ========== RETRY LOGIC ==========
interface RetryOptions {
  maxRetries?: number;
  delay?: number;
  backoff?: boolean;
}

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<Response> {
  const { maxRetries = 3, delay = 1000, backoff = true } = retryOptions;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Si la respuesta es exitosa o es un error del cliente (4xx), no reintentar
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response;
      }

      // Si es un error del servidor (5xx), reintentar
      throw new Error(`Server error: ${response.status}`);
    } catch (error) {
      lastError = error as Error;

      // Si es el último intento, lanzar el error
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Calcular delay con backoff exponencial
      const waitTime = backoff ? delay * Math.pow(2, attempt) : delay;

      console.warn(`Request failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
}

// ========== AUTH HELPER ==========
let getTokenFunction: (() => Promise<string | null>) | null = null;

export const setAuthTokenGetter = (getter: () => Promise<string | null>) => {
  getTokenFunction = getter;
};

async function getAuthHeaders(): Promise<HeadersInit> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (getTokenFunction) {
    try {
      const token = await getTokenFunction();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error al obtener token:', error);
    }
  }

  return headers;
}

// ========== API FUNCTIONS ==========

// Obtener todas las páginas (con caché)
export const getAllPages = async (useCache = true) => {
  const cacheKey = 'all-pages';

  // Intentar obtener del caché
  if (useCache) {
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log('📦 Usando datos en caché para getAllPages');
      return cached;
    }
  }

  try {
    const response = await fetchWithRetry(`${API_URL}/cms/pages`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Error al obtener páginas');
    }

    // Guardar en caché
    cache.set(cacheKey, data.data);

    return data.data;
  } catch (error) {
    console.error('Error en getAllPages:', error);
    throw error;
  }
};

// Obtener una página por slug (con caché y retry)
export const getPageBySlug = async (slug: string, useCache = true) => {
  const cacheKey = `page-${slug}`;

  // ⚡ Intentar obtener del caché
  if (useCache) {
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log(`📦 Usando datos en caché para página ${slug}`);
      return cached;
    }
  }

  try {
    const response = await fetchWithRetry(
      `${API_URL}/cms/pages/${slug}`,
      {},
      { maxRetries: 2, delay: 500 } // ⚡ Menos reintentos y delay más corto para páginas públicas
    );
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Error al obtener página');
    }

    // Guardar en caché
    cache.set(cacheKey, data.data);

    return data.data;
  } catch (error) {
    console.error(`Error en getPageBySlug (${slug}):`, error);
    
    // ⚡ Intentar usar datos en caché aunque estén expirados (stale-while-revalidate)
    const staleData = cache.getStale(cacheKey);
    if (staleData) {
      console.warn(`⚠️ Usando datos expirados del caché para ${slug}`);
      return staleData;
    }
    
    throw error;
  }
};

// Limpiar datos antes de enviar al backend
const cleanDataForBackend = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(cleanDataForBackend);
  }
  
  if (data && typeof data === 'object') {
    const cleaned: any = {};
    
    for (const [key, value] of Object.entries(data)) {
      // Omitir _id problemáticos que contengan buffer
      if (key === '_id' && 
          value && 
          typeof value === 'object' && 
          'buffer' in value) {
        continue; // Omitir este _id problemático
      }
      
      cleaned[key] = cleanDataForBackend(value);
    }
    
    return cleaned;
  }
  
  return data;
};

// Actualizar contenido de una página (con auth)
export const updatePage = async (slug: string, pageData: any) => {
  try {
    const headers = await getAuthHeaders();
    
    // Limpiar datos antes de enviar
    const cleanedData = cleanDataForBackend(pageData);

    const response = await fetchWithRetry(
      `${API_URL}/cms/pages/${slug}`,
      {
        method: 'PUT',
        headers,
        body: JSON.stringify(cleanedData),
      },
      { maxRetries: 2 } // Menos reintentos para operaciones de escritura
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Error al actualizar página');
    }

    // Invalidar caché de esta página
    cache.clear(`page-${slug}`);
    cache.clear('all-pages');

    return data.data;
  } catch (error) {
    console.error(`Error en updatePage (${slug}):`, error);
    throw error;
  }
};

// Inicializar página Home con datos por defecto (con auth)
export const initHomePage = async () => {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_URL}/cms/pages/init-home`, {
      method: 'POST',
      headers,
    });

    const data = await response.json();

    if (!data.success) {
      // Si ya existe, obtenerla
      if (data.message?.includes('ya está inicializada')) {
        return await getPageBySlug('home');
      }
      throw new Error(data.message || 'Error al inicializar página Home');
    }

    return data.data;
  } catch (error) {
    console.error('Error en initHomePage:', error);
    throw error;
  }
};

// ⚡ Exportar función para limpiar caché manualmente
export const clearCache = (pattern?: string) => {
  cache.clear(pattern);
};

// ⚡ Exportar función para forzar recarga sin caché
export const forceReload = async (slug: string) => {
  cache.clear(`page-${slug}`);
  return await getPageBySlug(slug, false);
};

export default {
  getAllPages,
  getPageBySlug,
  updatePage,
  initHomePage,
  clearCache,
  forceReload
};
