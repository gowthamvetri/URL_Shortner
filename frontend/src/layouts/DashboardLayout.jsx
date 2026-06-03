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
      <div className="h-20 flex items-center px-6 border-b-2 border-black bg-white group cursor-pointer transition-colors hover:bg-accent/10">
        <div className="flex items-center gap-2 group-hover:scale-105 transition-transform duration-300">
          <div className="w-10 h-10 bg-primary rounded-xl border-2 border-black flex items-center justify-center shadow-sm group-hover:shadow-hard group-hover:-translate-y-1 transition-all overflow-hidden">
            <img src="/final.png" alt="Logo" className="h-full w-full object-cover z-20" />
          </div>
          <h1 className="text-2xl font-heading font-extrabold tracking-tight text-foreground ml-1">VibrantLink</h1>
        </div>
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
                'group flex items-center justify-between px-4 py-3.5 text-sm font-bold rounded-xl transition-all border-2 duration-300 relative overflow-hidden',
                isActive
                  ? 'bg-primary text-black border-black shadow-hard translate-x-2'
                  : 'text-muted-foreground border-transparent hover:bg-white hover:border-black hover:text-foreground hover:shadow-hard hover:translate-x-1'
              )}
            >
              <div className="flex items-center z-10 relative">
                <item.icon className={cn("mr-3 h-5 w-5 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
                {item.name}
              </div>
              <div className={cn(
                "w-2 h-2 rounded-full border-2 border-black transition-all duration-300 z-10",
                isActive ? "bg-white scale-100" : "bg-transparent scale-0 group-hover:scale-100 group-hover:bg-primary"
              )} />
              {/* Background fill effect on hover */}
              {!isActive && (
                <div className="absolute inset-0 bg-[#F1C40F]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0"></div>
              )}
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t-2 border-black bg-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#F1C40F]/20 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-150"></div>
        <div className="flex items-center gap-3 px-3 py-2 mb-4 relative z-10">
          <div className="h-10 w-10 rounded-full bg-secondary border-2 border-black shadow-sm flex items-center justify-center text-black font-heading font-extrabold text-lg group-hover:shadow-hard group-hover:-translate-y-1 transition-all">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{user?.name}</p>
            <p className="text-xs font-medium text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold text-foreground bg-white hover:bg-[#ba1a1a] hover:text-white border-2 border-black shadow-sm hover:shadow-hard hover:-translate-y-1 rounded-xl transition-all relative z-10"
        >
          <LogOut className="mr-2 h-5 w-5" />
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
            <img src="/final.png" alt="Logo" className="h-8 w-8 mr-2 object-contain rounded-full border-2 border-black" />
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
