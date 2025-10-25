/**
 * 🧠 Smart Dashboard Layout
 * Layout inteligente que selecciona el sidebar correcto según el rol del usuario
 * - USER/CLIENT → ClientSidebar (simplificado)
 * - ADMIN/MODERATOR/SUPER_ADMIN → Sidebar (completo)
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import ClientSidebar from './ClientSidebar';
import { shouldUseClientDashboard } from '../types/roles';

interface SmartDashboardLayoutProps {
  children: React.ReactNode;
}

export default function SmartDashboardLayout({ children }: SmartDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { role } = useAuth();

  // Determinar qué sidebar usar según el rol
  const useClientSidebar = role ? shouldUseClientDashboard(role) : false;

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Componente Sidebar dinámico
  const SidebarComponent = useClientSidebar ? ClientSidebar : Sidebar;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 transition-colors duration-300">
      <SidebarComponent isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div
        className={`min-h-screen transition-all duration-300 ease-in-out ${
          isMobile
            ? 'ml-0'
            : sidebarOpen
              ? 'ml-72'
              : 'ml-12'
        }`}
      >
        {isMobile && (
          <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-10 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`p-2 text-white rounded-lg transition-all duration-200 shadow-lg ${
                  useClientSidebar
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <img 
                  src="/logos/logo-dark.svg" 
                  alt="Web Scuti" 
                  className="h-8 w-auto dark:invert"
                />
                <span className="font-bold text-slate-800 dark:text-white">
                  {useClientSidebar ? 'Panel de Usuario' : 'Panel Administrativo'}
                </span>
              </div>
            </div>
          </div>
        )}

        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}