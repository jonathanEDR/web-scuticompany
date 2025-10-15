import DashboardLayout from '../components/DashboardLayout';
import { Card, Button } from '../components/UI';

export default function Services() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Servicios</h1>
            <p className="text-gray-600">Gestiona los servicios de tu empresa</p>
          </div>
          <Button>
            ➕ Nuevo Servicio
          </Button>
        </div>

        {/* Servicios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Servicio 1 */}
          <Card className="p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">🌐</span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                Activo
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Desarrollo Web
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Creación de sitios web modernos y responsive con las últimas tecnologías.
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Precio:</span>
                <span className="font-semibold text-blue-600">$1,200 - $5,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duración:</span>
                <span className="font-medium">2-6 semanas</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1">
                ✏️ Editar
              </Button>
              <Button variant="primary" size="sm" className="flex-1">
                👁️ Ver
              </Button>
            </div>
          </Card>

          {/* Servicio 2 */}
          <Card className="p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">📱</span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                Activo
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Apps Móviles
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Desarrollo de aplicaciones móviles nativas e híbridas para iOS y Android.
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Precio:</span>
                <span className="font-semibold text-purple-600">$3,000 - $15,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duración:</span>
                <span className="font-medium">6-12 semanas</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1">
                ✏️ Editar
              </Button>
              <Button variant="primary" size="sm" className="flex-1">
                👁️ Ver
              </Button>
            </div>
          </Card>

          {/* Servicio 3 */}
          <Card className="p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">🔍</span>
              </div>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                En desarrollo
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              SEO & Marketing
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Optimización para motores de búsqueda y estrategias de marketing digital.
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Precio:</span>
                <span className="font-semibold text-green-600">$800 - $3,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duración:</span>
                <span className="font-medium">Continuo</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1">
                ✏️ Editar
              </Button>
              <Button variant="primary" size="sm" className="flex-1">
                👁️ Ver
              </Button>
            </div>
          </Card>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">12</div>
            <div className="text-sm text-gray-600">Servicios Activos</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">8</div>
            <div className="text-sm text-gray-600">En Progreso</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">45</div>
            <div className="text-sm text-gray-600">Completados</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">$12.5k</div>
            <div className="text-sm text-gray-600">Ingresos Este Mes</div>
          </Card>
        </div>

        {/* Próximamente */}
        <Card className="p-6 text-center">
          <div className="text-4xl mb-4">🚧</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            CRUD Completo en Desarrollo
          </h3>
          <p className="text-gray-600 mb-4">
            Próximamente podrás crear, editar y eliminar servicios directamente desde aquí.
          </p>
          <div className="flex justify-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Crear servicios
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Editar información
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              Gestionar precios
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}