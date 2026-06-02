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
    <div className="bg-card text-card-foreground p-8 rounded-[24px] border-2 border-black shadow-hard-lg max-w-md w-full mx-auto">
      <div className="flex flex-col items-center space-y-3 mb-6 text-center">
        <div className="h-16 w-16 bg-primary/10 rounded-full border-2 border-black flex items-center justify-center mb-2">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-heading font-extrabold tracking-tight text-3xl">Check your email</h3>
        <p className="text-sm font-medium text-muted-foreground">
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
          {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Verify Account'}
        </button>
      </form>
      
      <div className="mt-8 flex flex-col items-center gap-4 text-sm font-medium">
        <button 
          onClick={handleResend}
          disabled={cooldown > 0 || isResending}
          className="inline-flex items-center text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:hover:text-muted-foreground transition-colors"
        >
          {isResending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className={`h-4 w-4 mr-2 ${cooldown === 0 ? 'text-primary' : ''}`} />
          )}
          {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend Code'}
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
  );
};

export default VerifyEmail;
