import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield, Bell } from 'lucide-react';
import { ChangePasswordModal } from '../components/ChangePasswordModal';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service';

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);

  const handlePasswordChangeClick = async () => {
    setIsRequestingOtp(true);
    const toastId = toast.loading('Sending verification code to your email...');
    try {
      await authService.requestPasswordChangeOTP();
      toast.success('Verification code sent!', { id: toastId });
      setIsPasswordModalOpen(true);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send verification code', { id: toastId });
    } finally {
      setIsRequestingOtp(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl relative">
      <div className="relative z-10 p-8 bg-secondary rounded-xl border-2 border-black shadow-hard-lg overflow-hidden">
        {/* Organic Blob Background */}
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-white/30 rounded-full blur-2xl pointer-events-none"></div>
        <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-secondary-foreground mb-2 relative z-10">Settings</h2>
        <p className="text-secondary-foreground/80 font-medium relative z-10">Manage your account settings and preferences.</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Section */}
        <div className="rounded-xl border-2 border-black bg-card text-card-foreground shadow-hard-lg overflow-hidden">
          <div className="flex flex-col space-y-1.5 p-6 border-b-2 border-black bg-accent/20">
            <h3 className="font-heading font-extrabold text-xl leading-none tracking-tight">Profile</h3>
            <p className="text-sm font-medium text-muted-foreground mt-1">Your personal information.</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-full bg-primary border-2 border-black shadow-hard flex items-center justify-center text-primary-foreground text-3xl font-heading font-extrabold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-heading font-extrabold text-2xl">{user?.name}</p>
                <p className="text-sm font-medium text-muted-foreground mt-1">Member since {new Date(user?.createdAt || Date.now()).getFullYear()}</p>
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 pt-6 border-t-2 border-black">
              <div className="space-y-2">
                <label className="text-sm font-bold leading-none">Full Name</label>
                <div className="flex relative">
                  <User className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                  <input
                    disabled
                    value={user?.name || ''}
                    className="flex h-12 w-full rounded-2xl border-2 border-black bg-muted pl-12 pr-4 py-2 text-sm font-medium opacity-70 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold leading-none">Email Address</label>
                <div className="flex relative">
                  <Mail className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                  <input
                    disabled
                    value={user?.email || ''}
                    className="flex h-12 w-full rounded-2xl border-2 border-black bg-muted pl-12 pr-4 py-2 text-sm font-medium opacity-70 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Section (Placeholder) */}
        <div className="rounded-xl border-2 border-black bg-card text-card-foreground shadow-hard-lg overflow-hidden">
          <div className="flex flex-col space-y-1.5 p-6 border-b-2 border-black bg-accent/20">
            <h3 className="font-heading font-extrabold text-xl leading-none tracking-tight">Security</h3>
            <p className="text-sm font-medium text-muted-foreground mt-1">Manage your password and security settings.</p>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-bold text-base">Password</p>
                <p className="text-sm font-medium text-muted-foreground">Update your password to keep your account secure.</p>
              </div>
              <button 
                onClick={handlePasswordChangeClick}
                disabled={isRequestingOtp}
                className="inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-12 px-6 border-2 border-black shadow-hard hover:shadow-hard-lg bg-white text-foreground focus-visible:outline-none shrink-0 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isRequestingOtp ? 'Sending...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </div>
  );
};

export default Settings;
