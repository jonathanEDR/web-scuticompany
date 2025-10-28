/**
 * 🔧 CONFIGURACIÓN DE CLERK OPTIMIZADA PARA PRODUCCIÓN
 * Maneja las diferencias entre desarrollo y producción
 */

// Detectar si estamos en producción
const isProduction = import.meta.env.PROD;

// Configuración de Clerk para diferentes entornos
export const clerkConfig = {
  // Configuración base
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_bGlnaHQtZG9scGhpbi00Mi5jbGVyay5hY2NvdW50cy5kZXYk',
  
  // Configuración específica por entorno
  afterSignInUrl: isProduction 
    ? 'https://web-scuticompany.vercel.app/dashboard'
    : 'http://localhost:5173/dashboard',
    
  afterSignUpUrl: isProduction 
    ? 'https://web-scuticompany.vercel.app/dashboard' 
    : 'http://localhost:5173/dashboard',
    
  signInUrl: isProduction 
    ? 'https://web-scuticompany.vercel.app/login'
    : 'http://localhost:5173/login',
    
  signUpUrl: isProduction 
    ? 'https://web-scuticompany.vercel.app/signup'
    : 'http://localhost:5173/signup',

  // Configuraciones avanzadas para producción
  appearance: {
    baseTheme: undefined,
    variables: {
      colorPrimary: '#8b5cf6', // Purple-500
      colorBackground: '#1f2937', // Gray-800
      colorInputBackground: '#374151', // Gray-700
      colorInputText: '#f9fafb', // Gray-50
      colorText: '#f9fafb', // Gray-50
      colorTextSecondary: '#d1d5db', // Gray-300
      borderRadius: '0.5rem',
    },
  },
  
  // Configuración de localización
  localization: {
    locale: 'es-ES',
  },
  
  // Configuración de carga para producción
  loading: {
    // En producción, ser más paciente con la carga
    timeout: isProduction ? 15000 : 8000, // 15s en prod, 8s en dev
    retries: isProduction ? 3 : 1,
  },
};

// Función para obtener la configuración de Clerk adaptada al entorno
export const getClerkConfig = () => {
  const config = { ...clerkConfig };
  
  // Validaciones específicas por entorno
  if (isProduction) {
    // En producción, verificar que tengamos la clave correcta
    if (!config.publishableKey || config.publishableKey.includes('test')) {
      console.warn('⚠️ [Clerk] Usando clave de desarrollo en producción');
    }
    
    // Log menos verboso en producción
    console.log('🔐 [Clerk] Configurado para producción');
  } else {
    // En desarrollo, más información de debug
    console.log('🔐 [Clerk] Configurado para desarrollo', {
      publishableKey: config.publishableKey?.substring(0, 20) + '...',
      afterSignInUrl: config.afterSignInUrl,
      environment: import.meta.env.MODE
    });
  }
  
  return config;
};

// Función para detectar si Clerk está disponible globalmente
export const isClerkAvailable = (): boolean => {
  try {
    const clerk = (window as any).Clerk || 
                  (window as any).__clerk_frontend_api || 
                  (window as any).__clerk ||
                  (window as any).__clerk_db_api;
    
    return !!clerk;
  } catch {
    return false;
  }
};

// Función para obtener la instancia de Clerk de forma segura
export const getClerkInstance = () => {
  try {
    return (window as any).Clerk || 
           (window as any).__clerk_frontend_api || 
           (window as any).__clerk ||
           (window as any).__clerk_db_api;
  } catch {
    return null;
  }
};

// Función para esperar a que Clerk esté completamente cargado
export const waitForClerk = (timeout = 10000): Promise<any> => {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = Math.floor(timeout / 100); // Check every 100ms
    
    const checkClerk = () => {
      attempts++;
      const clerk = getClerkInstance();
      
      if (clerk && clerk.loaded !== false) {
        console.log(`✅ [Clerk] Disponible después de ${attempts * 100}ms`);
        resolve(clerk);
        return;
      }
      
      if (attempts >= maxAttempts) {
        console.warn(`⏰ [Clerk] Timeout después de ${timeout}ms`);
        reject(new Error('Clerk loading timeout'));
        return;
      }
      
      setTimeout(checkClerk, 100);
    };
    
    checkClerk();
  });
};

// Tipos para TypeScript
export interface ClerkUser {
  imageUrl?: string;
  profileImageUrl?: string;
  firstName?: string;
  lastName?: string;
  emailAddresses?: Array<{ emailAddress: string }>;
}

export interface UserData {
  imageUrl?: string;
  firstName?: string;
  lastName?: string;
  emailAddresses?: Array<{ emailAddress: string }>;
}