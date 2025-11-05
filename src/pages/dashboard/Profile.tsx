import React from 'react';
import DashboardSeo from '../../components/DashboardSeo';
import SmartDashboardLayout from '../../components/SmartDashboardLayout';
import ProfileEditor from '../../components/profile/ProfileEditorComplete';
// import ProfileEditorTest from '../../components/profile/ProfileEditorTest'; // 🧪 Componente de prueba

const Profile: React.FC = () => {
  // 🔧 Para debugging: Descomentar la línea abajo y comentar <ProfileEditor />
  // const UseTestComponent = true;
  
  return (
    <SmartDashboardLayout>
      <DashboardSeo
        pageName="profile"
        fallbackTitle="Mi Perfil - SCUTI Company"
        fallbackDescription="Edita y gestiona tu perfil de usuario"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header de la página */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mi Perfil</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Gestiona tu información personal y configuraciones de privacidad
            </p>
          </div>
          
          {/* Componente del editor */}
          {/* {UseTestComponent ? <ProfileEditorTest /> : <ProfileEditor />} */}
          <ProfileEditor />
        </div>
      </DashboardSeo>
    </SmartDashboardLayout>
  );
};

export default Profile;