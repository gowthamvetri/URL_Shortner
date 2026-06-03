import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-black mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Privacy Policy</h1>
        <p className="text-gray-500 font-medium mb-12">Last updated: June 2026</p>
        
        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="mb-6 font-medium leading-relaxed">
            Your privacy is important to us. It is our policy to respect your privacy regarding any information we may collect from you across our website, and other sites we own and operate.
          </p>
          <h2 className="text-2xl font-bold text-black mb-4 mt-8">Information we collect</h2>
          <p className="mb-6 font-medium leading-relaxed">
            We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
          </p>
          <h2 className="text-2xl font-bold text-black mb-4 mt-8">Data retention</h2>
          <p className="mb-6 font-medium leading-relaxed">
            We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.
          </p>
        </div>
      </div>
    </div>
  );
};
export default PrivacyPolicy;
