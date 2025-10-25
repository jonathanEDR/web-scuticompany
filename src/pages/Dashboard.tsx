import { useState, useEffect, useCallback } from 'react';
import { SignedIn, useUser } from '@clerk/clerk-react';
import SmartDashboardLayout from '../components/SmartDashboardLayout';
import { Button, LoadingSpinner } from '../components/UI';
import { useUserSync } from '../hooks/useUserSync';
import { useSeo } from '../hooks/useSeo';
import { getBackendUrl } from '../utils/apiConfig';

// 🎯 Tipos TypeScript optimizados
interface DatabaseInfo {
  status: string;
  host: string;
  connected?: boolean;
  name?: string;
}

interface ServerInfo {
  port: number;
  uptime: number;
  environment?: string;
  memory?: {
    used: number;
    total: number;
  };
}

interface BackendStatus {
  message: string;
  database: DatabaseInfo;
  server: ServerInfo;
  timestamp?: string;
}

interface TechnologyStack {
  backend: string;
  frontend: string;
  database: string;
  auth?: string;
}

interface PageInfo {
  name: string;
  status: string;
  updatedBy: string;
  lastUpdate: string;
  published?: boolean;
}

interface ProjectData {
  empresa: string;
  descripcion?: string;
  status: string;
  database: {
    totalPages: number;
  };
  currentPage: PageInfo | null;
  tecnologias: TechnologyStack;
  features?: string[];
  timestamp?: string;
}

// 🔧 Configuración de API  
const API_CONFIG = {
  BASE_URL: getBackendUrl(),
  ENDPOINTS: {
    DASHBOARD_STATUS: '/api/dashboard-status',
    PROJECT_INFO: '/api/project-info',
    HEALTH: '/api/health'
  },
  TIMEOUT: 15000 // Aumentar timeout para producción
} as const;

export default function Dashboard() {
  const { user, isLoaded, isSignedIn } = useUser();
  const userSyncStatus = useUserSync(); // Hook para auto-registro
  
  // 🎯 SEO dinámico para Dashboard
  const { SeoHelmet } = useSeo({
    pageName: 'dashboard',
    fallbackTitle: 'Dashboard - SCUTI Company',
    fallbackDescription: 'Panel de administración y gestión de contenidos de SCUTI Company.'
  });
  
  const [backendData, setBackendData] = useState<BackendStatus | null>(null);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // 🚀 Función optimizada para obtener datos del backend
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      // Verificar si la URL del backend está configurada
      if (API_CONFIG.BASE_URL === 'BACKEND_URL_NOT_CONFIGURED') {
        throw new Error('Backend URL no configurada para producción. Necesitas configurar VITE_API_URL en las variables de entorno de Vercel.');
      }
      // Crear controller para timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
      // Fetch paralelo para mejor performance
      const [backendResponse, projectResponse] = await Promise.all([
        fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DASHBOARD_STATUS}`, {
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' }
        }),
        fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROJECT_INFO}`, {
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' }
        })
      ]);
      clearTimeout(timeoutId);
      // Procesar respuesta del backend
      if (!backendResponse.ok) {
        throw new Error(`Error del servidor: ${backendResponse.status} ${backendResponse.statusText}`);
      }
      const backendResult = await backendResponse.json();
      if (backendResult.success && backendResult.data) {
        setBackendData(backendResult.data);
      } else {
        throw new Error(backendResult.message || 'Error en la respuesta del backend');
      }
      // Procesar información del proyecto
      if (projectResponse.ok) {
        const projectResult = await projectResponse.json();
        if (projectResult.success && projectResult.data) {
          setProjectData(projectResult.data);
        }
      }
      setLastUpdate(new Date());
    } catch (err) {
      let errorMessage = 'Error desconocido';
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'Timeout: El servidor tardó demasiado en responder';
        } else if (err.message.includes('Failed to fetch')) {
          errorMessage = 'No se puede conectar al servidor. Verifica que esté ejecutándose en puerto 5000';
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      fetchData();
    }
  }, [isSignedIn]);

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }

  return (
    <SignedIn>
      {/* 🎯 SEO Dinámico */}
      <SeoHelmet />
      
      <SmartDashboardLayout>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            ¡Bienvenido, {user.firstName || 'Usuario'}! 👋
          </h1>
          <p>{user.primaryEmailAddress?.emailAddress}</p>
        </div>

        {/* Status Summary */}
        <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="font-bold text-lg">📊 Estado del Sistema</h3>
              {lastUpdate && (
                <span className="text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full">
                  Actualizado: {lastUpdate.toLocaleTimeString()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className={`w-3 h-3 rounded-full ${backendData && projectData && !error ? 'bg-green-500' : error ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
              <span className="font-medium">
                {backendData && projectData && !error ? 'Sistema OK' : error ? 'Con errores' : 'Cargando...'}
              </span>
            </div>
          </div>
          
          {/* Debug info de configuración */}
          <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-2 rounded font-mono">
            🔗 Backend URL: {API_CONFIG.BASE_URL} • 🌍 Entorno: {import.meta.env.MODE} • 🏠 Host: {window.location.hostname}
          </div>
          
          {/* User Sync Status */}
          <div className="mt-2 text-xs bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-2 rounded">
            <div className="font-semibold text-purple-800 dark:text-purple-300 mb-1">👤 Estado de Auto-registro:</div>
            <div className="text-purple-700 dark:text-purple-300 space-y-1">
              <div>🔄 Sincronizando: {userSyncStatus.isLoading ? 'Sí' : 'No'}</div>
              <div>✅ Completado: {userSyncStatus.isSuccess ? 'Sí' : 'No'}</div>
              <div>❌ Error: {userSyncStatus.isError ? userSyncStatus.error : 'No'}</div>
              {userSyncStatus.userData && (
                <div>👤 Usuario: {userSyncStatus.userData.isNewUser ? 'Nuevo registrado' : 'Existente actualizado'}</div>
              )}
            </div>
          </div>
          
          {error && (
            <div className="mt-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm font-semibold">⚠️ {error}</p>
              
              {/* Mostrar instrucciones específicas si estamos en producción sin backend configurado */}
              {API_CONFIG.BASE_URL === 'BACKEND_URL_NOT_CONFIGURED' && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h4 className="text-blue-800 dark:text-blue-300 font-semibold mb-2">🔧 Configuración Requerida</h4>
                  <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
                    <p><strong>1. Ve a Render.com</strong> y copia la URL de tu backend</p>
                    <p><strong>2. Ve a Vercel → Settings → Environment Variables</strong></p>
                    <p><strong>3. Agrega:</strong> VITE_API_URL = https://tu-backend.onrender.com/api</p>
                    <p><strong>4. Redeploy</strong> tu proyecto en Vercel</p>
                  </div>
                  <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs text-yellow-800 dark:text-yellow-300">
                    <strong>URLs posibles:</strong> web-scuti-backend.onrender.com, webscuti-backend.onrender.com
                  </div>
                </div>
              )}
              
              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                <p>🌐 Backend URL: {API_CONFIG.BASE_URL}</p>
                <p>🏠 Hostname: {typeof window !== 'undefined' ? window.location.hostname : 'N/A'}</p>
                <p>🔗 Environment: {import.meta.env.MODE}</p>
                <p>📦 VITE_API_URL: {import.meta.env.VITE_API_URL || 'No configurada'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Backend Status Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                🔌 Estado del Backend
              </h2>
              <Button onClick={fetchData} loading={loading} size="sm">
                🔄 Recargar
              </Button>
            </div>

            {loading ? (
              <LoadingSpinner text="Verificando conexión..." />
            ) : error ? (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700">
                <div className="flex items-start gap-3">
                  <span className="text-xl">❌</span>
                  <div>
                    <div className="font-semibold">Error de Conexión</div>
                    <div className="text-sm">{error}</div>
                    <div className="text-xs mt-2 opacity-75">
                      Verifica que el backend esté en: http://localhost:5000
                    </div>
                  </div>
                </div>
              </div>
            ) : backendData ? (
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">✅</span>
                    <span className="font-bold">{backendData.message}</span>
                  </div>
                  {backendData.timestamp && (
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      {new Date(backendData.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-white/20 rounded-lg p-3">
                    <div className="font-semibold mb-1">🗄️ Base de Datos</div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${backendData.database.connected ? 'bg-green-300' : 'bg-red-300'}`}></span>
                      <span>{backendData.database.status}</span>
                    </div>
                    <div className="text-xs opacity-75 mt-1">
                      {backendData.database.host} • {backendData.database.name || 'web-scuti'}
                    </div>
                  </div>
                  
                  <div className="bg-white/20 rounded-lg p-3">
                    <div className="font-semibold mb-1">⚡ Servidor</div>
                    <div>Puerto: {backendData.server.port}</div>
                    <div className="text-xs opacity-75 mt-1">
                      Uptime: {Math.floor(backendData.server.uptime / 60)}min • 
                      {backendData.server.environment || 'development'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hay datos del backend
              </div>
            )}
          </div>

          {/* Project Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              📊 Información del Proyecto
            </h2>

            {projectData ? (
              <div className="space-y-4">
                {/* Información de la empresa */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold">EMPRESA</div>
                    {projectData.timestamp && (
                      <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                        {new Date(projectData.timestamp).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div className="font-bold text-lg text-gray-800 dark:text-gray-200">{projectData.empresa}</div>
                  {projectData.descripcion && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{projectData.descripcion}</div>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`w-2 h-2 rounded-full ${projectData.status === 'Sistema funcionando correctamente ✅' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">{projectData.status}</span>
                  </div>
                </div>

                {/* Base de datos y páginas */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-3">📄 CONFIGURACIÓN DE PÁGINAS</div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {projectData.database.totalPages}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">páginas configuradas</span>
                    </div>
                    <div className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full">
                      Base de datos inicializada ✓
                    </div>
                  </div>
                  
                  {projectData.currentPage && (
                    <div className="bg-white/70 dark:bg-gray-800/50 rounded-lg p-3 border border-emerald-200/50">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Página activa:</div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          projectData.currentPage.published 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }`}>
                          {projectData.currentPage.published ? 'Publicada' : 'Borrador'}
                        </div>
                      </div>
                      <div className="font-semibold text-gray-800 dark:text-gray-200">{projectData.currentPage.name}</div>
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{projectData.currentPage.status}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                        <span>👤 {projectData.currentPage.updatedBy}</span>
                        <span>•</span>
                        <span>📅 {new Date(projectData.currentPage.lastUpdate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stack tecnológico */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-3">🚀 STACK TECNOLÓGICO</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/60 dark:bg-gray-800/50 rounded-lg p-2 border border-purple-200/50">
                      <div className="flex items-center gap-2">
                        <span>🛠️</span>
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Backend</div>
                          <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{projectData.tecnologias.backend}</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/60 dark:bg-gray-800/50 rounded-lg p-2 border border-purple-200/50">
                      <div className="flex items-center gap-2">
                        <span>🎨</span>
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Frontend</div>
                          <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{projectData.tecnologias.frontend}</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/60 dark:bg-gray-800/50 rounded-lg p-2 border border-purple-200/50">
                      <div className="flex items-center gap-2">
                        <span>🗄️</span>
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Database</div>
                          <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{projectData.tecnologias.database}</div>
                        </div>
                      </div>
                    </div>
                    {projectData.tecnologias.auth && (
                      <div className="bg-white/60 dark:bg-gray-800/50 rounded-lg p-2 border border-purple-200/50">
                        <div className="flex items-center gap-2">
                          <span>🔐</span>
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Auth</div>
                            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{projectData.tecnologias.auth}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <LoadingSpinner text="Cargando información del proyecto..." />
            )}
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🎉</span>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              ¡Sistema Funcionando Correctamente!
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">✨</span>
                Implementado:
              </h3>
              <ul className="space-y-2">
                {[
                  'Auto-inicialización de base de datos',
                  'Estado del backend en tiempo real',
                  'Información del proyecto actualizada',
                  'Sistema de monitoreo integrado',
                  'Health checks automáticos',
                  'Logging detallado de cambios'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-green-600 text-sm mt-0.5">✅</span>
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Listo para usar:
              </h3>
              <ul className="space-y-2">
                {[
                  'CMS Manager para editar contenido',
                  'Deployment a producción',
                  'Configuración de imágenes e iconos',
                  'Personalización completa del tema',
                  'SEO optimizado',
                  'Sistema escalable y mantenible'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-blue-600 text-sm mt-0.5">🚀</span>
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </SmartDashboardLayout>
    </SignedIn>
  );
}