import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';

interface UserSyncData {
  id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  profileImage: string;
  isNewUser: boolean;
}

interface UserSyncStatus {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
  userData: UserSyncData | null;
}

// 🔧 Configuración de API (igual que en Dashboard)
const getApiBaseUrl = () => {
  console.log('[UserSync] Detectando entorno...', {
    env: import.meta.env.MODE,
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'N/A',
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL
  });

  // 1. PRIORIDAD: Variable de entorno VITE_BACKEND_URL (sin /api)
  if (import.meta.env.VITE_BACKEND_URL) {
    console.log('[UserSync] Usando VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL);
    return import.meta.env.VITE_BACKEND_URL;
  }

  // 2. Variable de entorno VITE_API_URL (remover /api si está presente)
  if (import.meta.env.VITE_API_URL) {
    const apiUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    console.log('[UserSync] Usando VITE_API_URL (sin /api):', apiUrl);
    return apiUrl;
  }
  
  // 3. Detección automática basada en el hostname
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Si estamos en cualquier dominio de Vercel (producción)
    if (hostname.includes('vercel.app') || hostname.includes('web-scuti')) {
      const productionUrl = 'https://web-scuticompany-back.onrender.com';
      console.log('[UserSync] Detectado entorno Vercel, usando:', productionUrl);
      return productionUrl;
    }
    
    // Si estamos en localhost (desarrollo)
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('127.0.0.1')) {
      const devUrl = 'http://localhost:5000';
      console.log('[UserSync] Detectado entorno local, usando:', devUrl);
      return devUrl;
    }
  }
  
  // 4. Fallback basado en el modo de construcción
  const fallbackUrl = import.meta.env.PROD 
    ? 'https://web-scuticompany-back.onrender.com'  // Producción
    : 'http://localhost:5000';                       // Desarrollo
  
  console.warn('[UserSync] Usando fallback URL:', fallbackUrl);
  return fallbackUrl;
};


/**
 * Hook personalizado para sincronizar automáticamente el usuario de Clerk con MongoDB
 * Se ejecuta cuando el usuario se autentica
 */
export const useUserSync = (): UserSyncStatus => {
  const { isSignedIn, user, isLoaded } = useUser();
  const [syncStatus, setSyncStatus] = useState<UserSyncStatus>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    userData: null
  });

  useEffect(() => {
    const syncUserWithBackend = async () => {
      // Solo sincronizar si el usuario está autenticado y los datos están cargados
      if (!isSignedIn || !user || !isLoaded) return;

      setSyncStatus(prev => ({ ...prev, isLoading: true, isError: false }));

      try {
        const userData = {
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          username: user.username || user.primaryEmailAddress?.emailAddress?.split('@')[0] || '',
          profileImage: user.imageUrl || ''
        };

        const response = await fetch(`${getApiBaseUrl()}/api/users/sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
          setSyncStatus({
            isLoading: false,
            isSuccess: true,
            isError: false,
            error: null,
            userData: result.user
          });
        } else {
          throw new Error(result.message || 'Error al sincronizar usuario');
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        setSyncStatus({
          isLoading: false,
          isSuccess: false,
          isError: true,
          error: errorMessage,
          userData: null
        });
      }
    };

    syncUserWithBackend();
  }, [isSignedIn, user, isLoaded]);

  return syncStatus;
};