import { NextPage } from 'next';
import Head from 'next/head';
import Settings from '@/components/settings/Settings';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const SettingsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Settings | 3i Global</title>
        <meta name="description" content="Manage your account settings and preferences" />
      </Head>
      
      <DashboardLayout>
        <Settings />
      </DashboardLayout>
    </>
  );
};

export default SettingsPage; 