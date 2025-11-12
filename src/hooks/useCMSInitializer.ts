/**
 * 🎯 Hook para inicializar páginas CMS automáticamente
 */

import { useEffect } from 'react';
import { initializeCMSPages } from '../services/cmsInitializer';
import { useAuth } from '@clerk/clerk-react';

/**
 * Hook que inicializa las páginas CMS si el usuario tiene permisos
 */
export const useCMSInitializer = () => {
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    // Solo intentar inicializar si el usuario está autenticado y tiene permisos
    // En este caso, solo si es usuario del sistema
    if (isLoaded && userId) {
      // Esperar un segundo para asegurar que Clerk está completamente listo
      const timeout = setTimeout(() => {
        initializeCMSPages().catch(error => {
          if (import.meta.env.DEV) {
            console.error('Error en inicialización de CMS:', error);
          }
        });
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [isLoaded, userId]);
};

export default useCMSInitializer;
