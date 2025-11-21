/**
 * 🎯 usePostContent Hook
 * Procesa el contenido HTML del post, agrega IDs a encabezados y extrae TOC
 */

import { useMemo } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface ProcessedContent {
  html: string;
  tocItems: TOCItem[];
}

export function usePostContent(content: string, maxLevel: number = 3): ProcessedContent {
  return useMemo(() => {
    if (!content) {
      return { html: '', tocItems: [] };
    }

    // Crear un documento temporal para manipular el HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    const tocItems: TOCItem[] = [];
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      
      if (level <= maxLevel) {
        const text = heading.textContent?.trim() || '';
        
        // Generar ID basado en el texto del encabezado
        const id = heading.id || text
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
          .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales
          .replace(/\s+/g, '-') // Reemplazar espacios con guiones
          .substring(0, 50) // Limitar longitud
          + `-${index}`; // Añadir índice para garantizar unicidad
        
        // Agregar ID al elemento heading
        heading.id = id;
        
        // Agregar clase para scroll offset (para header sticky)
        heading.classList.add('scroll-mt-24');
        
        tocItems.push({
          id,
          text,
          level
        });
      }
    });
    
    // Serializar el documento de vuelta a HTML
    const processedHtml = doc.body.innerHTML;
    
    return {
      html: processedHtml,
      tocItems
    };
  }, [content, maxLevel]);
}
