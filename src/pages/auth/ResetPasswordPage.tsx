import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { resetPassword } from '@/store/slices/authSlice';
import { ResetPasswordFormData } from '@/types/forms';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const ResetPasswordPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  const schema = yup.object({
    token: yup.string().required('Token is required'),
    password: yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
      .matches(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
      .matches(/(?=.*[0-9])/, 'Password must contain at least one number')
      .matches(/(?=.*[!@#$%^&*])/, 'Password must contain at least one special character'),
    password_confirmation: yup.string()
      .required('Password confirmation is required')
      .oneOf([yup.ref('password')], 'Passwords must match'),
  }).required();

  const form = useForm<ResetPasswordFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      token: token,
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsSubmitting(true);
    try {
      // Replace with actual API endpoint
      await dispatch(resetPassword(data));
      
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
      setIsSubmitting(false);
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
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="form-input-group">
          <label htmlFor="token" className="form-label">
            Verification Code
          </label>
          <input
            id="token"
            type="text"
            {...form.register('token')}
            className={`form-input ${form.errors.token ? 'border-red-500' : ''}`}
            placeholder="Enter 8-digit code"
            disabled={isSubmitting}
          />
          {form.errors.token && (
            <p className="form-error">{form.errors.token.message}</p>
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
              {...form.register('password')}
              className={`form-input pl-10 ${form.errors.password ? 'border-red-500' : ''}`}
              placeholder="Enter your new password"
              disabled={isSubmitting}
            />
          </div>
          {form.errors.password && (
            <p className="form-error">{form.errors.password.message}</p>
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
              {...form.register('password_confirmation')}
              className={`form-input pl-10 ${form.errors.password_confirmation ? 'border-red-500' : ''}`}
              placeholder="Confirm your new password"
              disabled={isSubmitting}
            />
          </div>
          {form.errors.password_confirmation && (
            <p className="form-error">{form.errors.password_confirmation.message}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="w-full btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
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
