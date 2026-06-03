import { useState } from 'react';
import { Modal } from './ui/Modal';
import { urlService } from '../services/url.service';
import { Loader2 } from 'lucide-react';

export const CreateUrlModal = ({ isOpen, onClose, onSuccess }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = { originalUrl };
      if (customAlias.trim()) {
        payload.customAlias = customAlias.trim();
      }
      if (expiryDate) {
        payload.expiryDate = new Date(expiryDate).toISOString();
      }

      const newUrl = await urlService.createUrl(payload);
      
      // Reset form
      setOriginalUrl('');
      setCustomAlias('');
      setExpiryDate('');
      
      onSuccess(newUrl);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create short URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Short Link">
      {error && (
        <div className="mb-4 p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="originalUrl">
            Destination URL <span className="text-destructive">*</span>
          </label>
          <input
            id="originalUrl"
            type="url"
            required
            placeholder="https://example.com/my-long-url"
            className="flex h-12 w-full rounded-2xl border-2 border-black bg-background px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 transition-all invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 invalid:[&:not(:placeholder-shown):not(:focus)]:text-red-500"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="customAlias">
            Custom Alias (Optional)
          </label>
          <div className="flex rounded-2xl border-2 border-black bg-background focus-within:ring-4 focus-within:ring-primary/20 transition-all overflow-hidden">
            <span className="flex items-center px-4 border-r-2 border-black bg-accent font-bold text-sm">
              short.ly/
            </span>
            <input
              id="customAlias"
              type="text"
              placeholder="my-campaign"
              className="flex h-12 w-full bg-transparent px-4 py-2 text-sm font-medium placeholder:text-muted-foreground focus-visible:outline-none"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Leave blank to auto-generate a short code.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="expiryDate">
            Expiry Date (Optional)
          </label>
          <input
            id="expiryDate"
            type="datetime-local"
            className="flex h-12 w-full rounded-2xl border-2 border-black bg-background px-4 py-2 text-sm font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 transition-all invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 invalid:[&:not(:placeholder-shown):not(:focus)]:text-red-500"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Link will become unreachable after this date.
          </p>
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
            {loading ? <img src="/Sandy Loading.svg" className="mr-2 h-4 w-4" alt="Loading..." /> : 'Create Link'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
