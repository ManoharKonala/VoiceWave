import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../app/store';

interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  followers: string[];
  following: string[];
  followerCount?: number;
  followingCount?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: 'idle',
  error: null,
};

// Async thunks
export const register = createAsyncThunk(
  'auth/register',
  async (
    { username, email, password }: { username: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/auth/register',
        { username, email, password },
        config
      );

      localStorage.setItem('token', data.token);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.errors?.[0]?.msg || 'Registration failed'
      );
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/auth/login',
        { email, password },
        config
      );

      localStorage.setItem('token', data.token);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.errors?.[0]?.msg || 'Login failed'
      );
    }
  }
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.token;

      if (!token) {
        return rejectWithValue('No token found');
      }

      const config = {
        headers: {
          'x-auth-token': token,
        },
      };

      const { data } = await axios.get('/api/auth/me', config);
      return data;
    } catch (error: any) {
      localStorage.removeItem('token');
      return rejectWithValue('Authentication failed');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (
    { username, bio }: { username?: string; bio?: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const token = (getState() as RootState).auth.token;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      };

      const { data } = await axios.put(
        '/api/auth/update-profile',
        { username, bio },
        config
      );

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.errors?.[0]?.msg || 'Update failed'
      );
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  'auth/uploadAvatar',
  async (file: File, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.token;
      const formData = new FormData();
      formData.append('avatar', file);

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token,
        },
      };

      const { data } = await axios.put(
        '/api/auth/upload-avatar',
        formData,
        config
      );

      return data.avatar;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Avatar upload failed'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = 'idle';
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(register.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(register.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.loading = 'succeeded';
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = 'failed';
      state.error = action.payload as string;
    });

    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.loading = 'succeeded';
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = 'failed';
      state.error = action.payload as string;
    });

    // Load User
    builder.addCase(loadUser.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(loadUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.loading = 'succeeded';
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(loadUser.rejected, (state, action) => {
      state.loading = 'failed';
      state.error = action.payload as string;
      state.token = null;
      state.isAuthenticated = false;
    });

    // Update Profile
    builder.addCase(updateProfile.fulfilled, (state, action: PayloadAction<User>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
      state.error = null;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // Upload Avatar
    builder.addCase(uploadAvatar.fulfilled, (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.avatar = action.payload;
      }
      state.error = null;
    });
    builder.addCase(uploadAvatar.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export const { logout, clearError } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
