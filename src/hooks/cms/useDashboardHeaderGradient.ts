/**
 * 🎨 useDashboardHeaderGradient Hook
 * Hook para obtener el gradiente del header del sidebar y usarlo en páginas administrativas
 * Mantiene consistencia visual en todo el dashboard
 */

import { useDashboardSidebarConfig } from './useDashboardSidebarConfig';
import { useTheme } from '../../contexts/ThemeContext';
import { useMemo } from 'react';

/**
 * Hook que retorna el gradiente del header según el tema activo
 * Usa la misma configuración que el Sidebar para mantener consistencia
 */
export const useDashboardHeaderGradient = () => {
  const { adminConfig } = useDashboardSidebarConfig();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Generar el CSS gradient basado en la configuración del sidebar
  const headerGradient = useMemo(() => {
    if (isDarkMode) {
      return `linear-gradient(to right, ${adminConfig.headerGradientFromDark}, ${adminConfig.headerGradientViaDark}, ${adminConfig.headerGradientToDark})`;
    }
    return `linear-gradient(to right, ${adminConfig.headerGradientFrom}, ${adminConfig.headerGradientVia}, ${adminConfig.headerGradientTo})`;
  }, [adminConfig, isDarkMode]);

  // Colores individuales por si se necesitan
  const colors = useMemo(() => ({
    from: isDarkMode ? adminConfig.headerGradientFromDark : adminConfig.headerGradientFrom,
    via: isDarkMode ? adminConfig.headerGradientViaDark : adminConfig.headerGradientVia,
    to: isDarkMode ? adminConfig.headerGradientToDark : adminConfig.headerGradientTo,
  }), [adminConfig, isDarkMode]);

  // Clase Tailwind aproximada (por si se necesita)
  const tailwindClass = isDarkMode
    ? 'from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-700 dark:via-blue-700 dark:to-indigo-700'
    : 'from-blue-500 via-purple-500 to-pink-500 dark:from-purple-600 dark:via-blue-600 dark:to-indigo-600';

  return {
    /** Gradiente CSS completo listo para usar en style={{background: headerGradient}} */
    headerGradient,
    /** Colores individuales del gradiente */
    colors,
    /** Clase Tailwind aproximada (menos precisa que el gradient CSS) */
    tailwindClass,
    /** Indica si está en modo oscuro */
    isDarkMode,
  };
};

export default useDashboardHeaderGradient;
