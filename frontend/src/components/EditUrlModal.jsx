import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { urlService } from '../services/url.service';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export const EditUrlModal = ({ isOpen, onClose, onSuccess, url }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [expiryDate, setExpiryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (url && isOpen) {
      setOriginalUrl(url.originalUrl || '');
      setIsActive(url.isActive !== false);
      setExpiryDate(url.expiryDate ? format(new Date(url.expiryDate), "yyyy-MM-dd'T'HH:mm") : '');
      setError('');
    }
  }, [url, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = { 
        originalUrl,
        isActive
      };
      
      if (expiryDate) {
        payload.expiryDate = new Date(expiryDate).toISOString();
      } else {
        payload.expiryDate = null;
      }

      const updatedUrl = await urlService.updateUrl(url._id, payload);
      
      onSuccess(updatedUrl);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update short URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Link">
      {error && (
        <div className="mb-4 p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="editOriginalUrl">
            Destination URL <span className="text-destructive">*</span>
          </label>
          <input
            id="editOriginalUrl"
            type="url"
            required
            placeholder="https://example.com/my-long-url"
            className="flex h-12 w-full rounded-2xl border-2 border-black bg-background px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 transition-all invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 invalid:[&:not(:placeholder-shown):not(:focus)]:text-red-500"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="editExpiryDate">
            Expiry Date (Optional)
          </label>
          <input
            id="editExpiryDate"
            type="datetime-local"
            className="flex h-12 w-full rounded-2xl border-2 border-black bg-background px-4 py-2 text-sm font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 transition-all invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 invalid:[&:not(:placeholder-shown):not(:focus)]:text-red-500"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Link will become unreachable after this date. Clear field to remove expiry.
          </p>
        </div>

        <div className="flex items-center space-x-3 p-4 rounded-xl border-2 border-black bg-accent">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-5 w-5 rounded border-2 border-black text-primary focus:ring-primary"
          />
          <label htmlFor="isActive" className="text-sm font-bold leading-none">
            Active Status (Link is reachable)
          </label>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
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
            {loading ? <img src="/Sandy Loading.svg" className="mr-2 h-4 w-4" alt="Loading..." /> : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
