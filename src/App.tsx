import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './components/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Code splitting: Lazy loading de páginas
const PublicHome = lazy(() => import('./pages/public/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Services = lazy(() => import('./pages/Services'));
const Settings = lazy(() => import('./pages/Settings'));
const Help = lazy(() => import('./pages/Help'));
const CmsManager = lazy(() => import('./pages/CmsManager'));

// Componente de loading
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
      <p className="text-gray-400 text-lg">Cargando...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Página pública principal */}
                <Route path="/" element={<PublicHome />} />
        
        {/* Rutas del dashboard protegidas */}
        <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/services"
          element={
            <ProtectedRoute>
              <Services />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/help"
          element={
            <ProtectedRoute>
              <Help />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/cms"
          element={
            <ProtectedRoute>
              <CmsManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/cms/content"
          element={
            <ProtectedRoute>
              <CmsManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/cms/seo"
          element={
            <ProtectedRoute>
              <CmsManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/cms/theme"
          element={
            <ProtectedRoute>
              <CmsManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/cms/cards"
          element={
            <ProtectedRoute>
              <CmsManager />
            </ProtectedRoute>
          }
        />
      </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
