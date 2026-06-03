import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Integrations = () => {
  const tools = ['Slack', 'Zapier', 'HubSpot', 'Salesforce', 'Discord', 'Mailchimp'];
  
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-black mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Integrations</h1>
        <p className="text-xl text-gray-600 mb-12">Connect your link shortener with the tools you already use.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {tools.map(tool => (
            <div key={tool} className="flex flex-col items-center justify-center p-8 border-2 border-black rounded-2xl shadow-hard hover:-translate-y-1 transition-transform cursor-pointer">
              <div className="w-16 h-16 bg-gray-100 rounded-full mb-4 border-2 border-black flex items-center justify-center font-bold text-xl">
                {tool[0]}
              </div>
              <h3 className="font-bold">{tool}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Integrations;
