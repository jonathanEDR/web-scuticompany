import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PublicHeader from '../../components/public/PublicHeader';
import ContactSection from '../../components/public/ContactSection';
import PublicFooter from '../../components/public/PublicFooter';
import { useDynamicSeo } from '../../hooks/useDynamicSeo';
import { usePageData } from '../../hooks/usePageData';

/**
 * 📧 Página Pública de Contacto
 * Muestra el formulario de contacto con datos desde el CMS
 */
const Contact = () => {
  const { slug } = useParams();
  const pageSlug = slug || 'contacto';
  
  // Cargar datos de la página desde el CMS
  const { pageData, loading, error, contactFormData } = usePageData(pageSlug);
  
  // Configurar SEO dinámico
  useDynamicSeo({
    pageData,
    routePath: '/contacto'
  });

  // Scroll to top al montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Error al cargar la página
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <PublicHeader />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Contact Form Section */}
        <ContactSection 
          data={pageData?.content?.contactForm || contactFormData} 
        />
      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
};

export default Contact;
