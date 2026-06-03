import { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Loader2, Mail, ArrowRight, RefreshCw, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  
  const { user, verifyEmail, resendVerification, error, setError, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  // Redirect if not logged in or already verified
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.isVerified) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Clear context error on mount
  useEffect(() => {
    if (setError) setError(null);
  }, [setError]);

  // Handle cooldown timer for resend button
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (index, value) => {
    if (isNaN(Number(value))) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (code[index] === '' && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const pastedArray = pastedData.split('');
      setCode(pastedArray);
      inputRefs.current[5].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    
    if (fullCode.length !== 6) {
      if (setError) setError('Please enter the 6-digit code');
      return;
    }

    setIsSubmitting(true);
    const success = await verifyEmail(fullCode);
    setIsSubmitting(false);

    if (success) {
      toast.success('Email verified successfully!');
      navigate('/dashboard');
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    
    setIsResending(true);
    const success = await resendVerification();
    setIsResending(false);

    if (success) {
      toast.success('Verification code sent! Please check your email.');
      setCooldown(60); // Reset cooldown to 60 seconds
      setCode(['', '', '', '', '', '']); // Clear inputs
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="bg-card text-card-foreground p-6 md:p-10 rounded-[32px] border-2 border-black shadow-hard-lg flex flex-col md:flex-row items-stretch gap-8 md:gap-12 w-full max-w-4xl mx-auto">
      
      {/* Left Side: Image Banner */}
      <div className="hidden md:flex flex-col items-center justify-center w-1/2 p-8 bg-[#F1C40F]/10 rounded-[24px] border-2 border-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 rounded-br-full -ml-16 -mt-16 border-b-2 border-r-2 border-black"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/50 rounded-tl-full -mr-12 -mb-12 border-t-2 border-l-2 border-black"></div>
        
        <img src="/verify_illustration.png" alt="Verify Email" className="w-full max-w-[280px] object-contain mb-8 relative z-10 drop-shadow-md hover:scale-105 transition-transform duration-500" />
        
        <div className="text-center relative z-10">
          <h3 className="font-heading font-extrabold text-3xl mb-3 text-foreground">Verify Your Account</h3>
          <p className="font-bold text-muted-foreground text-base max-w-xs mx-auto">
            You're just one step away from managing your vibrant links. Check your inbox!
          </p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        {/* Mobile Header */}
        <div className="flex flex-col items-center space-y-2 mb-8 text-center md:hidden">
          <img src="/verify_illustration.png" alt="Verify Email" className="h-28 w-28 mb-2 object-contain" />
          <h3 className="font-heading font-extrabold tracking-tight text-3xl">Check your email</h3>
          <p className="text-sm font-bold text-muted-foreground">
            We've sent a 6-digit verification code to<br/>
            <strong className="text-foreground">{user.email}</strong>
          </p>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block mb-8">
          <div className="flex items-center gap-3 mb-2">
             <div className="h-10 w-10 bg-primary/20 rounded-full border-2 border-black flex items-center justify-center">
               <Mail className="h-5 w-5 text-foreground" />
             </div>
             <h3 className="font-heading font-extrabold tracking-tight text-4xl">Enter Code</h3>
          </div>
          <p className="text-base font-bold text-muted-foreground">
            We've sent a 6-digit verification code to<br/>
            <strong className="text-foreground">{user.email}</strong>
          </p>
        </div>

      {error && (
        <div className="mb-6 p-3 rounded-md bg-destructive/15 text-destructive text-sm font-medium text-center border border-destructive/30">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between gap-2 sm:gap-3" onPaste={handlePaste}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-10 h-14 sm:w-12 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 border-black bg-background focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 transition-all"
              autoFocus={index === 0}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || code.some(d => d === '')}
          className="inline-flex items-center justify-center rounded-full text-sm font-bold transition-all hover:-translate-y-1 h-12 px-6 py-2 border-2 border-black shadow-hard hover:shadow-hard-lg bg-primary text-primary-foreground focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none w-full"
        >
          {isSubmitting ? <img src="/Sandy Loading.svg" className="mr-2 h-5 w-5" alt="Loading..." /> : 'Verify Account'}
        </button>
      </form>
      
      <div className="mt-8 flex flex-col items-center gap-4 text-sm font-medium">
        <button 
          onClick={handleResend}
          disabled={cooldown > 0 || isResending}
          className="inline-flex items-center text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:hover:text-muted-foreground transition-colors"
        >
          {isResending ? (
            <>
              <img src="/Sandy Loading.svg" className="h-4 w-4 mr-2" alt="Loading..." />
              Resending...
            </>
          ) : (
            <RefreshCw className={`h-4 w-4 mr-2 ${cooldown === 0 ? 'text-primary' : ''}`} />
          )}
          {cooldown > 0 ? `Resend code in ${cooldown}s` : !isResending && 'Resend Code'}
        </button>
        
        <button 
          onClick={handleLogout}
          className="inline-flex items-center text-destructive hover:text-destructive/80 transition-colors"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Use a different account
        </button>
      </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
