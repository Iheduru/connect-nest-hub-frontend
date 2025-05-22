
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Profile } from '@/types/user';
import axios from '@/utils/axios';
import { toast } from 'sonner';
import { ProfileFormData } from '@/types/forms';

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  profiles: Profile[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    per_page: number;
  } | null;
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
  profiles: [],
  pagination: null
};

// Get personal profile
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/personal/profile');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

// Get user data
export const fetchUserData = createAsyncThunk(
  'profile/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/register/data');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user data');
    }
  }
);

// Create or update profile
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData: Partial<ProfileFormData>, { rejectWithValue }) => {
    try {
      // Convert FormData if profile picture is included
      let requestData: FormData | Partial<ProfileFormData> = profileData;
      
      if (profileData.profile_picture instanceof File) {
        const formData = new FormData();
        formData.append('profile_picture', profileData.profile_picture);
        
        // Add all other profile fields to FormData
        Object.entries(profileData).forEach(([key, value]) => {
          if (key !== 'profile_picture' && value !== undefined) {
            formData.append(key, value as string);
          }
        });
        
        requestData = formData;
      }
      
      const response = await axios.post('/create/profile', requestData, {
        headers: profileData.profile_picture instanceof File ? {
          'Content-Type': 'multipart/form-data'
        } : undefined
      });
      
      toast.success('Profile updated successfully');
      return response.data.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

// Upload profile picture
export const uploadProfilePicture = createAsyncThunk(
  'profile/uploadProfilePicture',
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('profile_picture', file);
      
      const response = await axios.post('/update/profile/picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success('Profile picture updated successfully');
      return response.data.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload profile picture');
      return rejectWithValue(error.response?.data?.message || 'Failed to upload profile picture');
    }
  }
);

// Delete profile picture
export const deleteProfilePicture = createAsyncThunk(
  'profile/deleteProfilePicture',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete('/delete/profile/picture');
      toast.success('Profile picture deleted successfully');
      return response.data.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete profile picture');
      return rejectWithValue(error.response?.data?.message || 'Failed to delete profile picture');
    }
  }
);

// Delete personal profile
export const deleteProfile = createAsyncThunk(
  'profile/deleteProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete('/delete/personal/profile');
      toast.success('Profile deleted successfully');
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete profile');
      return rejectWithValue(error.response?.data?.message || 'Failed to delete profile');
    }
  }
);

// Regenerate profile slug
export const regenerateProfileSlug = createAsyncThunk(
  'profile/regenerateSlug',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post('/profile/regeneate');
      toast.success('Profile slug regenerated successfully');
      return response.data.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to regenerate profile slug');
      return rejectWithValue(error.response?.data?.message || 'Failed to regenerate profile slug');
    }
  }
);

// Get profile by slug (public)
export const fetchProfileBySlug = createAsyncThunk(
  'profile/fetchBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/profile/${slug}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

// Get all profiles (public)
export const fetchAllProfiles = createAsyncThunk(
  'profile/fetchAll',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/display/all/profiles?page=${page}`);
      return {
        profiles: response.data.data,
        pagination: response.data.pagination
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profiles');
    }
  }
);

// Search profiles (public)
export const searchProfiles = createAsyncThunk(
  'profile/searchProfiles',
  async (params: {
    username?: string,
    account_type?: string,
    city?: string,
    verified_host?: boolean,
    page?: number
  }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.username) queryParams.append('username', params.username);
      if (params.account_type) queryParams.append('account_type', params.account_type);
      if (params.city) queryParams.append('city', params.city);
      if (params.verified_host !== undefined) queryParams.append('verified_host', String(params.verified_host));
      if (params.page) queryParams.append('page', String(params.page));
      
      const response = await axios.get(`/profiles/search?${queryParams.toString()}`);
      
      return {
        profiles: response.data.data,
        pagination: response.data.pagination
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search profiles');
    }
  }
);

// Filter host profiles (public)
export const fetchHostProfiles = createAsyncThunk(
  'profile/fetchHosts',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/profiles/filter/hosts?page=${page}`);
      
      return {
        profiles: response.data.data,
        pagination: response.data.pagination
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch host profiles');
    }
  }
);

// Admin: Update user profile
export const adminUpdateUserProfile = createAsyncThunk(
  'profile/adminUpdateProfile',
  async ({ slug, data }: { slug: string, data: any }, { rejectWithValue }) => {
    try {
      // Handle FormData if profile_picture exists
      let requestData: FormData | any = data;
      
      if (data.profile_picture instanceof File) {
        const formData = new FormData();
        formData.append('profile_picture', data.profile_picture);
        
        // Add all other fields to FormData
        Object.entries(data).forEach(([key, value]) => {
          if (key !== 'profile_picture' && value !== undefined) {
            formData.append(key, value as string);
          }
        });
        
        requestData = formData;
      }
      
      const response = await axios.put(`/profile/update/${slug}`, requestData, {
        headers: data.profile_picture instanceof File ? {
          'Content-Type': 'multipart/form-data'
        } : undefined
      });
      
      toast.success('User profile updated successfully');
      return response.data.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user profile');
      return rejectWithValue(error.response?.data?.message || 'Failed to update user profile');
    }
  }
);

// Admin: Delete user profile
export const adminDeleteUserProfile = createAsyncThunk(
  'profile/adminDeleteProfile',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/delete/user/profile?slug=${slug}`);
      toast.success('User profile deleted successfully');
      return { slug };
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete user profile');
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user profile');
    }
  }
);

// Admin: List user profiles
export const adminListUserProfiles = createAsyncThunk(
  'profile/adminListProfiles',
  async (params: {
    per_page?: number,
    status?: string,
    account_type?: string
  } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.per_page) queryParams.append('per_page', String(params.per_page));
      if (params.status) queryParams.append('status', params.status);
      if (params.account_type) queryParams.append('account_type', params.account_type);
      
      const response = await axios.get(`/list/user/profiles?${queryParams.toString()}`);
      
      return {
        profiles: response.data.data,
        meta: response.data.meta
      };
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to list user profiles');
      return rejectWithValue(error.response?.data?.message || 'Failed to list user profiles');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    resetProfile: (state) => {
      state.profile = null;
      state.error = null;
      state.isLoading = false;
    },
    clearProfiles: (state) => {
      state.profiles = [];
      state.pagination = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch personal profile
    builder.addCase(fetchProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
      state.isLoading = false;
      state.profile = action.payload;
    });
    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Fetch user data
    builder.addCase(fetchUserData.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUserData.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(fetchUserData.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Update profile
    builder.addCase(updateProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
      state.isLoading = false;
      state.profile = action.payload;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Upload profile picture
    builder.addCase(uploadProfilePicture.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(uploadProfilePicture.fulfilled, (state, action: PayloadAction<Profile>) => {
      state.isLoading = false;
      if (state.profile && action.payload.profile_picture) {
        state.profile = {
          ...state.profile,
          profile_picture: action.payload.profile_picture
        };
      }
    });
    builder.addCase(uploadProfilePicture.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Delete profile picture
    builder.addCase(deleteProfilePicture.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteProfilePicture.fulfilled, (state) => {
      state.isLoading = false;
      if (state.profile) {
        state.profile.profile_picture = undefined;
      }
    });
    builder.addCase(deleteProfilePicture.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Delete personal profile
    builder.addCase(deleteProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteProfile.fulfilled, (state) => {
      state.isLoading = false;
      state.profile = null;
    });
    builder.addCase(deleteProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Regenerate profile slug
    builder.addCase(regenerateProfileSlug.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(regenerateProfileSlug.fulfilled, (state, action: PayloadAction<{slug: string}>) => {
      state.isLoading = false;
      if (state.profile) {
        state.profile.slug = action.payload.slug;
      }
    });
    builder.addCase(regenerateProfileSlug.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Fetch profile by slug
    builder.addCase(fetchProfileBySlug.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProfileBySlug.fulfilled, (state, action: PayloadAction<Profile>) => {
      state.isLoading = false;
      state.profiles = [action.payload];
    });
    builder.addCase(fetchProfileBySlug.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Fetch all profiles
    builder.addCase(fetchAllProfiles.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchAllProfiles.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profiles = action.payload.profiles;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(fetchAllProfiles.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Search profiles
    builder.addCase(searchProfiles.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(searchProfiles.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profiles = action.payload.profiles;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(searchProfiles.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Fetch host profiles
    builder.addCase(fetchHostProfiles.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchHostProfiles.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profiles = action.payload.profiles;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(fetchHostProfiles.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Admin: Update user profile
    builder.addCase(adminUpdateUserProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(adminUpdateUserProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
      state.isLoading = false;
      state.profiles = state.profiles.map(profile => 
        profile.id === action.payload.id ? action.payload : profile
      );
    });
    builder.addCase(adminUpdateUserProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Admin: Delete user profile
    builder.addCase(adminDeleteUserProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(adminDeleteUserProfile.fulfilled, (state, action: PayloadAction<{slug: string}>) => {
      state.isLoading = false;
      state.profiles = state.profiles.filter(profile => profile.slug !== action.payload.slug);
    });
    builder.addCase(adminDeleteUserProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    
    // Admin: List user profiles
    builder.addCase(adminListUserProfiles.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(adminListUserProfiles.fulfilled, (state, action) => {
      state.isLoading = false;
      state.profiles = action.payload.profiles;
      state.pagination = {
        current_page: action.payload.meta.current_page,
        per_page: action.payload.meta.per_page,
        total_items: action.payload.meta.total,
        total_pages: Math.ceil(action.payload.meta.total / action.payload.meta.per_page)
      };
    });
    builder.addCase(adminListUserProfiles.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearProfileError, resetProfile, clearProfiles } = profileSlice.actions;
export default profileSlice.reducer;
