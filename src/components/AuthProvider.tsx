import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setAuthTokenGetter } from '../services/cmsApi';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Componente que inicializa la función de obtención de tokens
 * para las requests autenticadas de la API
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { getToken } = useAuth();

  useEffect(() => {
    // Configurar la función de obtención de tokens para cmsApi
    setAuthTokenGetter(getToken);
  }, [getToken]);

  return <>{children}</>;
};
