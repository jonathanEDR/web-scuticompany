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
 * VERSIÓN MEJORADA - Más robusta para producción
 */
function detectApiConfiguration(): ApiConfigType {
  let baseUrl: string;
  let environment: 'development' | 'production';

  // Determinar el entorno de forma más robusta
  environment = import.meta.env.PROD ? 'production' : 'development';
  
  // DEBUG: Logging para troubleshooting
  if (environment === 'development') {
    console.log('🔧 [API Config] Variables disponibles:', {
      VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
      VITE_API_URL: import.meta.env.VITE_API_URL,
      PROD: import.meta.env.PROD,
      hostname: typeof window !== 'undefined' ? window.location.hostname : 'SSR'
    });
  }

  // 1. PRIORIDAD MÁXIMA: Variable de entorno VITE_BACKEND_URL
  if (import.meta.env.VITE_BACKEND_URL) {
    baseUrl = import.meta.env.VITE_BACKEND_URL;
    console.log(`🎯 [API Config] Usando VITE_BACKEND_URL: ${baseUrl}`);
  }
  // 2. Variable de entorno VITE_API_URL (remover /api)
  else if (import.meta.env.VITE_API_URL) {
    baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    console.log(`🎯 [API Config] Usando VITE_API_URL (processed): ${baseUrl}`);
  }
  // 3. Detección automática por hostname (MEJORADA PARA PRODUCCIÓN)
  else if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || 
                       hostname === '127.0.0.1' || 
                       hostname.includes('127.0.0.1') ||
                       hostname.includes('192.168.');
                       
    const isProductionDomain = hostname.includes('vercel.app') || 
                              hostname.includes('web-scuti') ||
                              hostname.includes('scuticompany') ||
                              hostname.includes('netlify.app') ||
                              hostname.includes('render.com');

    if (isLocalhost) {
      // Desarrollo local
      baseUrl = 'http://localhost:5000';
      environment = 'development';
      console.log(`🏠 [API Config] Detectado entorno DESARROLLO para: ${hostname}`);
    } 
    else if (isProductionDomain || import.meta.env.PROD) {
      // Producción - usar Render backend
      baseUrl = 'https://web-scuticompany-back.onrender.com';
      environment = 'production';
      console.log(`🌐 [API Config] Detectado entorno PRODUCCIÓN para: ${hostname} → ${baseUrl}`);
    } 
    else {
      // Fallback basado en PROD flag de Vite
      baseUrl = import.meta.env.PROD 
        ? 'https://web-scuticompany-back.onrender.com'
        : 'http://localhost:5000';
      environment = import.meta.env.PROD ? 'production' : 'development';
      console.warn(`⚠️ [API Config] Dominio no reconocido: ${hostname}, usando fallback basado en PROD=${import.meta.env.PROD}: ${baseUrl}`);
    }
  }
  // 4. Fallback absoluto (SSR o caso extremo)
  else {
    baseUrl = import.meta.env.PROD 
      ? 'https://web-scuticompany-back.onrender.com'
      : 'http://localhost:5000';
    console.warn(`⚠️ [API Config] Modo SSR detectado, usando fallback: ${baseUrl}`);
  }

  const config: ApiConfigType = {
    baseUrl,
    apiUrl: `${baseUrl}/api`,
    environment,
    isProduction: environment === 'production'
  };

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