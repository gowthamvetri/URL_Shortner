import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-black mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Terms of Service</h1>
        <p className="text-gray-500 font-medium mb-12">Last updated: June 2026</p>
        
        <div className="prose prose-lg max-w-none text-gray-700">
          <h2 className="text-2xl font-bold text-black mb-4">1. Terms</h2>
          <p className="mb-6 font-medium leading-relaxed">
            By accessing the website, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
          </p>
          <h2 className="text-2xl font-bold text-black mb-4 mt-8">2. Use License</h2>
          <p className="mb-6 font-medium leading-relaxed">
            Permission is granted to temporarily download one copy of the materials (information or software) on our website for personal, non-commercial transitory viewing only.
          </p>
          <h2 className="text-2xl font-bold text-black mb-4 mt-8">3. Disclaimer</h2>
          <p className="mb-6 font-medium leading-relaxed">
            The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability.
          </p>
        </div>
      </div>
    </div>
  );
};
export default TermsOfService;
