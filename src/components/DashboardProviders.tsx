import { ClerkProvider } from '@clerk/clerk-react';
import { AuthProvider } from './AuthProvider';

interface DashboardProvidersProps {
  children: React.ReactNode;
}

// Import Clerk Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_bGlnaHQtZG9scGhpbi00Mi5jbGVyay5hY2NvdW50cy5kZXYk';

if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY === 'YOUR_PUBLISHABLE_KEY') {
  throw new Error('Missing or Invalid Clerk Publishable Key. Check VITE_CLERK_PUBLISHABLE_KEY in .env.local');
}

/**
 * Providers específicos para el Dashboard
 * Solo se cargan cuando el usuario accede a rutas protegidas
 * Esto evita que Clerk se cargue en páginas públicas
 */
export const DashboardProviders = ({ children }: DashboardProvidersProps) => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <AuthProvider>
        {children}
      </AuthProvider>
    </ClerkProvider>
  );
};
