import { useState, useEffect } from 'react';
import { getClerkInstance, waitForClerk } from '../config/clerk';
import type { ClerkUser, UserData } from '../config/clerk';

/**
 * Hook personalizado para detectar usuario de Clerk de manera progresiva
 * Sin bloquear la carga inicial de páginas públicas
 * MEJORADO PARA PRODUCCIÓN
 */
export const useClerkDetection = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkClerkUser = async () => {
    try {
      // 🔥 MEJORA 1: Usar función centralizada para obtener Clerk
      const clerkInstance = getClerkInstance();

      console.log('🔍 [ClerkDetection] Verificando Clerk...', {
        windowClerk: !!(window as any).Clerk,
        clerkFrontendApi: !!(window as any).__clerk_frontend_api,
        clerkInstance: !!clerkInstance,
        isLoaded: clerkInstance?.loaded,
        user: !!clerkInstance?.user,
        env: import.meta.env.MODE,
        url: window.location.href
      });

      // 🔥 MEJORA 2: Si no hay instancia, intentar esperar a que cargue
      if (!clerkInstance) {
        console.log('⏳ [ClerkDetection] Clerk no disponible, esperando...');
        try {
          const loadedClerk = await waitForClerk(3000); // Esperar máximo 3 segundos
          return checkClerkUserSync(loadedClerk);
        } catch {
          console.log('⏰ [ClerkDetection] Timeout esperando Clerk');
          setUserData(null);
          setIsLoading(false);
          return false;
        }
      }

      return checkClerkUserSync(clerkInstance);
    } catch (error) {
      console.error('❌ [ClerkDetection] Error:', error);
      setUserData(null);
      setIsLoading(false);
      return false;
    }
  };

  const checkClerkUserSync = (clerkInstance: any) => {
    try {
      // 🔥 MEJORA 3: Verificar si Clerk está completamente cargado
      if (clerkInstance && clerkInstance.loaded !== false) {
        
        // Verificar si hay usuario autenticado
        if (clerkInstance.user) {
          const user: ClerkUser = clerkInstance.user;

          const newUserData: UserData = {
            imageUrl: user.imageUrl || user.profileImageUrl,
            firstName: user.firstName,
            lastName: user.lastName,
            emailAddresses: user.emailAddresses
          };

          console.log('✅ [ClerkDetection] Usuario detectado:', {
            firstName: user.firstName,
            hasImage: !!user.imageUrl,
            email: user.emailAddresses?.[0]?.emailAddress,
            environment: import.meta.env.MODE
          });

          setUserData(newUserData);
          setIsLoading(false);
          return true;
        } else {
          // Clerk cargado pero sin usuario
          console.log('ℹ️ [ClerkDetection] Clerk cargado, sin usuario autenticado');
          setUserData(null);
          setIsLoading(false);
          return false;
        }
      } else {
        // Clerk aún no está completamente cargado
        console.log('⏳ [ClerkDetection] Clerk aún cargando...');
        return false;
      }
    } catch (error) {
      console.error('❌ [ClerkDetection] Error en checkClerkUserSync:', error);
      setUserData(null);
      setIsLoading(false);
      return false;
    }
  };

  useEffect(() => {
    console.log('🚀 [ClerkDetection] Hook iniciado');
    
    // 🔥 MEJORA 3: Verificación inicial con delay para producción
    const initialCheck = async () => {
      const result = await checkClerkUser();
      if (!result) {
        // Si no está listo, reintentar en 1 segundo
        setTimeout(async () => {
          await checkClerkUser();
        }, 1000);
      }
    };

    // Delay inicial pequeño para que Clerk termine de cargar
    setTimeout(initialCheck, 100);

    // 🔥 MEJORA 4: Verificar periódicamente pero de forma inteligente
    let attemptCount = 0;
    const maxAttempts = 30; // 30 intentos = 3 minutos máximo
    
    const smartInterval = setInterval(async () => {
      attemptCount++;
      
      if (attemptCount >= maxAttempts) {
        console.log('⏰ [ClerkDetection] Timeout: Dejando de verificar Clerk');
        clearInterval(smartInterval);
        setIsLoading(false);
        return;
      }

      // Si ya tenemos datos de usuario, verificar menos frecuentemente
      if (userData) {
        await checkClerkUser();
      } else {
        // Si no tenemos usuario, verificar más activamente
        await checkClerkUser();
      }
    }, userData ? 30000 : 5000); // 30s si hay usuario, 5s si no hay

    // 🔥 MEJORA 5: Mejores event listeners
    const handleClerkEvent = async (eventName: string) => {
      console.log(`📡 [ClerkDetection] Evento Clerk: ${eventName}`);
      setTimeout(async () => {
        await checkClerkUser();
      }, 200);
    };

    const handleSignOut = () => {
      console.log('👋 [ClerkDetection] Usuario cerró sesión');
      setUserData(null);
      setIsLoading(false);
    };

    // 🔥 MEJORA 6: Más eventos de Clerk para capturar cambios
    const events = [
      'clerk:loaded',
      'clerk:signIn', 
      'clerk:sessionCreated',
      'clerk:userUpdated'
    ];

    events.forEach(event => {
      window.addEventListener(event as any, () => handleClerkEvent(event));
    });

    // Agregar evento específico para signOut
    window.addEventListener('clerk:signOut' as any, handleSignOut);

    // Eventos de navegación y visibilidad
    window.addEventListener('popstate', () => handleClerkEvent('popstate'));
    window.addEventListener('focus', () => handleClerkEvent('focus'));
    
    // 🔥 MEJORA 7: Verificar cuando la página vuelve a ser visible
    const handleVisibilityChange = async () => {
      if (!document.hidden) {
        console.log('👁️ [ClerkDetection] Página visible, verificando usuario');
        setTimeout(async () => {
          await checkClerkUser();
        }, 500);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(smartInterval);
      
      events.forEach(event => {
        window.removeEventListener(event as any, () => handleClerkEvent(event));
      });
      
      window.removeEventListener('popstate', () => handleClerkEvent('popstate'));
      window.removeEventListener('focus', () => handleClerkEvent('focus'));
      window.removeEventListener('clerk:signOut' as any, handleSignOut);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userData]); // 🔥 MEJORA 8: Dependencia de userData para optimizar

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
    isLoading,
    getUserInitials: () => userData ? getUserInitials(userData) : 'U'
  };
};