
import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
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
import { Lock } from 'lucide-react';

const ResetPasswordPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  
  const token = searchParams.get('token') || '';
  
  if (!token) {
    navigate('/forgot-password');
    return null;
  }

  const schema = yup.object().shape({
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
  });

  const form = useForm<ResetPasswordFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      token: token,
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      await dispatch(resetPassword(data) as any);
      toast({
        title: 'Password reset successful',
        description: 'Your password has been reset successfully. You can now login with your new password.',
      });
      navigate('/login');
    } catch (error: any) {
      setServerError('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="text-muted-foreground mt-2">Create a new password</p>
      </div>

      {serverError && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-center">
          {serverError}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type="password" 
                      placeholder="Enter your new password" 
                      {...field}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400">
                      <Lock size={16} />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type="password" 
                      placeholder="Confirm your new password" 
                      {...field}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400">
                      <Lock size={16} />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>

          <div className="text-center mt-4">
            <Link to="/login" className="text-sm text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordPage;
