import { useState, useEffect } from 'react';
import { urlService } from '../services/url.service';
import { Copy, Edit, Trash2, ExternalLink, Plus, Search, Loader2, QrCode, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FullPageLoader } from '../components/ui/FullPageLoader';
import { CreateUrlModal } from '../components/CreateUrlModal';
import { EditUrlModal } from '../components/EditUrlModal';
import { QRCodeModal } from '../components/QRCodeModal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { BulkUploadModal } from '../components/BulkUploadModal';

const Urls = () => {
  const [data, setData] = useState({ urls: [], totalCount: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [selectedUrlForQr, setSelectedUrlForQr] = useState(null);
  const [selectedUrlForEdit, setSelectedUrlForEdit] = useState(null);
  const [selectedUrlForDelete, setSelectedUrlForDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchUrls = async () => {
    setLoading(true);
    try {
      const response = await urlService.getUrls(page, 10, search);
      setData(response);
    } catch (err) {
      console.error('Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      fetchUrls();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, page]);

  const copyToClipboard = (shortCode) => {
    const url = `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'}/${shortCode}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUrlForDelete) return;
    setIsDeleting(true);
    try {
      await urlService.deleteUrl(selectedUrlForDelete._id);
      fetchUrls();
      setSelectedUrlForDelete(null);
      toast.success('URL successfully deleted!');
    } catch (err) {
      toast.error('Failed to delete URL');
      console.error('Failed to delete URL');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUrlCreated = (newUrl) => {
    fetchUrls();
    toast.success('Link successfully created!');
  };

  const handleUrlEdited = (updatedUrl) => {
    fetchUrls();
    toast.success('Link successfully updated!');
  };

  return (
    <div className="space-y-6">
      <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 p-8 bg-primary rounded-xl border-2 border-black shadow-hard-lg overflow-hidden">
        {/* Organic Blob Background */}
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-white/20 rounded-full blur-2xl"></div>

        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-primary-foreground mb-2">My Links</h2>
          <p className="text-primary-foreground/80 font-medium">Manage and monitor all your shortened URLs.</p>
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3">
          <button 
            onClick={() => setIsBulkModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-12 px-6 py-2 border-2 border-black shadow-hard hover:shadow-hard-lg bg-white text-foreground focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none"
          >
            Bulk Upload
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-12 px-6 py-2 border-2 border-black shadow-hard hover:shadow-hard-lg bg-secondary text-secondary-foreground focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Link
          </button>
        </div>
      </div>

      <div className="rounded-xl border-2 border-black bg-card text-card-foreground shadow-hard-lg overflow-hidden">
        <div className="p-6 border-b-2 border-black bg-accent/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-[350px]">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search links..."
              className="flex h-12 w-full rounded-2xl border-2 border-black bg-background pl-10 pr-4 py-2 text-sm font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 transition-all"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // reset to page 1 on search
              }}
            />
          </div>
        </div>

        <div className="p-0">
          {loading && data.urls.length === 0 ? (
            <FullPageLoader fullScreen={false} />
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b-2 [&_tr]:border-black bg-accent/20">
                  <tr className="border-b-2 border-black transition-colors hover:bg-muted/50">
                    <th className="h-14 px-6 text-left align-middle font-bold text-foreground">Short Link</th>
                    <th className="h-14 px-6 text-left align-middle font-bold text-foreground">Original URL</th>
                    <th className="h-14 px-6 text-left align-middle font-bold text-foreground">Clicks</th>
                    <th className="h-14 px-6 text-left align-middle font-bold text-foreground">Status</th>
                    <th className="h-14 px-6 text-left align-middle font-bold text-foreground">Created</th>
                    <th className="h-14 px-6 text-right align-middle font-bold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {data.urls.map((url) => (
                    <tr key={url._id} className="border-b-2 border-black transition-colors hover:bg-muted/50">
                      <td className="p-6 align-middle font-bold">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center justify-center bg-primary text-primary-foreground border-2 border-black rounded-full px-4 py-1 truncate max-w-[150px] shadow-sm">{url.customAlias || url.shortCode}</span>
                          <button onClick={() => copyToClipboard(url.customAlias || url.shortCode)} className="text-muted-foreground hover:text-foreground hover:scale-110 transition-transform">
                            <Copy className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                      <td className="p-6 align-middle">
                        <div className="flex items-center gap-2">
                          <span className="truncate max-w-[200px] block font-medium" title={url.originalUrl}>
                            {url.originalUrl}
                          </span>
                          <a href={url.originalUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        </div>
                      </td>
                      <td className="p-6 align-middle font-bold text-lg">{url.clickCount}</td>
                      <td className="p-6 align-middle">
                        <span className={`inline-flex items-center rounded-full border-2 border-black px-3 py-1 text-xs font-bold transition-colors ${
                          url.isActive ? 'bg-green-400 text-black' : 'bg-destructive text-white'
                        }`}>
                          {url.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-6 align-middle font-medium text-muted-foreground">{format(new Date(url.createdAt), 'MMM d, yyyy')}</td>
                      <td className="p-6 align-middle text-right">
                        <div className="flex justify-end gap-3">
                          <button 
                            onClick={() => navigate('/analytics', { state: { urlId: url._id } })}
                            className="inline-flex items-center justify-center rounded-full border-2 border-black shadow-hard hover:shadow-hard-lg hover:-translate-y-1 transition-all h-10 px-4 bg-[#F1C40F] text-black font-bold text-sm"
                            title="View Analytics"
                          >
                            <BarChart3 className="h-4 w-4 mr-2" />
                            View
                          </button>
                          <button 
                            onClick={() => setSelectedUrlForQr(url)}
                            className="inline-flex items-center justify-center rounded-full border-2 border-black shadow-hard hover:shadow-hard-lg hover:-translate-y-1 transition-all h-10 w-10 bg-secondary text-secondary-foreground"
                            title="Show QR Code"
                          >
                            <QrCode className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => setSelectedUrlForEdit(url)}
                            className="inline-flex items-center justify-center rounded-full border-2 border-black shadow-hard hover:shadow-hard-lg hover:-translate-y-1 transition-all h-10 w-10 bg-white text-foreground"
                            title="Edit Link"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => setSelectedUrlForDelete(url)}
                            className="inline-flex items-center justify-center rounded-full border-2 border-black shadow-hard hover:shadow-hard-lg hover:-translate-y-1 transition-all h-10 w-10 bg-destructive text-destructive-foreground"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {data.urls.length === 0 && !loading && (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center max-w-md mx-auto">
                          <img 
                            src="/empty_state_illustration.png" 
                            alt="No links found" 
                            className="w-32 h-32 object-contain mb-6 grayscale hover:grayscale-0 transition-all duration-300"
                          />
                          <h3 className="text-xl font-bold font-heading text-foreground mb-2">It's pretty quiet here...</h3>
                          <p className="font-medium text-sm mb-6 text-muted-foreground">
                            You don't have any links matching this criteria yet. 
                            Create a new link to get started!
                          </p>
                          <button 
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-10 px-6 border-2 border-black shadow-hard hover:shadow-hard-lg bg-primary text-primary-foreground focus-visible:outline-none"
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Create Link
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {data.totalPages > 1 && (
          <div className="flex items-center justify-end space-x-4 p-6 border-t-2 border-black bg-accent/20">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-10 px-4 py-2 border-2 border-black shadow-hard hover:shadow-hard-lg bg-white text-foreground disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none disabled:translate-y-0"
            >
              Previous
            </button>
            <div className="text-sm font-bold">
              Page {page} of {data.totalPages}
            </div>
            <button
              onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
              disabled={page === data.totalPages}
              className="inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-10 px-4 py-2 border-2 border-black shadow-hard hover:shadow-hard-lg bg-white text-foreground disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none disabled:translate-y-0"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <CreateUrlModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleUrlCreated} 
      />

      <BulkUploadModal 
        isOpen={isBulkModalOpen} 
        onClose={() => setIsBulkModalOpen(false)} 
        onSuccess={() => {
          fetchUrls();
        }} 
      />

      <EditUrlModal 
        isOpen={!!selectedUrlForEdit} 
        onClose={() => setSelectedUrlForEdit(null)} 
        onSuccess={handleUrlEdited} 
        url={selectedUrlForEdit}
      />

      <QRCodeModal
        isOpen={!!selectedUrlForQr}
        onClose={() => setSelectedUrlForQr(null)}
        url={selectedUrlForQr}
      />

      <ConfirmModal
        isOpen={!!selectedUrlForDelete}
        onClose={() => !isDeleting && setSelectedUrlForDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Link"
        message={`Are you sure you want to delete the link for "${selectedUrlForDelete?.originalUrl}"? This action cannot be undone and all analytics will be lost.`}
        confirmText="Delete"
        isDestructive={true}
        loading={isDeleting}
      />
    </div>
  );
};

export default Urls;
