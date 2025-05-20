
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { verifyLoginCode, resendLoginCode } from '@/store/slices/authSlice';
import { AppDispatch } from '@/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const verifyLoginCodeSchema = yup.object({
  user_id: yup.number().required('User ID is required'),
  verification_code: yup.string().required('Verification code is required').length(8, 'Verification code must be 8 digits'),
});

type VerifyLoginCodeFormData = {
  user_id: number;
  verification_code: string;
};

const VerifyLoginCodePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  // Get user_id from state
  const userId = location.state?.userId;
  
  useEffect(() => {
    // If no userId in state, redirect to login
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerifyLoginCodeFormData>({
    resolver: yupResolver(verifyLoginCodeSchema),
    defaultValues: {
      user_id: userId || 0,
    },
  });
  
  // Set user_id from state
  useEffect(() => {
    if (userId) {
      setValue('user_id', userId);
    }
  }, [userId, setValue]);
  
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

  const onSubmit = async (data: VerifyLoginCodeFormData) => {
    if (!userId) return;
    
    setLoading(true);
    try {
      await dispatch(verifyLoginCode(data)).unwrap();
      toast.success('Login verified successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Verification error:', error);
      // Toast notification is handled in the thunk
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || !userId) return;
    
    setResendLoading(true);
    try {
      await dispatch(resendLoginCode(userId)).unwrap();
      setResendCooldown(60); // 60 seconds cooldown
      toast.success('A new verification code has been sent to your email');
    } catch (error) {
      console.error('Resend error:', error);
      // Toast notification is handled in the thunk
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-brand-primary bg-opacity-10 mb-4">
          <ShieldCheck className="h-6 w-6 text-brand-primary" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Verify Login</h2>
        <p className="text-gray-600 mt-1">
          For security reasons, we've sent a verification code to your email address.
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <input
          type="hidden"
          {...register('user_id')}
        />
        
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
        
        <div>
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
              'Verify Code'
            )}
          </button>
        </div>
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
    </div>
  );
};

export default VerifyLoginCodePage;
