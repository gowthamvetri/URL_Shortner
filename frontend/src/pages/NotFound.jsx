import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md w-full bg-white border-2 border-black rounded-[32px] p-8 md:p-12 shadow-hard-lg flex flex-col items-center">
        <img 
          src="/not_found_illustration.png" 
          alt="404 Not Found" 
          className="w-48 h-48 object-contain mb-8"
        />
        <h1 className="text-5xl font-heading font-extrabold tracking-tight mb-4 text-[#111827]">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-gray-500 font-medium mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/dashboard"
          className="inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-12 px-8 border-2 border-black shadow-hard hover:shadow-hard-lg bg-primary text-primary-foreground focus-visible:outline-none"
        >
          <Home className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
