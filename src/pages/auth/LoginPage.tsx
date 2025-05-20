
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '@/utils/validation';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store';
import { User, Lock } from 'lucide-react';

type LoginFormData = {
  email_or_username: string;
  password: string;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated, requiresVerification, tempUserId } = useSelector(
    (state: RootState) => state.auth
  );

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else if (requiresVerification && tempUserId) {
      navigate('/verify-login-code', { state: { userId: tempUserId } });
    }
  }, [isAuthenticated, requiresVerification, tempUserId, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await dispatch(login(data)).unwrap();
      // No need to navigate here, the useEffect will handle it
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div>
      <h2 className="text-center text-xl font-bold text-gray-900 mb-6">
        Log in to your account
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="form-input-group">
          <label htmlFor="email_or_username" className="form-label">
            Email or Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email_or_username"
              type="text"
              {...register('email_or_username')}
              className={`form-input pl-10 ${errors.email_or_username ? 'border-red-500' : ''}`}
              placeholder="Enter your email or username"
              disabled={loading}
            />
          </div>
          {errors.email_or_username && (
            <p className="form-error">{errors.email_or_username.message}</p>
          )}
        </div>

        <div className="form-input-group">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-brand-primary hover:text-brand-primary/80"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              {...register('password')}
              className={`form-input pl-10 ${errors.password ? 'border-red-500' : ''}`}
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>
          {errors.password && (
            <p className="form-error">{errors.password.message}</p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <button
            type="submit"
            className="w-full btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Logging in...
              </span>
            ) : (
              'Log in'
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-primary font-medium hover:text-brand-primary/80">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
