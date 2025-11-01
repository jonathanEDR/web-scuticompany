/**
 * 📜 SCROLL TO TOP COMPONENT
 * Componente para resetear el scroll al cambiar de ruta
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top immediately when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Use instant to avoid animation conflicts
    });

    // Backup scroll after a small delay to ensure content is rendered
    const scrollTimeout = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }, 100);

    return () => clearTimeout(scrollTimeout);
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;