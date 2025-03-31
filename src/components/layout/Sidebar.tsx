import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, TestTube, FileText, Settings, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
const Sidebar = ({
  isOpen,
  onClose
}: SidebarProps) => {
  const location = useLocation();

  // Navigation items
  const navItems = [{
    name: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />
  }, {
    name: 'Assessments',
    href: '/assessments',
    icon: <TestTube className="h-5 w-5" />
  }, {
    name: 'Reports',
    href: '/reports',
    icon: <FileText className="h-5 w-5" />
  }, {
    name: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />
  }];
  return <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={onClose} />}
      
      {/* Sidebar */}
      <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 ease-in-out md:relative md:translate-x-0", isOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-16 items-center justify-between border-b border-border p-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-primary">
              <div className="absolute inset-0 flex items-center justify-center text-primary-foreground font-bold">
                C
              </div>
            </div>
            <span className="text-lg font-semibold">3i</span>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <nav className="flex flex-col gap-1">
            {navItems.map(item => <Link key={item.name} to={item.href} className={cn("group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground", location.pathname === item.href || item.href !== '/dashboard' && location.pathname.includes(item.href) ? "bg-accent text-accent-foreground" : "text-muted-foreground")} onClick={() => {
            if (window.innerWidth < 768) {
              onClose();
            }
          }}>
                {item.icon}
                {item.name}
              </Link>)}
          </nav>
        </div>
        
        <div className="border-t border-border p-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CareerPath
          </p>
        </div>
      </aside>
    </>;
};
export default Sidebar;