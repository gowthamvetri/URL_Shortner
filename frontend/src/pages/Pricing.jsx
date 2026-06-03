import { Link } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-black mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Choose the perfect plan for your link management needs. Upgrade or downgrade at any time.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <div className="p-8 border-2 border-black rounded-3xl shadow-hard-lg bg-white flex flex-col">
            <h3 className="text-2xl font-bold mb-2">Basic</h3>
            <p className="text-gray-500 font-medium mb-6">Perfect for individuals.</p>
            <div className="text-4xl font-extrabold mb-6">$0<span className="text-lg text-gray-500 font-medium">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 font-medium text-gray-700"><Check className="w-5 h-5 text-primary" /> Up to 50 links/month</li>
              <li className="flex items-center gap-3 font-medium text-gray-700"><Check className="w-5 h-5 text-primary" /> Standard analytics</li>
              <li className="flex items-center gap-3 font-medium text-gray-700"><Check className="w-5 h-5 text-primary" /> QR codes</li>
            </ul>
            <Link to="/register" className="w-full h-12 flex items-center justify-center rounded-full border-2 border-black font-bold hover:bg-gray-50 transition-colors">Get Started</Link>
          </div>
          
          {/* Pro Plan */}
          <div className="p-8 border-2 border-black rounded-3xl shadow-hard-lg bg-secondary flex flex-col relative transform md:-translate-y-4">
            <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-black text-white text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-full">Most Popular</div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-gray-800 font-medium mb-6">For teams and creators.</p>
            <div className="text-4xl font-extrabold mb-6">$29<span className="text-lg text-gray-800 font-medium">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 font-medium text-black"><Check className="w-5 h-5 text-black" /> Unlimited links</li>
              <li className="flex items-center gap-3 font-medium text-black"><Check className="w-5 h-5 text-black" /> Custom domains</li>
              <li className="flex items-center gap-3 font-medium text-black"><Check className="w-5 h-5 text-black" /> Advanced analytics</li>
              <li className="flex items-center gap-3 font-medium text-black"><Check className="w-5 h-5 text-black" /> Link expiration</li>
            </ul>
            <Link to="/register" className="w-full h-12 flex items-center justify-center rounded-full border-2 border-black font-bold bg-black text-white hover:bg-gray-800 transition-colors">Start Free Trial</Link>
          </div>

          {/* Business Plan */}
          <div className="p-8 border-2 border-black rounded-3xl shadow-hard-lg bg-[#18181b] text-white flex flex-col">
            <h3 className="text-2xl font-bold mb-2 text-white">Business</h3>
            <p className="text-gray-400 font-medium mb-6">For large organizations.</p>
            <div className="text-4xl font-extrabold mb-6">$99<span className="text-lg text-gray-400 font-medium">/mo</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 font-medium text-gray-200"><Check className="w-5 h-5 text-primary" /> Everything in Pro</li>
              <li className="flex items-center gap-3 font-medium text-gray-200"><Check className="w-5 h-5 text-primary" /> API Access</li>
              <li className="flex items-center gap-3 font-medium text-gray-200"><Check className="w-5 h-5 text-primary" /> Dedicated support</li>
              <li className="flex items-center gap-3 font-medium text-gray-200"><Check className="w-5 h-5 text-primary" /> SLA 99.9%</li>
            </ul>
            <Link to="/contact" className="w-full h-12 flex items-center justify-center rounded-full border-2 border-primary font-bold text-primary hover:bg-primary hover:text-black transition-colors">Contact Sales</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Pricing;
