import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/theme.css'
import App from './App.tsx'
import { HelmetProvider } from 'react-helmet-async'

/**
 * ⚡ OPTIMIZACIÓN DE RENDIMIENTO
 * - ClerkProvider removido de aquí (ahora solo en rutas protegidas)
 * - Páginas públicas se cargan sin dependencias de autenticación
 * - Mejora significativa en tiempo de carga inicial
 */

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
