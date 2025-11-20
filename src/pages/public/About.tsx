import { useEffect, useState } from 'react';
import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';
import FloatingChatWidget from '../../components/floating-chat/FloatingChatWidget';
import { useSeo } from '../../hooks/useSeo';
import { getPageBySlug } from '../../services/cmsApi';

/**
 * 🏢 Página Nosotros/About
 * Carga contenido dinámico desde el CMS
 */
const About = () => {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🎯 SEO dinámico con fallbacks
  const { SeoHelmet } = useSeo({
    pageName: 'about',
    fallbackTitle: 'Nosotros - SCUTI Company',
    fallbackDescription: 'Conoce más sobre SCUTI Company, nuestra historia, misión y el equipo de expertos en desarrollo de software.'
  });

  // Cargar datos de la página About desde CMS
  useEffect(() => {
    const loadPageData = async () => {
      try {
        const data = await getPageBySlug('about');
        setPageData(data);
      } catch (error) {
        console.error('Error cargando página About:', error);
        // Usar datos de fallback
        setPageData({
          content: {
            hero: {
              title: 'Sobre Nosotros',
              subtitle: 'Conoce nuestra historia y misión',
              description: 'SCUTI Company es una empresa líder en desarrollo de software y soluciones tecnológicas innovadoras en Perú.'
            },
            mission: {
              title: 'Nuestra Misión',
              description: 'Transformar empresas a través de la tecnología inteligente, creando soluciones digitales personalizadas que impulsen el crecimiento y la eficiencia.'
            },
            vision: {
              title: 'Nuestra Visión',
              description: 'Ser la empresa de referencia en desarrollo de software en Latinoamérica, reconocida por la calidad, innovación y impacto de nuestras soluciones.'
            }
          }
        });
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden bg-gray-50">
        <PublicHeader />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  const { hero, mission, vision } = pageData?.content || {};

  return (
    <>
      {/* 🎯 SEO automático */}
      <SeoHelmet />

      <div className="min-h-screen w-full overflow-x-hidden bg-gray-50 dark:bg-gray-900">
        <PublicHeader />
        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {hero?.title || 'Sobre Nosotros'}
              </h1>
              {hero?.subtitle && (
                <h2 className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                  {hero.subtitle}
                </h2>
              )}
              {hero?.description && (
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {hero.description}
                </p>
              )}
            </div>
            
            <div className="prose prose-lg max-w-none dark:prose-invert">
              {/* Misión */}
              {mission?.title && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    {mission.title}
                  </h2>
                  {mission.description && (
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {mission.description}
                    </p>
                  )}
                </div>
              )}
              
              {/* Visión */}
              {vision?.title && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    {vision.title}
                  </h2>
                  {vision.description && (
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {vision.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
        
        <PublicFooter />
        
        {/* 💬 Chatbot de Ventas Flotante */}
        <FloatingChatWidget />
      </div>
    </>
  );
};

export default About;