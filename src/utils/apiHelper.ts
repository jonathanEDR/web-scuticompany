// Usar la misma configuración que otros servicios
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper para construir URLs de API correctamente en desarrollo y producción
export const getApiUrl = (endpoint: string): string => {
  // Limpiar endpoint: asegurarse de que no empiece con /api
  const cleanEndpoint = endpoint.replace(/^\/api/, '');
  
  return `${API_URL}${cleanEndpoint.startsWith('/') ? cleanEndpoint : `/${cleanEndpoint}`}`;
};

// Helper específico para endpoints de CMS
export const getCmsApiUrl = (endpoint: string): string => {
  return getApiUrl(`/cms${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`);
};

// Log para debugging
export const logApiCall = (url: string, description: string) => {
  console.log(`🌐 [API] ${description}:`, {
    environment: import.meta.env.DEV ? 'development' : 'production',
    fullUrl: url,
    baseApiUrl: API_URL,
    configuredApiUrl: import.meta.env.VITE_API_URL,
    configuredBackendUrl: import.meta.env.VITE_BACKEND_URL,
  });
};

// Función para probar conectividad con el backend
export const testBackendConnection = async (): Promise<boolean> => {
  try {
    const testUrl = `${API_URL}/health`;
    console.log('🔄 [API] Probando conexión con backend:', testUrl);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const isOk = response.ok;
    console.log(isOk ? '✅ [API] Backend conectado' : '❌ [API] Backend no responde', {
      status: response.status,
      url: testUrl
    });
    
    return isOk;
  } catch (error) {
    console.error('❌ [API] Error conectando con backend:', error);
    return false;
  }
};