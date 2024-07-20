import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { updateProfileApi } from '../../utils/api';


interface UserProfile {
  id: string;
  name: string;
  email: string;
  password: string;
  bio: string;
  // followers: number[];
  // following: number[];
  avator: string; //프로필 사진 url을 받는다
}

interface UserState {
  followers: UserProfile[];
  following: UserProfile[];
  profile: UserProfile | null;
}

const initialState: UserState = {
  profile: null,
  followers: [],
  following: [],
};

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profile: Partial<UserProfile>, thunkAPI) => {
    try {
      const updatedProfile = await updateProfileApi(profile);
      return updatedProfile;
    } 
    catch (error) {
      return thunkAPI.rejectWithValue('Profile update failed');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<UserProfile>) {
      state.profile = action.payload;
    },
    setFollowers(state, action: PayloadAction<UserProfile[]>) {
      state.followers = action.payload;
    },
    setFollowing(state, action: PayloadAction<UserProfile[]>) {
      state.following = action.payload;
    },
    followUser(state, action: PayloadAction<UserProfile>) {
      state.following.push(action.payload);
    },
    unfollowUser(state, action: PayloadAction<string>) {
      state.following = state.following.filter(user => user.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile = { ...state.profile, ...action.payload };
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
      });
  },
});

export const { setProfile, setFollowers, setFollowing, followUser, unfollowUser } = userSlice.actions;
export default userSlice.reducer;
