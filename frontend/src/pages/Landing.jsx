import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ClipboardPaste, 
  PenTool, 
  Share2,
  BarChart3, 
  MonitorSmartphone,
  Shield, 
  CheckCircle,
  ChevronDown,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  
  return (
    <div className="border-2 border-black bg-white rounded-full mb-4 overflow-hidden shadow-none transition-all data-[state=open]:rounded-2xl data-[state=open]:shadow-hard" data-state={isOpen ? "open" : "closed"}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 md:px-8 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-bold text-[15px]">{question}</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 md:px-8 text-muted-foreground font-medium text-sm">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
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
          <a href="#" className="text-sm font-bold text-foreground hover:text-primary transition-colors">Home</a>
          <Link to="/contact" className="text-sm font-bold text-foreground hover:text-primary transition-colors">Contact Us</Link>
        </nav>
        <Link 
          to="/login" 
          className="ml-auto md:ml-0 inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-10 px-6 border-2 border-black bg-primary text-black"
        >
          Sign In
        </Link>
      </header>

      <main className="flex-1 relative">
        
        {/* Hero Section */}
        <section className="w-full py-16 md:py-24 flex items-center justify-center relative overflow-hidden bg-[#fafafa]">
          <div className="container px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Content */}
              <div className="flex flex-col space-y-6 text-left z-10 lg:pr-8">
                
                <h1 className="text-5xl font-heading font-extrabold tracking-tight sm:text-6xl lg:text-[64px] leading-[1.05] text-[#111827]">
                  Shorten Your Reach, Not Your Impact
                </h1>
                
                <p className="max-w-[550px] text-gray-500 md:text-lg font-medium leading-relaxed">
                  Transform long, cluttered URLs into powerful marketing assets. Track clicks, manage performance, and brand your presence with the world's most intuitive shortener.
                </p>

                {/* Input box */}
                <div className="mt-4 flex flex-col sm:flex-row items-center bg-white border-2 border-black rounded-[100px] p-2 max-w-xl w-full shadow-hard-lg">
                  <input 
                    type="text" 
                    placeholder="Paste your long link here..." 
                    className="flex-1 bg-transparent px-6 py-3 outline-none font-medium text-black placeholder:text-gray-400 w-full sm:w-auto text-[15px]"
                  />
                  <button className="inline-flex items-center justify-center rounded-full text-sm font-bold h-12 px-8 border-2 border-black bg-primary text-black whitespace-nowrap mt-2 sm:mt-0 w-full sm:w-auto shadow-sm hover:bg-[#1fa964] transition-colors" onClick={()=>navigate("/register")}>
                    Shorten <span className="ml-2">→</span>
                  </button>
                </div>

                {/* Social Proof */}
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex -space-x-3">
                    <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=1" alt="User" />
                    <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=2" alt="User" />
                    <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/100?img=3" alt="User" />
                  </div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Trusted by 2,000+ early adopters
                  </p>
                </div>
              </div>

              {/* Right Art */}
              <div className="relative flex justify-center items-center">
                {/* Background Blobs */}
                <div className="absolute top-10 -left-10 w-64 h-64 bg-[#f8e5b4] rounded-full mix-blend-multiply filter blur-2xl opacity-70"></div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#c8eedc] rounded-full mix-blend-multiply filter blur-2xl opacity-70"></div>
                
                <div className="relative z-10 w-full max-w-[580px] rounded-[32px] overflow-hidden flex items-center justify-center border-0">
                  <img src="/hero_browser_illustration.png" alt="Analytics Dashboard 3D" className="w-full h-full object-contain" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'; }} />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Stats Section (Dark) */}
        <section className="w-full py-8 bg-[#18181b] border-y-2 border-black">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x border-gray-700">
              
              <div className="flex flex-row items-center justify-center gap-3 py-2">
                <span className="text-3xl font-extrabold text-secondary tracking-tight">99k+</span>
                <span className="text-[10px] font-bold text-gray-400 tracking-[0.15em] uppercase text-left leading-tight">Satisfied<br/>Customers</span>
              </div>
              
              <div className="flex flex-row items-center justify-center gap-3 py-2">
                <span className="text-3xl font-extrabold text-primary tracking-tight">10k+</span>
                <span className="text-[10px] font-bold text-gray-400 tracking-[0.15em] uppercase text-left leading-tight">Supreme<br/>Assets</span>
              </div>
              
              <div className="flex flex-row items-center justify-center gap-3 py-2">
                <span className="text-3xl font-extrabold text-secondary tracking-tight">25M+</span>
                <span className="text-[10px] font-bold text-gray-400 tracking-[0.15em] uppercase text-left leading-tight">Links<br/>Shortened</span>
              </div>

            </div>
          </div>
        </section>

        {/* 3 Step Process */}
        <section className="w-full py-24 bg-white flex flex-col items-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center mb-16">
              <span className="text-[11px] font-bold text-primary tracking-[0.2em] uppercase mb-3">Efficiency First</span>
              <h2 className="text-4xl font-heading font-extrabold tracking-tight text-center">Simple 3-Step Process</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Step 1 */}
              <div className="bg-white border-2 border-black rounded-[24px] p-8 shadow-hard-lg relative overflow-hidden group">
                <div className="absolute -top-4 right-4 text-[120px] font-extrabold text-gray-100 z-0 leading-none group-hover:text-gray-200 transition-colors">01</div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-secondary rounded-full border-2 border-black flex items-center justify-center mb-6">
                    <ClipboardPaste className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Paste URL</h3>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-[250px]">
                    Drop your lengthy URL into our dashboard. We support everything from deep links to simple web addresses.
                  </p>
                </div>
              </div>

              {/* Step 2 (Green) */}
              <div className="bg-[#e9f8f0] border-2 border-black rounded-[24px] p-8 shadow-hard-lg relative overflow-hidden group">
                <div className="absolute -top-4 right-4 text-[120px] font-extrabold text-[#d2efe0] z-0 leading-none group-hover:text-[#c4ead6] transition-colors">02</div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-primary rounded-full border-2 border-black flex items-center justify-center mb-6">
                    <PenTool className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Customize</h3>
                  <p className="text-gray-600 font-medium text-sm leading-relaxed max-w-[250px]">
                    Add a custom alias, brand name, or descriptive tags to make your link memorable and clickable.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white border-2 border-black rounded-[24px] p-8 shadow-hard-lg relative overflow-hidden group">
                <div className="absolute -top-4 right-4 text-[120px] font-extrabold text-gray-100 z-0 leading-none group-hover:text-gray-200 transition-colors">03</div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-secondary rounded-full border-2 border-black flex items-center justify-center mb-6">
                    <Share2 className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Share & Track</h3>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-[250px]">
                    Distribute your new link and watch real-time analytics come to life on your personal dashboard.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-24 bg-[#f4f7f6] flex flex-col items-center">
          <div className="container px-4 md:px-6">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
              <div className="max-w-2xl text-left">
                <h2 className="text-4xl font-heading font-extrabold tracking-tight mb-4">Packed with Power</h2>
                <p className="text-gray-500 font-medium text-lg leading-relaxed">
                  We've built more than just a shortener. VibrantLink is a comprehensive link management ecosystem designed for modern marketers.
                </p>
              </div>
              <a href="#integrations" className="inline-flex items-center justify-center rounded-full text-sm font-bold transition-transform hover:-translate-y-1 h-12 px-8 border-2 border-black bg-white text-black shadow-hard shrink-0">
                Explore Integrations
              </a>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Feature 1 */}
              <div className="bg-white border-2 border-black rounded-[24px] p-6 shadow-hard-lg flex flex-col h-full">
                <div className="w-full h-40 bg-[#fdfaf0] rounded-[16px] border-2 border-black flex items-center justify-center mb-6">
                  <BarChart3 className="w-12 h-12 text-[#e5c158]" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold mb-3">Instant Analytics</h3>
                <p className="text-gray-500 font-medium text-[15px] leading-relaxed mb-6">
                  Detailed reports on geolocation, device type, and referral sources updated every second.
                </p>
                <div className="mt-auto space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <CheckCircle className="w-4 h-4 text-primary" /> Real-time tracking
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <CheckCircle className="w-4 h-4 text-primary" /> Actionable campaigns
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white border-2 border-black rounded-[24px] p-6 shadow-hard-lg flex flex-col h-full">
                <div className="w-full h-40 bg-[#f0f9f4] rounded-[16px] border-2 border-black flex items-center justify-center mb-6">
                  <MonitorSmartphone className="w-12 h-12 text-[#7bc99d]" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold mb-3">Branded Links</h3>
                <p className="text-gray-500 font-medium text-[15px] leading-relaxed mb-6">
                  Replace our domain with yours to increase click-through rates by up to 34% with trust.
                </p>
                <div className="mt-auto space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <CheckCircle className="w-4 h-4 text-primary" /> Custom domains
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <CheckCircle className="w-4 h-4 text-primary" /> SSL certification included
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white border-2 border-black rounded-[24px] p-6 shadow-hard-lg flex flex-col h-full">
                <div className="w-full h-40 bg-[#fdfaf0] rounded-[16px] border-2 border-black flex items-center justify-center mb-6">
                  <Shield className="w-12 h-12 text-[#e5c158]" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold mb-3">Secure Management</h3>
                <p className="text-gray-500 font-medium text-[15px] leading-relaxed mb-6">
                  Protect your links with passwords, expiration dates, and advanced anti-spam filters.
                </p>
                <div className="mt-auto space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <CheckCircle className="w-4 h-4 text-primary" /> Password protection
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <CheckCircle className="w-4 h-4 text-primary" /> Smart link redirection
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="w-full py-24 bg-white  flex flex-col items-center">
          <div className="container px-4 md:px-6 flex flex-col items-center">
            <h2 className="text-4xl font-heading font-extrabold tracking-tight text-center mb-16">Loved by the Community</h2>
            
            <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
              
              {/* Light Card */}
              <div className="bg-white border-2 border-black rounded-3xl p-8 md:p-10 shadow-hard-lg flex flex-col">
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />)}
                </div>
                <p className="text-xl font-bold italic text-gray-800 mb-8 leading-snug flex-1">
                  "VibrantLink has completely changed how we share our internal resources. The branded links alone have doubled our employee engagement on announcements."
                </p>
                <div className="flex items-center gap-4">
                  <img src="https://i.pravatar.cc/150?img=47" alt="Sarah Jenkins" className="w-12 h-12 rounded-full border-2 border-black" />
                  <div>
                    <h4 className="font-bold text-sm text-black">Sarah Jenkins</h4>
                    <p className="text-xs text-gray-500 font-bold">Marketing Director at TechFlow</p>
                  </div>
                </div>
              </div>

              {/* Dark Card */}
              <div className="bg-[#18181b] border-2 border-[#18181b] rounded-3xl p-8 md:p-10 shadow-hard-lg flex flex-col">
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-primary text-primary" />)}
                </div>
                <p className="text-xl font-bold italic text-white mb-8 leading-snug flex-1">
                  "The analytics are terrifyingly good. I can see exactly when my campaigns hit the peak and adjust my strategy in real-time. Unbeatable tool for growth."
                </p>
                <div className="flex items-center gap-4">
                  <img src="https://i.pravatar.cc/150?img=11" alt="Marcus Kane" className="w-12 h-12 rounded-full border-2 border-primary" />
                  <div>
                    <h4 className="font-bold text-sm text-primary">Marcus Kane</h4>
                    <p className="text-xs text-gray-400 font-bold">Founder of Creative Pulse</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-20 bg-white flex flex-col items-center">
          <div className="container px-4 md:px-6 flex flex-col items-center">
            <h2 className="text-3xl font-heading font-extrabold tracking-tight text-center mb-10">Got Questions?</h2>
            
            <div className="w-full max-w-3xl">
              <FAQItem 
                question="Is there a limit on how many links I can shorten?" 
                answer="Our free plan allows up to 50 links per month. For power users and businesses, our Premium plans offer unlimited link creation and advanced tracking features." 
              />
              <FAQItem 
                question="Can I use my own custom domain?" 
                answer="Yes. All paid plans include custom domain support. You can connect your own domain to create branded links like 'link.yourbrand.com'." 
              />
              <FAQItem 
                question="How long do shortened links last?" 
                answer="VibrantLink links never expire unless you choose to delete them or set a custom expiration date on our advanced plans." 
              />
            </div>
          </div>
        </section>

        {/* <CompanySection /> */}
        {/* <LegalSection /> */}

        {/* Huge Yellow CTA Banner */}
        <section className="w-full py-24 bg-white relative overflow-hidden flex justify-center">
           <div className="container px-4 md:px-6 w-full max-w-6xl">
              <div className="w-full bg-secondary border-2 border-black rounded-[40px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden py-20 px-8 text-center flex flex-col items-center">
                
                {/* Background Shapes */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#e5bc2e] rounded-full translate-x-1/3 -translate-y-1/3 z-0"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#e5bc2e] rounded-full -translate-x-1/4 translate-y-1/4 z-0"></div>
                
                <div className="relative z-10">
                  <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#111827] tracking-tight">Ready to shorten your first link?</h2>
                  <p className="text-sm md:text-base font-medium mb-10 max-w-xl mx-auto text-[#111827]/80 leading-relaxed">
                    Join over 99,000 users making their digital presence cleaner, smarter, and more impactful with VibrantLink.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                      to="/register"
                      className="inline-flex h-14 items-center justify-center rounded-full bg-[#111827] text-white px-8 font-bold text-[15px] border-2 border-black shadow-hard hover:-translate-y-1 transition-transform"
                    >
                      Get Started Now
                    </Link>
                    <a 
                      href="#pricing"
                      className="inline-flex h-14 items-center justify-center rounded-full bg-white text-[#111827] px-8 font-bold text-[15px] border-2 border-black shadow-hard hover:-translate-y-1 transition-transform"
                    >
                      View Pricing
                    </a>
                  </div>
                </div>
              </div>
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

export default Landing;
