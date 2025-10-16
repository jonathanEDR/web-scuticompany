// Componente para verificar la sincronización de temas entre CMS y páginas públicas
import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeSyncIndicator: React.FC = () => {
  const { theme, colors, themeConfig } = useTheme();
  const [cssVars, setCssVars] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Leer las variables CSS actuales del documento
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    setCssVars({
      ctaBg: computedStyle.getPropertyValue('--color-cta-bg').trim(),
      ctaText: computedStyle.getPropertyValue('--color-cta-text').trim(),
      ctaHover: computedStyle.getPropertyValue('--color-cta-hover-bg').trim(),
      contactBorder: computedStyle.getPropertyValue('--color-contact-border').trim(),
      contactText: computedStyle.getPropertyValue('--color-contact-text').trim(),
      contactHover: computedStyle.getPropertyValue('--color-contact-hover-bg').trim(),
      dashboardBg: computedStyle.getPropertyValue('--color-dashboard-bg').trim(),
      dashboardText: computedStyle.getPropertyValue('--color-dashboard-text').trim(),
      dashboardHover: computedStyle.getPropertyValue('--color-dashboard-hover-bg').trim(),
    });
  }, [theme, colors, themeConfig]);

  const currentButtons = theme === 'light' ? themeConfig?.lightMode.buttons : themeConfig?.darkMode.buttons;

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border-2 border-purple-400 rounded-lg shadow-xl p-4 max-w-md z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center">
          <span className="mr-2">🔄</span>
          Estado de Sincronización
        </h3>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          theme === 'light' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-700 text-gray-200'
        }`}>
          {theme === 'light' ? '☀️ Claro' : '🌙 Oscuro'}
        </span>
      </div>

      <div className="space-y-2 text-xs">
        {/* CTA Button */}
        <div className="border-l-4 border-purple-500 pl-2">
          <div className="font-semibold text-purple-600">🚀 CTA Principal</div>
          <div className="text-gray-600 dark:text-gray-400">
            Context: {currentButtons?.ctaPrimary?.bg || 'N/A'}<br/>
            CSS Var: {cssVars.ctaBg || 'No establecida'}
          </div>
          <div className={`text-xs ${
            currentButtons?.ctaPrimary?.bg === cssVars.ctaBg ? 'text-green-600' : 'text-red-600'
          }`}>
            {currentButtons?.ctaPrimary?.bg === cssVars.ctaBg ? '✅ Sincronizado' : '❌ Desincronizado'}
          </div>
        </div>

        {/* Contact Button */}
        <div className="border-l-4 border-cyan-500 pl-2">
          <div className="font-semibold text-cyan-600">📞 Contacto</div>
          <div className="text-gray-600 dark:text-gray-400">
            Context: {currentButtons?.contact?.border || 'N/A'}<br/>
            CSS Var: {cssVars.contactBorder || 'No establecida'}
          </div>
          <div className={`text-xs ${
            currentButtons?.contact?.border === cssVars.contactBorder ? 'text-green-600' : 'text-red-600'
          }`}>
            {currentButtons?.contact?.border === cssVars.contactBorder ? '✅ Sincronizado' : '❌ Desincronizado'}
          </div>
        </div>

        {/* Dashboard Button */}
        <div className="border-l-4 border-blue-500 pl-2">
          <div className="font-semibold text-blue-600">🎯 Dashboard</div>
          <div className="text-gray-600 dark:text-gray-400">
            Context: {currentButtons?.dashboard?.bg || 'N/A'}<br/>
            CSS Var: {cssVars.dashboardBg || 'No establecida'}
          </div>
          <div className={`text-xs ${
            currentButtons?.dashboard?.bg === cssVars.dashboardBg ? 'text-green-600' : 'text-red-600'
          }`}>
            {currentButtons?.dashboard?.bg === cssVars.dashboardBg ? '✅ Sincronizado' : '❌ Desincronizado'}
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          📍 Este indicador verifica que las configuraciones del CMS se apliquen correctamente a las páginas públicas.
        </div>
      </div>
    </div>
  );
};

export default ThemeSyncIndicator;
