import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Careers = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-black mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Join Our Team</h1>
        <p className="text-xl text-gray-600 mb-12">Help us build the future of link management.</p>
        
        <div className="space-y-6">
          <div className="p-6 border-2 border-black rounded-2xl shadow-hard bg-white flex justify-between items-center hover:-translate-y-1 transition-transform cursor-pointer">
             <div>
                <h3 className="text-xl font-bold">Senior Frontend Engineer</h3>
                <p className="text-gray-500 font-medium">Remote (US/Europe)</p>
             </div>
             <div className="bg-primary px-4 py-2 rounded-full font-bold text-sm border-2 border-black shadow-sm">Apply</div>
          </div>
          <div className="p-6 border-2 border-black rounded-2xl shadow-hard bg-white flex justify-between items-center hover:-translate-y-1 transition-transform cursor-pointer">
             <div>
                <h3 className="text-xl font-bold">Product Designer</h3>
                <p className="text-gray-500 font-medium">New York, NY</p>
             </div>
             <div className="bg-secondary px-4 py-2 rounded-full font-bold text-sm border-2 border-black shadow-sm">Apply</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Careers;
