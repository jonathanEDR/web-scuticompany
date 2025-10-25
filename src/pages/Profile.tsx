import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import SmartDashboardLayout from '../components/SmartDashboardLayout';
import { useUserSync } from '../hooks/useUserSync';
import DashboardSeo from '../components/DashboardSeo';
import { 
  Button, 
  Card, 
  LoadingSpinner, 
  Alert, 
  formatDate
} from '../components/UI';



interface UserStats {
  totalLogins: number;
  lastActivity: string;
  accountAge: number;
  profileCompletion: number;
}

export default function Profile() {
  const { user, isLoaded } = useUser();
  const syncStatus = useUserSync();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });

  // Cargar datos del usuario
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      });
      
      // Simular estadísticas del usuario
      setUserStats({
        totalLogins: Math.floor(Math.random() * 50) + 1,
        lastActivity: formatDate(new Date()),
        accountAge: Math.floor((new Date().getTime() - new Date(user.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24)),
        profileCompletion: calculateProfileCompletion(user)
      });
      
      setLoading(false);
    }
  }, [user]);

  const calculateProfileCompletion = (user: any) => {
    let completion = 0;
    if (user.firstName) completion += 25;
    if (user.lastName) completion += 25;
    if (user.primaryEmailAddress) completion += 25;
    if (user.imageUrl) completion += 25;
    return completion;
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      // Aquí iría la lógica para actualizar el perfil
      // Por ahora solo simulamos la actualización
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEditing(false);
    } catch (error) {
      console.error('Error actualizando perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <SmartDashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner size="lg" text="Cargando perfil..." />
        </div>
      </SmartDashboardLayout>
    );
  }

  if (!user) {
    return (
      <SmartDashboardLayout>
        <Alert type="error">
          No se pudo cargar la información del usuario.
        </Alert>
      </SmartDashboardLayout>
    );
  }

  return (
    <DashboardSeo
      pageName="profile"
      fallbackTitle="Mi Perfil - SCUTI Company"
      fallbackDescription="Gestiona tu información personal y configuración de cuenta."
    >
      <SmartDashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
            <p className="text-gray-600">Gestiona tu información personal y configuración de cuenta</p>
          </div>
          <Button
            onClick={() => editing ? handleSaveProfile() : setEditing(true)}
            loading={loading}
            variant={editing ? 'primary' : 'secondary'}
          >
            {editing ? '💾 Guardar' : '✏️ Editar'}
          </Button>
        </div>

        {/* Notificaciones de sincronización */}
        {syncStatus.isLoading && (
          <Alert type="info">
            <div className="flex items-center gap-3">
              <LoadingSpinner size="sm" />
              <span>Sincronizando datos del perfil...</span>
            </div>
          </Alert>
        )}

        {syncStatus.isError && (
          <Alert type="error">
            Error de sincronización: {syncStatus.error}
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Principal */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-2xl">👤</span>
                Información Personal
              </h2>

              <div className="space-y-6">
                {/* Avatar y nombre */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img
                      src={user.imageUrl}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full border-4 border-blue-100 shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre
                        </label>
                        {editing ? (
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Tu nombre"
                          />
                        ) : (
                          <p className="text-lg font-semibold text-gray-900">
                            {user.firstName || 'Sin especificar'}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Apellido
                        </label>
                        {editing ? (
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Tu apellido"
                          />
                        ) : (
                          <p className="text-lg font-semibold text-gray-900">
                            {user.lastName || 'Sin especificar'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico
                  </label>
                  <div className="flex items-center gap-2">
                    <p className="text-lg text-gray-900">{user.primaryEmailAddress?.emailAddress}</p>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      ✅ Verificado
                    </span>
                  </div>
                </div>

                {/* Fechas importantes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de registro
                    </label>
                    <p className="text-gray-900">
                      {user.createdAt ? formatDate(new Date(user.createdAt)) : 'No disponible'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Último acceso
                    </label>
                    <p className="text-gray-900">
                      {user.lastSignInAt ? formatDate(new Date(user.lastSignInAt)) : 'Primera vez'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Estadísticas y Estado */}
          <div className="space-y-6">
            {/* Completitud del perfil */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-xl">📊</span>
                Perfil Completado
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {userStats?.profileCompletion}%
                  </span>
                  <span className="text-sm text-gray-600">
                    {userStats?.profileCompletion === 100 ? '¡Completo!' : 'En progreso'}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${userStats?.profileCompletion}%` }}
                  ></div>
                </div>
                
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={user.firstName ? "text-green-600" : "text-gray-400"}>
                      {user.firstName ? "✅" : "○"}
                    </span>
                    <span>Nombre</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={user.lastName ? "text-green-600" : "text-gray-400"}>
                      {user.lastName ? "✅" : "○"}
                    </span>
                    <span>Apellido</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✅</span>
                    <span>Email verificado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✅</span>
                    <span>Foto de perfil</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Estadísticas de actividad */}
            {userStats && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-xl">📈</span>
                  Estadísticas
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total de sesiones</span>
                    <span className="font-semibold text-blue-600">{userStats.totalLogins}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Días como usuario</span>
                    <span className="font-semibold text-purple-600">{userStats.accountAge}</span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="text-sm text-gray-600">Última actividad</div>
                    <div className="font-medium text-gray-900">{userStats.lastActivity}</div>
                  </div>
                </div>
              </Card>
            )}

            {/* Estado del usuario */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-xl">🎯</span>
                Estado de la Cuenta
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <div className="font-medium text-green-800">Cuenta Activa</div>
                    <div className="text-sm text-green-600">Todo funcionando correctamente</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-blue-600">🔐</div>
                  <div>
                    <div className="font-medium text-blue-800">Autenticación Segura</div>
                    <div className="text-sm text-blue-600">Protegido por Clerk</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Acciones adicionales */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            Configuración de Cuenta
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="secondary" className="w-full">
              🔒 Cambiar Contraseña
            </Button>
            
            <Button variant="secondary" className="w-full">
              🔔 Notificaciones
            </Button>
            
            <Button variant="secondary" className="w-full">
              🌐 Preferencias
            </Button>
            
            <Button variant="secondary" className="w-full">
              📱 Dispositivos Vinculados
            </Button>
            
            <Button variant="secondary" className="w-full">
              📥 Descargar Datos
            </Button>
            
            <Button variant="danger" className="w-full">
              🗑️ Eliminar Cuenta
            </Button>
          </div>
        </Card>
      </div>
    </SmartDashboardLayout>
    </DashboardSeo>
  );
}