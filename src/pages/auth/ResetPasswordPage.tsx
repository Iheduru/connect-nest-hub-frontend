
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Lock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const resetPasswordSchema = yup.object({
  token: yup.string().required('Verification code is required').length(8, 'Code must be 8 characters'),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  password_confirmation: yup.string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

type ResetPasswordFormData = {
  token: string;
  password: string;
  password_confirmation: string;
};

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true);
    try {
      // Replace with actual API endpoint
      await axios.post('https://namph.connectnesthub.com/api/reset/password', {
        token: data.token,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      
      setResetSuccess(true);
      toast.success('Password has been reset successfully');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (resetSuccess) {
    return (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Password Reset Successful</h2>
        <p className="text-gray-600 mb-6">
          Your password has been reset. You will be redirected to login shortly.
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
      <h2 className="text-center text-xl font-bold text-gray-900 mb-6">
        Reset Your Password
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="form-input-group">
          <label htmlFor="token" className="form-label">
            Verification Code
          </label>
          <input
            id="token"
            type="text"
            {...register('token')}
            className={`form-input ${errors.token ? 'border-red-500' : ''}`}
            placeholder="Enter 8-digit code"
            disabled={loading}
          />
          {errors.token && (
            <p className="form-error">{errors.token.message}</p>
          )}
        </div>

        <div className="form-input-group">
          <label htmlFor="password" className="form-label">
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              {...register('password')}
              className={`form-input pl-10 ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Enter your new password"
              disabled={loading}
            />
          </div>
          {errors.password && (
            <p className="form-error">{errors.password.message}</p>
          )}
        </div>

        <div className="form-input-group">
          <label htmlFor="password_confirmation" className="form-label">
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password_confirmation"
              type="password"
              {...register('password_confirmation')}
              className={`form-input pl-10 ${errors.password_confirmation ? 'border-red-500' : ''}`}
              placeholder="Confirm your new password"
              disabled={loading}
            />
          </div>
          {errors.password_confirmation && (
            <p className="form-error">{errors.password_confirmation.message}</p>
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
                Resetting...
              </span>
            ) : (
              'Reset Password'
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

export default ResetPasswordPage;
