import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
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
          <div className="md:hidden bg-white/95 backdrop-blur-sm shadow-sm p-4 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="font-bold text-lg text-blue-600">🚀 Web Scuti</h1>
            </div>
          </div>
        )}

        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}