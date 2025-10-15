import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import PublicHome from './pages/public/Home'; // Página pública landing
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Services from './pages/Services'
import Settings from './pages/Settings'
import Help from './pages/Help'
import CmsManager from './pages/CmsManager'
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
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
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
