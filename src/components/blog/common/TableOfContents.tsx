/**
 * 📑 TableOfContents Component
 * Genera navegación automática basada en encabezados del contenido
 */

import { useState, useEffect } from 'react';
import { List, ChevronRight } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
  maxLevel?: number;
}

export default function TableOfContents({
  content,
  className = '',
  maxLevel = 3
}: TableOfContentsProps) {
  
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extraer encabezados del contenido HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    const items: TOCItem[] = [];
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      
      if (level <= maxLevel) {
        const text = heading.textContent?.trim() || '';
        const id = heading.id || `heading-${index}`;
        
        // Si el heading no tiene ID, añadirlo
        if (!heading.id) {
          heading.id = id;
        }
        
        items.push({
          id,
          text,
          level
        });
      }
    });
    
    setTocItems(items);
  }, [content, maxLevel]);

  useEffect(() => {
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
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  if (!tocItems.length) {
    return null;
  }

  return (
    <div className={`table-of-contents ${className}`}>
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <List className="text-blue-600 dark:text-blue-400" size={20} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Contenido
          </h3>
        </div>
        
        <nav className="toc-nav">
          <ul className="space-y-2">
            {tocItems.map((item) => (
              <li key={item.id} style={{ marginLeft: `${(item.level - 1) * 16}px` }}>
                <button
                  onClick={() => handleClick(item.id)}
                  className={`
                    w-full text-left text-sm transition-colors duration-200 flex items-center gap-2 p-2 rounded
                    ${activeId === item.id
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-medium'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }
                  `}
                >
                  <ChevronRight 
                    className={`transition-transform ${activeId === item.id ? 'rotate-90' : ''}`}
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