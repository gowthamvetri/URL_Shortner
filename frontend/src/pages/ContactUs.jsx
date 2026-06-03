import React from 'react';
import { Link } from 'react-router-dom';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      
      {/* Header */}
      <header className="px-4 lg:px-8 h-20 flex items-center border-b-2 border-black bg-white sticky top-0 z-50">
        <Link to="/" className="flex items-center">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="#25c073" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="#25c073" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-heading font-extrabold text-2xl tracking-tight text-foreground">VibrantLink</span>
          </div>
        </Link>
        <nav className="hidden md:flex ml-auto gap-8 items-center mr-8">
          <Link to="/" className="text-sm font-bold text-foreground hover:text-primary transition-colors">Home</Link>
          <Link to="/contact" className="text-sm font-bold text-foreground hover:text-primary transition-colors">Contact Us</Link>
        </nav>
        <Link 
          to="/login" 
          className="ml-auto md:ml-0 inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-10 px-6 border-2 border-black bg-primary text-black"
        >
          Sign In
        </Link>
      </header>

      <main className="flex-1 relative bg-[#fafafa]">
        <section className="w-full py-24 flex flex-col items-center">
          <div className="container px-4 md:px-6 max-w-2xl mx-auto">
            <div className="text-center mb-12 flex flex-col items-center">
              <h1 className="text-5xl font-heading font-extrabold tracking-tight mb-4">Contact Us</h1>
              <p className="text-xl text-gray-600">Have a question? We'd love to hear from you.</p>
            </div>
            
            <form className="p-8 md:p-12 border-2 border-black rounded-3xl shadow-hard-lg bg-white space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-900">Name</label>
                <input type="text" className="w-full border-2 border-black rounded-xl px-5 py-4 outline-none focus:ring-4 focus:ring-primary/20 transition-all text-sm font-medium" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-900">Email</label>
                <input type="email" className="w-full border-2 border-black rounded-xl px-5 py-4 outline-none focus:ring-4 focus:ring-primary/20 transition-all text-sm font-medium" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-900">Message</label>
                <textarea rows="5" className="w-full border-2 border-black rounded-xl px-5 py-4 outline-none focus:ring-4 focus:ring-primary/20 transition-all text-sm font-medium resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <button type="button" className="w-full h-14 bg-black text-white font-bold rounded-full border-2 border-black hover:bg-gray-800 transition-all shadow-hard hover:shadow-hard-lg mt-4">
                Send Message
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#18181b] text-white pt-16 pb-8 border-t-2 border-black flex flex-col items-center">
        <div className="container px-4 md:px-6 flex flex-col items-center mb-12">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="#25c073" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="#25c073" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-heading font-extrabold text-2xl tracking-tight text-white">VibrantLink</span>
            </Link>
            <p className="text-gray-400 font-medium text-sm leading-relaxed text-center max-w-sm mb-6">
              Making the web more accessible, one short link at a time. Built for creators, teams, and enterprises.
            </p>
            <Link to="/contact" className="text-primary hover:text-white font-bold transition-colors">
              Contact Us
            </Link>
        </div>
        
        <div className="container px-4 md:px-6 pt-8 border-t border-gray-800 flex justify-center text-center">
          <p className="text-xs text-gray-500 font-medium">
            © {new Date().getFullYear()} VibrantLink Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ContactUs;
