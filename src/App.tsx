import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import { DashboardProviders } from './components/DashboardProviders';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// ⚡ OPTIMIZACIÓN: Lazy loading agresivo
// Páginas públicas - Sin dependencias de autenticación
const Home = lazy(() => import('./pages/public/Home'));

// Páginas de autenticación - CON Clerk optimizado
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));

// Páginas del dashboard - Con autenticación
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Services = lazy(() => import('./pages/Services'));
const Settings = lazy(() => import('./pages/Settings'));
const Help = lazy(() => import('./pages/Help'));
const CmsManager = lazy(() => import('./pages/CmsManager'));

// Componente de loading minimalista
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
      <p className="text-gray-400 text-lg">Cargando...</p>
    </div>
  </div>
);

/**
 * Wrapper para rutas del dashboard con providers de autenticación
 * Clerk solo se carga aquí, NO en páginas públicas
 */
const DashboardRoute = ({ children }: { children: React.ReactNode }) => (
  <DashboardProviders>
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  </DashboardProviders>
);

function App() {
  return (
    <ErrorBoundary>
      {/* ⚡ ThemeProvider es ligero, se mantiene global */}
      <ThemeProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* ⚡ PÁGINAS PÚBLICAS - SIN CLERK, CARGA INSTANTÁNEA */}
              <Route path="/" element={<Home />} />
              
              {/* 🔐 RUTAS DE AUTENTICACIÓN - Clerk con diseño optimizado */}
              <Route path="/login" element={
                <DashboardProviders>
                  <Login />
                </DashboardProviders>
              } />
              
              <Route path="/signup" element={
                <DashboardProviders>
                  <Signup />
                </DashboardProviders>
              } />
      
              {/* 🔒 RUTAS PROTEGIDAS - Clerk se carga solo aquí */}
              <Route path="/dashboard" element={
                <DashboardRoute>
                  <Dashboard />
                </DashboardRoute>
              } />
              
              <Route path="/dashboard/profile" element={
                <DashboardRoute>
                  <Profile />
                </DashboardRoute>
              } />
              
              <Route path="/dashboard/services" element={
                <DashboardRoute>
                  <Services />
                </DashboardRoute>
              } />
              
              <Route path="/dashboard/settings" element={
                <DashboardRoute>
                  <Settings />
                </DashboardRoute>
              } />
              
              <Route path="/dashboard/help" element={
                <DashboardRoute>
                  <Help />
                </DashboardRoute>
              } />
              
              <Route path="/dashboard/cms" element={
                <DashboardRoute>
                  <CmsManager />
                </DashboardRoute>
              } />
              
              <Route path="/dashboard/cms/content" element={
                <DashboardRoute>
                  <CmsManager />
                </DashboardRoute>
              } />
              
              <Route path="/dashboard/cms/seo" element={
                <DashboardRoute>
                  <CmsManager />
                </DashboardRoute>
              } />
              
              <Route path="/dashboard/cms/theme" element={
                <DashboardRoute>
                  <CmsManager />
                </DashboardRoute>
              } />
              
              <Route path="/dashboard/cms/cards" element={
                <DashboardRoute>
                  <CmsManager />
                </DashboardRoute>
              } />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
