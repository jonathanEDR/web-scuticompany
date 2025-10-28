import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ToastContainer from './components/common/ToastContainer';
import ErrorBoundary from './components/ErrorBoundary';
import { DashboardProviders } from './components/DashboardProviders';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import DashboardRouter from './components/DashboardRouter';
import { UserRole } from './types/roles';
import './App.css';

// ⚡ Configuración de Clerk global optimizada
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_bGlnaHQtZG9scGhpbi00Mi5jbGVyay5hY2NvdW50cy5kZXYk';

if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY === 'YOUR_PUBLISHABLE_KEY') {
  throw new Error('Missing or Invalid Clerk Publishable Key. Check VITE_CLERK_PUBLISHABLE_KEY in .env.local');
}

// ⚡ OPTIMIZACIÓN: Lazy loading agresivo
// Páginas públicas - Sin dependencias de autenticación
const Home = lazy(() => import('./pages/public/Home'));
const About = lazy(() => import('./pages/public/About'));
const ServicesPublic = lazy(() => import('./pages/public/ServicesPublicV2'));
const ServicioDetail = lazy(() => import('./pages/public/ServicioDetail'));
const Contact = lazy(() => import('./pages/public/Contact'));

// Páginas de autenticación - CON Clerk optimizado
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));

// Dashboards con roles
const ClientDashboard = lazy(() => import('./pages/ClientDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Páginas del dashboard - Con autenticación
const Profile = lazy(() => import('./pages/Profile'));
const Services = lazy(() => import('./pages/Services'));
const Settings = lazy(() => import('./pages/Settings'));
const LeadsManagement = lazy(() => import('./pages/admin/LeadsManagement'));
const Help = lazy(() => import('./pages/Help'));
const CmsManager = lazy(() => import('./pages/CmsManager'));
const MediaLibrary = lazy(() => import('./pages/MediaLibrary'));

// Páginas administrativas
const UsersManagement = lazy(() => import('./pages/admin/UsersManagement'));

// Páginas demo
const NotificationDemo = lazy(() => import('./pages/demo/NotificationDemo'));
const PerformanceDemo = lazy(() => import('./pages/demo/PerformanceDemo'));

// Módulo de Servicios
const ServicioDashboard = lazy(() => import('./pages/admin/ServicioDashboard'));
const ServiciosManagement = lazy(() => import('./pages/admin/ServiciosManagement'));
const ServicioForm = lazy(() => import('./pages/admin/ServicioFormV3'));

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
 * Wrapper para rutas del dashboard con providers de autenticación y roles
 * Clerk + AuthContext se cargan aquí
 */
const DashboardRoute = ({ children }: { children: React.ReactNode }) => (
  <DashboardProviders>
    <AuthProvider>
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
    </AuthProvider>
  </DashboardProviders>
);

function App() {
  return (
    <ErrorBoundary>
      {/* ⚡ ClerkProvider global optimizado - Carga lazy */}
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY} 
        afterSignOutUrl="/"
      >
        {/* ⚡ ThemeProvider es ligero, se mantiene global */}
        <ThemeProvider>
          {/* 🔔 Sistema de notificaciones global */}
          <NotificationProvider>
            <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
              {/* ⚡ PÁGINAS PÚBLICAS - SIN CLERK, CARGA INSTANTÁNEA */}
              <Route path="/" element={<Home />} />
              <Route path="/nosotros" element={<About />} />
              <Route path="/servicios" element={<ServicesPublic />} />
              <Route path="/servicios/:slug" element={<ServicioDetail />} />
              <Route path="/contacto" element={<Contact />} />
              
              {/* 🔐 RUTAS DE AUTENTICACIÓN - Clerk ya disponible globalmente */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
      
              {/* 🔒 RUTAS PROTEGIDAS CON SISTEMA DE ROLES */}
              
              {/* Dashboard Principal - Redirige según rol */}
              <Route path="/dashboard" element={
                <DashboardRoute>
                  <DashboardRouter />
                </DashboardRoute>
              } />
              
              {/* 👤 Dashboard para USER y CLIENT */}
              <Route path="/dashboard/client" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.USER, UserRole.CLIENT]}>
                    <ClientDashboard />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* ⚡ Dashboard para ADMIN, MODERATOR y SUPER_ADMIN */}
              <Route path="/dashboard/admin" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <AdminDashboard />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* Perfil - Accesible para todos los usuarios autenticados */}
              <Route path="/dashboard/profile" element={
                <DashboardRoute>
                  <Profile />
                </DashboardRoute>
              } />
              
              {/* Servicios - Accesible para todos */}
              <Route path="/dashboard/services" element={
                <DashboardRoute>
                  <Services />
                </DashboardRoute>
              } />
              
              {/* Configuración - Accesible para todos */}
              <Route path="/dashboard/settings" element={
                <DashboardRoute>
                  <Settings />
                </DashboardRoute>
              } />
              
              {/* Ayuda - Accesible para todos */}
              <Route path="/dashboard/help" element={
                <DashboardRoute>
                  <Help />
                </DashboardRoute>
              } />
              
              {/* 📝 CMS - Solo ADMIN, MODERATOR y SUPER_ADMIN */}
              <Route path="/dashboard/cms" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <CmsManager />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              <Route path="/dashboard/cms/content" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <CmsManager />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              <Route path="/dashboard/cms/seo" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <CmsManager />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              <Route path="/dashboard/cms/theme" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <CmsManager />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              <Route path="/dashboard/cms/cards" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <CmsManager />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              <Route path="/dashboard/cms/contact" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <CmsManager />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* 🖼️ Media Library - Solo ADMIN, MODERATOR y SUPER_ADMIN */}
              <Route path="/dashboard/media" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <MediaLibrary />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* 📋 CRM - Gestión de Leads - Solo ADMIN, MODERATOR y SUPER_ADMIN */}
              <Route path="/dashboard/crm" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <LeadsManagement />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* 🚀 MÓDULO DE SERVICIOS - Solo ADMIN, MODERATOR y SUPER_ADMIN */}
              
              {/* Dashboard Principal de Servicios - Estadísticas y métricas */}
              <Route path="/dashboard/servicios" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <ServicioDashboard />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* Gestión de Servicios - Lista, filtros, CRUD */}
              <Route path="/dashboard/servicios/management" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <ServiciosManagement />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* Crear Nuevo Servicio */}
              <Route path="/dashboard/servicios/new" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <ServicioForm />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* Editar Servicio Existente */}
              <Route path="/dashboard/servicios/:id/edit" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <ServicioForm />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* 👥 Gestión de Usuarios - Solo ADMIN y SUPER_ADMIN */}
              <Route path="/dashboard/admin/users" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                    <UsersManagement />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />

              {/* 🎨 PÁGINAS DEMO - Solo ADMIN, MODERATOR y SUPER_ADMIN */}
              
              {/* Demo de Notificaciones */}
              <Route path="/demo/notifications" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <NotificationDemo />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* Demo de Optimizaciones de Rendimiento */}
              <Route path="/demo/performance" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <PerformanceDemo />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
            </Routes>
          </Suspense>
          {/* 🔔 Contenedor de notificaciones Toast */}
          <ToastContainer position="top-right" />
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
      </ClerkProvider>
  </ErrorBoundary>
);
}

export default App;
