import React from 'react';
import { SignedIn } from '@clerk/clerk-react';
import DashboardLayout from '../components/DashboardLayout';
import CmsManager from '../components/cms/CmsManager';
import DashboardSeo from '../components/DashboardSeo';

const CmsManagerPage: React.FC = () => {
  return (
    <SignedIn>
      <DashboardSeo
        pageName="cms"
        fallbackTitle="CMS Manager - SCUTI Company"
        fallbackDescription="Gestor de contenido, SEO y temas para tu página web."
      >
        <DashboardLayout>
          <CmsManager />
        </DashboardLayout>
      </DashboardSeo>
    </SignedIn>
  );
};

export default CmsManagerPage;
