import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Blog = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-black mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Our Blog</h1>
        <p className="text-xl text-gray-600 mb-12">Insights, updates, and guides on link management.</p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="border-2 border-black rounded-2xl overflow-hidden shadow-hard bg-white">
            <div className="h-48 bg-secondary border-b-2 border-black"></div>
            <div className="p-6">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Marketing</div>
              <h3 className="text-xl font-bold mb-2 hover:underline cursor-pointer">5 Ways Branded Links Increase CTR</h3>
              <p className="text-gray-600 font-medium">Learn how using your own domain can significantly boost user trust and engagement.</p>
            </div>
          </div>
          <div className="border-2 border-black rounded-2xl overflow-hidden shadow-hard bg-white">
            <div className="h-48 bg-primary border-b-2 border-black"></div>
            <div className="p-6">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Product Update</div>
              <h3 className="text-xl font-bold mb-2 hover:underline cursor-pointer">Introducing Advanced QR Codes</h3>
              <p className="text-gray-600 font-medium">We've overhauled our QR code generator with new customization options and dynamic tracking.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Blog;
