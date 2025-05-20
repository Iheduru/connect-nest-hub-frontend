
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerSchema } from '@/utils/validation';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerUser } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

type RegisterFormData = {
  username: string;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  password: string;
  password_confirmation: string;
  role: 'client' | 'host' | 'admin';
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      role: 'client',
    },
  });

  const username = watch('username');
  const email = watch('email');

  // Check username availability
  const checkUsername = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    
    try {
      setCheckingUsername(true);
      const response = await axios.post('https://namph.connectnesthub.com/api/check/username', {
        usernames: [username],
      });
      
      setUsernameAvailable(response.data.data.available.includes(username));
      setCheckingUsername(false);
    } catch (error) {
      setUsernameAvailable(null);
      setCheckingUsername(false);
    }
  };

  // Check email availability
  const checkEmail = async (email: string) => {
    if (!email || !email.includes('@')) {
      setEmailAvailable(null);
      return;
    }
    
    try {
      setCheckingEmail(true);
      const response = await axios.post('https://namph.connectnesthub.com/api/check/email', {
        emails: [email],
      });
      
      setEmailAvailable(response.data.data.available.includes(email));
      setCheckingEmail(false);
    } catch (error) {
      setEmailAvailable(null);
      setCheckingEmail(false);
    }
  };

  // Debounced version of check functions
  const debouncedCheckUsername = (username: string) => {
    if (usernameTimeout) clearTimeout(usernameTimeout);
    usernameTimeout = setTimeout(() => checkUsername(username), 500);
  };

  const debouncedCheckEmail = (email: string) => {
    if (emailTimeout) clearTimeout(emailTimeout);
    emailTimeout = setTimeout(() => checkEmail(email), 500);
  };

  // Set up timeouts for debounce
  let usernameTimeout: ReturnType<typeof setTimeout>;
  let emailTimeout: ReturnType<typeof setTimeout>;

  // Handle username change
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedCheckUsername(value);
  };

  // Handle email change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    debouncedCheckEmail(value);
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await dispatch(registerUser(data)).unwrap();
      // If successful, navigate to verify email page with email in state
      navigate('/verify-email', { state: { email: data.email } });
    } catch (error: any) {
      // The toast is already shown in the async thunk
      console.error('Registration error:', error);
    }
  };

  return (
    <div>
      <h2 className="text-center text-xl font-bold text-gray-900 mb-6">
        Create your account
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Username field */}
        <div className="form-input-group">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <div className="relative">
            <input
              id="username"
              type="text"
              {...register('username')}
              onChange={(e) => {
                register('username').onChange(e);
                handleUsernameChange(e);
              }}
              className={`form-input pr-10 ${errors.username ? 'border-red-500' : ''}`}
              placeholder="Enter your username"
              disabled={loading}
            />
            {checkingUsername ? (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="h-4 w-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
              </span>
            ) : (
              usernameAvailable !== null && (
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {usernameAvailable ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </span>
              )
            )}
          </div>
          {errors.username && (
            <p className="form-error">{errors.username.message}</p>
          )}
          {!errors.username && !usernameAvailable && usernameAvailable !== null && (
            <p className="form-error">Username is already taken</p>
          )}
        </div>

        {/* Email field */}
        <div className="form-input-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              {...register('email')}
              onChange={(e) => {
                register('email').onChange(e);
                handleEmailChange(e);
              }}
              className={`form-input pr-10 ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Enter your email"
              disabled={loading}
            />
            {checkingEmail ? (
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="h-4 w-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
              </span>
            ) : (
              emailAvailable !== null && (
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {emailAvailable ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </span>
              )
            )}
          </div>
          {errors.email && (
            <p className="form-error">{errors.email.message}</p>
          )}
          {!errors.email && !emailAvailable && emailAvailable !== null && (
            <p className="form-error">Email is already registered</p>
          )}
        </div>

        {/* First Name field */}
        <div className="form-input-group">
          <label htmlFor="first_name" className="form-label">
            First Name
          </label>
          <input
            id="first_name"
            type="text"
            {...register('first_name')}
            className={`form-input ${errors.first_name ? 'border-red-500' : ''}`}
            placeholder="Enter your first name"
            disabled={loading}
          />
          {errors.first_name && (
            <p className="form-error">{errors.first_name.message}</p>
          )}
        </div>

        {/* Middle Name field */}
        <div className="form-input-group">
          <label htmlFor="middle_name" className="form-label">
            Middle Name (Optional)
          </label>
          <input
            id="middle_name"
            type="text"
            {...register('middle_name')}
            className={`form-input ${errors.middle_name ? 'border-red-500' : ''}`}
            placeholder="Enter your middle name"
            disabled={loading}
          />
          {errors.middle_name && (
            <p className="form-error">{errors.middle_name.message}</p>
          )}
        </div>

        {/* Last Name field */}
        <div className="form-input-group">
          <label htmlFor="last_name" className="form-label">
            Last Name
          </label>
          <input
            id="last_name"
            type="text"
            {...register('last_name')}
            className={`form-input ${errors.last_name ? 'border-red-500' : ''}`}
            placeholder="Enter your last name"
            disabled={loading}
          />
          {errors.last_name && (
            <p className="form-error">{errors.last_name.message}</p>
          )}
        </div>

        {/* Password field */}
        <div className="form-input-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className={`form-input ${errors.password ? 'border-red-500' : ''}`}
            placeholder="Enter your password"
            disabled={loading}
          />
          {errors.password && (
            <p className="form-error">{errors.password.message}</p>
          )}
        </div>

        {/* Password Confirmation field */}
        <div className="form-input-group">
          <label htmlFor="password_confirmation" className="form-label">
            Confirm Password
          </label>
          <input
            id="password_confirmation"
            type="password"
            {...register('password_confirmation')}
            className={`form-input ${errors.password_confirmation ? 'border-red-500' : ''}`}
            placeholder="Confirm your password"
            disabled={loading}
          />
          {errors.password_confirmation && (
            <p className="form-error">{errors.password_confirmation.message}</p>
          )}
        </div>

        {/* Role selection */}
        <div className="form-input-group">
          <label htmlFor="role" className="form-label">
            Account Type
          </label>
          <select
            id="role"
            {...register('role')}
            className={`form-input ${errors.role ? 'border-red-500' : ''}`}
            disabled={loading}
          >
            <option value="client">Client</option>
            <option value="host">Host</option>
          </select>
          {errors.role && (
            <p className="form-error">{errors.role.message}</p>
          )}
        </div>

        {/* Submit button */}
        <div>
          <button
            type="submit"
            className="w-full btn-primary"
            disabled={loading || checkingEmail || checkingUsername}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-primary font-medium hover:text-brand-primary/80">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
