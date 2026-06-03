import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
        <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-black mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">About Us</h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">We are on a mission to simplify the internet.</p>
        
        <div className="p-8 border-2 border-black rounded-3xl shadow-hard-lg bg-white text-left">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-600 font-medium leading-relaxed mb-6">
            Founded in 2026, our team realized that as the internet grew, so did the length and complexity of links. We built this platform to give marketers, creators, and developers a simple tool to take back control of their brand's digital footprint.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t-2 border-gray-100">
             <div>
                <strong className="block text-3xl font-extrabold text-primary">25M+</strong>
                <span className="text-sm font-bold text-gray-500 uppercase">Links Shortened</span>
             </div>
             <div>
                <strong className="block text-3xl font-extrabold text-secondary">99k+</strong>
                <span className="text-sm font-bold text-gray-500 uppercase">Happy Users</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AboutUs;
