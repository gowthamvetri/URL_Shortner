import { useState } from 'react';
import { Modal } from './ui/Modal';
import { authService } from '../services/auth.service';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await authService.changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully!');
      
      // Reset form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Password">
      {error && (
        <div className="mb-4 p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium border-2 border-destructive">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold leading-none" htmlFor="currentPassword">
            Current Password <span className="text-destructive">*</span>
          </label>
          <input
            id="currentPassword"
            type="password"
            required
            className="flex h-12 w-full rounded-2xl border-2 border-black bg-background px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 transition-all invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 invalid:[&:not(:placeholder-shown):not(:focus)]:text-red-500"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-bold leading-none" htmlFor="newPassword">
            New Password <span className="text-destructive">*</span>
          </label>
          <input
            id="newPassword"
            type="password"
            required
            minLength={8}
            className="flex h-12 w-full rounded-2xl border-2 border-black bg-background px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 transition-all invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 invalid:[&:not(:placeholder-shown):not(:focus)]:text-red-500"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <p className="text-xs text-muted-foreground font-medium mt-1">Must be at least 8 characters long.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold leading-none" htmlFor="confirmPassword">
            Confirm New Password <span className="text-destructive">*</span>
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            minLength={8}
            className="flex h-12 w-full rounded-2xl border-2 border-black bg-background px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 transition-all invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 invalid:[&:not(:placeholder-shown):not(:focus)]:text-red-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-12 px-6 py-2 border-2 border-black shadow-hard hover:shadow-hard-lg bg-white text-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-12 px-6 py-2 border-2 border-black shadow-hard hover:shadow-hard-lg bg-primary text-primary-foreground focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Update Password'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
