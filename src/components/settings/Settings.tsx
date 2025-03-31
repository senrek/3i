import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  school: string;
  class: string;
  created_at: string;
}

interface FormData {
  full_name: string;
  email: string;
  phone: string;
  school: string;
  class: string;
}

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    email: '',
    phone: '',
    school: '',
    class: ''
  });

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setFormData({
            full_name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
            email: user.email || '',
            phone: data.phone || '',
            school: data.school || '',
            class: data.class || ''
          });
        }
        setUser(user);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      
      // First check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
        throw fetchError;
      }

      // Split full name into first and last name
      const [first_name = '', last_name = ''] = formData.full_name.split(' ');

      const profileData = {
        id: user?.id,
        first_name,
        last_name,
        email: formData.email,
        phone: formData.phone,
        school: formData.school,
        class: formData.class
      };

      let result;
      if (existingProfile) {
        // Update existing profile
        result = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', user?.id);
      } else {
        // Insert new profile
        result = await supabase
          .from('profiles')
          .insert(profileData);
      }

      if (result.error) {
        throw result.error;
      }

      toast.success('Profile updated successfully!');
      
      // Refresh profile data
      await getProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Error updating profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error: any) {
      toast.error('Error logging out');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              value={formData.email}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">School</label>
            <Input
              value={formData.school}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              placeholder="Enter your school name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Class</label>
            <Input
              value={formData.class}
              onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              placeholder="Enter your class"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-4 pt-4">
          <Button
            onClick={handleUpdate}
            disabled={updating}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {updating ? 'Updating...' : 'Update Profile'}
          </Button>

          <Button
            onClick={handleLogout}
            variant="destructive"
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
          >
            Logout
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Settings; 