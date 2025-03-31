
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar when route changes (on mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Public routes do not need the sidebar
  const isPublicRoute = ['/login', '/register', '/'].includes(location.pathname);

  return (
    <div className="flex min-h-screen flex-col">
      <Header toggleSidebar={!isPublicRoute ? toggleSidebar : undefined} />
      
      <div className="flex flex-1">
        {isAuthenticated && !isPublicRoute && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}
        
        <main className="flex-1 bg-background">
          <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
