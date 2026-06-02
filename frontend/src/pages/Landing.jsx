import { Link } from 'react-router-dom';
import { Link2, Zap, BarChart3, Shield, Users } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-4 lg:px-6 h-20 flex items-center border-b-2 border-black bg-primary sticky top-0 z-50">
        <Link to="/" className="flex items-center justify-center">
          <img src="/final.png" alt="VibrantLink Logo" className="h-10 w-10 mr-2 object-contain" />
          <span className="font-heading font-extrabold text-2xl tracking-tight text-white">VibrantLink</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link to="/login" className="text-sm font-bold text-white hover:underline underline-offset-4 py-2">
            Sign In
          </Link>
          <Link 
            to="/register" 
            className="inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-10 px-6 border-2 border-black shadow-hard hover:shadow-hard-lg bg-secondary text-secondary-foreground"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 relative overflow-hidden">
        {/* New Hero Section */}
        <section className="w-full py-20 lg:py-32 flex items-center justify-center relative z-10 overflow-hidden bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
              
              {/* Left Side: Content */}
              <div className="flex flex-col space-y-8 text-left lg:pr-10">
                <h1 className="text-5xl font-heading font-extrabold tracking-tight sm:text-6xl lg:text-[72px] leading-[1.1] text-foreground">
                  Shorten Your Reach, <br className="hidden lg:block" />
                  Not Your Impact
                </h1>
                
                <p className="max-w-[600px] text-muted-foreground md:text-xl font-medium leading-relaxed">
                  Transform long, unwieldy URLs into clean, trackable links. Elevate your brand presence and gather insights with every click.
                </p>

                {/* Dots / Pills decoration */}
                <div className="flex items-center space-x-2 pt-2">
                  <div className="w-8 h-3 bg-black rounded-full"></div>
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                  <div className="w-8 h-3 bg-primary rounded-full"></div>
                </div>
                
                {/* Input box */}
                <div className="mt-8 flex flex-col sm:flex-row items-center bg-white border-[3px] border-black rounded-full p-2 max-w-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full relative group transition-transform hover:-translate-y-1">
                  <input 
                    type="text" 
                    placeholder="Paste your long URL here..." 
                    className="flex-1 bg-transparent px-6 py-4 outline-none font-medium text-black placeholder:text-muted-foreground w-full sm:w-auto text-base"
                  />
                  <Link 
                    to="/register" 
                    className="inline-flex items-center justify-center rounded-full text-sm font-bold transition-transform active:scale-95 h-12 px-8 border-2 border-black bg-primary text-black whitespace-nowrap mt-2 sm:mt-0 w-full sm:w-auto hover:bg-[#3ceb8b]"
                  >
                    Getting Started
                  </Link>
                </div>
              </div>

              {/* Right Side: Artwork */}
              <div className="relative flex justify-center items-center pt-20 lg:pt-0 min-h-[500px]">
                
                {/* Background Blobs */}
                <div className="absolute w-[120%] h-[120%] max-w-[600px] max-h-[600px] bg-[#FFD12A] rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] border-[3px] border-black top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12 -z-20"></div>
                
                <div className="absolute w-[100%] h-[100%] max-w-[500px] max-h-[500px] bg-primary rounded-[50%_50%_40%_60%_/_60%_40%_50%_50%] border-[3px] border-black top-1/2 left-1/2 -translate-x-[60%] -translate-y-[40%] -rotate-12 -z-10"></div>
                
                {/* Center Frame with Image */}
                <div className="relative z-10 w-[280px] h-[380px] sm:w-[320px] sm:h-[440px] border-[4px] border-black rounded-[60px] bg-[#97E2D5] overflow-hidden shadow-none flex items-center justify-center">
                  <img src="/hero-image.png" alt="Hero" className="w-full h-full object-cover" />
                </div>

                {/* Floating Card */}
                <div className="absolute z-20 bottom-10 -right-4 sm:-right-12 bg-white border-[3px] border-black rounded-[24px] p-4 flex items-center space-x-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-[280px] w-full transform rotate-2 hover:rotate-0 transition-transform">
                  <div className="w-12 h-12 rounded-full bg-[#FFD12A] border-2 border-black flex items-center justify-center shrink-0">
                    <Users className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-black leading-tight mb-1">Interactive Engagement</h4>
                    <p className="text-[11px] text-muted-foreground leading-snug font-medium">
                      Engaging participation enhances learning, fostering interactive collaboration, and feedback.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-accent/20 border-t-2 border-black flex justify-center relative z-10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-4">
                <h2 className="text-4xl font-heading font-extrabold tracking-tight md:text-5xl">Everything you need</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-medium">
                  Our platform provides all the tools you need to manage your links effectively.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-8 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center bg-card p-8 rounded-[24px] border-2 border-black shadow-hard-lg hover:-translate-y-2 transition-transform">
                <div className="p-4 bg-primary rounded-full border-2 border-black shadow-hard">
                  <Zap className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-heading font-extrabold">Lightning Fast</h3>
                <p className="text-muted-foreground text-base font-medium">
                  Global edge network ensures your links redirect instantly, anywhere in the world.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center bg-card p-8 rounded-[24px] border-2 border-black shadow-hard-lg hover:-translate-y-2 transition-transform">
                <div className="p-4 bg-secondary rounded-full border-2 border-black shadow-hard">
                  <BarChart3 className="h-8 w-8 text-secondary-foreground" />
                </div>
                <h3 className="text-2xl font-heading font-extrabold">Advanced Analytics</h3>
                <p className="text-muted-foreground text-base font-medium">
                  Track every click with detailed statistics on devices, locations, and referrers.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center bg-card p-8 rounded-[24px] border-2 border-black shadow-hard-lg hover:-translate-y-2 transition-transform">
                <div className="p-4 bg-black rounded-full border-2 border-black shadow-hard">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-heading font-extrabold">Secure & Reliable</h3>
                <p className="text-muted-foreground text-base font-medium">
                  Built with security in mind. Manage active and expired links safely.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t-2 border-black bg-primary">
        <p className="text-sm text-white font-bold">
          © {new Date().getFullYear()} VibrantLink. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-bold text-white hover:underline underline-offset-4" to="#">
            Terms of Service
          </Link>
          <Link className="text-sm font-bold text-white hover:underline underline-offset-4" to="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default Landing;
