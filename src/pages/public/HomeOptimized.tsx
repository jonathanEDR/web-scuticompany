
/**
 * Versión optimizada de la página Home con configuración predeterminada
 * Garantiza funcionamiento sin conexión a base de datos
 */

import { Helmet } from 'react-helmet-async';
import PublicHeader from '../../components/public/PublicHeader';
import HeroSection from '../../components/public/HeroSection';
import SolutionsSection from '../../components/public/SolutionsSection';
import PublicFooter from '../../components/public/PublicFooter';
import { DEFAULT_HERO_CONFIG, DEFAULT_SOLUTIONS_CONFIG } from '../../utils/defaultConfig';

const HomeOptimized = () => {
  // Usar directamente defaultConfig.ts sin hooks complejos
  const heroData = DEFAULT_HERO_CONFIG;
  const solutionsData = DEFAULT_SOLUTIONS_CONFIG;

  return (
    <div className="theme-transition">
      <Helmet>
        <title>Scuti Company - Transformamos tu empresa con tecnología inteligente</title>
        <meta 
          name="description" 
          content="Soluciones digitales, desarrollo de software y modelos de IA personalizados para impulsar tu negocio"
        />
        <meta 
          name="keywords" 
          content="tecnología, software, inteligencia artificial, transformación digital, scuti company"
        />
        
        {/* Open Graph */}
        <meta property="og:title" content="Scuti Company - Tecnología Inteligente" />
        <meta 
          property="og:description" 
          content="Transformamos procesos con soluciones digitales y modelos de IA personalizados" 
        />
        <meta property="og:image" content={DEFAULT_HERO_CONFIG.backgroundImage.dark} />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Scuti Company - Tecnología Inteligente" />
        <meta 
          name="twitter:description" 
          content="Transformamos procesos con soluciones digitales y modelos de IA personalizados" 
        />
        <meta name="twitter:image" content={DEFAULT_HERO_CONFIG.backgroundImage.dark} />
      </Helmet>

      {/* Header público */}
      <PublicHeader />

      {/* Contenido principal */}
      <main className="theme-transition">
        {/* Hero Section con configuración predeterminada */}
        <HeroSection data={heroData} />
        
        {/* Solutions Section con configuración predeterminada */}
        <SolutionsSection data={solutionsData} />
      </main>

      {/* Footer público */}
      <PublicFooter />
    </div>
  );
};

export default HomeOptimized;