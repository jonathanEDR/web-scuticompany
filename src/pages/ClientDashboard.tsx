/**
 * 👤 Client Dashboard
 * Dashboard simplificado para roles USER y CLIENT
 * Interfaz limpia enfocada en consumo de contenido y servicios
 */

import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import SmartDashboardLayout from '../components/SmartDashboardLayout';
import RoleBadge from '../components/RoleBadge';
import { formatUserName } from '../types/roles';

export default function ClientDashboard() {
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'Mi Dashboard | Web Scuti';
  }, []);

  if (!user) {
    return null;
  }

  const userName = formatUserName(user);

  return (
    <SmartDashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header de Bienvenida */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-600 dark:via-purple-600 dark:to-pink-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                ¡Bienvenido, {userName}! 👋
              </h1>
              <p className="text-blue-100 dark:text-purple-100 text-lg">
                Estamos felices de verte de nuevo
              </p>
            </div>
            <div className="hidden md:block">
              <RoleBadge role={user.role} size="lg" />
            </div>
          </div>
        </div>

        {/* Grid de Información */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Card de Perfil */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl">
                👤
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Mi Perfil
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Información personal
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Gestiona tu información personal y preferencias de la cuenta.
            </p>
            <a
              href="/dashboard/profile"
              className="inline-block w-full text-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-200"
            >
              Ver Perfil
            </a>
          </div>

          {/* Card de Servicios */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
                ⚙️
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Servicios
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Explorar servicios
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Descubre todos los servicios disponibles para ti.
            </p>
            <a
              href="/dashboard/services"
              className="inline-block w-full text-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-200"
            >
              Ver Servicios
            </a>
          </div>

          {/* Card de Ayuda */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-2xl">
                ❓
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Ayuda
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Centro de ayuda
                </p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              ¿Necesitas ayuda? Consulta nuestra documentación y soporte.
            </p>
            <a
              href="/dashboard/help"
              className="inline-block w-full text-center px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-all duration-200"
            >
              Centro de Ayuda
            </a>
          </div>
        </div>

        {/* Información del Usuario */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">📊</span>
            Información de tu Cuenta
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna Izquierda */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300 font-medium">
                  Email
                </span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {user.email}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300 font-medium">
                  Nombre
                </span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {userName}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300 font-medium">
                  Estado
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  user.isActive 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {user.isActive ? '✓ Activo' : '✗ Inactivo'}
                </span>
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300 font-medium">
                  Rol
                </span>
                <RoleBadge role={user.role} size="md" />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300 font-medium">
                  Email Verificado
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  user.emailVerified
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {user.emailVerified ? '✓ Verificado' : '⚠ Pendiente'}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300 font-medium">
                  Miembro desde
                </span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  {new Date(user.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Accesos Rápidos */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">🚀</span>
            Accesos Rápidos
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a
              href="/dashboard/profile"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:shadow-lg transition-all duration-200 group"
            >
              <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                👤
              </span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 text-center">
                Mi Perfil
              </span>
            </a>

            <a
              href="/dashboard/services"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:shadow-lg transition-all duration-200 group"
            >
              <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                ⚙️
              </span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 text-center">
                Servicios
              </span>
            </a>

            <a
              href="/dashboard/settings"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:shadow-lg transition-all duration-200 group"
            >
              <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                🔧
              </span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 text-center">
                Configuración
              </span>
            </a>

            <a
              href="/dashboard/help"
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:shadow-lg transition-all duration-200 group"
            >
              <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                ❓
              </span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 text-center">
                Ayuda
              </span>
            </a>
          </div>
        </div>
      </div>
    </SmartDashboardLayout>
  );
}
