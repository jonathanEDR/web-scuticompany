/**
 * 🌐 Configuración Central de API
 * Maneja la detección automática de URLs del backend según el entorno
 */

interface ApiConfigType {
  baseUrl: string;
  apiUrl: string;
  environment: 'development' | 'production';
  isProduction: boolean;
}

/**
 * Detecta el entorno y configura las URLs correctas
 */
function detectApiConfiguration(): ApiConfigType {
  const logContext = '[ApiConfig]';
  
  console.log(`${logContext} Iniciando detección de configuración...`, {
    mode: import.meta.env.MODE,
    prod: import.meta.env.PROD,
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'SSR',
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
    VITE_NODE_ENV: import.meta.env.VITE_NODE_ENV,
    NODE_ENV: import.meta.env.NODE_ENV
  });

  let baseUrl: string;
  let environment: 'development' | 'production';

  // 1. PRIORIDAD MÁXIMA: Variable de entorno VITE_BACKEND_URL
  if (import.meta.env.VITE_BACKEND_URL) {
    baseUrl = import.meta.env.VITE_BACKEND_URL;
    environment = import.meta.env.PROD ? 'production' : 'development';
    console.log(`${logContext} Usando VITE_BACKEND_URL:`, baseUrl);
  }
  // 2. Variable de entorno VITE_API_URL (remover /api)
  else if (import.meta.env.VITE_API_URL) {
    baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    environment = import.meta.env.PROD ? 'production' : 'development';
    console.log(`${logContext} Usando VITE_API_URL (sin /api):`, baseUrl);
  }
  // 3. Detección automática por hostname
  else if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    if (hostname.includes('vercel.app') || 
        hostname.includes('web-scuti') ||
        hostname.includes('netlify.app') ||
        import.meta.env.PROD) {
      // Producción
      baseUrl = 'https://web-scuticompany-back.onrender.com';
      environment = 'production';
      console.log(`${logContext} Detectado entorno de producción (${hostname}):`, baseUrl);
    } else if (hostname === 'localhost' || 
               hostname === '127.0.0.1' || 
               hostname.includes('127.0.0.1') ||
               hostname.includes('192.168.')) {
      // Desarrollo local
      baseUrl = 'http://localhost:5000';
      environment = 'development';
      console.log(`${logContext} Detectado entorno local (${hostname}):`, baseUrl);
    } else {
      // Fallback para otros dominios
      baseUrl = import.meta.env.PROD 
        ? 'https://web-scuticompany-back.onrender.com'
        : 'http://localhost:5000';
      environment = import.meta.env.PROD ? 'production' : 'development';
      console.warn(`${logContext} Hostname desconocido (${hostname}), usando fallback:`, baseUrl);
    }
  }
  // 4. Fallback absoluto (SSR o caso extremo)
  else {
    baseUrl = import.meta.env.PROD 
      ? 'https://web-scuticompany-back.onrender.com'
      : 'http://localhost:5000';
    environment = import.meta.env.PROD ? 'production' : 'development';
    console.warn(`${logContext} No hay window disponible, usando fallback:`, baseUrl);
  }

  const config: ApiConfigType = {
    baseUrl,
    apiUrl: `${baseUrl}/api`,
    environment,
    isProduction: environment === 'production'
  };

  console.log(`${logContext} Configuración final:`, {
    baseUrl: config.baseUrl,
    apiUrl: config.apiUrl,
    environment: config.environment,
    isProduction: config.isProduction
  });

  return config;
}

// Crear configuración global (se ejecuta una vez)
export const API_CONFIG = detectApiConfiguration();

/**
 * Obtiene la URL base del backend (sin /api)
 * @returns URL base del backend
 */
export const getBackendUrl = (): string => {
  return API_CONFIG.baseUrl;
};

/**
 * Obtiene la URL de la API (con /api)
 * @returns URL completa de la API
 */
export const getApiUrl = (): string => {
  return API_CONFIG.apiUrl;
};

/**
 * Verifica si estamos en producción
 * @returns true si está en producción
 */
export const isProduction = (): boolean => {
  return API_CONFIG.isProduction;
};

/**
 * Obtiene el entorno actual
 * @returns 'development' | 'production'
 */
export const getEnvironment = (): 'development' | 'production' => {
  return API_CONFIG.environment;
};

/**
 * Construye una URL completa para un endpoint
 * @param endpoint - El endpoint (puede empezar con /api o no)
 * @returns URL completa
 */
export const buildApiUrl = (endpoint: string): string => {
  // Si el endpoint ya incluye /api, usar baseUrl
  if (endpoint.startsWith('/api/')) {
    return `${API_CONFIG.baseUrl}${endpoint}`;
  }
  
  // Si no incluye /api, agregarlo
  if (endpoint.startsWith('/')) {
    return `${API_CONFIG.apiUrl}${endpoint}`;
  }
  
  // Si no empieza con /, agregarlo junto con /api
  return `${API_CONFIG.apiUrl}/${endpoint}`;
};

export default {
  API_CONFIG,
  getBackendUrl,
  getApiUrl,
  isProduction,
  getEnvironment,
  buildApiUrl
};