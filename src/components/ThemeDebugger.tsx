import { useTheme } from '../contexts/ThemeContext';

/**
 * Componente de debug temporal para verificar el estado del tema
 * Solo para desarrollo - eliminar en producción
 */
const ThemeDebugger = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 text-white p-4 rounded-lg text-sm font-mono">
      <div className="mb-2">
        <strong>🎨 Theme Debug</strong>
      </div>
      <div className="mb-2">
        Current Theme: <span className="font-bold text-yellow-300">{theme}</span>
      </div>
      <div className="mb-2">
        Path: <span className="text-blue-300">{window.location.pathname}</span>
      </div>
      <div className="mb-3">
        Time: <span className="text-green-300">{new Date().toLocaleTimeString()}</span>
      </div>
      <button
        onClick={toggleTheme}
        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-white text-xs"
      >
        Toggle Theme
      </button>
    </div>
  );
};

export default ThemeDebugger;