
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, LogOut, Moon, Sun, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  toggleSidebar?: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          {isAuthenticated && toggleSidebar && (
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}
          
          <Link to="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary">
              <div className="absolute inset-0 flex items-center justify-center text-primary-foreground font-bold">
                C
              </div>
            </div>
            <span className="hidden text-lg font-semibold sm:inline-block">CareerPath</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          <Link 
            to="/" 
            className={`${
              location.pathname === '/' ? 'nav-link nav-link-active' : 'nav-link'
            }`}
          >
            Home
          </Link>
          {isAuthenticated && (
            <>
              <Link 
                to="/dashboard" 
                className={`${
                  location.pathname === '/dashboard' ? 'nav-link nav-link-active' : 'nav-link'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/assessments" 
                className={`${
                  location.pathname.includes('/assessments') ? 'nav-link nav-link-active' : 'nav-link'
                }`}
              >
                Assessments
              </Link>
              <Link 
                to="/reports" 
                className={`${
                  location.pathname.includes('/reports') ? 'nav-link nav-link-active' : 'nav-link'
                }`}
              >
                Reports
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <User className="h-4 w-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex flex-col gap-y-1 p-2">
                  <p className="text-sm font-medium">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            location.pathname !== '/login' && location.pathname !== '/register' && (
              <Button asChild size="sm" className="rounded-xl">
                <Link to="/login">Sign in</Link>
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
