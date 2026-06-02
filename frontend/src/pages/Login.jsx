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
    <div className="bg-card text-card-foreground p-8 rounded-[24px] border-2 border-black shadow-hard-lg">
      <div className="flex flex-col items-center space-y-1.5 mb-6 text-center">
        <img src="/final.png" alt="Logo" className="h-12 w-12 mb-2 object-contain border-2 border-black rounded-full" />
        <h3 className="font-heading font-extrabold tracking-tight text-3xl">Sign In</h3>
        <p className="text-sm font-medium text-muted-foreground">
          Enter your email below to access your account.
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
      
      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">Don't have an account? </span>
        <Link to="/register" className="text-primary underline-offset-4 hover:underline font-medium">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default Login;
