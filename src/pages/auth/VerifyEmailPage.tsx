import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  const email = searchParams.get('email') || '';
  const [isResending, setIsResending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const schema = yup.object({
    email: yup.string().required('Email is required').email('Invalid email format'),
    verification_code: yup.string()
      .required('Verification code is required')
      .length(8, 'Verification code must be 8 digits')
      .matches(/^[0-9]+$/, 'Verification code must contain only numbers'),
  }).required();

  const form = useForm<VerifyEmailFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: email,
      verification_code: '',
    },
  });

  const onSubmit = async (data: VerifyEmailFormData) => {
    try {
      const resultAction = await dispatch(verifyEmail(data));
      
      if (verifyEmail.fulfilled.match(resultAction)) {
        toast({
          title: 'Email verified',
          description: 'Your email has been successfully verified!',
        });
        navigate('/login');
      }
    } catch (err) {
      setServerError('Email verification failed. Please try again.');
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      await dispatch(resendVerificationCode(email));
      toast({
        title: 'Verification code resent',
        description: 'A new verification code has been sent to your email address.',
      });
    } catch (err) {
      setServerError('Failed to resend verification code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Verify Your Email</h1>
        <p className="text-muted-foreground mt-2">
          Enter the verification code sent to your email address.
        </p>
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} readOnly />
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
                  <Input type="text" placeholder="Enter verification code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            Verify Email
          </Button>

          <div className="text-center mt-4">
            <Button 
              type="button" 
              variant="link" 
              onClick={handleResendCode} 
              disabled={isResending}
            >
              {isResending ? 'Resending...' : 'Resend Code'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default VerifyEmailPage;
