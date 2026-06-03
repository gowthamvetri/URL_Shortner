import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, Shield, BarChart3 } from 'lucide-react';

const Features = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-black mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Powerful Features</h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl">Everything you need to manage, track, and optimize your links in one unified platform.</p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 border-2 border-black rounded-3xl shadow-hard-lg bg-[#f4f7f6]">
            <Zap className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-2xl font-bold mb-3">Lightning Fast</h3>
            <p className="text-gray-600 font-medium">Global edge network ensures your links redirect instantly anywhere in the world.</p>
          </div>
          <div className="p-8 border-2 border-black rounded-3xl shadow-hard-lg bg-[#fdfaf0]">
            <Shield className="w-10 h-10 text-secondary mb-4" />
            <h3 className="text-2xl font-bold mb-3">Secure Management</h3>
            <p className="text-gray-600 font-medium">Protect links with passwords, set expiration dates, and block malicious traffic automatically.</p>
          </div>
          <div className="p-8 border-2 border-black rounded-3xl shadow-hard-lg md:col-span-2 flex flex-col md:flex-row items-center gap-8 bg-white">
            <div className="flex-1">
              <BarChart3 className="w-10 h-10 text-black mb-4" />
              <h3 className="text-2xl font-bold mb-3">Advanced Analytics</h3>
              <p className="text-gray-600 font-medium">Track every click with detailed statistics on devices, locations, referrers, and browsers. Export data effortlessly.</p>
            </div>
            <div className="w-full md:w-1/2 h-40 bg-gray-100 rounded-xl border-2 border-black flex items-center justify-center">
              <span className="text-gray-400 font-bold">Chart Preview</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Features;
