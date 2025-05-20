
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { verificationCodeSchema } from '@/utils/validation';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail, resendVerificationCode } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Check } from 'lucide-react';

type VerifyEmailFormData = {
  email: string;
  verification_code: string;
};

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const [isVerified, setIsVerified] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  // Get email from location state
  const emailFromState = location.state?.email || '';
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<VerifyEmailFormData>({
    resolver: yupResolver(verificationCodeSchema),
    defaultValues: {
      email: emailFromState,
    },
  });

  // Set email from state
  useEffect(() => {
    if (emailFromState) {
      setValue('email', emailFromState);
    }
  }, [emailFromState, setValue]);
  
  // Handle resend cooldown
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendCooldown]);

  const onSubmit = async (data: VerifyEmailFormData) => {
    try {
      await dispatch(verifyEmail(data)).unwrap();
      setIsVerified(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Verification error:', error);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    
    const email = emailFromState;
    if (!email) return;
    
    try {
      setResendLoading(true);
      await dispatch(resendVerificationCode(email)).unwrap();
      setResendCooldown(60); // 60 seconds cooldown
    } catch (error) {
      console.error('Resend error:', error);
    } finally {
      setResendLoading(false);
    }
  };

  if (isVerified) {
    return (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Email Verified Successfully</h2>
        <p className="text-gray-600 mb-6">
          Your email has been verified. You will be redirected to the login page shortly.
        </p>
        <Link
          to="/login"
          className="text-brand-primary hover:text-brand-primary/80 font-medium"
        >
          Click here if you are not redirected
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-brand-primary bg-opacity-10 mb-4">
          <Mail className="h-6 w-6 text-brand-primary" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Verify Your Email</h2>
        <p className="text-gray-600 mt-1">
          We've sent a verification code to your email. Please enter it below.
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="form-input-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={`form-input ${errors.email ? 'border-red-500' : ''}`}
            disabled={!!emailFromState || loading}
          />
          {errors.email && (
            <p className="form-error">{errors.email.message}</p>
          )}
        </div>
        
        <div className="form-input-group">
          <label htmlFor="verification_code" className="form-label">
            Verification Code
          </label>
          <input
            id="verification_code"
            type="text"
            {...register('verification_code')}
            className={`form-input ${errors.verification_code ? 'border-red-500' : ''}`}
            placeholder="Enter 8-digit code"
            disabled={loading}
          />
          {errors.verification_code && (
            <p className="form-error">{errors.verification_code.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full btn-primary"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Verifying...
            </span>
          ) : (
            'Verify Email'
          )}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Didn't receive the code?{' '}
          <button
            type="button"
            onClick={handleResendCode}
            className={`text-brand-primary font-medium ${
              resendCooldown > 0 || resendLoading ? 'opacity-50 cursor-not-allowed' : 'hover:text-brand-primary/80'
            }`}
            disabled={resendCooldown > 0 || resendLoading}
          >
            {resendLoading ? 'Sending...' : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
          </button>
        </p>
      </div>
      
      <div className="mt-6 text-center border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-600">
          Already verified?{' '}
          <Link to="/login" className="text-brand-primary font-medium hover:text-brand-primary/80">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
