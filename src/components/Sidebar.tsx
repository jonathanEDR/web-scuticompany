import { SignOutButton, useUser } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface MenuItem {
  name: string;
  icon: string;
  path: string;
  description: string;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      icon: '🏠',
      path: '/dashboard',
      description: 'Panel principal'
    },
    {
      name: 'Perfil',
      icon: '👤',
      path: '/dashboard/profile',
      description: 'Tu información personal'
    },
    {
      name: 'Servicios',
      icon: '⚙️',
      path: '/dashboard/services',
      description: 'Gestión de servicios'
    },
    {
      name: 'CMS',
      icon: '📝',
      path: '/dashboard/cms',
      description: 'Gestor de contenido'
    },
    {
      name: 'Configuración',
      icon: '🔧',
      path: '/dashboard/settings',
      description: 'Ajustes de la cuenta'
    },
    {
      name: 'Ayuda',
      icon: '❓',
      path: '/dashboard/help',
      description: 'Centro de ayuda'
    }
  ];

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
          fixed top-0 left-0 h-full bg-white/95 backdrop-blur-md shadow-2xl z-30 
          transition-all duration-300 ease-in-out flex flex-col border-r border-slate-200/80 overflow-hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isOpen ? 'w-72' : 'w-0 md:w-16'}
        `}
      >
        {/* Header del Sidebar */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
          {/* Efecto de fondo */}
          <div className="absolute inset-0 bg-white/10"></div>
          
          <div className="relative z-10">
            {isOpen ? (
              // Sidebar expandido
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl transform hover:scale-110 transition-transform">🚀</div>
                    <div>
                      <h2 className="font-bold text-xl text-white">Web Scuti</h2>
                      <p className="text-xs text-blue-100 font-medium">Panel</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                    title="Contraer sidebar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                  </button>
                </div>

                {/* Info del usuario */}
                {user && (
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-lg hover:bg-white/25 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={user.imageUrl}
                          alt="Avatar"
                          className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-sm truncate">
                          {user.firstName || user.username || 'Usuario'}
                        </p>
                        <p className="text-xs text-blue-50 truncate">
                          {user.primaryEmailAddress?.emailAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Sidebar colapsado
              <div className="p-3 flex flex-col items-center">
                <button
                  onClick={() => setIsOpen(true)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors mb-3"
                  title="Expandir sidebar"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
                {user && (
                  <img
                    src={user.imageUrl}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto bg-slate-50">
          {isOpen ? (
            // Navegación expandida
            <div className="p-4">
              <div className="mb-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
                  Navegación Principal
                </p>
              </div>
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`
                        group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                        ${isActive
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/20 scale-[1.02]'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:translate-x-1'
                        }
                      `}
                    >
                      <span className={`text-2xl transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {item.icon}
                      </span>
                      <div className="flex-1 text-left">
                        <div className={`font-semibold text-sm ${isActive ? 'text-white' : ''}`}>
                          {item.name}
                        </div>
                        <div className={`text-xs ${isActive ? 'text-blue-50' : 'text-slate-400 group-hover:text-slate-500'}`}>
                          {item.description}
                        </div>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-white rounded-full shadow-lg shadow-white/50 animate-pulse"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            // Navegación colapsada (solo iconos)
            <div className="p-2">
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`
                        group w-full flex items-center justify-center p-3 rounded-xl transition-all duration-200
                        ${isActive
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-110'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:scale-110'
                        }
                      `}
                      title={item.name}
                    >
                      <span className="text-xl">
                        {item.icon}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* Footer con botón de cerrar sesión */}
        <div className="bg-slate-100 border-t border-slate-200">
          {isOpen ? (
            // Footer expandido
            <div className="p-4">
              <SignOutButton>
                <button
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:scale-[1.02]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Cerrar Sesión</span>
                </button>
              </SignOutButton>

              <div className="mt-4 text-center">
                <p className="text-xs text-slate-500 font-medium">Web Scuti v1.0.0</p>
                <p className="text-xs text-slate-400 mt-1">© 2025</p>
              </div>
            </div>
          ) : (
            // Footer colapsado
            <div className="p-2">
              <SignOutButton>
                <button
                  className="w-full flex items-center justify-center p-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:scale-105"
                  title="Cerrar Sesión"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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