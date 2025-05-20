
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const forgotPasswordSchema = yup.object({
  email: yup.string().required('Email is required').email('Please enter a valid email'),
});

type ForgotPasswordFormData = {
  email: string;
};

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      // Replace with actual API endpoint
      await axios.post('https://namph.connectnesthub.com/api/request/password/reset/verification', {
        email: data.email,
      });
      
      setEmailSent(true);
      toast.success('Verification code has been sent to your email');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send verification code';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-brand-primary bg-opacity-10 mb-4">
          <Mail className="h-6 w-6 text-brand-primary" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Check Your Email</h2>
        <p className="text-gray-600 mb-6">
          We've sent a verification code to your email. Use this code to reset your password.
        </p>
        <Link
          to="/reset-password"
          className="btn-primary inline-block"
        >
          Reset Password
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-center text-xl font-bold text-gray-900 mb-6">
        Forgot Password
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="form-input-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`form-input pl-10 ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>
          {errors.email && (
            <p className="form-error">{errors.email.message}</p>
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
                Sending...
              </span>
            ) : (
              'Send Reset Code'
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Remember your password?{' '}
          <Link to="/login" className="text-brand-primary font-medium hover:text-brand-primary/80">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
