import { createSlice, PayloadAction, createAsyncThunk, AsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { api, createPostApi, userApi } from '../../utils/api';

interface Address {
  city: string;
  gu: string;
  details?: string;
}

export interface UserProfile {
  userId: number,
  email: "string",
  socialType: "string",
  providerId: "string",
  name: "string",
  nickname: "string",
  userProfileImage?: "string",
  address?: Address,
  age?: number,
  gender?: "string",
  intro?: "string",
  phoneNumber?: "string"
}

interface UserState {
  profile: UserProfile | null;
  error: string | null;
  posts: any[]; // 작성한 게시글 목록
}

const initialState: UserState = {
  profile: null,
  posts: [],
  error: null
};

export const fetchProfile = createAsyncThunk(
  'user/fetchProfile', 
  async (userId: number, thunkAPI) => {
  // const response = await api.get('/profile'); // 프로필 정보를 가져오는 API 호출
  // return response.data;
  try {
    const response = await userApi(userId);
    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
    else {
      return thunkAPI.rejectWithValue('Failed to fetch profile');
    }
  } catch (error) {
    return thunkAPI.rejectWithValue('Failed to fetch profile');
  }
});

export const createPost = createAsyncThunk(
  'user/createPost',
  async (postData: any, { rejectWithValue }) => {
    try {
      const response = await createPostApi(postData);
      return response;
    } catch (error) {
      return rejectWithValue('Failed to create post');  //rejectWithValue는 reject시 해당 값을 반환
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
    builder.addCase(fetchProfile.rejected, (state, action: PayloadAction<any>) => {
      state.error = action.payload as string;
    });
    builder.addCase(createPost.fulfilled, (state, action: PayloadAction<any>) => { //그냥 객체 타입 -> any로 지정해줌
      state.posts.push(action.payload);
    });
  },
});

export const selectUserProfile = (state: RootState) => state.user.profile;
export default userSlice.reducer;

//selectUserProfile 은 UserProfile 배열을 가져온다
