import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Enterprise = () => {
  return (
    <div className="min-h-screen bg-[#18181b] text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight text-secondary">Enterprise Solutions</h1>
        <p className="text-xl text-gray-300 mb-12">Secure, scalable, and reliable link management for large organizations.</p>
        
        <div className="bg-white text-black p-8 md:p-12 border-2 border-black rounded-3xl shadow-hard-lg">
          <h2 className="text-3xl font-bold mb-6">Why Enterprise?</h2>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <div className="w-6 h-6 bg-primary rounded-full mt-1 mr-3 flex-shrink-0"></div>
              <div>
                <strong className="block text-lg">Single Sign-On (SSO)</strong>
                <span className="text-gray-600 font-medium">Integrate with Okta, Azure AD, or Google Workspace.</span>
              </div>
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 bg-primary rounded-full mt-1 mr-3 flex-shrink-0"></div>
              <div>
                <strong className="block text-lg">Dedicated Account Manager</strong>
                <span className="text-gray-600 font-medium">24/7 priority support and custom onboarding.</span>
              </div>
            </li>
            <li className="flex items-start">
              <div className="w-6 h-6 bg-primary rounded-full mt-1 mr-3 flex-shrink-0"></div>
              <div>
                <strong className="block text-lg">Advanced Compliance</strong>
                <span className="text-gray-600 font-medium">SOC2 Type II compliant, GDPR ready infrastructure.</span>
              </div>
            </li>
          </ul>
          <Link to="/contact" className="inline-flex h-12 items-center justify-center rounded-full bg-black text-white px-8 font-bold hover:bg-gray-800 transition-colors">
            Contact Sales Team
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Enterprise;
