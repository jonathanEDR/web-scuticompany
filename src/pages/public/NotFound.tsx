import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import SITE_CONFIG from '../../config/siteConfig';

/**
 * 🚫 Página 404 - Not Found
 * SEO-friendly: noindex para que Google no indexe URLs inexistentes
 * Incluye navegación útil para recuperar al usuario
 */
const NotFound = () => {
  const location = useLocation();

  return (
    <>
      <Helmet>
        <title>Página no encontrada - {SITE_CONFIG.siteName}</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="La página que buscas no existe o fue movida." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          {/* 404 visual */}
          <div className="mb-8">
            <h1 className="text-8xl sm:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 select-none">
              404
            </h1>
            <div className="mt-2">
              <span className="text-6xl" role="img" aria-label="Perdido">🔍</span>
            </div>
          </div>

          {/* Mensaje */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">
            Página no encontrada
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            La ruta <code className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-sm font-mono">{location.pathname}</code> no existe o fue movida.
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mb-8">
            Revisa la URL o navega usando los enlaces de abajo.
          </p>

          {/* Navegación de recuperación */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <Link
              to="/"
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">🏠</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Inicio</span>
            </Link>
            <Link
              to="/servicios"
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">💼</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Servicios</span>
            </Link>
            <Link
              to="/blog"
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">📰</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Blog</span>
            </Link>
            <Link
              to="/contacto"
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">📧</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Contacto</span>
            </Link>
          </div>

          {/* Botón principal */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
