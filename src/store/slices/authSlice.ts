
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '@/types/user';
import { toast } from 'sonner';
import { 
  LoginFormData, 
  RegisterFormData, 
  VerifyEmailFormData, 
  ForgotPasswordFormData, 
  ResetPasswordFormData, 
  VerifyLoginCodeFormData 
} from '@/types/forms';
import { axiosInstance } from '@/utils/axios';
import { setAuthToken, removeAuthToken } from '@/utils/auth';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
  requiresVerification: boolean;
  tempUserId: number | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  error: null,
  requiresVerification: false,
  tempUserId: null,
};

// Check username availability
export const checkUsernameAvailability = createAsyncThunk(
  'auth/checkUsername',
  async (usernames: string[], { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/check/username', { usernames });
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          toast.error(`Too many requests. Please try again in ${error.response.data.retry_after} seconds.`);
        }
        return rejectWithValue(error.response?.data?.message || 'Failed to check username availability');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Check email availability
export const checkEmailAvailability = createAsyncThunk(
  'auth/checkEmail',
  async (emails: string[], { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/check/email', { emails });
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          toast.error(`Too many requests. Please try again in ${error.response.data.retry_after} seconds.`);
        }
        return rejectWithValue(error.response?.data?.message || 'Failed to check email availability');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Auth Async Thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginFormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/login', credentials);
      
      // Check if admin/host needs verification
      if (response.data.data?.requires_verification) {
        return {
          requiresVerification: true,
          userId: response.data.data.user_id
        };
      }
      
      // Regular login success
      if (response.data.data?.authorization?.token) {
        setAuthToken(response.data.data.authorization.token);
      }
      
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Login failed');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterFormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/register', userData);
      toast.success('Registration successful. Please check your email for verification.');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Registration failed');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (verificationData: VerifyEmailFormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/verify/email', verificationData);
      toast.success('Email verified successfully. You can now log in.');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Email verification failed');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const resendVerificationCode = createAsyncThunk(
  'auth/resendVerificationCode',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/resend/verificationcode', { email });
      toast.success('A new verification code has been sent to your email.');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to resend verification code');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (emailData: ForgotPasswordFormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/request/password/reset/verification', emailData);
      toast.success('A verification code has been sent to your email.');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to process forgot password request');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const verifyPasswordResetCode = createAsyncThunk(
  'auth/verifyPasswordResetCode',
  async ({ email, verification_code }: { email: string, verification_code: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/verify/password/reset/code', { 
        email, 
        verification_code 
      });
      return response.data.reset_token;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to verify reset code');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (resetData: ResetPasswordFormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/reset/password', resetData);
      toast.success('Password reset successfully. You can now log in with your new password.');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const verifyLoginCode = createAsyncThunk(
  'auth/verifyLoginCode',
  async (verificationData: VerifyLoginCodeFormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/verify/login/code', verificationData);
      
      // Set token if auth is successful
      if (response.data.data?.authorization?.token) {
        setAuthToken(response.data.data.authorization.token);
      }
      
      return response.data.data.user;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Login code verification failed');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const resendLoginCode = createAsyncThunk(
  'auth/resendLoginCode',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/resend/login/code', { user_id: userId });
      toast.success('A new verification code has been sent to your email.');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to resend login code');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ current_password, new_password, new_password_confirmation }: {
    current_password: string,
    new_password: string,
    new_password_confirmation: string
  }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/change-password', {
        current_password,
        new_password,
        new_password_confirmation
      });
      toast.success('Password changed successfully.');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to change password');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/logout');
      removeAuthToken();
      toast.success('Logged out successfully.');
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Still remove the token even if API call fails
        removeAuthToken();
        return rejectWithValue(error.response?.data?.message || 'Logout failed');
      }
      removeAuthToken();
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.requiresVerification = false;
      state.tempUserId = null;
    },
  },
  extraReducers: (builder) => {
    // Username/Email Availability
    builder.addCase(checkUsernameAvailability.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(checkUsernameAvailability.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(checkUsernameAvailability.rejected, (state) => {
      state.isLoading = false;
    });
    
    builder.addCase(checkEmailAvailability.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(checkEmailAvailability.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(checkEmailAvailability.rejected, (state) => {
      state.isLoading = false;
    });

    // Login reducers
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      
      // Handle admin/host two-factor authentication
      if (action.payload?.requiresVerification) {
        state.requiresVerification = true;
        state.tempUserId = action.payload.userId;
        return;
      }
      
      // Regular login
      if (action.payload?.user) {
        state.isAuthenticated = true;
        state.user = action.payload.user;
      }
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Register reducers
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Verify email reducers
    builder.addCase(verifyEmail.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(verifyEmail.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(verifyEmail.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Resend verification code reducers
    builder.addCase(resendVerificationCode.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(resendVerificationCode.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(resendVerificationCode.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Forgot password and verification reducers
    builder.addCase(forgotPassword.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(forgotPassword.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    builder.addCase(verifyPasswordResetCode.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(verifyPasswordResetCode.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(verifyPasswordResetCode.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Reset password reducers
    builder.addCase(resetPassword.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Verify login code reducers
    builder.addCase(verifyLoginCode.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(verifyLoginCode.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.requiresVerification = false;
      state.tempUserId = null;
    });
    builder.addCase(verifyLoginCode.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Resend login code reducers
    builder.addCase(resendLoginCode.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(resendLoginCode.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(resendLoginCode.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Change password reducers
    builder.addCase(changePassword.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(changePassword.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Logout reducers
    builder.addCase(logout.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.requiresVerification = false;
      state.tempUserId = null;
    });
  },
});

export const { clearErrors, setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
