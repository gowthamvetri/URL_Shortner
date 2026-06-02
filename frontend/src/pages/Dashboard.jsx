import { useState, useEffect } from 'react';
import { urlService } from '../services/url.service';
import { Link2, MousePointerClick, Activity, AlertCircle, Copy, Edit, Trash2, ExternalLink, Plus, QrCode } from 'lucide-react';
import { format } from 'date-fns';
import { CreateUrlModal } from '../components/CreateUrlModal';
import { EditUrlModal } from '../components/EditUrlModal';
import { QRCodeModal } from '../components/QRCodeModal';
import { ConfirmModal } from '../components/ui/ConfirmModal';

const Dashboard = () => {
  const [data, setData] = useState({ urls: [], totalCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUrlForQr, setSelectedUrlForQr] = useState(null);
  const [selectedUrlForEdit, setSelectedUrlForEdit] = useState(null);
  const [selectedUrlForDelete, setSelectedUrlForDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    setLoading(true);
    try {
      const response = await urlService.getUrls(1, 5); // Just first 5 for dashboard
      setData(response);
    } catch (err) {
      setError('Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  };

  const totalClicks = data.urls.reduce((acc, url) => acc + url.clickCount, 0);
  const activeLinks = data.urls.filter(url => url.isActive).length;

  const copyToClipboard = (shortCode) => {
    const url = `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'}/${shortCode}`;
    navigator.clipboard.writeText(url);
    // Add toast notification here later
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUrlForDelete) return;
    setIsDeleting(true);
    try {
      await urlService.deleteUrl(selectedUrlForDelete._id);
      fetchUrls();
      setSelectedUrlForDelete(null);
    } catch (err) {
      console.error('Failed to delete URL');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 p-8 bg-secondary rounded-xl border-2 border-black shadow-hard-lg overflow-hidden">
        {/* Organic Blob Background */}
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-secondary-foreground mb-2">Overview</h2>
          <p className="text-secondary-foreground/80 font-medium">Here's what's happening with your links.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="relative z-10 inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-12 px-6 py-2 border-2 border-black shadow-hard hover:shadow-hard-lg bg-primary text-primary-foreground focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create Link
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border-2 border-black bg-card text-card-foreground shadow-hard transition-transform hover:-translate-y-1">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-bold">Total URLs</h3>
            <div className="p-2 bg-primary/20 rounded-full border-2 border-black"><Link2 className="h-4 w-4 text-primary-foreground" /></div>
          </div>
          <div className="p-6 pt-0">
            <div className="text-3xl font-heading font-extrabold">{data.totalCount}</div>
          </div>
        </div>
        <div className="rounded-xl border-2 border-black bg-card text-card-foreground shadow-hard transition-transform hover:-translate-y-1">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-bold">Total Clicks</h3>
            <div className="p-2 bg-secondary/20 rounded-full border-2 border-black"><MousePointerClick className="h-4 w-4 text-secondary-foreground" /></div>
          </div>
          <div className="p-6 pt-0">
            <div className="text-3xl font-heading font-extrabold">{totalClicks}</div>
          </div>
        </div>
        <div className="rounded-xl border-2 border-black bg-card text-card-foreground shadow-hard transition-transform hover:-translate-y-1">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-bold">Active Links</h3>
            <div className="p-2 bg-primary/20 rounded-full border-2 border-black"><Activity className="h-4 w-4 text-primary-foreground" /></div>
          </div>
          <div className="p-6 pt-0">
            <div className="text-3xl font-heading font-extrabold">{activeLinks}</div>
          </div>
        </div>
        <div className="rounded-xl border-2 border-black bg-card text-card-foreground shadow-hard transition-transform hover:-translate-y-1">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-bold">Inactive Links</h3>
            <div className="p-2 bg-accent rounded-full border-2 border-black"><AlertCircle className="h-4 w-4 text-accent-foreground" /></div>
          </div>
          <div className="p-6 pt-0">
            <div className="text-3xl font-heading font-extrabold">{data.urls.length - activeLinks}</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border-2 border-black bg-card text-card-foreground shadow-hard-lg overflow-hidden">
        <div className="flex flex-col space-y-1.5 p-6 border-b-2 border-black bg-accent/50">
          <h3 className="font-heading font-extrabold text-xl leading-none tracking-tight">Recent Links</h3>
          <p className="text-sm font-medium text-muted-foreground">A list of your recently created short URLs.</p>
        </div>
        <div className="p-6 pt-0">
          {loading ? (
            <div className="text-center py-4 text-muted-foreground">Loading...</div>
          ) : error ? (
            <div className="text-center py-4 text-destructive">{error}</div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b-2 [&_tr]:border-black bg-accent/20">
                  <tr className="border-b-2 border-black transition-colors hover:bg-muted/50">
                    <th className="h-14 px-6 text-left align-middle font-bold text-foreground">Short Link</th>
                    <th className="h-14 px-6 text-left align-middle font-bold text-foreground">Original URL</th>
                    <th className="h-14 px-6 text-left align-middle font-bold text-foreground">Clicks</th>
                    <th className="h-14 px-6 text-left align-middle font-bold text-foreground">Created</th>
                    <th className="h-14 px-6 text-right align-middle font-bold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {data.urls.map((url) => (
                    <tr key={url._id} className="border-b-2 border-black transition-colors hover:bg-muted/50">
                      <td className="p-6 align-middle font-bold">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center justify-center bg-primary text-primary-foreground border-2 border-black rounded-full px-4 py-1 truncate max-w-[150px] shadow-sm">{url.shortCode}</span>
                          <button onClick={() => copyToClipboard(url.shortCode)} className="text-muted-foreground hover:text-foreground hover:scale-110 transition-transform">
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
                      <td className="p-6 align-middle font-medium text-muted-foreground">{format(new Date(url.createdAt), 'MMM d, yyyy')}</td>
                      <td className="p-6 align-middle text-right">
                        <div className="flex justify-end gap-3">
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
                            title="Delete Link"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {data.urls.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-muted-foreground">
                        No links found. Create one to get started!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <CreateUrlModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => fetchUrls()} 
      />

      <EditUrlModal 
        isOpen={!!selectedUrlForEdit} 
        onClose={() => setSelectedUrlForEdit(null)} 
        onSuccess={() => fetchUrls()} 
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

export default Dashboard;
