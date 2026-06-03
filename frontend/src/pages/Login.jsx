import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Loader2, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="bg-card text-card-foreground p-6 md:p-10 rounded-[32px] border-2 border-black shadow-hard-lg flex flex-col md:flex-row items-stretch gap-8 md:gap-12">
      
      {/* Left Side: Image Banner */}
      <div className="hidden md:flex flex-col items-center justify-center w-1/2 p-8 bg-secondary/10 rounded-[24px] border-2 border-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-full -mr-16 -mt-16 border-b-2 border-l-2 border-black"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/50 rounded-tr-full -ml-12 -mb-12 border-t-2 border-r-2 border-black"></div>
        
        <img src="/login_illustration.png" alt="Welcome Back" className="w-full max-w-[280px] object-contain mb-8 relative z-10 drop-shadow-md hover:scale-105 transition-transform duration-500" />
        
        <div className="text-center relative z-10">
          <h3 className="font-heading font-extrabold text-3xl mb-3 text-foreground">Welcome Back!</h3>
          <p className="font-bold text-muted-foreground text-base max-w-xs mx-auto">
            We are so happy to see you again. Sign in to manage your vibrant links.
          </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        {/* Mobile Header */}
        <div className="flex flex-col items-center space-y-2 mb-8 text-center md:hidden">
          <img src="/login_illustration.png" alt="Login" className="h-28 w-28 mb-2 object-contain" />
          <h3 className="font-heading font-extrabold tracking-tight text-3xl">Sign In</h3>
          <p className="text-sm font-bold text-muted-foreground">
            Enter your email below to access your account.
          </p>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block mb-8">
          <h3 className="font-heading font-extrabold tracking-tight text-4xl mb-2">Sign In</h3>
          <p className="text-base font-bold text-muted-foreground">
            Enter your details to access your account.
          </p>
        </div>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold leading-none" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className="flex h-12 w-full rounded-2xl border-2 border-black bg-background px-4 py-2 text-sm font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 transition-all invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 invalid:[&:not(:placeholder-shown):not(:focus)]:text-red-500"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2 pt-2 relative">
          <label className="text-sm font-bold leading-none" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Password"
            required
            className="flex h-12 w-full rounded-2xl border-2 border-black bg-background px-4 py-2 text-sm font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 transition-all invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 invalid:[&:not(:placeholder-shown):not(:focus)]:text-red-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="absolute right-2 top-1/2 -mt-1 p-2 rounded-full hover:bg-muted/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            {isPasswordVisible ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
          </button>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-12 px-6 py-2 border-2 border-black shadow-hard hover:shadow-hard-lg bg-primary text-primary-foreground focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none w-full mt-6"
        >
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign In'}
        </button>
      </form>
      
      <div className="mt-8 text-center text-base font-bold">
        <span className="text-muted-foreground">Don't have an account? </span>
        <Link to="/register" className="text-primary underline-offset-4 hover:underline">
          Sign up
        </Link>
      </div>
      </div>
    </div>
  );
};

export default Login;
