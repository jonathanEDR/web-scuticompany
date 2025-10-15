import { Link } from 'react-router-dom';
import { SignUpButton, SignedIn, SignedOut } from '@clerk/clerk-react';

interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
}

interface HeroSectionProps {
  data?: HeroData;
}

const HeroSection = ({ data }: HeroSectionProps) => {
  // Datos por defecto si no se proporcionan
  const heroData: HeroData = data || {
    title: 'Transformamos tu empresa con tecnología inteligente',
    subtitle: 'Innovamos para que tu empresa avance al ritmo de la tecnología.',
    description: 'Transformamos procesos con soluciones digitales, proyectos de software y modelos de IA personalizados.',
    ctaText: 'Conoce nuestros servicios',
    ctaLink: '#servicios'
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden theme-transition"
             style={{
               background: `linear-gradient(135deg, var(--color-background), color-mix(in srgb, var(--color-primary) 10%, var(--color-background)), var(--color-background))`
             }}>
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, color-mix(in srgb, var(--color-primary) 40%, transparent) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          animation: 'backgroundScroll 20s linear infinite'
        }}></div>
      </div>

      {/* Key Icon - Right Side */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 opacity-20">
        <svg viewBox="0 0 200 200" className="w-full h-auto">
          <defs>
            <linearGradient id="keyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'var(--color-secondary)', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: 'var(--color-primary)', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <circle cx="140" cy="60" r="35" fill="none" stroke="url(#keyGradient)" strokeWidth="8"/>
          <rect x="100" y="58" width="60" height="12" fill="url(#keyGradient)" rx="2"/>
          <rect x="130" y="45" width="8" height="30" fill="url(#keyGradient)" rx="2"/>
          <rect x="150" y="50" width="8" height="20" fill="url(#keyGradient)" rx="2"/>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8 animate-fadeIn">
          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold theme-text-primary leading-tight theme-transition">
            <span className="block mb-2">{heroData.title}</span>
          </h1>

          {/* Subtitle */}
          <div className="max-w-4xl mx-auto space-y-4">
            <p className="text-xl sm:text-2xl theme-text-primary theme-transition">
              {heroData.subtitle}
            </p>
            <p className="text-lg sm:text-xl theme-text-secondary theme-transition">
              {heroData.description}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {/* Botón principal de servicios */}
            <Link
              to={heroData.ctaLink}
              className="group relative px-8 py-4 rounded-full overflow-hidden theme-transition"
              style={{
                background: `linear-gradient(90deg, var(--color-primary), var(--color-secondary), var(--color-primary))`,
                backgroundSize: '200% 100%',
                animation: 'gradientShift 3s ease-in-out infinite'
              }}
            >
              <div className="absolute inset-0 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"
                   style={{
                     background: `linear-gradient(90deg, var(--color-primary), var(--color-secondary), var(--color-primary))`,
                     backgroundSize: '200% 100%'
                   }}></div>
              <span className="relative text-white font-semibold text-lg flex items-center space-x-2">
                <span>{heroData.ctaText}</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>

            {/* Botones de autenticación */}
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="group relative px-8 py-4 rounded-full border-2 theme-transition font-semibold text-lg hover:bg-opacity-100"
                        style={{
                          borderColor: 'var(--color-primary)',
                          color: 'var(--color-primary)',
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.backgroundColor = 'var(--color-primary)';
                          (e.target as HTMLElement).style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.backgroundColor = 'transparent';
                          (e.target as HTMLElement).style.color = 'var(--color-primary)';
                        }}>
                  <span className="flex items-center space-x-2">
                    <span>🚀</span>
                    <span>Comenzar Gratis</span>
                  </span>
                </button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <Link
                to="/dashboard"
                className="group relative px-8 py-4 rounded-full border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white transition-all duration-300 font-semibold text-lg"
              >
                <span className="flex items-center space-x-2">
                  <span>🎯</span>
                  <span>Ir al Dashboard</span>
                </span>
              </Link>
            </SignedIn>
          </div>

          {/* Scroll Indicator Dots */}
          <div className="flex justify-center space-x-2 pt-8">
            <div className="w-2 h-2 rounded-full bg-purple-400"></div>
            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes backgroundScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(40px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
