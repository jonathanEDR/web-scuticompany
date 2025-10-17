import { SignIn } from '@clerk/clerk-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useEffect, useState } from 'react';

const Login = () => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  // Asegurar que el tema se haya cargado antes de renderizar
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100); // Pequeño delay para asegurar que el tema se aplique

    return () => clearTimeout(timer);
  }, [theme]);

  // Configuración dinámica de apariencia según el tema
  const appearance = {
    elements: {
      rootBox: {
        width: '100%',
        maxWidth: '400px'
      },
      card: {
        backgroundColor: theme === 'dark' ? '#0A0A0A' : '#FFFFFF',
        border: theme === 'dark' ? '1px solid #1F1F1F' : '1px solid #E5E7EB',
        boxShadow: theme === 'dark' 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.8)' 
          : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        borderRadius: '12px'
      },
      headerTitle: {
        color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
        fontSize: '24px',
        fontWeight: '700'
      },
      headerSubtitle: {
        color: theme === 'dark' ? '#E5E7EB' : '#6B7280'
      },
      formButtonPrimary: {
        backgroundColor: '#8B5CF6',
        '&:hover': {
          backgroundColor: '#7C3AED'
        }
      },
      dividerLine: {
        backgroundColor: theme === 'dark' ? '#1F1F1F' : '#E5E7EB'
      },
      dividerText: {
        color: theme === 'dark' ? '#E5E7EB' : '#6B7280'
      },
      // ⚡ OCULTAR elementos que no queremos
      footer: {
        display: 'none' // Esto oculta el "Don't have an account? Sign up"
      },
      footerAction: {
        display: 'none'
      },
      footerActionText: {
        display: 'none'
      }
    },
    layout: {
      socialButtonsPlacement: 'top' as const,
      socialButtonsVariant: 'blockButton' as const
    }
  };

  // Mostrar loading mientras se aplica el tema
  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          backgroundColor: '#000000' // Fondo negro por defecto
        }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300"
      style={{
        backgroundColor: theme === 'dark' ? '#000000' : '#F9FAFB'
      }}
    >
      <SignIn 
        appearance={appearance}
        redirectUrl="/dashboard"
        afterSignInUrl="/dashboard"
      />
    </div>
  );
};

export default Login;