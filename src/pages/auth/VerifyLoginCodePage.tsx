import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { verifyLoginCode, resendLoginCode } from '@/store/slices/authSlice';
import { RootState } from '@/store';
import { VerifyLoginCodeFormData } from '@/types/forms';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const VerifyLoginCodePage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tempUserId, isLoading, error } = useSelector((state: RootState) => state.auth);
  const [isResending, setIsResending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Redirect if no user ID in state
  if (!tempUserId) {
    navigate('/login');
    return null;
  }

  const schema = yup.object({
    user_id: yup.number().required('User ID is required'),
    verification_code: yup.string()
      .required('Verification code is required')
      .length(8, 'Verification code must be 8 digits')
      .matches(/^[0-9]+$/, 'Verification code must contain only numbers'),
  }).required();

  const form = useForm<VerifyLoginCodeFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      user_id: tempUserId,
      verification_code: '',
    },
  });

  const onSubmit = async (data: VerifyLoginCodeFormData) => {
    try {
      const resultAction = await dispatch(verifyLoginCode(data));

      if (verifyLoginCode.fulfilled.match(resultAction)) {
        toast({
          title: 'Login successful',
          description: 'Your login code has been verified.',
        });
        navigate('/dashboard');
      }
    } catch (err) {
      setServerError('Verification failed. Please try again.');
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      if (tempUserId) {
        await dispatch(resendLoginCode(tempUserId));
        toast({
          title: 'Verification code resent',
          description: 'A new verification code has been sent to your email.',
        });
      }
    } catch (err) {
      setServerError('Failed to resend verification code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md animate-fade-in">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Verify Login Code</h1>
        <p className="text-muted-foreground mt-2">
          Enter the 8-digit code sent to your email to complete the login process.
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
            name="verification_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your verification code"
                    {...field}
                    type="number"
                    minLength={8}
                    maxLength={8}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify Code'}
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

export default VerifyLoginCodePage;
