
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/utils/axios";
import { User } from "@/types/user";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  accessToken: localStorage.getItem('accessToken'),
};

// Register user
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post('/register', userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      );
    }
  }
);

// Verify email
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (verificationData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post('/verify/email', verificationData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Email verification failed'
      );
    }
  }
);

// Login user
export const loginUser = createAsyncThunk(
  'auth/login',
  async (loginData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post('/login', loginData);
      
      // Check if the response indicates the need for a verification code
      if (response.data.data?.requires_verification) {
        return {
          requires_verification: true,
          user_id: response.data.data.user_id
        };
      }
      
      // Regular login success
      if (response.data.data?.authorization?.token) {
        localStorage.setItem('accessToken', response.data.data.authorization.token);
        return {
          user: response.data.data.user,
          token: response.data.data.authorization.token
        };
      }
      
      return rejectWithValue('Invalid response from server');
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

// Verify login code (for admin/host two-factor)
export const verifyLoginCode = createAsyncThunk(
  'auth/verifyLoginCode',
  async (verificationData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post('/verify/login/code', verificationData);
      
      if (response.data.data?.authorization?.token) {
        localStorage.setItem('accessToken', response.data.data.authorization.token);
        return {
          user: response.data.data.user,
          token: response.data.data.authorization.token
        };
      }
      
      return rejectWithValue('Invalid response from server');
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Verification failed'
      );
    }
  }
);

// Logout user
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Only make the API call if we have a token
      if (localStorage.getItem('accessToken')) {
        await axios.post('/logout');
      }
      localStorage.removeItem('accessToken');
      return null;
    } catch (error: any) {
      // Even if the API call fails, we'll still remove the token and log the user out
      localStorage.removeItem('accessToken');
      return rejectWithValue(
        error.response?.data?.message || 'Logout failed'
      );
    }
  }
);

// Forgot password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post('/request/password/reset/verification', { email });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Password reset request failed'
      );
    }
  }
);

// Verify reset code
export const verifyResetCode = createAsyncThunk(
  'auth/verifyResetCode',
  async (data: { email: string, verification_code: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/verify/password/reset/code', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Code verification failed'
      );
    }
  }
);

// Reset password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: { token: string, password: string, password_confirmation: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/reset/password', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Password reset failed'
      );
    }
  }
);

// Get authenticated user
export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/personal/profile');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get user profile'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('accessToken', action.payload.token);
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
    },
  },
  extraReducers: (builder) => {
    // Register user
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Verify email
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

    // Login user
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      // If login returns a token and user, set them in state
      if (action.payload.user && action.payload.token) {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.token;
      }
      // If requires verification, we don't update authentication state
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload as string;
    });

    // Verify login code
    builder.addCase(verifyLoginCode.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyLoginCode.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.user && action.payload.token) {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.token;
      }
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
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(logout.rejected, (state) => {
      // Even if the API call fails, we want to log the user out on the client side
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.loading = false;
    });

    // Get user profile
    builder.addCase(getUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.data) {
        state.user = action.payload.data;
      }
    });
    builder.addCase(getUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      
      // If the API call returns a 401 (Unauthorized), log the user out
      if (axios.isAxiosError(action.payload) && action.payload.response?.status === 401) {
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
      }
    });
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
