
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'sonner';
import { setAuthToken, removeAuthToken } from '@/utils/auth';

// Types
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'client' | 'host' | 'admin';
  first_name?: string;
  last_name?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  tempUserId: number | null; // Used for verification steps
  requiresVerification: boolean;
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  tempUserId: null,
  requiresVerification: false,
};

const API_URL = 'https://namph.connectnesthub.com/api';

// Async Thunks
export const register = createAsyncThunk(
  'auth/register',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      toast.success('Registration successful! Please check your email for verification.');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      const errorDetails = error.response?.data?.errors || {};
      
      // Show error toast
      toast.error(errorMessage);
      
      // Format error details for field-level errors
      return rejectWithValue({ message: errorMessage, details: errorDetails });
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email_or_username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      
      // Handle special case for admin/host that requires verification
      if (response.data.data?.requires_verification) {
        toast.info('Please check your email for a verification code.');
        return { 
          requiresVerification: true, 
          userId: response.data.data.user_id 
        };
      }
      
      // Regular login success case
      const { token } = response.data.data.authorization;
      setAuthToken(token);
      toast.success('Login successful!');
      return { 
        user: response.data.data.user,
        requiresVerification: false 
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const verifyLoginCode = createAsyncThunk(
  'auth/verifyLoginCode',
  async (data: { user_id: number; verification_code: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/verify/login/code`, data);
      const { token } = response.data.data.authorization;
      setAuthToken(token);
      toast.success('Login successful!');
      return response.data.data.user;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Verification failed';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${API_URL}/logout`);
      removeAuthToken();
      toast.success('Logged out successfully');
      return null;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Logout failed';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (data: { email: string; verification_code: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/verify/email`, data);
      toast.success('Email verified successfully!');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Email verification failed';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const resendVerificationCode = createAsyncThunk(
  'auth/resendVerificationCode',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/resend/verificationcode`, { email });
      toast.success('A new verification code has been sent to your email');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to resend verification code';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/request/password/reset/verification`, { email });
      toast.success('Password reset instructions sent to your email');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to request password reset';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const verifyPasswordResetCode = createAsyncThunk(
  'auth/verifyPasswordResetCode',
  async (data: { email: string; verification_code: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/verify/password/reset/code`, data);
      toast.success('Verification successful!');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Verification failed';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: { token: string; password: string; password_confirmation: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/reset/password`, data);
      toast.success('Password reset successfully!');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    restoreAuth: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action: any) => {
      state.loading = false;
      
      if (action.payload.requiresVerification) {
        state.requiresVerification = true;
        state.tempUserId = action.payload.userId;
      } else {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.requiresVerification = false;
      }
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Verify Login Code
    builder.addCase(verifyLoginCode.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyLoginCode.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.requiresVerification = false;
      state.tempUserId = null;
    });
    builder.addCase(verifyLoginCode.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.requiresVerification = false;
      state.tempUserId = null;
    });
    builder.addCase(logout.rejected, (state) => {
      state.loading = false;
      // Logout anyway even if the API call fails
      state.isAuthenticated = false;
      state.user = null;
    });

    // Email Verification
    builder.addCase(verifyEmail.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyEmail.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(verifyEmail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearAuthError, restoreAuth } = authSlice.actions;
export default authSlice.reducer;
