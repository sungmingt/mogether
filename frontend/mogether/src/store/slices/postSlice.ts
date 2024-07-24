import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchPostsApi } from '../../utils/api';

interface Post {
  id: string;
  title: string;
  content: string;
  image: string;
  host: {
    avatarUrl: string;
    nickname: string;
  };
  location: string;
  likes: number;
  createdAt: string;
}

interface PostState {
  allPosts: Post[];
  visiblePosts: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostState = {
  allPosts: [],
  visiblePosts: [],
  loading: false,
  error: null,
};

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, thunkAPI) => {
    try {
      const response = await fetchPostsApi();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch posts');
    }
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    loadMorePosts(state) {
      const morePosts = state.allPosts.slice(state.visiblePosts.length, state.visiblePosts.length + 12);
      state.visiblePosts = [...state.visiblePosts, ...morePosts];
    },
    sortPostsByLatest(state) {
      state.allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      state.visiblePosts = state.allPosts.slice(0, 12);
    },
    sortPostsByLikes(state) {
      state.allPosts.sort((a, b) => b.likes - a.likes);
      state.visiblePosts = state.allPosts.slice(0, 12);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.allPosts = action.payload;
        state.visiblePosts = state.allPosts.slice(0, 12);
        state.loading = false;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { loadMorePosts, sortPostsByLatest, sortPostsByLikes } = postSlice.actions;
export default postSlice.reducer;
