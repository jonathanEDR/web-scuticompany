import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';
import { useSeo } from '../../hooks/useSeo';

/**
 * 🏢 Página Nosotros/About
 * Demuestra el uso del hook useSeo para páginas adicionales
 */
const About = () => {
  // 🎯 SEO dinámico con fallbacks
  const { SeoHelmet } = useSeo({
    pageName: 'about',
    fallbackTitle: 'Nosotros - SCUTI Company',
    fallbackDescription: 'Conoce más sobre SCUTI Company, nuestra historia, misión y el equipo de expertos en desarrollo de software.'
  });

  return (
    <>
      {/* 🎯 SEO automático */}
      <SeoHelmet />

      <div className="min-h-screen w-full overflow-x-hidden bg-gray-50">
        <PublicHeader />
        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Sobre Nosotros
            </h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-6">
                SCUTI Company es una empresa líder en desarrollo de software y soluciones tecnológicas 
                innovadoras en Perú.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Nuestra Misión
              </h2>
              <p className="text-gray-700 mb-6">
                Transformar empresas a través de la tecnología inteligente, creando soluciones 
                digitales personalizadas que impulsen el crecimiento y la eficiencia.
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
                Nuestra Visión
              </h2>
              <p className="text-gray-700 mb-6">
                Ser la empresa de referencia en desarrollo de software en Latinoamérica, 
                reconocida por la calidad, innovación y impacto de nuestras soluciones.
              </p>
              
              <div className="bg-blue-50 p-6 rounded-lg mt-8">
                <h3 className="text-xl font-semibold text-blue-900 mb-3">
                  🎯 Prueba de SEO Dinámico
                </h3>
                <p className="text-blue-800">
                  Esta página utiliza el hook <code className="bg-blue-100 px-2 py-1 rounded">useSeo()</code> 
                  para gestionar automáticamente los meta tags. El título de la pestaña del navegador 
                  se actualiza dinámicamente desde el CMS.
                </p>
              </div>
            </div>
          </div>
        </main>
        
        <PublicFooter />
      </div>
    </>
  );
};

export default About;