
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import RegisterForm from '@/components/auth/RegisterForm';

const RegisterPage = () => {
  const { isAuthenticated } = useAuth();
  
  // If already logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-12">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/10 dark:to-indigo-950/10" />
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
        <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
      </div>
      <div className="z-10 w-full max-w-md px-4 sm:px-0">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="mt-2 text-muted-foreground">
            Start your career assessment journey by setting up an account
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
