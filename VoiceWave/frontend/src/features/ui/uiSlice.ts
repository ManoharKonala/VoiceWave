import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  isDrawerOpen: boolean;
  isAudioPlayerOpen: boolean;
  isUploadModalOpen: boolean;
  isLoginModalOpen: boolean;
  isRegisterModalOpen: boolean;
  isProfileMenuOpen: boolean;
  isMobileMenuOpen: boolean;
  themeMode: 'light' | 'dark';
  snackbar: {
    open: boolean;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
  };
  audioPlayer: {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    isMuted: boolean;
    isLooping: boolean;
    currentAudioId: string | null;
    playlist: string[];
  };
}

const initialState: UIState = {
  isDrawerOpen: false,
  isAudioPlayerOpen: false,
  isUploadModalOpen: false,
  isLoginModalOpen: false,
  isRegisterModalOpen: false,
  isProfileMenuOpen: false,
  isMobileMenuOpen: false,
  themeMode: (localStorage.getItem('themeMode') as 'light' | 'dark') || 'light',
  snackbar: {
    open: false,
    message: '',
    severity: 'info',
  },
  audioPlayer: {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    isMuted: false,
    isLooping: false,
    currentAudioId: null,
    playlist: [],
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    openDrawer: (state) => {
      state.isDrawerOpen = true;
    },
    closeDrawer: (state) => {
      state.isDrawerOpen = false;
    },
    toggleAudioPlayer: (state) => {
      state.isAudioPlayerOpen = !state.isAudioPlayerOpen;
    },
    openAudioPlayer: (state) => {
      state.isAudioPlayerOpen = true;
    },
    closeAudioPlayer: (state) => {
      state.isAudioPlayerOpen = false;
    },
    openUploadModal: (state) => {
      state.isUploadModalOpen = true;
    },
    closeUploadModal: (state) => {
      state.isUploadModalOpen = false;
    },
    openLoginModal: (state) => {
      state.isLoginModalOpen = true;
      state.isRegisterModalOpen = false;
    },
    closeLoginModal: (state) => {
      state.isLoginModalOpen = false;
    },
    openRegisterModal: (state) => {
      state.isRegisterModalOpen = true;
      state.isLoginModalOpen = false;
    },
    closeRegisterModal: (state) => {
      state.isRegisterModalOpen = false;
    },
    toggleProfileMenu: (state) => {
      state.isProfileMenuOpen = !state.isProfileMenuOpen;
    },
    closeProfileMenu: (state) => {
      state.isProfileMenuOpen = false;
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false;
    },
    toggleTheme: (state) => {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', state.themeMode);
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.themeMode = action.payload;
      localStorage.setItem('themeMode', action.payload);
    },
    showSnackbar: (
      state,
      action: PayloadAction<{
        message: string;
        severity?: 'success' | 'info' | 'warning' | 'error';
      }>
    ) => {
      state.snackbar = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity || 'info',
      };
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false;
    },
    // Audio Player Actions
    playAudio: (state, action: PayloadAction<string>) => {
      state.audioPlayer.isPlaying = true;
      state.audioPlayer.currentAudioId = action.payload;
      state.isAudioPlayerOpen = true;
      
      // Add to playlist if not already in it
      if (!state.audioPlayer.playlist.includes(action.payload)) {
        state.audioPlayer.playlist = [...state.audioPlayer.playlist, action.payload];
      }
    },
    pauseAudio: (state) => {
      state.audioPlayer.isPlaying = false;
    },
    togglePlayPause: (state) => {
      state.audioPlayer.isPlaying = !state.audioPlayer.isPlaying;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.audioPlayer.currentTime = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.audioPlayer.duration = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.audioPlayer.volume = action.payload;
      if (action.payload === 0) {
        state.audioPlayer.isMuted = true;
      } else {
        state.audioPlayer.isMuted = false;
      }
    },
    toggleMute: (state) => {
      state.audioPlayer.isMuted = !state.audioPlayer.isMuted;
    },
    toggleLoop: (state) => {
      state.audioPlayer.isLooping = !state.audioPlayer.isLooping;
    },
    nextTrack: (state) => {
      if (state.audioPlayer.playlist.length === 0) return;
      
      const currentIndex = state.audioPlayer.playlist.findIndex(
        (id) => id === state.audioPlayer.currentAudioId
      );
      
      if (currentIndex === -1 || currentIndex === state.audioPlayer.playlist.length - 1) {
        state.audioPlayer.currentAudioId = state.audioPlayer.playlist[0];
      } else {
        state.audioPlayer.currentAudioId = state.audioPlayer.playlist[currentIndex + 1];
      }
      
      state.audioPlayer.isPlaying = true;
    },
    prevTrack: (state) => {
      if (state.audioPlayer.playlist.length === 0) return;
      
      const currentIndex = state.audioPlayer.playlist.findIndex(
        (id) => id === state.audioPlayer.currentAudioId
      );
      
      if (currentIndex <= 0) {
        state.audioPlayer.currentAudioId = state.audioPlayer.playlist[state.audioPlayer.playlist.length - 1];
      } else {
        state.audioPlayer.currentAudioId = state.audioPlayer.playlist[currentIndex - 1];
      }
      
      state.audioPlayer.isPlaying = true;
    },
    addToPlaylist: (state, action: PayloadAction<string>) => {
      if (!state.audioPlayer.playlist.includes(action.payload)) {
        state.audioPlayer.playlist.push(action.payload);
      }
    },
    removeFromPlaylist: (state, action: PayloadAction<string>) => {
      state.audioPlayer.playlist = state.audioPlayer.playlist.filter(
        (id) => id !== action.payload
      );
      
      if (state.audioPlayer.currentAudioId === action.payload) {
        if (state.audioPlayer.playlist.length > 0) {
          state.audioPlayer.currentAudioId = state.audioPlayer.playlist[0];
        } else {
          state.audioPlayer.currentAudioId = null;
          state.audioPlayer.isPlaying = false;
        }
      }
    },
    clearPlaylist: (state) => {
      state.audioPlayer.playlist = [];
      state.audioPlayer.currentAudioId = null;
      state.audioPlayer.isPlaying = false;
      state.audioPlayer.currentTime = 0;
    },
  },
});

export const {
  toggleDrawer,
  openDrawer,
  closeDrawer,
  toggleAudioPlayer,
  openAudioPlayer,
  closeAudioPlayer,
  openUploadModal,
  closeUploadModal,
  openLoginModal,
  closeLoginModal,
  openRegisterModal,
  closeRegisterModal,
  toggleProfileMenu,
  closeProfileMenu,
  toggleMobileMenu,
  closeMobileMenu,
  toggleTheme,
  setTheme,
  showSnackbar,
  hideSnackbar,
  playAudio,
  pauseAudio,
  togglePlayPause,
  setCurrentTime,
  setDuration,
  setVolume,
  toggleMute,
  toggleLoop,
  nextTrack,
  prevTrack,
  addToPlaylist,
  removeFromPlaylist,
  clearPlaylist,
} = uiSlice.actions;

export const selectIsDrawerOpen = (state: { ui: UIState }) => state.ui.isDrawerOpen;
export const selectIsAudioPlayerOpen = (state: { ui: UIState }) => state.ui.isAudioPlayerOpen;
export const selectIsUploadModalOpen = (state: { ui: UIState }) => state.ui.isUploadModalOpen;
export const selectIsLoginModalOpen = (state: { ui: UIState }) => state.ui.isLoginModalOpen;
export const selectIsRegisterModalOpen = (state: { ui: UIState }) => state.ui.isRegisterModalOpen;
export const selectIsProfileMenuOpen = (state: { ui: UIState }) => state.ui.isProfileMenuOpen;
export const selectIsMobileMenuOpen = (state: { ui: UIState }) => state.ui.isMobileMenuOpen;
export const selectThemeMode = (state: { ui: UIState }) => state.ui.themeMode;
export const selectSnackbar = (state: { ui: UIState }) => state.ui.snackbar;
export const selectAudioPlayer = (state: { ui: UIState }) => state.ui.audioPlayer;

export default uiSlice.reducer;
