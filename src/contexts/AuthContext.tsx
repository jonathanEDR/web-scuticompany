/**
 * 🔐 Context de Autenticación con Roles
 * Sincroniza Clerk con el backend MongoDB y provee información del usuario con su rol
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import type { 
  UserWithRole, 
  Permission 
} from '../types/roles';
import {
  hasPermission as checkPermission,
  getRolePermissions,
  canAccessAdminDashboard,
  shouldUseClientDashboard,
  UserRole
} from '../types/roles';
import { authService } from '../services/authService';

interface AuthContextType {
  // Usuario y rol
  user: UserWithRole | null;
  role: UserRole | null;
  isLoading: boolean;
  error: string | null;
  
  // Verificaciones de permisos
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  
  // Verificaciones de acceso
  canAccessAdmin: boolean;
  shouldUseClientDashboard: boolean;
  
  // Métodos
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

// ============================================
// CONTEXT
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { getToken } = useClerkAuth();
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Sincroniza el usuario de Clerk con MongoDB
   */
  const syncUserData = async () => {
    // Si Clerk no ha cargado, esperar
    if (!isClerkLoaded) {
      return;
    }

    // Si no hay usuario en Clerk, limpiar estado
    if (!clerkUser) {
      setUser(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Obtener token de Clerk
      const token = await getToken();
      
      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }

      // Preparar datos del usuario de Clerk
      const userData = {
        clerkId: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        username: clerkUser.username,
        profileImage: clerkUser.imageUrl
      };

      // Obtener o sincronizar usuario con backend
      const syncedUser = await authService.getOrSyncUser(token, userData);
      
      setUser(syncedUser);

      console.log('[AuthContext] Usuario sincronizado:', {
        email: syncedUser.email,
        role: syncedUser.role,
        isActive: syncedUser.isActive
      });

      // 🔍 DEBUG: Verificar funciones de roles
      console.log('[AuthContext] DEBUG ROLES:', {
        role: syncedUser.role,
        roleType: typeof syncedUser.role,
        shouldUseClient: shouldUseClientDashboard(syncedUser.role),
        canAccessAdmin: canAccessAdminDashboard(syncedUser.role),
        comparison: {
          isUSER: syncedUser.role === 'USER',
          isCLIENT: syncedUser.role === 'CLIENT',
          isString: typeof syncedUser.role === 'string'
        }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al sincronizar usuario';
      console.error('[AuthContext] Error:', errorMessage, err);
      setError(errorMessage);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Efecto: Sincronizar cuando Clerk carga o cambia el usuario
   */
  useEffect(() => {
    syncUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clerkUser, isClerkLoaded]);

  /**
   * Método para refrescar manualmente el usuario
   */
  const refreshUser = async () => {
    await syncUserData();
  };

  /**
   * Limpiar error
   */
  const clearError = () => {
    setError(null);
  };

  // ============================================
  // VERIFICACIONES DE PERMISOS
  // ============================================

  /**
   * Verifica si el usuario tiene un permiso específico
   */
  const hasPermissionCheck = (permission: Permission): boolean => {
    if (!user || !user.role) return false;
    
    // Verificar permisos personalizados del usuario
    if (user.customPermissions?.includes(permission)) {
      return true;
    }
    
    // Verificar permisos del rol
    return checkPermission(user.role, permission);
  };

  /**
   * Verifica si el usuario tiene al menos uno de los permisos
   */
  const hasAnyPermissionCheck = (permissions: Permission[]): boolean => {
    if (!user || !user.role) return false;
    return permissions.some(permission => hasPermissionCheck(permission));
  };

  /**
   * Verifica si el usuario tiene todos los permisos
   */
  const hasAllPermissionsCheck = (permissions: Permission[]): boolean => {
    if (!user || !user.role) return false;
    return permissions.every(permission => hasPermissionCheck(permission));
  };

  /**
   * Verifica si el usuario tiene uno de los roles especificados
   */
  const hasRoleCheck = (roles: UserRole | UserRole[]): boolean => {
    if (!user || !user.role) return false;
    
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  // ============================================
  // VERIFICACIONES DE ACCESO
  // ============================================

  const canAccessAdmin = user?.role ? canAccessAdminDashboard(user.role) : false;
  const shouldUseClient = user?.role ? shouldUseClientDashboard(user.role) : false;

  // ============================================
  // CONTEXT VALUE
  // ============================================

  const value: AuthContextType = {
    // Estado
    user,
    role: user?.role || null,
    isLoading,
    error,
    
    // Verificaciones de permisos
    hasPermission: hasPermissionCheck,
    hasAnyPermission: hasAnyPermissionCheck,
    hasAllPermissions: hasAllPermissionsCheck,
    hasRole: hasRoleCheck,
    
    // Verificaciones de acceso
    canAccessAdmin,
    shouldUseClientDashboard: shouldUseClient,
    
    // Métodos
    refreshUser,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

/**
 * Hook para acceder al contexto de autenticación
 * 
 * @throws Error si se usa fuera del AuthProvider
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { user, role, hasPermission } = useAuth();
 *   
 *   if (hasPermission(Permission.MANAGE_USERS)) {
 *     return <AdminPanel />;
 *   }
 *   
 *   return <UserPanel />;
 * }
 * ```
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
}

// ============================================
// HOOKS ADICIONALES
// ============================================

/**
 * Hook para verificar si el usuario tiene un permiso específico
 * 
 * @param permission - Permiso a verificar
 * @returns true si tiene el permiso
 * 
 * @example
 * ```typescript
 * function AdminButton() {
 *   const canManageUsers = usePermission(Permission.MANAGE_USERS);
 *   
 *   if (!canManageUsers) return null;
 *   return <button>Gestionar Usuarios</button>;
 * }
 * ```
 */
export function usePermission(permission: Permission): boolean {
  const { hasPermission } = useAuth();
  return hasPermission(permission);
}

/**
 * Hook para verificar si el usuario tiene uno de los roles especificados
 * 
 * @param roles - Rol o array de roles
 * @returns true si tiene uno de los roles
 * 
 * @example
 * ```typescript
 * function AdminPanel() {
 *   const isAdmin = useRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]);
 *   
 *   if (!isAdmin) {
 *     return <Navigate to="/dashboard" />;
 *   }
 *   
 *   return <AdminContent />;
 * }
 * ```
 */
export function useRole(roles: UserRole | UserRole[]): boolean {
  const { hasRole } = useAuth();
  return hasRole(roles);
}

/**
 * Hook para obtener los permisos del usuario actual
 * 
 * @returns Array de permisos del usuario
 * 
 * @example
 * ```typescript
 * function PermissionsList() {
 *   const permissions = useUserPermissions();
 *   
 *   return (
 *     <ul>
 *       {permissions.map(permission => (
 *         <li key={permission}>{permission}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useUserPermissions(): Permission[] {
  const { user } = useAuth();
  
  if (!user || !user.role) {
    return [];
  }
  
  const rolePermissions = getRolePermissions(user.role);
  const customPermissions = user.customPermissions || [];
  
  // Combinar permisos del rol con permisos personalizados
  return Array.from(new Set([...rolePermissions, ...customPermissions]));
}

// ============================================
// EXPORTS
// ============================================

export default AuthContext;
