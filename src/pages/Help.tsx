import DashboardLayout from '../components/DashboardLayout';
import { Card, Button } from '../components/UI';

export default function Help() {
  const faqs = [
    {
      question: "¿Cómo empiezo a usar Web Scuti?",
      answer: "Simplemente inicia sesión con tu cuenta y explora el dashboard. Puedes comenzar creando tu perfil y configurando tus servicios."
    },
    {
      question: "¿Puedo personalizar mi perfil?",
      answer: "Sí, ve a la sección de Perfil para actualizar tu información personal, foto y preferencias."
    },
    {
      question: "¿Cómo gestiono mis servicios?",
      answer: "En la sección Servicios puedes ver, crear y editar los servicios que ofreces. Próximamente tendrás funciones CRUD completas."
    },
    {
      question: "¿Es segura mi información?",
      answer: "Absolutamente. Utilizamos Clerk para autenticación segura y todas las comunicaciones están encriptadas."
    }
  ];

  const contactOptions = [
    {
      icon: "📧",
      title: "Email de Soporte",
      description: "support@webscuti.com",
      action: "Enviar Email"
    },
    {
      icon: "💬",
      title: "Chat en Vivo",
      description: "Respuesta en 2-5 minutos",
      action: "Iniciar Chat"
    },
    {
      icon: "📞",
      title: "Teléfono",
      description: "+1 (555) 123-4567",
      action: "Llamar Ahora"
    },
    {
      icon: "🎓",
      title: "Centro de Aprendizaje",
      description: "Tutoriales y guías paso a paso",
      action: "Ver Tutoriales"
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Centro de Ayuda</h1>
          <p className="text-lg text-gray-600 mb-6">
            ¿En qué podemos ayudarte hoy?
          </p>
          
          {/* Buscador */}
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Buscar en la ayuda..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600">
              <span className="text-xl">🔍</span>
            </button>
          </div>
        </div>

        {/* Opciones de Contacto Rápido */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactOptions.map((option, index) => (
            <Card key={index} className="p-4 text-center hover:shadow-xl transition-all duration-300">
              <div className="text-3xl mb-3">{option.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{option.title}</h3>
              <p className="text-sm text-gray-600 mb-3">{option.description}</p>
              <Button size="sm" className="w-full">
                {option.action}
              </Button>
            </Card>
          ))}
        </div>

        {/* Preguntas Frecuentes */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">❓</span>
            Preguntas Frecuentes
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="border border-gray-200 rounded-lg">
                <summary className="cursor-pointer p-4 hover:bg-gray-50 font-medium text-gray-900 flex items-center justify-between">
                  {faq.question}
                  <span className="text-gray-400">▼</span>
                </summary>
                <div className="px-4 pb-4 text-gray-600">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </Card>

        {/* Guías Rápidas */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            Guías de Inicio Rápido
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">🎯 Configuración Inicial</h3>
              <p className="text-blue-700 text-sm mb-3">
                Configura tu perfil y preferencias básicas en 5 minutos.
              </p>
              <Button variant="secondary" size="sm">Ver Guía</Button>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-900 mb-2">⚙️ Gestión de Servicios</h3>
              <p className="text-purple-700 text-sm mb-3">
                Aprende a crear y gestionar tus servicios profesionales.
              </p>
              <Button variant="secondary" size="sm">Ver Guía</Button>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">🔒 Configuración de Seguridad</h3>
              <p className="text-green-700 text-sm mb-3">
                Protege tu cuenta con las mejores prácticas de seguridad.
              </p>
              <Button variant="secondary" size="sm">Ver Guía</Button>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="font-semibold text-orange-900 mb-2">📊 Dashboard Avanzado</h3>
              <p className="text-orange-700 text-sm mb-3">
                Aprovecha al máximo todas las funcionalidades del panel.
              </p>
              <Button variant="secondary" size="sm">Ver Guía</Button>
            </div>
          </div>
        </Card>

        {/* Estado del Sistema */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Estado del Sistema
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-800">Aplicación Web</span>
              </div>
              <span className="text-green-600 font-semibold">Operativa</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-800">API Backend</span>
              </div>
              <span className="text-green-600 font-semibold">Operativa</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-800">Base de Datos</span>
              </div>
              <span className="text-green-600 font-semibold">Operativa</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-blue-800">Autenticación</span>
              </div>
              <span className="text-blue-600 font-semibold">Funcional</span>
            </div>
          </div>
        </Card>

        {/* Recursos Adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-xl">📚</span>
              Recursos Útiles
            </h3>
            
            <div className="space-y-3">
              <a href="#" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="font-medium text-gray-900">📖 Documentación Completa</div>
                <div className="text-sm text-gray-600">Guía técnica detallada</div>
              </a>
              
              <a href="#" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="font-medium text-gray-900">🎥 Videos Tutoriales</div>
                <div className="text-sm text-gray-600">Aprende viendo ejemplos prácticos</div>
              </a>
              
              <a href="#" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="font-medium text-gray-900">💡 Casos de Uso</div>
                <div className="text-sm text-gray-600">Ejemplos reales de implementación</div>
              </a>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-xl">🤝</span>
              Comunidad
            </h3>
            
            <div className="space-y-3">
              <a href="#" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="font-medium text-gray-900">💬 Foro de Usuarios</div>
                <div className="text-sm text-gray-600">Comparte experiencias y consejos</div>
              </a>
              
              <a href="#" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="font-medium text-gray-900">📢 Blog de Novedades</div>
                <div className="text-sm text-gray-600">Últimas actualizaciones y features</div>
              </a>
              
              <a href="#" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="font-medium text-gray-900">🐛 Reportar Problemas</div>
                <div className="text-sm text-gray-600">Ayúdanos a mejorar la plataforma</div>
              </a>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}