
import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { verifyEmail, resendVerificationCode } from '@/store/slices/authSlice';
import { VerifyEmailFormData } from '@/types/forms';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const VerifyEmailPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Get email from URL if available
  const emailFromUrl = searchParams.get('email') || '';

  const schema = yup.object().shape({
    email: yup.string().required('Email is required').email('Invalid email format'),
    verification_code: yup.string().required('Verification code is required'),
  });

  const form = useForm<VerifyEmailFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      email: emailFromUrl,
      verification_code: '',
    },
  });

  const onSubmit = async (data: VerifyEmailFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const resultAction = await dispatch(verifyEmail(data) as any);
      if (verifyEmail.fulfilled.match(resultAction)) {
        toast({
          title: 'Email Verified',
          description: 'Your email has been verified successfully.',
        });
        navigate('/login');
      } else {
        setServerError('Failed to verify email. Please check your verification code.');
      }
    } catch (err) {
      setServerError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    const email = form.getValues('email');
    if (!email) {
      form.setError('email', { 
        type: 'manual', 
        message: 'Please enter your email address' 
      });
      return;
    }

    setIsResending(true);
    try {
      const resultAction = await dispatch(resendVerificationCode(email) as any);
      if (resendVerificationCode.fulfilled.match(resultAction)) {
        toast({
          title: 'Verification Code Sent',
          description: 'A new verification code has been sent to your email.',
        });
      } else {
        setServerError('Failed to send verification code. Please try again.');
      }
    } catch (err) {
      setServerError('An unexpected error occurred. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Verify Your Email</h1>
        <p className="text-muted-foreground mt-2">Enter the verification code sent to your email</p>
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    {...field}
                    type="email"
                    disabled={!!emailFromUrl}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="verification_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter verification code"
                    {...field}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              onClick={handleResendCode}
              disabled={isResending}
              className="text-sm"
            >
              {isResending ? 'Sending...' : 'Resend Code'}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Verifying...' : 'Verify Email'}
            </Button>
          </div>

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

export default VerifyEmailPage;
