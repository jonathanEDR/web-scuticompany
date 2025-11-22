import { SignOutButton } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, Permission } from '../types/roles';
import RoleBadge from './RoleBadge';
import { messageService } from '../services/messageService';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface MenuItem {
  name: string;
  icon: string;
  path: string;
  description: string;
  // Control de acceso
  roles?: UserRole[]; // Roles que pueden ver este item (si está vacío, todos lo ven)
  permission?: Permission; // Permiso específico requerido
  adminOnly?: boolean; // Solo para ADMIN, MODERATOR, SUPER_ADMIN
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, role, hasPermission, canAccessAdmin, shouldUseClientDashboard: isClientUser } = useAuth();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    const loadUnread = async () => {
      try {
        const response = await messageService.getUnreadMessages();
        if (!mounted) return;
        if (response && response.success && response.data) {
          setUnreadCount(response.data.total || (response.data.mensajes || []).length || 0);
        }
      } catch (error) {
        // No bloquear la UI por errores de badge
        // console.warn('[Sidebar] error cargando mensajes no leídos', error);
      }
    };

    loadUnread();
    const interval = setInterval(loadUnread, 60000); // poll cada 60s
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Definir items del menú con control de acceso
  const menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      icon: '🏠',
      path: isClientUser ? '/dashboard/client' : '/dashboard/admin',
      description: 'Panel principal',
      // Todos pueden ver el dashboard
    },
    {
      name: 'Perfil',
      icon: '👤',
      path: '/dashboard/profile',
      description: 'Tu información personal',
      // Todos pueden ver su perfil
    },
    {
      name: 'Módulo Servicios',
      icon: '🚀',
      path: '/dashboard/servicios/management',
      description: 'Gestión avanzada de servicios',
      permission: Permission.MANAGE_CONTENT,
      adminOnly: true,
      // Solo ADMIN, MODERATOR, SUPER_ADMIN - Panel de gestión de servicios
    },
    {
      name: 'CMS',
      icon: '📝',
      path: '/dashboard/cms',
      description: 'Gestor de contenido',
      permission: Permission.MANAGE_CONTENT,
      adminOnly: true,
      // Solo ADMIN, MODERATOR, SUPER_ADMIN
    },
    {
      name: 'Solicitudes',
      icon: '📝',
      path: '/dashboard/crm',
      description: 'Gestión de solicitudes',
      permission: Permission.MANAGE_CONTENT,
      adminOnly: true,
      // Solo roles administrativos - Sistema de gestión de solicitudes
    },
    {
      name: 'Mensajes',
      icon: '💬',
      path: '/dashboard/crm/messages',
      description: 'Mensajes de solicitudes',
      permission: Permission.MANAGE_CONTENT,
      adminOnly: true,
    },
    {
      name: 'Agenda',
      icon: '📅',
      path: '/dashboard/agenda',
      description: 'Calendario y eventos',
      permission: Permission.MANAGE_CONTENT,
      adminOnly: true,
      // Solo roles administrativos - Módulo de agenda
    },
    {
      name: 'Media Library',
      icon: '🖼️',
      path: '/dashboard/media',
      description: 'Gestión de imágenes',
      permission: Permission.MANAGE_UPLOADS,
      adminOnly: true,
      // Solo roles administrativos con MANAGE_UPLOADS
    },
    {
      name: 'Blog',
      icon: '📝',
      path: '/dashboard/blog',
      description: 'Gestión del blog',
      permission: Permission.MANAGE_CONTENT,
      adminOnly: true,
      // Solo roles administrativos - Módulo de blog
    },
    {
      name: 'Agentes IA',
      icon: '🤖',
      path: '/dashboard/ai-agents',
      description: 'Sistema de agentes inteligentes',
      permission: Permission.MANAGE_SYSTEM,
      roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
      // Solo ADMIN y SUPER_ADMIN - Sistema de IA
    },
    {
      name: 'SCUTI AI',
      icon: '🚀',
      path: '/dashboard/scuti-ai',
      description: 'Chat inteligente con asistente IA',
      permission: Permission.MANAGE_SYSTEM,
      roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
      // Solo ADMIN y SUPER_ADMIN - Chat principal
    },
    {
      name: 'Gestión de Usuarios',
      icon: '👥',
      path: '/dashboard/admin/users',
      description: 'Administrar usuarios y roles',
      permission: Permission.MANAGE_USERS,
      roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
      // Solo ADMIN y SUPER_ADMIN
    },
    {
      name: 'Configuración',
      icon: '🔧',
      path: '/dashboard/settings',
      description: 'Ajustes de la cuenta',
      // Todos pueden configurar su cuenta
    }
  ];

  // Filtrar items del menú según permisos y rol
  const visibleMenuItems = menuItems.filter(item => {
    // Si no hay usuario autenticado, no mostrar nada
    if (!user || !role) return false;

    // Si el item requiere roles específicos
    if (item.roles && !item.roles.includes(role)) {
      return false;
    }

    // Si el item es solo para admins
    if (item.adminOnly && !canAccessAdmin) {
      return false;
    }

    // Si el item requiere un permiso específico
    if (item.permission && !hasPermission(item.permission)) {
      return false;
    }

    // Si pasa todas las validaciones, mostrar el item
    return true;
  });

  const handleNavigation = (path: string) => {
    navigate(path);
    // Cerrar sidebar en móvil después de navegar
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Overlay para móvil - mejorado */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl z-30
          transition-all duration-300 ease-in-out flex flex-col border-r border-slate-200/60 dark:border-gray-700/60 overflow-hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isOpen ? 'w-72' : 'w-0 md:w-16'}
        `}
      >
        {/* Header del Sidebar */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-purple-600 dark:via-blue-600 dark:to-indigo-600 relative overflow-hidden">
          {/* Efecto de fondo */}
          <div className="absolute inset-0 bg-white/10 dark:bg-black/10"></div>
          
          <div className="relative z-10">
            {isOpen ? (
              // Sidebar expandido
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0">
                      <img 
                        src="/logos/logo-white.svg" 
                        alt="Web Scuti" 
                        className="h-8 w-auto filter brightness-0 invert"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors"
                    title="Contraer sidebar"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                  </button>
                </div>

                {/* Indicador de sesión activa + Badge de Rol */}
                <div className="bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-lg p-3 border border-white/30 dark:border-white/20 shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-white text-xs">
                        {canAccessAdmin ? 'Panel Administrativo' : 'Panel de Usuario'}
                      </p>
                      <p className="text-xs text-blue-50 opacity-80">
                        Sesión Activa
                      </p>
                    </div>
                  </div>
                  {/* Badge de Rol */}
                  {role && (
                    <div className="flex items-center justify-between pt-2 border-t border-white/20">
                      <span className="text-xs text-white/80">Tu rol:</span>
                      <RoleBadge role={role} size="sm" />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Sidebar colapsado
              <div className="p-2 flex flex-col items-center">
                <button
                  onClick={() => setIsOpen(true)}
                  className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-colors mb-2"
                  title="Expandir sidebar"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
              </div>
            )}
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto bg-slate-50/80 dark:bg-gray-900/80 backdrop-blur-sm transition-colors duration-300">
          {isOpen ? (
            // Navegación expandida
            <div className="p-3">
              <div className="mb-2">
                <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-1">
                  Navegación Principal
                </p>
              </div>
              <div className="space-y-1">
                {visibleMenuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`
                        group w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
                        ${isActive
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 dark:from-purple-600 dark:to-pink-600 text-white shadow-lg shadow-blue-500/20 dark:shadow-purple-500/20 scale-[1.01]'
                          : 'text-slate-700 dark:text-gray-200 hover:bg-slate-100/80 dark:hover:bg-gray-800/80 hover:text-slate-900 dark:hover:text-white hover:translate-x-0.5'
                        }
                      `}
                    >
                      <span className={`text-lg transition-transform ${isActive ? 'scale-105' : 'group-hover:scale-105'}`}>
                        {item.icon}
                      </span>
                      <div className="flex-1 text-left">
                        <div className={`font-medium text-sm ${isActive ? 'text-white' : ''}`}>
                          {item.name}
                        </div>
                        <div className={`text-xs leading-tight ${isActive ? 'text-blue-50 dark:text-purple-50' : 'text-slate-500 dark:text-gray-400 group-hover:text-slate-600 dark:group-hover:text-gray-300'}`}>
                          {item.description}
                        </div>
                      </div>
                      {/* Badge de no leídos para Mensajería */}
                      {item.path === '/dashboard/crm/messages' && unreadCount > 0 && (
                        <div className="ml-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-600 text-white">
                            {unreadCount}
                          </span>
                        </div>
                      )}
                      {isActive && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full shadow-lg shadow-white/50 animate-pulse"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            // Navegación colapsada (solo iconos)
            <div className="p-1">
              <div className="space-y-1">
                {visibleMenuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`
                        relative group w-full flex items-center justify-center p-2.5 rounded-lg transition-all duration-200
                        ${isActive
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 dark:from-purple-600 dark:to-pink-600 text-white shadow-lg scale-105'
                          : 'text-slate-700 dark:text-gray-200 hover:bg-slate-100/80 dark:hover:bg-gray-800/80 hover:text-slate-900 dark:hover:text-white hover:scale-105'
                        }
                      `}
                      title={item.name}
                    >
                      <span className="text-lg">
                        {item.icon}
                      </span>
                      {item.path === '/dashboard/crm/messages' && unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold bg-red-600 text-white rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* Footer con botón de cerrar sesión */}
        <div className="bg-slate-100/80 dark:bg-gray-950/80 backdrop-blur-sm border-t border-slate-200/80 dark:border-gray-700/80 transition-colors duration-300">
          {isOpen ? (
            // Footer expandido
            <div className="p-3 space-y-2">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-medium text-slate-600 dark:text-gray-400">Apariencia</span>
                <ThemeToggle />
              </div>

              <SignOutButton>
                <button
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white hover:from-red-600 hover:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 transition-all duration-200 font-medium shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:scale-[1.01]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="text-sm">Cerrar Sesión</span>
                </button>
              </SignOutButton>

              <div className="text-center">
                <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">Web Scuti v1.0.0</p>
                <p className="text-xs text-slate-400 dark:text-gray-500">© 2025</p>
              </div>
            </div>
          ) : (
            // Footer colapsado
            <div className="p-1.5 space-y-1.5">
              {/* Theme Toggle */}
              <div className="flex justify-center">
                <ThemeToggle />
              </div>

              <SignOutButton>
                <button
                  className="w-full flex items-center justify-center p-2.5 rounded-lg bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white hover:from-red-600 hover:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 transition-all duration-200 shadow-lg hover:scale-105"
                  title="Cerrar Sesión"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </SignOutButton>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}