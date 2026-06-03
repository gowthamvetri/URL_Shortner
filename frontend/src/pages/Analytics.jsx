import { useState, useEffect } from 'react';
import { urlService } from '../services/url.service';
import { analyticsService } from '../services/analytics.service';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { FullPageLoader } from '../components/ui/FullPageLoader';
import { Link, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { useSocket } from '../hooks/useSocket';

const COLORS = ['#2ecc71', '#F1C40F', '#000000', '#ba1a1a', '#e2e2e2'];

const Analytics = () => {
  const [urls, setUrls] = useState([]);
  const [selectedUrlId, setSelectedUrlId] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');
  const location = useLocation();
  
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await urlService.getUrls(1, 100);
        setUrls(response.urls);
        if (location.state?.urlId) {
          setSelectedUrlId(location.state.urlId);
        } else if (response.urls.length > 0) {
          setSelectedUrlId(response.urls[0]._id);
        }
      } catch (err) {
        setError('Failed to fetch URLs');
      } finally {
        setLoading(false);
      }
    };
    fetchUrls();
  }, []);

  useEffect(() => {
    if (selectedUrlId) {
      const fetchAnalytics = async () => {
        setLoading(true);
        try {
          const data = await analyticsService.getUrlAnalytics(selectedUrlId);
          setAnalytics(data);
        } catch (err) {
          setError('Failed to fetch analytics');
        } finally {
          setLoading(false);
        }
      };
      fetchAnalytics();
    }
  }, [selectedUrlId]);

  useEffect(() => {
    if (!socket || !selectedUrlId) return;

    const handleLinkClicked = (eventData) => {
      const currentUrl = urls.find(u => u._id === selectedUrlId);
      if (currentUrl && currentUrl.shortCode === eventData.shortCode) {
        // Soft refresh the detailed analytics to pull in new geo/device/log data
        console.log('Live click received for current URL, refreshing detailed analytics...');
        analyticsService.getUrlAnalytics(selectedUrlId)
          .then(data => setAnalytics(data))
          .catch(err => console.error('Live update failed:', err));
      }
    };

    socket.on('linkClicked', handleLinkClicked);
    return () => {
      socket.off('linkClicked', handleLinkClicked);
    };
  }, [socket, selectedUrlId, urls]);

  if (loading && !analytics) {
    return <FullPageLoader fullScreen={false} />;
  }

  if (urls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] max-w-md mx-auto text-center p-6 bg-white border-2 border-black rounded-[32px] shadow-hard-lg mt-8">
        <img 
          src="/empty_state_illustration.png" 
          alt="No URLs found" 
          className="w-40 h-40 object-contain mb-6"
        />
        <h2 className="text-3xl font-heading font-extrabold mb-2 text-[#111827]">No URLs found</h2>
        <p className="text-muted-foreground font-medium mb-8">
          You need to create a short link first to start tracking analytics!
        </p>
        <Link 
          to="/dashboard" 
          className="inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-12 px-8 border-2 border-black shadow-hard hover:shadow-hard-lg bg-[#F1C40F] text-black focus-visible:outline-none"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative flex flex-col sm:flex-row items-center gap-4 p-8 bg-secondary rounded-xl border-2 border-black shadow-hard-lg overflow-hidden">
        {/* Organic Blob Background */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/30 rounded-full blur-2xl"></div>

        <Link 
          to="/urls" 
          className="relative z-10 inline-flex items-center justify-center rounded-full h-12 w-12 border-2 border-black bg-white hover:-translate-y-1 hover:shadow-hard transition-all focus:outline-none"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="relative z-10 flex items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold tracking-tight text-secondary-foreground">Analytics</h2>
              {/* {isConnected && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-[#2ecc71]/20 border border-[#2ecc71] rounded-full" title="Live stats connected">
                  <div className="w-2 h-2 rounded-full bg-[#2ecc71] animate-pulse"></div>
                  <span className="text-[10px] font-bold text-[#27ae60] uppercase tracking-wider">Live</span>
                </div>
              )} */}
            </div>
            <p className="text-secondary-foreground/80 font-medium break-all">{analytics?.url?.originalUrl}</p>
          </div>
        </div>
      </div>

      <select 
          className="flex h-10 w-full sm:w-[300px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={selectedUrlId}
          onChange={(e) => setSelectedUrlId(e.target.value)}
        >
          {urls.map(url => (
            <option key={url._id} value={url._id}>
              {url.shortCode} - {url.originalUrl.substring(0, 30)}...
            </option>
          ))}
      </select>

      {analytics && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Stats Overview */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:col-span-2">
            <div className="rounded-xl border-2 border-black bg-card text-card-foreground shadow-hard hover:-translate-y-1 transition-transform">
              <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-bold">Total Clicks</h3>
              </div>
              <div className="p-6 pt-0">
                <div className="text-3xl font-heading font-extrabold">{analytics?.summary?.totalClicks || 0}</div>
              </div>
            </div>
            <div className="rounded-xl border-2 border-black bg-card text-card-foreground shadow-hard hover:-translate-y-1 transition-transform">
              <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-bold">Unique Visitors</h3>
              </div>
              <div className="p-6 pt-0">
                <div className="text-3xl font-heading font-extrabold">{analytics?.recentVisits ? new Set(analytics.recentVisits.filter(v => v.ipAddress).map(v => v.ipAddress)).size : 0}</div>
              </div>
            </div>
          </div>

          {/* Timeline Chart */}
          <div className="rounded-xl border-2 border-black bg-card text-card-foreground shadow-hard col-span-1 md:col-span-2 overflow-hidden">
            <div className="p-6 border-b-2 border-black bg-accent/20">
              <h3 className="font-heading font-extrabold text-xl leading-none tracking-tight">Clicks Over Time (Last 30 days)</h3>
            </div>
            <div className="p-6 h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.charts.timeline}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#191c1d" />
                  <XAxis dataKey="date" stroke="#191c1d" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#191c1d" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="clicks" stroke="#2ecc71" strokeWidth={4} dot={{ r: 6, strokeWidth: 2, fill: "#fff", stroke: "#000" }} activeDot={{ r: 8, strokeWidth: 2, stroke: "#000" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* OS Chart */}
          <div className="rounded-xl border-2 border-black bg-card text-card-foreground shadow-hard overflow-hidden">
            <div className="p-6 border-b-2 border-black bg-accent/20">
              <h3 className="font-heading font-extrabold text-xl leading-none tracking-tight">Operating Systems</h3>
            </div>
            <div className="p-6 flex flex-col">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.charts.os}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {analytics.charts.os.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#000" strokeWidth={2} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {analytics.charts.os.map((entry, index) => (
                  <div key={entry.name} className="flex items-center text-sm font-bold">
                    <span className="w-3 h-3 rounded-full mr-2 border border-black" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    {entry.name || 'Unknown'}: {entry.count}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Devices Chart */}
          <div className="rounded-xl border-2 border-black bg-card text-card-foreground shadow-hard overflow-hidden">
            <div className="p-6 border-b-2 border-black bg-accent/20">
              <h3 className="font-heading font-extrabold text-xl leading-none tracking-tight">Devices</h3>
            </div>
            <div className="p-6 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.charts.device}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#191c1d" />
                  <XAxis dataKey="name" stroke="#191c1d" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#191c1d" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip />
                  <Bar dataKey="count" fill="#2ecc71" stroke="#000" strokeWidth={2} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Visit Log Table */}
          <div className="rounded-xl border-2 border-black bg-card text-card-foreground shadow-hard-lg col-span-1 md:col-span-2 overflow-hidden mt-6">
            <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-black bg-accent/20">
              <div>
                <h3 className="font-heading font-extrabold text-xl leading-none tracking-tight">Visit Logs</h3>
                <p className="text-sm font-medium text-muted-foreground mt-1">Detailed log of every visit to this link.</p>
              </div>
              <div className="relative w-full sm:w-[350px]">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter logs (IP, Device, OS, Browser, Country)..."
                  className="flex h-12 w-full rounded-2xl border-2 border-black bg-background pl-10 pr-4 py-2 text-sm font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 transition-all"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </div>
            </div>
            <div className="p-0">
              <div className="relative w-full overflow-auto max-h-[500px]">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b-2 [&_tr]:border-black bg-accent/10 sticky top-0 z-10 shadow-sm">
                    <tr className="border-b-2 border-black transition-colors hover:bg-muted/50">
                      <th className="h-14 px-6 text-left align-middle font-bold text-foreground">Time</th>
                      <th className="h-14 px-6 text-left align-middle font-bold text-foreground">IP Address</th>
                      <th className="h-14 px-6 text-left align-middle font-bold text-foreground">Device</th>
                      <th className="h-14 px-6 text-left align-middle font-bold text-foreground">OS</th>
                      <th className="h-14 px-6 text-left align-middle font-bold text-foreground">Browser</th>
                      <th className="h-14 px-6 text-left align-middle font-bold text-foreground">Country</th>
                      <th className="h-14 px-6 text-left align-middle font-bold text-foreground">Referrer</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {analytics.recentVisits
                      .filter(v => {
                        if (!filterText) return true;
                        const s = filterText.toLowerCase();
                        return (
                          (v.ipAddress || '').toLowerCase().includes(s) ||
                          (v.device || '').toLowerCase().includes(s) ||
                          (v.operatingSystem || '').toLowerCase().includes(s) ||
                          (v.browser || '').toLowerCase().includes(s) ||
                          (v.country || '').toLowerCase().includes(s) ||
                          (v.referrer || '').toLowerCase().includes(s)
                        );
                      })
                      .map((visit) => (
                      <tr key={visit._id} className="border-b-2 border-black transition-colors hover:bg-muted/50">
                        <td className="p-6 align-middle whitespace-nowrap font-medium text-muted-foreground">
                          {format(new Date(visit.timestamp), 'MMM d, yyyy HH:mm:ss')}
                        </td>
                        <td className="p-6 align-middle font-bold">{visit.ipAddress || 'Unknown'}</td>
                        <td className="p-6 align-middle">{visit.device || 'Unknown'}</td>
                        <td className="p-6 align-middle">{visit.operatingSystem || 'Unknown'}</td>
                        <td className="p-6 align-middle">{visit.browser || 'Unknown'}</td>
                        <td className="p-6 align-middle">{visit.country || 'Unknown'}</td>
                        <td className="p-6 align-middle text-muted-foreground max-w-[200px] truncate" title={visit.referrer || 'Direct'}>
                          {visit.referrer || 'Direct'}
                        </td>
                      </tr>
                    ))}
                    {analytics.recentVisits.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-muted-foreground font-medium">
                          No visits recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
