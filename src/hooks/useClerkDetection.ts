import { useState, useEffect } from 'react';

interface ClerkUser {
  imageUrl?: string;
  profileImageUrl?: string;
  firstName?: string;
  lastName?: string;
  emailAddresses?: Array<{ emailAddress: string }>;
}

interface UserData {
  imageUrl?: string;
  firstName?: string;
  lastName?: string;
  emailAddresses?: Array<{ emailAddress: string }>;
}

/**
 * Hook personalizado para detectar usuario de Clerk de manera progresiva
 * Sin bloquear la carga inicial de páginas públicas
 */
export const useClerkDetection = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  const checkClerkUser = () => {
    try {
      // Verificar múltiples formas de acceder a Clerk
      const clerkInstance = (window as any).Clerk || 
                           (window as any).__clerk_frontend_api || 
                           (window as any).__clerk;

      // Verificar si Clerk está cargado y tiene usuario
      if (clerkInstance?.user) {
        const user: ClerkUser = clerkInstance.user;

        const newUserData: UserData = {
          imageUrl: user.imageUrl || user.profileImageUrl,
          firstName: user.firstName,
          lastName: user.lastName,
          emailAddresses: user.emailAddresses
        };

        setUserData(newUserData);
        return true;
      }

      // Si no hay usuario, limpiar datos
      setUserData(null);
      return false;
    } catch (error) {
      // Silenciar errores en producción
      setUserData(null);
      return false;
    }
  };

  useEffect(() => {
    // Verificación inicial
    checkClerkUser();

    // Verificar periódicamente
    const interval = setInterval(checkClerkUser, 5000);

    // Escuchar eventos de Clerk
    const handleClerkEvent = () => {
      setTimeout(checkClerkUser, 100);
    };

    const handleSignOut = () => {
      setUserData(null);
    };

    // Eventos de Clerk
    window.addEventListener('clerk:loaded', handleClerkEvent);
    window.addEventListener('clerk:signIn', handleClerkEvent);
    window.addEventListener('clerk:signOut', handleSignOut);

    // Eventos de navegación
    window.addEventListener('popstate', handleClerkEvent);

    return () => {
      clearInterval(interval);
      window.removeEventListener('clerk:loaded', handleClerkEvent);
      window.removeEventListener('clerk:signIn', handleClerkEvent);
      window.removeEventListener('clerk:signOut', handleSignOut);
      window.removeEventListener('popstate', handleClerkEvent);
    };
  }, []);

  // Función para obtener iniciales del usuario
  const getUserInitials = (userData: UserData): string => {
    const firstName = userData.firstName?.trim();
    const lastName = userData.lastName?.trim();
    const email = userData.emailAddresses?.[0]?.emailAddress;

    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName.slice(0, 2).toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  return {
    userData,
    isLoggedIn: !!userData,
    getUserInitials: () => userData ? getUserInitials(userData) : 'U'
  };
};