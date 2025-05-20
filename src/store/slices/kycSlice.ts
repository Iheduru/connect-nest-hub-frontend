
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'sonner';

export interface KycSubmission {
  kyc_status: 'pending' | 'approved' | 'rejected' | 'not_submitted';
  document_type: string;
  rejection_reason: string | null;
  submitted_at: string;
}

export interface KycSubmissionDetails extends KycSubmission {
  user_id: number;
  email: string;
  verified_at: string | null;
}

interface KycState {
  status: KycSubmission | null;
  adminSubmissions: KycSubmissionDetails[];
  loading: boolean;
  error: string | null;
}

const initialState: KycState = {
  status: null,
  adminSubmissions: [],
  loading: false,
  error: null,
};

const API_URL = 'https://namph.connectnesthub.com/api';

// Async Thunks
export const submitKyc = createAsyncThunk(
  'kyc/submitKyc',
  async (data: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/kyc/submit`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('KYC document submitted successfully');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to submit KYC document';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const resubmitKyc = createAsyncThunk(
  'kyc/resubmitKyc',
  async (data: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/kyc/resubmit`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('KYC document resubmitted successfully');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to resubmit KYC document';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const getKycStatus = createAsyncThunk(
  'kyc/getKycStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/kyc/status`);
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch KYC status';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Admin Thunks
export const getKycSubmissions = createAsyncThunk(
  'kyc/getKycSubmissions',
  async (status?: string, { rejectWithValue }) => {
    try {
      const url = status ? `${API_URL}/admin/kyc/list?status=${status}` : `${API_URL}/admin/kyc/list`;
      const response = await axios.get(url);
      return response.data.data.submissions;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch KYC submissions';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const verifyKyc = createAsyncThunk(
  'kyc/verifyKyc',
  async ({ userId, status, rejectionReason }: { userId: number; status: string; rejectionReason?: string }, { rejectWithValue }) => {
    try {
      const data = status === 'rejected' ? { status, rejection_reason: rejectionReason } : { status };
      const response = await axios.patch(`${API_URL}/admin/kyc/${userId}`, data);
      toast.success(`KYC ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
      return { userId, ...response.data.data };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update KYC status';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const getKycDocument = createAsyncThunk(
  'kyc/getKycDocument',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/admin/kyc/document/${userId}`);
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch KYC document';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// KYC Slice
const kycSlice = createSlice({
  name: 'kyc',
  initialState,
  reducers: {
    clearKycError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Submit KYC
    builder.addCase(submitKyc.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(submitKyc.fulfilled, (state) => {
      state.loading = false;
      if (!state.status) state.status = { 
        kyc_status: 'pending', 
        document_type: 'submitted',
        rejection_reason: null,
        submitted_at: new Date().toISOString()
      };
      else state.status.kyc_status = 'pending';
    });
    builder.addCase(submitKyc.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Resubmit KYC
    builder.addCase(resubmitKyc.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(resubmitKyc.fulfilled, (state) => {
      state.loading = false;
      if (state.status) {
        state.status.kyc_status = 'pending';
        state.status.rejection_reason = null;
        state.status.submitted_at = new Date().toISOString();
      }
    });
    builder.addCase(resubmitKyc.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get KYC Status
    builder.addCase(getKycStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getKycStatus.fulfilled, (state, action) => {
      state.loading = false;
      state.status = action.payload;
    });
    builder.addCase(getKycStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Admin: Get KYC Submissions
    builder.addCase(getKycSubmissions.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getKycSubmissions.fulfilled, (state, action) => {
      state.loading = false;
      state.adminSubmissions = action.payload;
    });
    builder.addCase(getKycSubmissions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Admin: Verify KYC
    builder.addCase(verifyKyc.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyKyc.fulfilled, (state, action) => {
      state.loading = false;
      const { userId, ...rest } = action.payload;
      
      state.adminSubmissions = state.adminSubmissions.map(submission => 
        submission.user_id === userId ? { ...submission, ...rest } : submission
      );
    });
    builder.addCase(verifyKyc.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearKycError } = kycSlice.actions;
export default kycSlice.reducer;
