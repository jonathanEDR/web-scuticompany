import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                🚀 Web Scuti
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                    Iniciar Sesión
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                    Comenzar Gratis
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Ir al Dashboard
                </button>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <span>✨</span>
            <span>Plataforma Web Empresarial</span>
          </div>
          
          <h1 className="text-6xl font-extrabold text-gray-900 mb-6">
            Impulsa tu negocio con
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Web Scuti
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Plataforma empresarial moderna con React, Node.js y MongoDB. 
            Optimizada para SEO, diseño responsive y autenticación segura.
          </p>

          <SignedOut>
            <div className="flex gap-4 justify-center">
              <SignUpButton mode="modal">
                <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl text-lg">
                  🚀 Comenzar Ahora
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl border-2 border-blue-600 hover:bg-blue-50 transition-all text-lg">
                  Iniciar Sesión
                </button>
              </SignInButton>
            </div>
          </SignedOut>

          <SignedIn>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl transition-all text-lg"
            >
              Acceder al Dashboard →
            </button>
          </SignedIn>
        </div>

        {/* Features Grid */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Por qué elegir Web Scuti?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Ultra Rápido
              </h3>
              <p className="text-gray-600">
                Construido con Vite y React para máximo rendimiento. 
                Carga instantánea y experiencia fluida.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🔐</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Seguro y Confiable
              </h3>
              <p className="text-gray-600">
                Autenticación robusta con Clerk. Protección de datos 
                y sincronización automática con MongoDB.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Diseño Moderno
              </h3>
              <p className="text-gray-600">
                Interfaz elegante con Tailwind CSS. 
                Responsive y optimizado para todos los dispositivos.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🗄️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Base de Datos Potente
              </h3>
              <p className="text-gray-600">
                MongoDB para almacenamiento escalable. 
                API REST completa con operaciones CRUD.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                SEO Optimizado
              </h3>
              <p className="text-gray-600">
                Estructura preparada para posicionamiento orgánico. 
                Meta tags y URLs amigables.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                100% Responsive
              </h3>
              <p className="text-gray-600">
                Perfecto en móviles, tablets y desktop. 
                Diseño mobile-first adaptativo.
              </p>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Tecnologías de Primera Clase
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
              <div className="text-4xl mb-2">⚛️</div>
              <h4 className="font-bold text-blue-900">React 18</h4>
              <p className="text-sm text-blue-700">Frontend</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
              <div className="text-4xl mb-2">🟢</div>
              <h4 className="font-bold text-green-900">Node.js</h4>
              <p className="text-sm text-green-700">Backend</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 text-center">
              <div className="text-4xl mb-2">🍃</div>
              <h4 className="font-bold text-emerald-900">MongoDB</h4>
              <p className="text-sm text-emerald-700">Database</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
              <div className="text-4xl mb-2">🎨</div>
              <h4 className="font-bold text-purple-900">Tailwind</h4>
              <p className="text-sm text-purple-700">CSS</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <SignedOut>
          <div className="py-16">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
              <h2 className="text-4xl font-bold mb-4">
                ¿Listo para comenzar?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Únete a Web Scuti y lleva tu proyecto al siguiente nivel
              </p>
              <SignUpButton mode="modal">
                <button className="px-10 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all text-lg shadow-lg">
                  Crear Cuenta Gratis 🚀
                </button>
              </SignUpButton>
            </div>
          </div>
        </SignedOut>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                🚀 Web Scuti
              </h3>
              <p className="text-gray-400">
                Plataforma empresarial moderna para impulsar tu negocio digital.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Tecnologías</h4>
              <ul className="space-y-2 text-gray-400">
                <li>React + TypeScript</li>
                <li>Node.js + Express</li>
                <li>MongoDB + Mongoose</li>
                <li>Clerk Authentication</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Enlaces</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentación</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Soporte</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Web Scuti. Construido con ❤️ usando tecnologías modernas.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
