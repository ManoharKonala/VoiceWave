import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../app/store';

interface Comment {
  _id: string;
  user: {
    _id: string;
    username: string;
    avatar: string;
  };
  content: string;
  audioComment?: string;
  audioDuration?: number;
  likes: string[];
  likeCount?: number;
  createdAt: string;
}

interface Audio {
  _id: string;
  user: {
    _id: string;
    username: string;
    avatar: string;
  };
  title: string;
  description: string;
  audioUrl: string;
  duration: number;
  tags: string[];
  likes: string[];
  likeCount?: number;
  comments: Comment[];
  commentCount?: number;
  isPrivate: boolean;
  views: number;
  createdAt: string;
}

interface AudioState {
  audios: Audio[];
  currentAudio: Audio | null;
  trendingAudios: Audio[];
  userAudios: Audio[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalAudios: number;
}

const initialState: AudioState = {
  audios: [],
  currentAudio: null,
  trendingAudios: [],
  userAudios: [],
  loading: 'idle',
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalAudios: 0,
};

// Async thunks
export const fetchAudios = createAsyncThunk(
  'audio/fetchAudios',
  async (
    { page = 1, limit = 10, userId, tag, q }: 
    { page?: number; limit?: number; userId?: string; tag?: string; q?: string } = {},
    { getState, rejectWithValue }
  ) => {
    try {
      const token = (getState() as RootState).auth.token;
      const config = {
        headers: {} as Record<string, string>,
        params: { page, limit } as Record<string, any>,
      };

      if (token) {
        config.headers['x-auth-token'] = token;
      }

      if (userId) {
        config.params.userId = userId;
      }

      if (tag) {
        config.params.tag = tag;
      }

      if (q) {
        config.params.q = q;
      }


      const { data } = await axios.get('/api/audio', config);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch audios'
      );
    }
  }
);

export const fetchTrendingAudios = createAsyncThunk(
  'audio/fetchTrendingAudios',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/api/audio/trending');
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch trending audios'
      );
    }
  }
);

export const fetchAudioById = createAsyncThunk(
  'audio/fetchAudioById',
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.token;
      const config = {
        headers: {} as Record<string, string>,
      };

      if (token) {
        config.headers['x-auth-token'] = token;
      }

      const { data } = await axios.get(`/api/audio/${id}`, config);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch audio'
      );
    }
  }
);

export const likeAudio = createAsyncThunk(
  'audio/likeAudio',
  async (audioId: string, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.token;
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };

      const { data } = await axios.put(`/api/audio/like/${audioId}`, {}, config);
      return { audioId, isLiked: data.isLiked };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to like audio'
      );
    }
  }
);

export const uploadAudio = createAsyncThunk(
  'audio/uploadAudio',
  async (
    formData: FormData,
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.post('/api/audio/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to upload audio'
      );
    }
  }
);

export const deleteAudio = createAsyncThunk(
  'audio/deleteAudio',
  async (audioId: string, { getState, rejectWithValue }) => {
    try {
      const token = (getState() as RootState).auth.token;
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };

      await axios.delete(`/api/audio/${audioId}`, config);
      return audioId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete audio'
      );
    }
  }
);

export const fetchFeed = createAsyncThunk(
  'audio/fetchFeed',
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number } = {},
    { getState, rejectWithValue }
  ) => {
    try {
      const token = (getState() as RootState).auth.token;
      const config = {
        headers: {
          'x-auth-token': token,
        },
        params: { page, limit },
      };

      const { data } = await axios.get('/api/audio/feed', config);
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch feed'
      );
    }
  }
);

const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    clearCurrentAudio: (state) => {
      state.currentAudio = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Audios
    builder.addCase(fetchAudios.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(fetchAudios.fulfilled, (state, action) => {
      state.loading = 'succeeded';
      state.audios = action.payload.audios;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.totalAudios = action.payload.totalAudios;
      state.error = null;
    });
    builder.addCase(fetchAudios.rejected, (state, action) => {
      state.loading = 'failed';
      state.error = action.payload as string;
    });

    // Fetch Trending Audios
    builder.addCase(fetchTrendingAudios.fulfilled, (state, action) => {
      state.trendingAudios = action.payload;
      state.error = null;
    });
    builder.addCase(fetchTrendingAudios.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // Fetch Audio By ID
    builder.addCase(fetchAudioById.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(fetchAudioById.fulfilled, (state, action) => {
      state.loading = 'succeeded';
      state.currentAudio = action.payload;
      state.error = null;
    });
    builder.addCase(fetchAudioById.rejected, (state, action) => {
      state.loading = 'failed';
      state.error = action.payload as string;
    });

    // Like Audio
    builder.addCase(likeAudio.fulfilled, (state, action) => {
      const { audioId, isLiked } = action.payload;
      
      // Update in audios array
      state.audios = state.audios.map(audio => {
        if (audio._id === audioId) {
          return {
            ...audio,
            likes: isLiked 
              ? [...audio.likes, 'current-user-id'] // This will be replaced with actual user ID in the component
              : audio.likes.filter(id => id !== 'current-user-id'),
            likeCount: isLiked 
              ? (audio.likeCount || audio.likes.length) + 1 
              : Math.max(0, (audio.likeCount || audio.likes.length) - 1)
          };
        }
        return audio;
      });

      // Update in currentAudio if it's the liked audio
      if (state.currentAudio?._id === audioId) {
        state.currentAudio = {
          ...state.currentAudio,
          likes: isLiked 
            ? [...state.currentAudio.likes, 'current-user-id']
            : state.currentAudio.likes.filter(id => id !== 'current-user-id'),
          likeCount: isLiked 
            ? (state.currentAudio.likeCount || state.currentAudio.likes.length) + 1
            : Math.max(0, (state.currentAudio.likeCount || state.currentAudio.likes.length) - 1)
        };
      }
      
      state.error = null;
    });
    builder.addCase(likeAudio.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // Upload Audio
    builder.addCase(uploadAudio.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(uploadAudio.fulfilled, (state, action) => {
      state.loading = 'succeeded';
      state.audios = [action.payload, ...state.audios];
      state.totalAudios += 1;
      state.error = null;
    });
    builder.addCase(uploadAudio.rejected, (state, action) => {
      state.loading = 'failed';
      state.error = action.payload as string;
    });

    // Delete Audio
    builder.addCase(deleteAudio.fulfilled, (state, action) => {
      const audioId = action.payload;
      state.audios = state.audios.filter(audio => audio._id !== audioId);
      state.userAudios = state.userAudios.filter(audio => audio._id !== audioId);
      state.totalAudios = Math.max(0, state.totalAudios - 1);
      state.error = null;
    });
    builder.addCase(deleteAudio.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // Fetch Feed
    builder.addCase(fetchFeed.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(fetchFeed.fulfilled, (state, action) => {
      state.loading = 'succeeded';
      state.audios = action.payload.audios;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.totalAudios = action.payload.totalAudios;
      state.error = null;
    });
    builder.addCase(fetchFeed.rejected, (state, action) => {
      state.loading = 'failed';
      state.error = action.payload as string;
    });
  },
});

export const { clearCurrentAudio, clearError } = audioSlice.actions;

export const selectAllAudios = (state: RootState) => state.audio.audios;
export const selectCurrentAudio = (state: RootState) => state.audio.currentAudio;
export const selectTrendingAudios = (state: RootState) => state.audio.trendingAudios;
export const selectAudioLoading = (state: RootState) => state.audio.loading;
export const selectAudioError = (state: RootState) => state.audio.error;
export const selectAudioPagination = (state: RootState) => ({
  currentPage: state.audio.currentPage,
  totalPages: state.audio.totalPages,
  totalAudios: state.audio.totalAudios,
});

export default audioSlice.reducer;
