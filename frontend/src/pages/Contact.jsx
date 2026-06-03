import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-xl">
        <Link to="/" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-black mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Contact Us</h1>
        <p className="text-xl text-gray-600 mb-12">Have a question? We'd love to hear from you.</p>
        
        <form className="p-8 border-2 border-black rounded-3xl shadow-hard-lg bg-white space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2">Name</label>
            <input type="text" className="w-full border-2 border-black rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#25c073]" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Email</label>
            <input type="email" className="w-full border-2 border-black rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#25c073]" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Message</label>
            <textarea rows="4" className="w-full border-2 border-black rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#25c073]" placeholder="How can we help you?"></textarea>
          </div>
          <button type="button" className="w-full h-12 bg-black text-white font-bold rounded-full border-2 border-black hover:bg-gray-800 transition-colors">Send Message</button>
        </form>
      </div>
    </div>
  );
};
export default Contact;
