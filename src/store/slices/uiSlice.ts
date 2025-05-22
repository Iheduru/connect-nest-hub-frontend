
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isDarkMode: boolean;
  isSidebarOpen: boolean;
  isLoading: boolean;
  animationsEnabled: boolean;
  reducedMotion: boolean;
}

const initialState: UiState = {
  isDarkMode: false,
  isSidebarOpen: true,
  isLoading: false,
  animationsEnabled: true,
  reducedMotion: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    toggleAnimations: (state) => {
      state.animationsEnabled = !state.animationsEnabled;
    },
    setReducedMotion: (state, action: PayloadAction<boolean>) => {
      state.reducedMotion = action.payload;
    },
  },
});

export const { 
  toggleDarkMode, 
  toggleSidebar, 
  setSidebarOpen, 
  setLoading,
  toggleAnimations,
  setReducedMotion
} = uiSlice.actions;

export default uiSlice.reducer;
