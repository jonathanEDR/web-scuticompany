import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';
import { useSeo } from '../../hooks/useSeo';

/**
 * 🛠️ Página Servicios
 * Demuestra el uso del hook useSeo para páginas de servicios
 */
const ServicesPublic = () => {
  // 🎯 SEO dinámico con fallbacks
  const { SeoHelmet } = useSeo({
    pageName: 'services',
    fallbackTitle: 'Servicios - SCUTI Company',
    fallbackDescription: 'Descubre nuestros servicios de desarrollo de software, aplicaciones móviles, inteligencia artificial y soluciones digitales.'
  });

  return (
    <>
      {/* 🎯 SEO automático */}
      <SeoHelmet />

      <div className="min-h-screen w-full overflow-x-hidden bg-gray-50">
        <PublicHeader />
        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
              Nuestros Servicios
            </h1>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {/* Servicio 1 */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-4xl mb-4">💻</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Desarrollo de Software
                </h3>
                <p className="text-gray-600">
                  Aplicaciones web y de escritorio personalizadas usando las últimas tecnologías.
                </p>
              </div>
              
              {/* Servicio 2 */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Aplicaciones Móviles
                </h3>
                <p className="text-gray-600">
                  Apps nativas e híbridas para iOS y Android que transforman ideas en realidad.
                </p>
              </div>
              
              {/* Servicio 3 */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Inteligencia Artificial
                </h3>
                <p className="text-gray-600">
                  Soluciones de IA personalizadas para automatizar y optimizar procesos.
                </p>
              </div>
              
              {/* Servicio 4 */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-4xl mb-4">🌐</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Páginas Web
                </h3>
                <p className="text-gray-600">
                  Sitios web responsive y optimizados para SEO que impulsan tu presencia online.
                </p>
              </div>
              
              {/* Servicio 5 */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-4xl mb-4">☁️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Soluciones en la Nube
                </h3>
                <p className="text-gray-600">
                  Migración e implementación de infraestructura en la nube escalable.
                </p>
              </div>
              
              {/* Servicio 6 */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-4xl mb-4">🔧</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Consultoría Tecnológica
                </h3>
                <p className="text-gray-600">
                  Asesoramiento experto para tomar las mejores decisiones tecnológicas.
                </p>
              </div>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg mt-12">
              <h3 className="text-xl font-semibold text-green-900 mb-3">
                ✅ SEO Global Funcionando
              </h3>
              <p className="text-green-800">
                Esta página utiliza el mismo hook <code className="bg-green-100 px-2 py-1 rounded">useSeo()</code> 
                que la página principal. Cada página puede tener sus propios meta tags dinámicos 
                gestionados desde el CMS, sin duplicar código.
              </p>
            </div>
          </div>
        </main>
        
        <PublicFooter />
      </div>
    </>
  );
};

export default ServicesPublic;