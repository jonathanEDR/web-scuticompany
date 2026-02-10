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
        {/* Logo del sitio con efecto glow sutil */}
        <div className="relative">
          <img
            src={logo}
            alt={message}
            className="w-40 h-auto animate-pulse"
            style={{ animationDuration: '2s' }}
          />
          {/* Glow effect debajo del logo */}
          <div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-4 rounded-full blur-xl opacity-60"
            style={{
              background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
              animation: 'glowPulse 2s ease-in-out infinite',
            }}
          />
        </div>

        {/* Barra de progreso animada - Estilo indeterminado */}
        <div className="w-48 h-1.5 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden relative">
          {/* Barra principal que se mueve */}
          <div
            className="absolute h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #7c3aed, #06b6d4, #7c3aed)',
              backgroundSize: '200% 100%',
              animation: 'progressBar 1.5s ease-in-out infinite, shimmer 2s linear infinite',
              width: '40%',
            }}
          />
          {/* Segunda barra para efecto más dinámico */}
          <div
            className="absolute h-full rounded-full opacity-50"
            style={{
              background: 'linear-gradient(90deg, #06b6d4, #7c3aed)',
              animation: 'progressBar2 2s ease-in-out infinite',
              width: '30%',
              animationDelay: '0.5s',
            }}
          />
        </div>

        {/* Texto de carga con animación de puntos */}
        {message && (
          <p className="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-1">
            {message.replace('...', '')}
            <span className="inline-flex">
              <span style={{ animation: 'dotBounce 1.4s ease-in-out infinite' }}>.</span>
              <span style={{ animation: 'dotBounce 1.4s ease-in-out infinite', animationDelay: '0.2s' }}>.</span>
              <span style={{ animation: 'dotBounce 1.4s ease-in-out infinite', animationDelay: '0.4s' }}>.</span>
            </span>
          </p>
        )}
      </div>

      {/* Keyframes para las animaciones */}
      <style>{`
        @keyframes progressBar {
          0% {
            left: -40%;
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            left: 100%;
            opacity: 1;
          }
        }

        @keyframes progressBar2 {
          0% {
            left: -30%;
          }
          100% {
            left: 100%;
          }
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.4; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.7; transform: translateX(-50%) scale(1.1); }
        }

        @keyframes dotBounce {
          0%, 80%, 100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          40% {
            opacity: 1;
            transform: translateY(-3px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-pulse { animation: none !important; }
          @keyframes progressBar {
            0%, 100% { left: 30%; opacity: 1; }
          }
          @keyframes progressBar2 {
            0%, 100% { left: 35%; }
          }
          @keyframes shimmer {
            0%, 100% { background-position: 0 0; }
          }
          @keyframes glowPulse {
            0%, 100% { opacity: 0.5; transform: translateX(-50%) scale(1); }
          }
          @keyframes dotBounce {
            0%, 100% { opacity: 1; transform: translateY(0); }
          }
        }
      `}</style>
    </div>
  );
};

export default PageLoader;
