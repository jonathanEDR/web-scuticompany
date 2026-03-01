import { Link } from 'react-router-dom';

/**
 * 🍞 Breadcrumbs - Navegación visual de migas de pan
 * Componente reutilizable para páginas públicas
 * Mejora UX + SEO (complementa BreadcrumbSchema JSON-LD)
 */

export interface BreadcrumbItem {
  label: string;
  href?: string; // Si no tiene href, es el item actual
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs = ({ items, className = '' }: BreadcrumbsProps) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`text-sm ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-1" itemScope itemType="https://schema.org/BreadcrumbList">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={index}
              className="flex items-center gap-1"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {/* Separator */}
              {index > 0 && (
                <svg
                  className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}

              {isLast || !item.href ? (
                // Current page (no link)
                <span
                  className="text-gray-500 dark:text-gray-400 font-medium truncate max-w-[200px] sm:max-w-[300px]"
                  itemProp="name"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                // Clickable link
                <Link
                  to={item.href}
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </Link>
              )}
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
