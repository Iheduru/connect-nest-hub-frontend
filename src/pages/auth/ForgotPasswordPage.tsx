
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '@/store/slices/authSlice';
import { ForgotPasswordFormData } from '@/types/forms';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const ForgotPasswordPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const schema = yup.object().shape({
    email: yup.string().required('Email is required').email('Invalid email format'),
  });

  const form = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const resultAction = await dispatch(forgotPassword(data) as any);
      if (forgotPassword.fulfilled.match(resultAction)) {
        toast({
          title: 'Email Sent',
          description: 'Please check your inbox for password reset instructions.',
        });
        setEmailSent(true);
      } else {
        setServerError('Failed to send reset password email. Please try again.');
      }
    } catch (err) {
      setServerError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <p className="text-muted-foreground mt-2">Enter your email to reset your password</p>
      </div>

      {(serverError) && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-center">
          {serverError}
        </div>
      )}

      {emailSent ? (
        <div className="text-center text-green-500 font-semibold">
          Password reset link has been sent to your email address.
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>

            <div className="text-center mt-4">
              <Link to="/login" className="text-sm text-primary hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
