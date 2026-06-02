import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Link as LinkIcon, BarChart3, Settings, LogOut, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My URLs', href: '/urls', icon: LinkIcon },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center px-6 border-b-2 border-black bg-accent/30">
        <img src="/final.png" alt="Logo" className="h-8 w-8 mr-2 object-contain border-2 border-black rounded-full" />
        <h1 className="text-2xl font-heading font-extrabold tracking-tight text-primary">VibrantLink</h1>
      </div>
      <div className="flex-1 py-6 px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                'flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all border-2',
                isActive
                  ? 'bg-primary text-primary-foreground border-black shadow-hard translate-x-1'
                  : 'text-muted-foreground border-transparent hover:bg-muted hover:border-black hover:text-foreground'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t-2 border-black bg-accent/10">
        <div className="flex items-center px-3 py-2 mb-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-sm font-bold text-destructive hover:bg-destructive hover:text-destructive-foreground border-2 border-transparent hover:border-black hover:shadow-hard rounded-xl transition-all"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-64 flex-col hidden md:flex border-r-2 border-black bg-card z-20 shadow-hard-lg flex-shrink-0 h-full">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Sidebar drawer */}
          <aside className="fixed inset-y-0 left-0 w-64 flex flex-col bg-background shadow-xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 flex items-center justify-between px-4 border-b-2 border-black bg-background md:hidden sticky top-0 z-40">
          <div className="flex items-center">
            <img src="/final.png" alt="Logo" className="h-8 w-8 mr-2 object-contain" />
            <h1 className="text-2xl font-heading font-extrabold tracking-tight text-primary">VibrantLink</h1>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -mr-2 text-muted-foreground hover:text-foreground focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
