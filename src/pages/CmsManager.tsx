import React from 'react';
import { SignedIn } from '@clerk/clerk-react';
import DashboardLayout from '../components/DashboardLayout';
import CmsManager from '../components/cms/CmsManager';

const CmsManagerPage: React.FC = () => {
  return (
    <SignedIn>
      <DashboardLayout>
        <CmsManager />
      </DashboardLayout>
    </SignedIn>
  );
};

export default CmsManagerPage;
