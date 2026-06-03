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
  Star,
  Menu,
  X
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  const features = [
    {
      title: "Instant Analytics",
      desc: "Detailed reports on geolocation, device type, and referral sources updated every second.",
      image: "/analytics_feature.png",
      points: ["Real-time tracking", "Actionable campaigns"]
    },
    {
      title: "Branded Links",
      desc: "Replace our domain with yours to increase click-through rates by up to 34% with trust.",
      image: "/branded_links_feature.png",
      points: ["Custom domains", "SSL certification included"]
    },
    {
      title: "Secure Management",
      desc: "Protect your links with passwords, expiration dates, and advanced anti-spam filters.",
      image: "/secure_management_feature.png",
      points: ["Access control", "Spam protection"]
    }
  ];

  const nextFeature = () => setActiveFeatureIndex((prev) => (prev + 1) % features.length);
  const prevFeature = () => setActiveFeatureIndex((prev) => (prev - 1 + features.length) % features.length);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      
      {/* Header */}
      <header className="px-4 lg:px-8 h-[88px] flex items-center border-b-2 border-black bg-white sticky top-0 z-50">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <div className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary rounded-xl border-2 border-black flex items-center justify-center shadow-sm group-hover:shadow-hard group-hover:-translate-y-1 transition-all overflow-hidden">
                <img className='z-20' src="../../public/final.png" alt="" />
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-tight text-foreground ml-1">VibrantLink</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-base font-bold text-foreground hover:text-primary transition-colors relative after:absolute after:-bottom-1 after:left-0 after:h-1 after:w-0 after:bg-primary after:transition-all hover:after:w-full">Home</a>
            <a href="#features" className="text-base font-bold text-foreground hover:text-primary transition-colors relative after:absolute after:-bottom-1 after:left-0 after:h-1 after:w-0 after:bg-primary after:transition-all hover:after:w-full">Features</a>
            <Link to="/contact" className="text-base font-bold text-foreground hover:text-primary transition-colors relative after:absolute after:-bottom-1 after:left-0 after:h-1 after:w-0 after:bg-primary after:transition-all hover:after:w-full">Contact Us</Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link 
              to="/login" 
              className="text-base font-bold text-foreground hover:text-primary transition-colors px-2"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-11 px-8 border-2 border-black shadow-hard hover:shadow-hard-lg bg-primary text-black"
            >
              Get Started
            </Link>
          </div>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden w-11 h-11 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-sm hover:shadow-hard hover:-translate-y-1 transition-all focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-black" /> : <Menu className="w-5 h-5 text-black" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-[96px] left-4 right-4 bg-white border-2 border-black rounded-[24px] z-40 shadow-hard-lg overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              <a 
                href="#" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-bold text-foreground hover:bg-secondary/20 transition-colors p-3 rounded-xl"
              >
                Home
              </a>
              <a 
                href="#features" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-bold text-foreground hover:bg-secondary/20 transition-colors p-3 rounded-xl"
              >
                Features
              </a>
              <Link 
                to="/contact" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-bold text-foreground hover:bg-secondary/20 transition-colors p-3 rounded-xl"
              >
                Contact Us
              </Link>
              
              <div className="h-0.5 w-full bg-gray-100 my-2"></div>
              
              <Link 
                to="/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex items-center justify-center rounded-xl text-base font-bold h-12 px-6 border-2 border-black bg-white text-black w-full"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex items-center justify-center rounded-xl text-base font-bold h-12 px-6 border-2 border-black bg-primary text-black w-full shadow-hard"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <div className="mt-4 flex flex-col sm:flex-row items-center bg-white border-2 border-black rounded-3xl sm:rounded-[100px] p-2 max-w-xl w-full shadow-hard-lg">
                  <input 
                    type="text" 
                    placeholder="Paste your long link here..." 
                    className="flex-1 bg-transparent px-4 sm:px-6 py-3 outline-none font-medium text-black placeholder:text-gray-400 w-full sm:w-auto text-[15px]"
                  />
                  <button className="inline-flex items-center justify-center rounded-full text-sm font-bold h-12 px-8 border-2 border-black bg-primary text-black whitespace-nowrap mt-2 sm:mt-0 w-full sm:w-auto shadow-sm hover:bg-[#1fa964] transition-colors" onClick={()=>navigate("/register")}>
                    Shorten <span className="ml-2">→</span>
                  </button>
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
            <h1 className='text-center text-3xl font-bold mb-10'>What Makes VibrantLink Stand Out</h1>
            <div className="relative w-full max-w-4xl mx-auto mt-4">
              <div className="bg-white border-2 border-black rounded-[32px] p-8 md:p-12 shadow-hard-lg overflow-hidden flex flex-col md:flex-row gap-12 items-center min-h-[450px]">
                
                <div className="w-full md:w-1/2 flex-shrink-0 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={activeFeatureIndex}
                      src={features[activeFeatureIndex].image}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-auto rounded-[16px] border-2 border-black object-cover shadow-sm max-h-[250px]"
                      alt={features[activeFeatureIndex].title}
                    />
                  </AnimatePresence>
                </div>

                <div className="w-full md:w-1/2 flex flex-col items-start justify-center h-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFeatureIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col"
                    >
                      <h3 className="text-3xl font-extrabold mb-4 font-heading tracking-tight text-[#111827]">{features[activeFeatureIndex].title}</h3>
                      <p className="text-gray-500 font-medium text-base leading-relaxed mb-8">
                        {features[activeFeatureIndex].desc}
                      </p>
                      
                      <div className="space-y-4">
                        {features[activeFeatureIndex].points.map((point, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                            <CheckCircle className="w-5 h-5 text-primary" /> {point}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Carousel Controls */}
              <div className="flex items-center justify-center mt-8 gap-6">
                <button 
                  onClick={prevFeature}
                  className="w-12 h-12 rounded-full border-2 border-black bg-white flex items-center justify-center shadow-hard hover:shadow-hard-lg hover:-translate-y-1 transition-all focus:outline-none"
                >
                  <span className="sr-only">Previous</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <div className="flex gap-2">
                  {features.map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setActiveFeatureIndex(i)}
                      className={`w-3 h-3 rounded-full border-2 border-black transition-colors ${activeFeatureIndex === i ? 'bg-primary' : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
                <button 
                  onClick={nextFeature}
                  className="w-12 h-12 rounded-full border-2 border-black bg-white flex items-center justify-center shadow-hard hover:shadow-hard-lg hover:-translate-y-1 transition-all focus:outline-none"
                >
                  <span className="sr-only">Next</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
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
