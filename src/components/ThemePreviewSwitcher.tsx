// Componente para alternar entre vista previa de temas
import React, { useState } from 'react';
import ButtonPreview from './ButtonPreview';

interface ThemePreviewSwitcherProps {
  lightMode: {
    buttons?: {
      ctaPrimary?: {
        bg: string;
        text: string;
        hover: string;
      };
      contact?: {
        bg: string;
        text: string;
        border?: string;
        hover: string;
        hoverText?: string;
      };
      dashboard?: {
        bg: string;
        text: string;
        hover: string;
      };
    };
  };
  darkMode: {
    buttons?: {
      ctaPrimary?: {
        bg: string;
        text: string;
        hover: string;
      };
      contact?: {
        bg: string;
        text: string;
        border?: string;
        hover: string;
        hoverText?: string;
      };
      dashboard?: {
        bg: string;
        text: string;
        hover: string;
      };
    };
  };
}

export const ThemePreviewSwitcher: React.FC<ThemePreviewSwitcherProps> = ({
  lightMode,
  darkMode
}) => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  return (
    <div className="space-y-4">
      {/* Selector de tema */}
      <div className="flex items-center justify-between">
        <h5 className="text-md font-medium text-gray-700">
          Alternar Vista Previa:
        </h5>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setCurrentTheme('light')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              currentTheme === 'light'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ☀️ Claro
          </button>
          <button
            onClick={() => setCurrentTheme('dark')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              currentTheme === 'dark'
                ? 'bg-gray-800 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🌙 Oscuro
          </button>
        </div>
      </div>

      {/* Vista previa */}
      <ButtonPreview
        lightMode={lightMode}
        darkMode={darkMode}
        currentTheme={currentTheme}
      />

      {/* Indicadores de configuración */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Estado Modo Claro */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h6 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center">
            ☀️ Estado - Modo Claro
          </h6>
          <div className="space-y-1 text-xs text-yellow-700">
            <div className="flex justify-between">
              <span>CTA Principal:</span>
              <span className={`px-2 py-1 rounded ${lightMode.buttons?.ctaPrimary?.bg ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {lightMode.buttons?.ctaPrimary?.bg ? 'Configurado' : 'Sin configurar'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Contacto:</span>
              <span className={`px-2 py-1 rounded ${lightMode.buttons?.contact?.text ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {lightMode.buttons?.contact?.text ? 'Configurado' : 'Sin configurar'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Dashboard:</span>
              <span className={`px-2 py-1 rounded ${lightMode.buttons?.dashboard?.bg ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {lightMode.buttons?.dashboard?.bg ? 'Configurado' : 'Sin configurar'}
              </span>
            </div>
          </div>
        </div>

        {/* Estado Modo Oscuro */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <h6 className="text-sm font-semibold text-slate-800 mb-2 flex items-center">
            🌙 Estado - Modo Oscuro
          </h6>
          <div className="space-y-1 text-xs text-slate-700">
            <div className="flex justify-between">
              <span>CTA Principal:</span>
              <span className={`px-2 py-1 rounded ${darkMode.buttons?.ctaPrimary?.bg ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {darkMode.buttons?.ctaPrimary?.bg ? 'Configurado' : 'Sin configurar'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Contacto:</span>
              <span className={`px-2 py-1 rounded ${darkMode.buttons?.contact?.text ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {darkMode.buttons?.contact?.text ? 'Configurado' : 'Sin configurar'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Dashboard:</span>
              <span className={`px-2 py-1 rounded ${darkMode.buttons?.dashboard?.bg ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {darkMode.buttons?.dashboard?.bg ? 'Configurado' : 'Sin configurar'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemePreviewSwitcher;