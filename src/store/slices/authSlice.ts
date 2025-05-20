import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { User } from '@/types/user';
import { 
  LoginFormData, 
  RegisterFormData, 
  VerifyEmailFormData, 
  ForgotPasswordFormData, 
  ResetPasswordFormData, 
  VerifyLoginCodeFormData 
} from '@/types/forms';
import { axiosInstance } from '@/utils/axios';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
  // Add these for login verification flow
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
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to process forgot password request');
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
      return response.data.data;
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
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to resend login code');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/logout');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Logout failed');
      }
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
    
    // Forgot password reducers
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
    
    // Logout reducers
    builder.addCase(logout.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    });
  },
});

export const { clearErrors, setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
