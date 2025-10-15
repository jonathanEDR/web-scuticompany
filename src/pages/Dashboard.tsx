import { useState, useEffect } from 'react';
import { SignedIn, SignInButton, useUser } from '@clerk/clerk-react';
import DashboardLayout from '../components/DashboardLayout';
import { useUserSync } from '../hooks/useUserSync';
import { 
  Button, 
  LoadingSpinner, 
  StatusCard, 
  Alert, 
  formatDate, 
  API_CONFIG 
} from '../components/UI';

// Interfaces
interface BackendMessage {
  message: string;
  timestamp?: string;
  backend?: string;
  status?: string;
}

interface CompanyInfo {
  empresa: string;
  descripcion: string;
  tecnologias: {
    backend: string;
    frontend: string;
  };
}



// Componente principal del Dashboard
export default function Dashboard() {
  const { user, isLoaded, isSignedIn } = useUser();
  const syncStatus = useUserSync();
  const [message, setMessage] = useState<string>('Cargando...');
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const API_URL = API_CONFIG.BASE_URL;

  // Función para obtener mensaje del backend
  const fetchHelloMessage = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_URL}${API_CONFIG.ENDPOINTS.HELLO}`);
      
      if (!response.ok) {
        throw new Error('Error al conectar con el backend');
      }
      
      const data: BackendMessage = await response.json();
      setMessage(data.message);
    } catch (err) {
      setError('⚠️ No se pudo conectar con el backend. Verifica que esté ejecutándose.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener información de la empresa
  const fetchCompanyInfo = async () => {
    try {
      const response = await fetch(`${API_URL}${API_CONFIG.ENDPOINTS.INFO}`);
      if (response.ok) {
        const data: CompanyInfo = await response.json();
        setCompanyInfo(data);
      }
    } catch (err) {
      console.error('Error al obtener información de la empresa:', err);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    if (isSignedIn) {
      fetchHelloMessage();
      fetchCompanyInfo();
    }
  }, [isSignedIn]);

  // Mostrar loading mientras carga la autenticación
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <LoadingSpinner size="lg" text="Cargando..." />
      </div>
    );
  }

  // Si no está autenticado, redirigir al home
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceso Requerido</h2>
          <p className="text-gray-600 mb-6">Necesitas iniciar sesión para acceder al dashboard</p>
          <SignInButton mode="modal">
            <Button>Iniciar Sesión</Button>
          </SignInButton>
        </div>
      </div>
    );
  }  // Vista para usuarios autenticados
  return (
    <SignedIn>
      <DashboardLayout>
        {/* Notificaciones de sincronización */}
        {syncStatus.isLoading && (
          <Alert type="info" className="mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <LoadingSpinner size="sm" />
              <span className="text-sm sm:text-base">Sincronizando perfil...</span>
            </div>
          </Alert>
        )}

        {syncStatus.isSuccess && syncStatus.userData?.isNewUser && (
          <Alert type="success" className="mb-4 sm:mb-6">
            <span className="text-sm sm:text-base">
              ¡Bienvenido por primera vez! Tu perfil ha sido creado.
            </span>
          </Alert>
        )}

        {syncStatus.isError && (
          <Alert type="error" className="mb-4 sm:mb-6">
            <span className="text-sm sm:text-base">Error: {syncStatus.error}</span>
          </Alert>
        )}

        {/* Sección de Bienvenida */}
        {isLoaded && user && (
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 text-white shadow-2xl relative overflow-hidden animate-slideDown">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 via-purple-600/50 to-pink-600/50 animate-pulse"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left animate-slideLeft">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-3 drop-shadow-lg">
                  ¡Bienvenido, {user.firstName || user.username || 'Usuario'}! 👋
                </h1>
                <p className="text-blue-100 text-sm sm:text-base lg:text-lg font-medium">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
                <p className="text-blue-200 text-xs sm:text-sm mt-1 sm:mt-2">
                  Último acceso: {formatDate(new Date())}
                </p>
              </div>
              <div className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl animate-float">
                🎉
              </div>
            </div>
          </div>
        )}

        {/* Sección de Conexión Backend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-slate-200 hover:shadow-2xl transition-all duration-300 animate-slideLeft hover:-translate-y-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="text-2xl sm:text-3xl">📨</span>
                <span className="hidden sm:inline">Mensaje del Backend</span>
                <span className="sm:hidden">Backend</span>
              </h2>
              <Button
                onClick={fetchHelloMessage}
                loading={loading}
                size="sm"
                className="w-full sm:w-auto"
              >
                🔄 Recargar
              </Button>
            </div>

            {loading ? (
              <LoadingSpinner text="Cargando..." />
            ) : error ? (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 sm:p-6 text-red-700">
                <div className="flex items-start gap-3">
                  <div className="text-red-600 text-xl">❌</div>
                  <span className="text-sm sm:text-base">{error}</span>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 rounded-xl p-4 sm:p-6 text-white shadow-lg">
                <p className="text-lg sm:text-xl lg:text-2xl font-bold flex items-center justify-center gap-2">
                  <span className="text-2xl">☀️</span>
                  {message}
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-slate-200 hover:shadow-2xl transition-all duration-300 animate-slideRight hover:-translate-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-4 sm:mb-6 flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">📊</span>
              <span className="hidden sm:inline">Información del Proyecto</span>
              <span className="sm:hidden">Proyecto</span>
            </h2>

            {companyInfo ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 sm:p-4 border border-blue-100">
                  <p className="text-xs sm:text-sm text-slate-500 font-semibold mb-1">EMPRESA</p>
                  <p className="text-sm sm:text-base lg:text-lg font-bold text-slate-900">{companyInfo.empresa}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 sm:p-4 border border-slate-200">
                  <p className="text-xs sm:text-sm text-slate-500 font-semibold mb-1">DESCRIPCIÓN</p>
                  <p className="text-xs sm:text-sm lg:text-base text-slate-700">{companyInfo.descripcion}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 sm:p-4 border border-purple-100">
                  <p className="text-xs sm:text-sm text-slate-500 font-semibold mb-2">STACK TECNOLÓGICO</p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🛠️</span>
                      <span className="text-xs sm:text-sm font-medium text-slate-700">Backend: {companyInfo.tecnologias.backend}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🎨</span>
                      <span className="text-xs sm:text-sm font-medium text-slate-700">Frontend: {companyInfo.tecnologias.frontend}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <LoadingSpinner text="Cargando información..." />
            )}
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="animate-scaleIn" style={{animationDelay: '0ms'}}>
            <StatusCard 
              icon="✅"
              title="Backend"
              subtitle="Node.js + Express"
              status="Puerto 5000 Activo"
              gradient="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200"
            />
          </div>
          <div className="animate-scaleIn" style={{animationDelay: '100ms'}}>
            <StatusCard 
              icon="⚛️"
              title="Frontend" 
              subtitle="React + Vite"
              status="Puerto 5173 Activo"
              gradient="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200"
            />
          </div>
          <div className="animate-scaleIn" style={{animationDelay: '200ms'}}>
            <StatusCard 
              icon="🎨"
              title="Estilos"
              subtitle="Tailwind CSS"
              status="Utilidad primero"
              gradient="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200"
            />
          </div>
          <div className="animate-scaleIn" style={{animationDelay: '300ms'}}>
            <StatusCard 
              icon="🔐"
              title="Auth"
              subtitle="Clerk"
              status="✓ Autenticado"
              gradient="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200"
            />
          </div>
        </div>

        {/* Sección de Features */}
        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-slate-200 animate-slideUp">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <span className="text-2xl sm:text-3xl lg:text-4xl animate-bounce">🎉</span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              ¡Configuración Exitosa!
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-green-200">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
                <span className="text-xl sm:text-2xl">✨</span>
                Implementado:
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  'Backend con Express configurado',
                  'API REST funcional',
                  'MongoDB conectado', 
                  'Frontend React + TypeScript',
                  'Tailwind CSS integrado',
                  'Autenticación con Clerk'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 group">
                    <span className="text-green-600 text-sm sm:text-base mt-0.5">✅</span>
                    <span className="text-xs sm:text-sm text-slate-700 group-hover:text-slate-900 transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-blue-200">
              <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
                <span className="text-xl sm:text-2xl">💡</span>
                Próximos Pasos:
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  'Crear páginas adicionales',
                  'Personalizar tema y colores',
                  'Implementar SEO avanzado',
                  'Agregar CRUD de servicios',
                  'Optimizar para producción'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 group">
                    <span className="text-blue-600 text-sm sm:text-base mt-0.5">🔄</span>
                    <span className="text-xs sm:text-sm text-slate-700 group-hover:text-slate-900 transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </SignedIn>
  );
}