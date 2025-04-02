
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileSettings from '@/components/settings/ProfileSettings';
import { FileText, User } from 'lucide-react';

const SettingsPage = () => {
  return (
    <Layout>
      <Container className="py-8">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>
        </Tabs>
      </Container>
    </Layout>
  );
};

export default SettingsPage;
