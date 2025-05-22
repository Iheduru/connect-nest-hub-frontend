
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '@/utils/axios';
import { toast } from 'sonner';

interface KycState {
  status: 'pending' | 'approved' | 'rejected' | 'not_submitted';
  documentType: string | null;
  submittedAt: string | null;
  rejectionReason: string | null;
  loading: boolean;
  error: string | null;
  submissions: any[];
  pagination: {
    current_page: number;
    total_pages: number;
    total: number;
    per_page: number;
  } | null;
}

export interface SubmitKycData {
  kyc_document: File;
  document_type: string;
}

export interface KycVerificationPayload {
  user_id: number;
  status: 'approved' | 'rejected';
  rejection_reason?: string;
}

const initialState: KycState = {
  status: 'not_submitted',
  documentType: null,
  submittedAt: null,
  rejectionReason: null,
  loading: false,
  error: null,
  submissions: [],
  pagination: null
};

// Get KYC Status
export const getKycStatus = createAsyncThunk(
  'kyc/status',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/kyc/status');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to get KYC status';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Submit KYC
export const submitKyc = createAsyncThunk(
  'kyc/submit',
  async (data: SubmitKycData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('kyc_document', data.kyc_document);
      formData.append('document_type', data.document_type);
      
      const response = await axios.post('/kyc/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('KYC submitted successfully');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to submit KYC';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Resubmit KYC
export const resubmitKyc = createAsyncThunk(
  'kyc/resubmit',
  async (data: SubmitKycData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('kyc_document', data.kyc_document);
      formData.append('document_type', data.document_type);
      
      const response = await axios.post('/kyc/resubmit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('KYC resubmitted successfully');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to resubmit KYC';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Admin: List KYC submissions
export const listKycSubmissions = createAsyncThunk(
  'kyc/listSubmissions',
  async (params: { status?: string; per_page?: number; page?: number } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.status) queryParams.append('status', params.status);
      if (params.per_page) queryParams.append('per_page', String(params.per_page));
      if (params.page) queryParams.append('page', String(params.page));
      
      const response = await axios.get(`/admin/kyc/list?${queryParams.toString()}`);
      
      return {
        submissions: response.data.data.submissions,
        pagination: response.data.data.pagination
      };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to list KYC submissions';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Admin: Get KYC document
export const getKycDocument = createAsyncThunk(
  'kyc/getDocument',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/admin/kyc/document/${userId}`);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to get KYC document';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Admin: Verify or reject KYC
export const verifyKyc = createAsyncThunk(
  'kyc/verify',
  async ({ user_id, status, rejection_reason }: KycVerificationPayload, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/admin/kyc/${user_id}`, {
        status,
        rejection_reason,
      });
      
      toast.success(`KYC ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to verify KYC';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const kycSlice = createSlice({
  name: 'kyc',
  initialState,
  reducers: {
    resetKyc: () => initialState,
    clearKycError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get KYC Status
      .addCase(getKycStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getKycStatus.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.status = action.payload.kyc_status;
        state.documentType = action.payload.document_type;
        state.submittedAt = action.payload.submitted_at;
        state.rejectionReason = action.payload.rejection_reason;
      })
      .addCase(getKycStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Submit KYC
      .addCase(submitKyc.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitKyc.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.status = 'pending';
        state.documentType = action.payload.document_type;
        state.submittedAt = action.payload.submitted_at;
      })
      .addCase(submitKyc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Resubmit KYC
      .addCase(resubmitKyc.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resubmitKyc.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.status = 'pending';
        state.documentType = action.payload.document_type;
        state.submittedAt = action.payload.submitted_at;
        state.rejectionReason = null;
      })
      .addCase(resubmitKyc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Admin: List KYC submissions
      .addCase(listKycSubmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(listKycSubmissions.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.submissions = action.payload.submissions;
        state.pagination = action.payload.pagination;
      })
      .addCase(listKycSubmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Admin: Get KYC document
      .addCase(getKycDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getKycDocument.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getKycDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Admin: Verify KYC
      .addCase(verifyKyc.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyKyc.fulfilled, (state) => {
        state.loading = false;
        // The submissions list will need to be refreshed from the server
        // after a verification action
      })
      .addCase(verifyKyc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetKyc, clearKycError } = kycSlice.actions;

export default kycSlice.reducer;
