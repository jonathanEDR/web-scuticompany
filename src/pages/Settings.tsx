import SmartDashboardLayout from '../components/SmartDashboardLayout';
import { Card, Button, Alert } from '../components/UI';
import { useState } from 'react';

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    desktop: false,
    marketing: true
  });

  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('es');

  return (
    <SmartDashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración</h1>
          <p className="text-gray-600">Personaliza tu experiencia en Web Scuti</p>
        </div>

        {/* Preferencias de Notificaciones */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">🔔</span>
            Notificaciones
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Notificaciones por Email</h3>
                <p className="text-sm text-gray-600">Recibe actualizaciones importantes por correo</p>
              </div>
              <button
                onClick={() => setNotifications({...notifications, email: !notifications.email})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.email ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.email ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Notificaciones de Escritorio</h3>
                <p className="text-sm text-gray-600">Alertas emergentes en tu navegador</p>
              </div>
              <button
                onClick={() => setNotifications({...notifications, desktop: !notifications.desktop})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.desktop ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.desktop ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Marketing y Promociones</h3>
                <p className="text-sm text-gray-600">Ofertas especiales y novedades</p>
              </div>
              <button
                onClick={() => setNotifications({...notifications, marketing: !notifications.marketing})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.marketing ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.marketing ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Apariencia */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">🎨</span>
            Apariencia
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Tema</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === 'light' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-white border border-gray-300 rounded"></div>
                    <span className="font-medium">Claro</span>
                  </div>
                </button>
                
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    theme === 'dark' 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-800 rounded"></div>
                    <span className="font-medium">Oscuro</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">Próximamente</div>
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Idioma</h3>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="es">🇪🇸 Español</option>
                <option value="en">🇺🇸 English (Próximamente)</option>
                <option value="fr">🇫🇷 Français (Próximamente)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Seguridad */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">🔒</span>
            Seguridad
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <h3 className="font-medium text-green-800">Autenticación Segura</h3>
                  <p className="text-sm text-green-600">Protegido por Clerk Auth</p>
                </div>
              </div>
              <Button variant="secondary" size="sm">
                Ver Detalles
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button variant="secondary" className="w-full">
                🔑 Cambiar Contraseña
              </Button>
              
              <Button variant="secondary" className="w-full">
                📱 Autenticación 2FA
              </Button>
              
              <Button variant="secondary" className="w-full">
                🔗 Sesiones Activas
              </Button>
              
              <Button variant="secondary" className="w-full">
                📥 Descargar Datos
              </Button>
            </div>
          </div>
        </Card>

        {/* Información de la Cuenta */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">ℹ️</span>
            Información de la Cuenta
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Plan Actual</h3>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="font-semibold text-blue-800">Plan Gratuito</div>
                <div className="text-sm text-blue-600">Acceso completo a funciones básicas</div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Almacenamiento</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Usado</span>
                  <span>2.4 GB de 10 GB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '24%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Zona de Peligro */}
        <Card className="p-6 border-red-200 bg-red-50">
          <h2 className="text-xl font-semibold text-red-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            Zona de Peligro
          </h2>

          <Alert type="warning" className="mb-4">
            Las acciones en esta sección son irreversibles. Procede con precaución.
          </Alert>

          <div className="space-y-3">
            <Button variant="danger" className="w-full sm:w-auto">
              🗑️ Eliminar Cuenta Permanentemente
            </Button>
          </div>
        </Card>

        {/* Guardar cambios */}
        <div className="flex justify-end gap-3">
          <Button variant="secondary">
            Cancelar
          </Button>
          <Button variant="primary">
            💾 Guardar Cambios
          </Button>
        </div>
      </div>
    </SmartDashboardLayout>
  );
}