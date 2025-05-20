
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'sonner';

export interface Profile {
  id: number;
  slug: string;
  username: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  profile_picture?: string;
  phone_number?: string;
  alternative_email?: string;
  bio?: string;
  gender?: string;
  dob?: string;
  // Add other profile fields as needed
}

interface ProfileState {
  profile: Profile | null;
  publicProfile: Profile | null;
  profiles: Profile[];
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  publicProfile: null,
  profiles: [],
  loading: false,
  error: null,
};

const API_URL = 'https://namph.connectnesthub.com/api';

// Async Thunks
export const getProfile = createAsyncThunk(
  'profile/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/personal/profile`);
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch profile';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/create/profile`, profileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Profile updated successfully');
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateProfilePicture = createAsyncThunk(
  'profile/updateProfilePicture',
  async (pictureData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/update/profile/picture`, pictureData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Profile picture updated successfully');
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile picture';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteProfilePicture = createAsyncThunk(
  'profile/deleteProfilePicture',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/delete/profile/picture`);
      toast.success('Profile picture deleted successfully');
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete profile picture';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const getPublicProfile = createAsyncThunk(
  'profile/getPublicProfile',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/profile/${slug}`);
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch public profile';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Admin thunks
export const getAllProfiles = createAsyncThunk(
  'profile/getAllProfiles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/list/user/profiles`);
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch profiles';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async ({ slug, profileData }: { slug: string; profileData: any }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/profile/update/${slug}`, profileData);
      toast.success('User profile updated successfully');
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update user profile';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteUserProfile = createAsyncThunk(
  'profile/deleteUserProfile',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/delete/user/profile?slug=${slug}`);
      toast.success('User profile deleted successfully');
      return slug;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete user profile';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Profile Slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    clearProfile: (state) => {
      state.profile = null;
    }
  },
  extraReducers: (builder) => {
    // Get Profile
    builder.addCase(getProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    });
    builder.addCase(getProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Profile
    builder.addCase(updateProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Profile Picture
    builder.addCase(updateProfilePicture.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProfilePicture.fulfilled, (state, action) => {
      state.loading = false;
      if (state.profile) {
        state.profile.profile_picture = action.payload.profile_picture;
      }
    });
    builder.addCase(updateProfilePicture.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete Profile Picture
    builder.addCase(deleteProfilePicture.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteProfilePicture.fulfilled, (state) => {
      state.loading = false;
      if (state.profile) {
        state.profile.profile_picture = undefined;
      }
    });
    builder.addCase(deleteProfilePicture.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get Public Profile
    builder.addCase(getPublicProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getPublicProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.publicProfile = action.payload;
    });
    builder.addCase(getPublicProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Admin: Get All Profiles
    builder.addCase(getAllProfiles.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllProfiles.fulfilled, (state, action) => {
      state.loading = false;
      state.profiles = action.payload;
    });
    builder.addCase(getAllProfiles.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Admin: Update User Profile
    builder.addCase(updateUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profiles = state.profiles.map(profile => 
        profile.id === action.payload.id ? action.payload : profile
      );
    });
    builder.addCase(updateUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Admin: Delete User Profile
    builder.addCase(deleteUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profiles = state.profiles.filter(profile => profile.slug !== action.payload);
    });
    builder.addCase(deleteUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearProfileError, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
