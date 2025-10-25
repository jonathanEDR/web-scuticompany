import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import { DashboardProviders } from './components/DashboardProviders';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import DashboardRouter from './components/DashboardRouter';
import { UserRole } from './types/roles';
import './App.css';

// ⚡ OPTIMIZACIÓN: Lazy loading agresivo
// Páginas públicas - Sin dependencias de autenticación
const Home = lazy(() => import('./pages/public/Home'));
const About = lazy(() => import('./pages/public/About'));
const ServicesPublic = lazy(() => import('./pages/public/ServicesPublic'));

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
      {/* ⚡ ThemeProvider es ligero, se mantiene global */}
      <ThemeProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* ⚡ PÁGINAS PÚBLICAS - SIN CLERK, CARGA INSTANTÁNEA */}
              <Route path="/" element={<Home />} />
              <Route path="/nosotros" element={<About />} />
              <Route path="/servicios" element={<ServicesPublic />} />
              
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
              
              {/* � CRM - Gestión de Leads - Solo ADMIN, MODERATOR y SUPER_ADMIN */}
              <Route path="/dashboard/crm" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <LeadsManagement />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* �👥 Gestión de Usuarios - Solo ADMIN y SUPER_ADMIN */}
              <Route path="/dashboard/admin/users" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                    <UsersManagement />
                  </RoleBasedRoute>
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
