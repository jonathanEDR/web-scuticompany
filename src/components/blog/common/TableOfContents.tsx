/**
 * 📑 TableOfContents Component - Enhanced
 * Genera navegación automática con botón flotante y smooth scroll
 */

import { useState, useEffect } from 'react';
import { List, ChevronRight, X, Menu } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  tocItems: TOCItem[];
  className?: string;
  variant?: 'sidebar' | 'floating';
}

export default function TableOfContents({
  tocItems,
  className = '',
  variant = 'sidebar'
}: TableOfContentsProps) {
  
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(variant === 'sidebar');

  useEffect(() => {
    if (!tocItems.length) return;

    // Observar intersección de encabezados para resaltar el activo
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { 
        rootMargin: '-20% 0px -35% 0px',
        threshold: 0
      }
    );

    // Observar todos los encabezados
    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [tocItems]);

  useEffect(() => {
    if (!tocItems.length) return;

    // Observar intersección de encabezados para resaltar el activo
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { 
        rootMargin: '-20% 0px -35% 0px',
        threshold: 0
      }
    );

    // Observar todos los encabezados
    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [tocItems]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; // Offset para el header sticky
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
      
      // Cerrar en modo flotante móvil después de hacer clic
      if (variant === 'floating' && window.innerWidth < 1024) {
        setIsOpen(false);
      }
    }
  };

  if (!tocItems.length) {
    return null;
  }

  // Variante Flotante
  if (variant === 'floating') {
    return (
      <>
        {/* Botón flotante */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-6 right-6 z-40 lg:bottom-8 lg:right-8
            bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-2xl
            transition-all duration-300 hover:scale-110 active:scale-95
            border-2 border-white dark:border-gray-800"
          aria-label={isOpen ? 'Ocultar índice' : 'Mostrar índice'}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Panel deslizable */}
        <div
          className={`fixed inset-y-0 right-0 z-30 w-80 bg-white dark:bg-gray-800 
            shadow-2xl border-l border-gray-200 dark:border-gray-700
            transition-transform duration-300 ease-out overflow-y-auto
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <List className="text-blue-600 dark:text-blue-400" size={24} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Índice
                </h3>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {tocItems.length} secciones
              </span>
            </div>
            
            <nav className="toc-nav">
              <ul className="space-y-1">
                {tocItems.map((item) => (
                  <li key={item.id} style={{ marginLeft: `${(item.level - 1) * 12}px` }}>
                    <button
                      onClick={() => handleClick(item.id)}
                      className={`
                        w-full text-left text-sm transition-all duration-200 flex items-center gap-2 p-3 rounded-lg
                        ${activeId === item.id
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 font-semibold shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                        }
                      `}
                    >
                      <ChevronRight 
                        className={`transition-transform flex-shrink-0 ${activeId === item.id ? 'rotate-90' : ''}`}
                        size={16} 
                      />
                      <span className="flex-1 line-clamp-2">{item.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Overlay para móvil */}
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
          />
        )}
      </>
    );
  }

  // Variante Sidebar (desktop)
  return (
    <div className={`table-of-contents ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <List className="text-blue-600 dark:text-blue-400" size={20} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Contenido
            </h3>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {tocItems.length}
          </span>
        </div>
        
        <nav className="toc-nav">
          <ul className="space-y-1">
            {tocItems.map((item) => (
              <li key={item.id} style={{ marginLeft: `${(item.level - 1) * 12}px` }}>
                <button
                  onClick={() => handleClick(item.id)}
                  className={`
                    w-full text-left text-sm transition-all duration-200 flex items-center gap-2 p-2.5 rounded-lg
                    ${activeId === item.id
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 font-semibold'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }
                  `}
                >
                  <ChevronRight 
                    className={`transition-transform flex-shrink-0 ${activeId === item.id ? 'rotate-90' : ''}`}
                    size={14} 
                  />
                  <span className="flex-1">{item.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}