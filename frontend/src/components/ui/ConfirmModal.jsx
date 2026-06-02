import { Modal } from './Modal';
import { Loader2 } from 'lucide-react';

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', isDestructive = false, loading = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="py-4">
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-12 px-6 py-2 border-2 border-black shadow-hard hover:shadow-hard-lg bg-white text-foreground"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={`inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-12 px-6 py-2 border-2 border-black shadow-hard hover:shadow-hard-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none ${
            isDestructive 
              ? 'bg-destructive text-destructive-foreground' 
              : 'bg-primary text-primary-foreground'
          }`}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : confirmText}
        </button>
      </div>
    </Modal>
  );
};
