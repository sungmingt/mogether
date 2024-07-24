import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { api, createPostApi } from '../../utils/api';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
  // 추가적으로 필요한 프로필 정보
}

interface UserState {
  profile: UserProfile | null;
  posts: any[]; // 작성한 게시글 목록
}

const initialState: UserState = {
  profile: null,
  posts: [],
};

export const fetchProfile = createAsyncThunk('user/fetchProfile', async () => {
  const response = await api.get('/profile'); // 프로필 정보를 가져오는 API 호출
  return response.data;
});

export const createPost = createAsyncThunk(
  'user/createPost',
  async (postData: any, { rejectWithValue }) => {
    try {
      const response = await createPostApi(postData);
      return response;
    } catch (error) {
      return rejectWithValue('Failed to create post');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    });
    builder.addCase(createPost.fulfilled, (state, action: PayloadAction<any>) => {
      state.posts.push(action.payload);
    });
  },
});

export const selectUserProfile = (state: RootState) => state.user.profile;
export default userSlice.reducer;
