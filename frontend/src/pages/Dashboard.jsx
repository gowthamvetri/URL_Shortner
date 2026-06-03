import { useState, useEffect } from 'react';
import { urlService } from '../services/url.service';
import { analyticsService } from '../services/analytics.service';
import { 
  Link2, MousePointerClick, Activity, AlertCircle, Copy, Edit, Trash2, 
  ExternalLink, Plus, QrCode, TrendingUp, TrendingDown 
} from 'lucide-react';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { CreateUrlModal } from '../components/CreateUrlModal';
import { EditUrlModal } from '../components/EditUrlModal';
import { QRCodeModal } from '../components/QRCodeModal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, CartesianGrid
} from 'recharts';
import { useSocket } from '../hooks/useSocket';

const COLORS = ['#e2e2e2', '#e2e2e2', '#e2e2e2', '#F1C40F', '#e2e2e2', '#2ecc71', '#e2e2e2'];

const Dashboard = () => {
  const [data, setData] = useState({ urls: [], totalCount: 0 });
  const [globalAnalytics, setGlobalAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUrlForQr, setSelectedUrlForQr] = useState(null);
  const [selectedUrlForEdit, setSelectedUrlForEdit] = useState(null);
  const [selectedUrlForDelete, setSelectedUrlForDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleLinkClicked = (eventData) => {
      console.log('Live link click received:', eventData);
      
      // Update recent links table
      setData(prevData => {
        const newUrls = prevData.urls.map(url => {
          if (url.shortCode === eventData.shortCode) {
            return { ...url, clickCount: eventData.clickCount };
          }
          return url;
        });
        return { ...prevData, urls: newUrls };
      });

      // Update global analytics cards and charts
      setGlobalAnalytics(prev => {
        if (!prev) return prev;
        
        const newAnalytics = { ...prev };
        
        if (newAnalytics.summary) {
          newAnalytics.summary.totalClicks += 1;
        }

        if (newAnalytics.topUrl && newAnalytics.topUrl.shortCode === eventData.shortCode) {
          newAnalytics.topUrl.clickCount = eventData.clickCount;
        }

        if (newAnalytics.charts && newAnalytics.charts.timeline) {
          const lastIndex = newAnalytics.charts.timeline.length - 1;
          if (lastIndex >= 0) {
            const lastItem = newAnalytics.charts.timeline[lastIndex];
            newAnalytics.charts.timeline[lastIndex] = {
              ...lastItem,
              clicks: lastItem.clicks + 1
            };
          }
        }

        if (newAnalytics.charts && newAnalytics.charts.referrer && eventData.referrer) {
          const referrerIndex = newAnalytics.charts.referrer.findIndex(r => r.name === eventData.referrer);
          if (referrerIndex !== -1) {
            newAnalytics.charts.referrer[referrerIndex] = {
              ...newAnalytics.charts.referrer[referrerIndex],
              count: newAnalytics.charts.referrer[referrerIndex].count + 1
            };
          } else {
            newAnalytics.charts.referrer.push({ name: eventData.referrer, count: 1 });
          }
          newAnalytics.charts.referrer.sort((a, b) => b.count - a.count);
          newAnalytics.charts.referrer = newAnalytics.charts.referrer.slice(0, 5);
        }

        return newAnalytics;
      });
    };

    socket.on('linkClicked', handleLinkClicked);

    return () => {
      socket.off('linkClicked', handleLinkClicked);
    };
  }, [socket]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [urlsResponse, analyticsResponse] = await Promise.all([
        urlService.getUrls(1, 5),
        analyticsService.getGlobalAnalytics()
      ]);
      setData(urlsResponse);
      setGlobalAnalytics(analyticsResponse);
    } catch (err) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (shortCode) => {
    const url = `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'}/${shortCode}`;
    navigator.clipboard.writeText(url);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUrlForDelete) return;
    setIsDeleting(true);
    try {
      await urlService.deleteUrl(selectedUrlForDelete._id);
      fetchDashboardData();
      setSelectedUrlForDelete(null);
    } catch (err) {
      console.error('Failed to delete URL');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num;
  };

  const getDayName = (dateString) => {
    try {
      return format(parseISO(dateString), 'EEE');
    } catch (e) {
      return dateString;
    }
  };

  // Ensure 7 days of data for the chart
  const processTimeline = (timeline) => {
    if (!timeline || timeline.length === 0) return Array.from({length: 7}).map(() => ({ clicks: 0, date: '' }));
    return timeline.slice(-7).map(item => ({
      ...item,
      day: getDayName(item.date)
    }));
  };

  const getReferrerIcon = (name) => {
    const initial = name.charAt(0).toUpperCase();
    let bg = 'bg-primary';
    if (name.toLowerCase().includes('twitter') || name.toLowerCase().includes('x')) bg = 'bg-blue-500';
    if (name.toLowerCase().includes('instagram') || name.toLowerCase().includes('ig')) bg = 'bg-pink-500';
    if (name.toLowerCase().includes('direct')) bg = 'bg-gray-400';
    
    return (
      <div className={`w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-white font-bold text-xs ${bg}`}>
        {initial}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Overview Header */}
      <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 p-8 bg-secondary rounded-xl border-2 border-black shadow-hard-lg overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/20 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-secondary-foreground">Dashboard</h2>
              {isConnected && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-[#2ecc71]/20 border border-[#2ecc71] rounded-full" title="Live stats connected">
                  <div className="w-2 h-2 rounded-full bg-[#2ecc71] animate-pulse"></div>
                  <span className="text-[10px] font-bold text-[#27ae60] uppercase tracking-wider">Live</span>
                </div>
              )}
            </div>
            <p className="text-secondary-foreground/80 font-medium">Your link performance at a glance.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="relative z-10 inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-12 px-6 py-2 border-2 border-black shadow-hard hover:shadow-hard-lg bg-primary text-primary-foreground focus-visible:outline-none"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create Link
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 font-bold text-muted-foreground">Loading Analytics...</div>
      ) : error ? (
        <div className="text-center py-12 font-bold text-destructive">{error}</div>
      ) : (
        <>
          {/* New Neo-Brutalist Analytics Section */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            
            {/* Top Left: Featured Link */}
            <div className="md:col-span-1 rounded-2xl border-2 border-black bg-card text-card-foreground shadow-hard-lg p-6 flex flex-col justify-between min-h-[220px]">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-heading font-extrabold text-2xl truncate max-w-[75%]">
                    {globalAnalytics?.topUrl ? `vbrnt.link/${globalAnalytics.topUrl.shortCode}` : 'No Links Yet'}
                  </h3>
                  {globalAnalytics?.topUrl && (
                    <span className="px-3 py-1 bg-[#2ecc71] border-2 border-black rounded-full text-xs font-bold text-black">
                      {globalAnalytics.topUrl.isActive ? 'Active' : 'Inactive'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate mb-6 font-medium">
                  {globalAnalytics?.topUrl?.originalUrl || 'Create a link to see it featured here.'}
                </p>
              </div>
              
              <div className="flex gap-3 mb-6">
                <button 
                  onClick={() => globalAnalytics?.topUrl && copyToClipboard(globalAnalytics.topUrl.shortCode)}
                  disabled={!globalAnalytics?.topUrl}
                  className="flex-1 bg-[#2ecc71] hover:bg-[#27ae60] text-black border-2 border-black rounded-full py-2 font-bold flex items-center justify-center transition-transform hover:-translate-y-1 shadow-sm disabled:opacity-50"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </button>
                <button 
                  onClick={() => globalAnalytics?.topUrl && setSelectedUrlForQr(globalAnalytics.topUrl)}
                  disabled={!globalAnalytics?.topUrl}
                  className="flex-1 bg-white hover:bg-gray-100 text-black border-2 border-black rounded-full py-2 font-bold flex items-center justify-center transition-transform hover:-translate-y-1 shadow-sm disabled:opacity-50"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  QR Code
                </button>
              </div>

              <div className="flex gap-2">
                <span className="px-3 py-1 border-2 border-black rounded-full text-xs font-bold bg-white">Marketing</span>
                <span className="px-3 py-1 border-2 border-black rounded-full text-xs font-bold bg-[#F1C40F]">Promo</span>
              </div>
            </div>

            {/* Top Right: Click Trend Chart */}
            <div className="md:col-span-2 rounded-2xl border-2 border-black bg-white shadow-hard-lg p-6 min-h-[220px] flex flex-col">
              <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-4">
                <h3 className="font-heading font-extrabold text-2xl">Click Trend</h3>
                <div className="px-4 py-1.5 border-2 border-black rounded-full text-sm font-bold bg-white">
                  Last 7 Days
                </div>
              </div>
              <div className="flex-1 min-h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={processTimeline(globalAnalytics?.charts?.timeline)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="day" axisLine={true} tickLine={false} tick={{fontFamily: 'inherit', fontWeight: 'bold'}} stroke="#000" />
                    <YAxis axisLine={false} tickLine={false} tick={{fontFamily: 'inherit', fontWeight: 'bold'}} stroke="#000" />
                    <RechartsTooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{border: '2px solid black', borderRadius: '8px', fontWeight: 'bold'}} />
                    <Bar dataKey="clicks" radius={[4, 4, 0, 0]} stroke="#000" strokeWidth={2}>
                      {processTimeline(globalAnalytics?.charts?.timeline).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom Left: Total Clicks */}
            <div className="md:col-span-1 rounded-2xl border-2 border-black bg-[#2ecc71] text-black shadow-hard-lg p-6 relative overflow-hidden min-h-[200px] flex flex-col justify-center">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 border-[20px] border-black/10 rounded-full"></div>
              <h3 className="font-bold text-sm tracking-wider uppercase mb-2">Total Clicks</h3>
              <div className="font-heading font-extrabold text-6xl md:text-7xl mb-4 relative z-10">
                {formatNumber(globalAnalytics?.summary?.totalClicks || 0)}
              </div>
              <div className="flex items-center font-bold text-sm bg-white/30 w-fit px-3 py-1 rounded-full border border-black/20">
                <span className="bg-white rounded-full p-1 mr-2 border border-black">
                  {globalAnalytics?.summary?.trend >= 0 ? 
                    <TrendingUp className="h-3 w-3 text-[#2ecc71]" /> : 
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  }
                </span>
                {globalAnalytics?.summary?.trend >= 0 ? '+' : ''}{globalAnalytics?.summary?.trend}% from last week
              </div>
            </div>

            {/* Bottom Middle: Top Locations */}
            <div className="md:col-span-1 rounded-2xl border-2 border-black bg-white shadow-hard-lg p-6">
              <h3 className="font-heading font-extrabold text-xl mb-6">Top Locations</h3>
              <div className="space-y-4">
                {globalAnalytics?.charts?.country?.length > 0 ? (
                  globalAnalytics.charts.country.slice(0,3).map((country, idx) => {
                    const percentage = Math.round((country.count / globalAnalytics.summary.totalClicks) * 100) || 0;
                    return (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="font-bold text-sm text-gray-600">{country.name || 'Unknown'}</span>
                        <span className="px-3 py-1 border-2 border-black rounded-md font-bold text-sm">
                          {percentage}%
                        </span>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-muted-foreground font-medium text-sm">No location data available.</div>
                )}
              </div>
            </div>

            {/* Bottom Right: Referrers */}
            <div className="md:col-span-1 rounded-2xl border-2 border-black bg-white shadow-hard-lg p-6">
              <h3 className="font-heading font-extrabold text-xl mb-6">Referrers</h3>
              <div className="space-y-4">
                {globalAnalytics?.charts?.referrer?.length > 0 ? (
                  globalAnalytics.charts.referrer.slice(0,3).map((ref, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getReferrerIcon(ref.name || 'Direct')}
                        <span className="font-bold text-sm text-gray-700 capitalize">{ref.name || 'Direct'}</span>
                      </div>
                      <span className="px-3 py-1 border-2 border-black rounded-md font-bold text-sm">
                        {formatNumber(ref.count)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground font-medium text-sm">No referrer data available.</div>
                )}
              </div>
            </div>

          </div>

          {/* Original Recent Links Table (Kept as requested) */}
          <div className="rounded-xl border-2 border-black bg-card text-card-foreground shadow-hard-lg overflow-hidden mt-8">
            <div className="flex flex-col space-y-1.5 p-6 border-b-2 border-black bg-accent/50">
              <h3 className="font-heading font-extrabold text-xl leading-none tracking-tight">Recent Links</h3>
              <p className="text-sm font-medium text-muted-foreground">A list of your recently created short URLs.</p>
            </div>
            <div className="p-6 pt-0 mt-4">
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
            </div>
          </div>
        </>
      )}

      <CreateUrlModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => fetchDashboardData()} 
      />

      <EditUrlModal 
        isOpen={!!selectedUrlForEdit} 
        onClose={() => setSelectedUrlForEdit(null)} 
        onSuccess={() => fetchDashboardData()} 
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
