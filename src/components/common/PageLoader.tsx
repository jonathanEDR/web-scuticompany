import { useTheme } from '../../contexts/ThemeContext';

interface PageLoaderProps {
  fullScreen?: boolean;
  message?: string;
}

/**
 * Componente unificado de carga para toda la aplicación.
 * Usa los logos SVG del sitio según el tema activo.
 * - Tema claro → Logo negro
 * - Tema oscuro → Logo blanco
 */
const PageLoader = ({ fullScreen = false, message = 'Cargando...' }: PageLoaderProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const logo = isDark
    ? '/LOGO VECTOR VERSION BLANCA.svg'
    : '/LOGO VECTOR VERSION NEGRA.svg';

  const containerClass = fullScreen
    ? 'min-h-screen fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-[#0a0a0a]'
    : 'py-20 flex items-center justify-center';

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-5">
        {/* Logo del sitio */}
        <img
          src={logo}
          alt={message}
          className="w-40 h-auto animate-pulse"
          style={{ animationDuration: '2s' }}
        />

        {/* Barra de progreso animada */}
        <div className="w-40 h-1 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
            style={{
              animation: 'pageLoaderBar 1.4s ease-in-out infinite',
              width: '40%',
            }}
          />
        </div>

        {/* Texto de carga */}
        {message && (
          <p className="text-sm text-gray-400 dark:text-gray-500">{message}</p>
        )}
      </div>

      {/* Keyframes para la barra */}
      <style>{`
        @keyframes pageLoaderBar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(250%); }
          100% { transform: translateX(-100%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-pulse { animation: none !important; }
          @keyframes pageLoaderBar { 0%, 100% { transform: translateX(0); } }
        }
      `}</style>
    </div>
  );
};

export default PageLoader;
