import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

import { FullPageLoader } from '../components/ui/FullPageLoader';

const AuthLayout = () => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <FullPageLoader />;
  }

  if (user) {
    if (!user.isVerified && location.pathname !== '/verify-email') {
      return <Navigate to="/verify-email" replace />;
    } else if (user.isVerified) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-white rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight text-primary-foreground">VibrantLink</h1>
          <p className="text-primary-foreground/80 font-bold mt-2">Manage your links with ease</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
