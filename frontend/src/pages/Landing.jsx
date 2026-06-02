import { Link } from 'react-router-dom';
import { Link2, Zap, BarChart3, Shield } from 'lucide-react';

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
        {/* Organic Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary rounded-full mix-blend-multiply filter blur-[100px] opacity-30 z-0 pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary rounded-full mix-blend-multiply filter blur-[100px] opacity-30 z-0 pointer-events-none"></div>
        
        <section className="w-full py-20 md:py-32 lg:py-48 flex items-center justify-center relative z-10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-4">
                <h1 className="text-5xl font-heading font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                  Shorten your links, <br/><span className="text-primary underline decoration-secondary decoration-8 underline-offset-8">expand your reach.</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl pt-4 font-medium">
                  A modern, powerful URL shortener that gives you full control and insights over your links. Track clicks, location, and devices all from an elegant dashboard.
                </p>
              </div>
              <div className="space-x-4 pt-8">
                <Link 
                  to="/register" 
                  className="inline-flex items-center justify-center rounded-full text-base font-bold transition-all hover:-translate-y-1 h-14 px-8 border-2 border-black shadow-hard hover:shadow-hard-lg bg-primary text-primary-foreground focus-visible:outline-none"
                >
                  Start for free
                </Link>
                <Link 
                  to="/login" 
                  className="inline-flex items-center justify-center rounded-full text-base font-bold transition-all hover:-translate-y-1 h-14 px-8 border-2 border-black shadow-hard hover:shadow-hard-lg bg-white text-foreground focus-visible:outline-none"
                >
                  View Dashboard
                </Link>
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
