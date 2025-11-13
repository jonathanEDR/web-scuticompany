import ContactSection from '../../components/public/ContactSection';
import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';
import { useCategoriasTipoServicio } from '../../hooks/useCategoriasTipoServicio';

/**
 * 📝 Página Pública de Contacto
 * Página dedicada para formulario de contacto que puedes compartir con clientes
 * URL: /contacto
 */
const Contact = () => {
  // Obtener categorías para el formulario
  const { categorias: categoriasConTipo, isLoading: loadingCategorias } = useCategoriasTipoServicio();

  // Fallback a categorías por defecto si la API falla
  const defaultCategorias = [
    { _id: '1', nombre: 'Desarrollo Web', slug: 'desarrollo-web', icono: '🌐', color: '#3B82F6' },
    { _id: '2', nombre: 'App Móvil', slug: 'app-movil', icono: '📱', color: '#8B5CF6' },
    { _id: '3', nombre: 'E-commerce', slug: 'ecommerce', icono: '🛒', color: '#EC4899' },
    { _id: '4', nombre: 'Sistemas', slug: 'sistemas', icono: '⚙️', color: '#F59E0B' },
    { _id: '5', nombre: 'Consultoría', slug: 'consultoria', icono: '💼', color: '#10B981' },
    { _id: '6', nombre: 'Diseño', slug: 'diseño', icono: '🎨', color: '#06B6D4' },
    { _id: '7', nombre: 'Marketing', slug: 'marketing', icono: '📊', color: '#F97316' },
    { _id: '8', nombre: 'Otro', slug: 'otro', icono: '📋', color: '#6B7280' }
  ];

  // Convertir categorías al formato esperado por ContactSection
  // Si hay categorías de la API, usarlas; si no, usar las por defecto
  const categoriasParaUsar = categoriasConTipo.length > 0 ? categoriasConTipo : defaultCategorias;
  
  const categorias = categoriasParaUsar.map((cat: any) => ({
    _id: cat._id,
    nombre: cat.nombre,
    slug: cat.slug,
    descripcion: cat?.descripcion || '',
    icono: cat.icono || '📋',
    color: cat.color || '#6B7280',
    orden: 0, // No disponible en el nuevo formato
    activo: true, // Solo devolvemos las activas
    totalServicios: 0, // No necesario para el formulario
    createdAt: '', // No necesario para el formulario
    updatedAt: '' // No necesario para el formulario
  }));

  // No bloquear la renderización mientras carga, mostrar con fallback
  if (loadingCategorias && categoriasConTipo.length === 0) {
    // Continuamos con fallback, no mostramos spinner
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-fade-in">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="pt-20 pb-12 bg-gradient-to-br from-gray-50 dark:from-gray-900 via-purple-100/20 dark:via-purple-900/20 to-blue-100/20 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-down">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              ¡Trabajemos Juntos! 🚀
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
              Cuéntanos sobre tu proyecto y te ayudaremos a convertir tus ideas en realidad digital. Nuestro equipo está listo para asesorarte.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Respuesta en 24 horas
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Cotización gratuita
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                </svg>
                Asesoría especializada
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Formulario de Contacto */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactSection 
            data={{
              enabled: true,
              title: '📝 Cuéntanos sobre tu proyecto',
              subtitle: 'EMPEZEMOS A TRABAJAR JUNTOS',
              description: 'Completa el formulario y nos pondremos en contacto contigo lo antes posible para discutir tu proyecto y brindarte una cotización personalizada.',
              fields: {
                nombreLabel: 'Nombre completo',
                nombrePlaceholder: 'Tu nombre',
                nombreRequired: true,
                celularLabel: 'Celular / Teléfono',
                celularPlaceholder: '+51 999 999 999',
                celularRequired: true,
                correoLabel: 'Correo electrónico',
                correoPlaceholder: 'tu@email.com',
                correoRequired: true,
                mensajeLabel: 'Cuéntanos sobre tu proyecto',
                mensajePlaceholder: 'Describe tu proyecto, necesidades o consulta...',
                mensajeRequired: true,
                mensajeRows: 5,
                categoriaEnabled: true,
                categoriaLabel: 'Tipo de servicio que necesitas',
                categoriaPlaceholder: 'Selecciona el tipo de servicio',
                categoriaRequired: true,
                termsText: 'Acepto la Política de Privacidad y Términos de Servicio',
                termsRequired: true,
                termsLink: '/politica-privacidad',
              },
              button: {
                text: 'Enviar solicitud 🚀',
                loadingText: 'Enviando...',
              },
              messages: {
                success: '¡Excelente! 🎉 Hemos recibido tu solicitud. Te contactaremos en las próximas 24 horas para discutir tu proyecto.',
                error: 'Hubo un problema al enviar tu solicitud. Por favor, intenta nuevamente o contáctanos directamente.',
              },
              styles: {
                light: {
                  titleColor: '#1f2937',
                  subtitleColor: '#6b7280',
                  descriptionColor: '#4b5563',
                  formBackground: 'rgba(255, 255, 255, 0.95)',
                  formBorder: 'rgba(0, 0, 0, 0.1)',
                  formShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                  labelColor: '#374151',
                  inputBackground: '#ffffff',
                  inputBorder: '#e5e7eb',
                  inputText: '#1f2937',
                  errorColor: '#ef4444',
                },
                dark: {
                  titleColor: '#f3f4f6',
                  subtitleColor: '#d1d5db',
                  descriptionColor: '#9ca3af',
                  formBackground: 'rgba(31, 41, 55, 0.95)',
                  formBorder: 'rgba(255, 255, 255, 0.1)',
                  formShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                  labelColor: '#e5e7eb',
                  inputBackground: '#374151',
                  inputBorder: '#4b5563',
                  inputText: '#f3f4f6',
                  errorColor: '#fca5a5',
                }
              },
              layout: {
                maxWidth: '600px',
                padding: '1.5rem',
                borderRadius: '0.75rem',
              },
              cardsDesign: {
                light: {
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: 'rgba(0, 0, 0, 0.1)',
                  borderWidth: '1px',
                  shadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  hoverBackground: 'rgba(255, 255, 255, 1)',
                  hoverBorder: 'rgba(0, 0, 0, 0.15)',
                  hoverShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                  iconGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  iconBackground: '#f3f4f6',
                  iconColor: '#667eea',
                  titleColor: '#1f2937',
                  descriptionColor: '#4b5563',
                  linkColor: '#667eea',
                  cardPadding: '1.5rem',
                },
                dark: {
                  background: 'rgba(31, 41, 55, 0.95)',
                  border: 'rgba(255, 255, 255, 0.1)',
                  borderWidth: '1px',
                  shadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  hoverBackground: 'rgba(31, 41, 55, 1)',
                  hoverBorder: 'rgba(255, 255, 255, 0.15)',
                  hoverShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
                  iconGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  iconBackground: '#1e293b',
                  iconColor: '#a78bfa',
                  titleColor: '#f3f4f6',
                  descriptionColor: '#9ca3af',
                  linkColor: '#a78bfa',
                  cardPadding: '1.5rem',
                }
              },
              map: {
                enabled: false,
              }
            } as any}
            categorias={categorias}
          />
        </div>
      </section>

      {/* Información adicional */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              ¿Por qué elegir Scuti Company?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Desarrollo Rápido</h3>
              <p className="text-gray-600 dark:text-gray-400">Entregamos proyectos en tiempo récord sin comprometer la calidad.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Calidad Garantizada</h3>
              <p className="text-gray-600 dark:text-gray-400">Cada proyecto pasa por rigurosas pruebas de calidad.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75c0-1.148-.198-2.25-.559-3.262M15.75 3a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Soporte Continuo</h3>
              <p className="text-gray-600 dark:text-gray-400">Te acompañamos durante todo el proceso y después del lanzamiento.</p>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default Contact;
