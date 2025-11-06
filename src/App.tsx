import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ToastContainer from './components/common/ToastContainer';
import ErrorBoundary from './components/ErrorBoundary';
import { DashboardProviders } from './components/DashboardProviders';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import DashboardRouter from './components/DashboardRouter';
import ScrollToTop from './components/common/ScrollToTop';
import WelcomeNotification from './components/WelcomeNotification';
import { UserRole } from './types/roles';
import { useAuth } from './contexts/AuthContext';
import { setTokenGetter } from './services/blog/blogApiClientSetup';
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
const PublicProfilePage = lazy(() => import('./pages/public/PublicProfilePage'));
const ProfileListPage = lazy(() => import('./pages/public/ProfileListPage'));

// Páginas de autenticación - CON Clerk optimizado
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));

// Dashboards con roles
const ClientDashboard = lazy(() => import('./pages/ClientDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Páginas del dashboard - Con autenticación
const Profile = lazy(() => import('./pages/dashboard/Profile'));
const Services = lazy(() => import('./pages/Services'));
const Settings = lazy(() => import('./pages/Settings'));
const LeadsManagement = lazy(() => import('./pages/admin/LeadsManagement'));
// Página de mensajería CRM (admin)
const CrmMessages = lazy(() => import('./pages/admin/CrmMessages'));
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

// Páginas del Portal Cliente
const ClientPortal = lazy(() => import('./pages/client/ClientPortal'));
const MyLeads = lazy(() => import('./pages/client/MyLeads'));
const MyMessages = lazy(() => import('./pages/client/MyMessages'));

// Módulo de Blog - Páginas Públicas
const BlogHome = lazy(() => import('./pages/public/blog/BlogHome'));
const BlogPost = lazy(() => import('./pages/public/blog/BlogPost'));
const BlogSearch = lazy(() => import('./pages/public/blog/BlogSearch'));
const BlogCategory = lazy(() => import('./pages/public/blog/BlogCategory'));

// Módulo de Blog - Páginas Administrativas
const BlogDashboard = lazy(() => import('./pages/admin/blog/BlogDashboard'));

// Componente de Testing IA (temporal) - Comentado hasta implementar
// const AISystemTestWithAuth = lazy(() => import('./components/testing/AISystemTestWithAuth'));
const PostEditor = lazy(() => import('./pages/admin/blog/PostEditor'));
const CategoriesManager = lazy(() => import('./pages/admin/blog/CategoriesManager'));
const CommentModeration = lazy(() => import('./pages/admin/blog/CommentModeration'));

// Módulo de Blog - Páginas del Cliente
const MyBlogHub = lazy(() => import('./components/blog/MyBlogHub'));

// Panel Central de IA
const AIAgentsDashboard = lazy(() => import('./pages/admin/AIAgentsDashboard'));
const BlogAgentConfig = lazy(() => import('./pages/admin/BlogAgentConfig'));
const BlogAgentTraining = lazy(() => import('./pages/admin/BlogAgentTraining'));
const SEOAgentTraining = lazy(() => import('./pages/admin/SEOAgentTraining'));
const AIAnalytics = lazy(() => import('./pages/admin/AIAnalytics'));

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
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  </DashboardProviders>
);

function AppContent() {
  const { showWelcomeNotification, onboardingData, dismissWelcomeNotification } = useAuth();
  const { getToken } = useClerkAuth();

  // Configurar el token getter para el blog API
  useEffect(() => {
    setTokenGetter(getToken);
    console.log('🔧 [App] Token getter configurado para Blog API');
  }, [getToken]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      
      {/* 🎉 Notificación de bienvenida para nuevos clientes */}
      {showWelcomeNotification && onboardingData && (
        <WelcomeNotification 
          onboarding={onboardingData}
          onClose={dismissWelcomeNotification}
        />
      )}
      
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
                  {/* ⚡ PÁGINAS PÚBLICAS - SIN CLERK, CARGA INSTANTÁNEA */}
                  <Route path="/" element={<Home />} />
              <Route path="/nosotros" element={<About />} />
              <Route path="/servicios" element={<ServicesPublic />} />
              <Route path="/servicios/:slug" element={<ServicioDetail />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="/perfiles" element={<ProfileListPage />} />
              <Route path="/perfil/:username" element={<PublicProfilePage />} />
              
              {/* � BLOG - Páginas Públicas */}
              <Route path="/blog" element={<BlogHome />} />
              <Route path="/blog/search" element={<BlogSearch />} />
              <Route path="/blog/categoria/:slug" element={<BlogCategory />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              
              {/* �🔐 RUTAS DE AUTENTICACIÓN - Clerk ya disponible globalmente */}
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

              {/* 🏠 Portal Cliente - Dashboard Principal */}
              <Route path="/dashboard/client/portal" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.USER, UserRole.CLIENT]}>
                    <ClientPortal />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />

              {/* 📊 Mis Proyectos/Leads */}
              <Route path="/dashboard/client/leads" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.USER, UserRole.CLIENT]}>
                    <MyLeads />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />

              {/* 💬 Mis Mensajes */}
              <Route path="/dashboard/client/messages" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.USER, UserRole.CLIENT]}>
                    <MyMessages />
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
              
              {/* 📚 Mi Actividad en el Blog - Accesible para todos los usuarios autenticados */}
              <Route path="/dashboard/mi-blog" element={
                <ProtectedRoute>
                  <MyBlogHub />
                </ProtectedRoute>
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

              {/* 💬 Mensajería CRM - Página administrativa de mensajes */}
              <Route path="/dashboard/crm/messages" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <CrmMessages />
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
              
              {/* � MÓDULO DE BLOG - Solo ADMIN, MODERATOR y SUPER_ADMIN */}
              
              {/* Dashboard Principal de Blog - Estadísticas y resumen */}
              <Route path="/dashboard/blog" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <BlogDashboard />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* Crear Nuevo Post */}
              <Route path="/dashboard/blog/posts/new" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <PostEditor />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* Editar Post Existente */}
              <Route path="/dashboard/blog/posts/:id/edit" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <PostEditor />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* Gestión de Categorías */}
              <Route path="/dashboard/blog/categories" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <CategoriesManager />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* Moderación de Comentarios */}
              <Route path="/dashboard/blog/moderation" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.MODERATOR, UserRole.SUPER_ADMIN]}>
                    <CommentModeration />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              
              {/* 🤖 MÓDULO DE AGENTES IA - Solo ADMIN y SUPER_ADMIN */}
              
              {/* Dashboard Central de Agentes IA - Configuración y monitoreo */}
              <Route path="/dashboard/ai-agents" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                    <AIAgentsDashboard />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />

              {/* Configuración detallada del BlogAgent */}
              <Route path="/dashboard/agents/blog/config" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                    <BlogAgentConfig />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />

              {/* Entrenamiento avanzado del BlogAgent */}
              <Route path="/dashboard/agents/blog/training" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                    <BlogAgentTraining />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />

              {/* Entrenamiento avanzado del SEOAgent */}
              <Route path="/dashboard/agents/seo/training" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                    <SEOAgentTraining />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />

              {/* Analytics de AI - Estadísticas de uso */}
              <Route path="/dashboard/ai-analytics" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                    <AIAnalytics />
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

              {/* 🤖 Sistema de IA - Testing (Temporal) */}
              {/* Route temporalmente comentada - componente no implementado
              <Route path="/admin/ai-test" element={
                <DashboardRoute>
                  <RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
                    <AISystemTestWithAuth />
                  </RoleBasedRoute>
                </DashboardRoute>
              } />
              */}
            </Routes>
          </Suspense>
          {/* 🔔 Contenedor de notificaciones Toast */}
          <ToastContainer position="top-right" />
        </BrowserRouter>
  );
}

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
            {/* 🔐 AuthProvider con notificación de bienvenida */}
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </NotificationProvider>
        </ThemeProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

export default App;
