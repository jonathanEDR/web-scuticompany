import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 🔄 Redirección de Contacto
 * Redirige a la página home con el formulario de contacto
 */
const Contact = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirigir al home con el hash del formulario
    navigate('/#contacto', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Redirigiendo al formulario de contacto...</p>
      </div>
    </div>
  );
};

export default Contact;
