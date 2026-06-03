import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Link as LinkIcon, BarChart3, Settings, LogOut, Menu, X, UploadCloud } from 'lucide-react';
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
    { name: 'Bulk Upload', href: '/bulk-upload', icon: UploadCloud },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <>
      <div className="h-24 flex items-center justify-center px-6 border-b-4 border-black bg-secondary group cursor-pointer transition-colors hover:bg-[#e5bc2e]">
        <div className="flex items-center gap-2 group-hover:scale-105 transition-transform duration-300">
          <div className="w-10 h-10 bg-primary rounded-xl border-2 border-black flex items-center justify-center shadow-sm group-hover:shadow-hard group-hover:-translate-y-1 transition-all overflow-hidden">
            <img src="/logo.png" alt="Logo" className="h-full w-full object-cover z-20" />
          </div>
          <h1 className="text-2xl font-heading font-extrabold tracking-tight text-foreground ml-1">VibrantLink</h1>
        </div>
      </div>
      <div className="flex-1 py-8 px-5 space-y-3 bg-white">
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
                <item.icon className={cn("mr-4 h-6 w-6 transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110 group-hover:-rotate-12")} />
                <span className="text-[15px]">{item.name}</span>
              </div>
              <div className={cn(
                "w-2.5 h-2.5 rounded-full border-2 border-black transition-all duration-300 z-10",
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
      <div className="p-5 border-t-4 border-black bg-[#f4f7f6] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-full -mr-12 -mt-12 transition-transform duration-500 group-hover:scale-150"></div>
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
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0 hidden md:block">
         <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
         <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      {/* Desktop Sidebar Wrapper */}
      <aside className="hidden md:flex w-[320px] flex-col p-6 pr-2 z-20 flex-shrink-0 h-screen">
        <div className="flex flex-col h-full bg-white rounded-[40px] border-4 border-black shadow-hard-lg overflow-hidden relative">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Sidebar drawer */}
          <aside className="fixed inset-y-0 left-0 w-[280px] flex flex-col bg-white border-r-4 border-black shadow-[12px_0px_0px_0px_rgba(0,0,0,1)]">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10 md:p-6 md:pl-4">
        <div className="flex-1 flex flex-col bg-white md:rounded-[40px] md:border-4 md:border-black md:shadow-hard-lg overflow-hidden">
          {/* Mobile Header */}
          <header className="h-20 flex items-center justify-between px-6 border-b-4 border-black bg-secondary md:hidden sticky top-0 z-40">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded-xl border-2 border-black flex items-center justify-center shadow-sm overflow-hidden mr-3">
                <img src="/logo.png" alt="Logo" className="h-full w-full object-cover z-20" />
              </div>
              <h1 className="text-2xl font-heading font-extrabold tracking-tight text-black">VibrantLink</h1>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-12 h-12 bg-white border-2 border-black rounded-xl shadow-sm flex items-center justify-center text-black focus:outline-none active:translate-y-1 active:shadow-none transition-all"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </header>

          <div className="flex-1 overflow-auto p-4 md:p-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
