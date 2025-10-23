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
  // En producción (Vercel), usar backend de Render
  if (typeof window !== 'undefined' && window.location.hostname === 'web-scuticompany.vercel.app') {
    return 'https://web-scuticompany-back.onrender.com';
  }
  // En desarrollo usar localhost
  return import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
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