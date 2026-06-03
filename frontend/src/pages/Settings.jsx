import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield, Bell, Phone, Globe, Loader2 } from 'lucide-react';
import { ChangePasswordModal } from '../components/ChangePasswordModal';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service';

const Settings = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || ''
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [ipData, setIpData] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phoneNumber: user.phoneNumber || ''
      });
    }
  }, [user]);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => setIpData(data))
      .catch(err => console.error('Failed to fetch IP', err));
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    const success = await updateProfile(formData.name, formData.phoneNumber);
    setIsUpdatingProfile(false);
    if (success) {
      toast.success('Profile updated successfully!');
    }
  };

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
    <div className="space-y-8 relative">
      <div className="relative z-10 p-8 bg-primary rounded-xl border-2 border-black shadow-hard-lg overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Organic Blob Background */}
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-white/30 rounded-full blur-2xl pointer-events-none"></div>
        <img src="/settings_illustration.png" alt="Settings" className="relative z-10 w-24 h-24 object-contain hidden sm:block drop-shadow-md" />
        <div className="relative z-10 flex-1">
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-secondary-foreground mb-2">Settings</h2>
          <p className="text-secondary-foreground/80 font-medium">Manage your account settings and preferences.</p>
        </div>
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
            
            <form onSubmit={handleProfileSubmit} className="grid gap-6 md:grid-cols-2 pt-6 border-t-2 border-black">
              <div className="space-y-2">
                <label className="text-sm font-bold leading-none">Full Name</label>
                <div className="flex relative">
                  <User className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                  <input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="flex h-12 w-full rounded-2xl border-2 border-black bg-background pl-12 pr-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 transition-all"
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
              <div className="space-y-2">
                <label className="text-sm font-bold leading-none">Phone Number</label>
                <div className="flex relative">
                  <Phone className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                  <input
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    placeholder="Enter phone number"
                    className="flex h-12 w-full rounded-2xl border-2 border-black bg-background pl-12 pr-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 transition-all"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2 flex justify-end">
                 <button 
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-12 px-8 border-2 border-black shadow-hard hover:shadow-hard-lg bg-primary text-black focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isUpdatingProfile ? <img src="/Sandy Loading.svg" className="mr-2 h-5 w-5" alt="Loading..." /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Connection Info Section */}
        <div className="rounded-xl border-2 border-black bg-card text-card-foreground shadow-hard-lg overflow-hidden">
          <div className="flex flex-col space-y-1.5 p-6 border-b-2 border-black bg-accent/20">
            <h3 className="font-heading font-extrabold text-xl leading-none tracking-tight">Current Connection Info</h3>
            <p className="text-sm font-medium text-muted-foreground mt-1">Your current IP address and detected location.</p>
          </div>
          <div className="p-6">
            {ipData ? (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-muted-foreground">IP Address</p>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    <p className="text-lg font-bold">{ipData.ip}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-muted-foreground">Location</p>
                  <p className="text-lg font-bold">{ipData.city ? `${ipData.city}, ${ipData.country_name}` : 'Unknown'}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center text-muted-foreground font-medium">
                <img src="/Sandy Loading.svg" className="w-5 h-5 mr-2" alt="Loading..." /> Fetching connection info...
              </div>
            )}
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
