
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/store/slices/authSlice';
import { RootState } from '@/store';
import { LoginFormData } from '@/types/forms';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error, requiresVerification, tempUserId } = useSelector((state: RootState) => state.auth);
  const [serverError, setServerError] = useState<string | null>(null);

  const schema = yup.object().shape({
    email_or_username: yup.string().required('Email or username is required'),
    password: yup.string().required('Password is required'),
  });

  const form = useForm<LoginFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      email_or_username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const resultAction = await dispatch(login(data) as any);
      
      if (login.fulfilled.match(resultAction)) {
        if (resultAction.payload?.requiresVerification) {
          navigate('/verify-login-code');
        } else {
          toast({
            title: 'Login successful',
            description: 'Welcome back!',
          });
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setServerError('Login failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Login to Your Account</h1>
        <p className="text-muted-foreground mt-2">Enter your credentials to access your account</p>
      </div>

      {(error || serverError) && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-center">
          {error || serverError}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email_or_username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email or Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email or username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot Password?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>

          <div className="text-center mt-4">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginPage;
