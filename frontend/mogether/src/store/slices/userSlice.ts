import { createSlice, PayloadAction, createAsyncThunk, AsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { api, createMoimApi, userApi, createBungaeApi } from '../../utils/api';
import { MoimInterestApi, BungaeInterestApi, MyCreateMoimListApi, MyCreateBungaeListApi, changeUserProfile } from "../../utils/api";

interface Address {
  city: string;
  gu: string;
  details?: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  imageUrls?: string[];
  thumbnailUrl?: string;
  hostId: number;
  hostName: string;
  hostProfileImageUrl: string;
  hostIntro?: string;
  participantsImageUrls?: string[];
  participantsCount?: number;
  keyword: string;
  interestsCount: number;
  address: {
    city: string;
    gu: string;
    details: string;
  };
  description?: string;
  createdAt: string;
  expireAt: string;
  interested?: boolean;
  gatherAt?: string;
}

export interface UserProfile {
  userId: number,
  email: "string",
  socialType: "string",
  providerId: "string",
  name: "string",
  nickname: "string",
  imageUrl?: "string",
  address?: Address,
  age?: number,
  gender?: "string",
  intro?: "string",
  phoneNumber?: "string"
}

interface UserState {
  profile: UserProfile | null;
  error: string | null;
  posts: Post[]; // 작성한 소모임 목록
  bungaes: Post[];  //작성한 번개글 목록
  // interestPosts: Post[]; //관심 게시글 목록
  // createPosts: Post[]; //작성한 게시글 목록
  MyInterestedMoim: Post[] | null,  
  MyInterestedBungae: Post[] | null,
  MyCreatedMoim: Post[] | null,
  MyCreatedBungae: Post[] | null,
}

const initialState: UserState = {
  profile: null,
  posts: [],  // 내가 작성한 소모임 목록
  error: null,
  bungaes: [],  // 내가 작성한 번개 목록
  // interestPosts: [],  // 관심 게시글 목록
  // createPosts: [],   // 내가 등록한 게시글 목록
  MyInterestedMoim: [],  // 아래는 api 별로 세분화한것 -> 차라리 내 게시글 안에서 따로 분류를 해서 불러내는건 어떨까?
  MyInterestedBungae: [],
  MyCreatedMoim: [],
  MyCreatedBungae: [],
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

export const createMoim = createAsyncThunk(
  'user/createPost',
  async (postData: any, { rejectWithValue }) => {
    try {
      const response = await createMoimApi(postData);
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
    } catch (error) {
      return rejectWithValue('Failed to create post');  //rejectWithValue는 reject시 해당 값을 반환
    }   //반환값 확인하면서 고치기
  }
);

export const createBungae = createAsyncThunk(
  'user/createBungae',
  async (postData: any, { rejectWithValue }) => {
    try {
      const response = await createBungaeApi(postData);
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
    } catch (error) {
      return rejectWithValue('Failed to create post');
    }
  }
)

export const MyInterestedMoim = createAsyncThunk(
  'user/MyInterestedMoim',
  async (userId: number, { rejectWithValue }) => {
    try {
      const moimResponse = await MoimInterestApi(userId);

      if (moimResponse.status === 200 || moimResponse.status === 201) {
        const sortedInterestedMoim = moimResponse.data.sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return sortedInterestedMoim;
      } else {
        return rejectWithValue('Failed to fetch interest posts');
      }
    } catch (error) {
      return rejectWithValue('Failed to fetch interest posts');
    }
  }
);

export const MyInterestedBungae = createAsyncThunk(
  'user/MyInterestedBungae',
  async (userId: number, { rejectWithValue }) => {
    try {
      const bungaeResponse = await BungaeInterestApi(userId);
      if (bungaeResponse.status === 200 || bungaeResponse.status === 201) {
        const sortedInterestedBungae = bungaeResponse.data.sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return sortedInterestedBungae;
      } else {
        return rejectWithValue('Failed to fetch interest posts');
      }
    } catch (error) {
      return rejectWithValue('Failed to fetch interest posts');
    }
  }
);

export const MyCreatedMoim = createAsyncThunk(
  'user/MyCreatedMoim',
  async (userId: number, thunkAPI) => {
    try {
      const response = await MyCreateMoimListApi(userId);
      if (response.status === 200 || response.status === 201) {
        const sortedCreatedMoim = response.data.sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return sortedCreatedMoim;
      }
      else {
        return thunkAPI.rejectWithValue('Failed to fetch posts');
      }
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch posts');
    }
  }
)

export const MyCreatedBungae = createAsyncThunk(
  'user/MyCreatedBungae',
  async (userId: number, thunkAPI) => {
    try {
      const response = await MyCreateBungaeListApi(userId);
      if (response.status === 200 || response.status === 201) {
        const sortedCreatedBungae = response.data.sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return sortedCreatedBungae;
      }
      else {
        return thunkAPI.rejectWithValue('Failed to fetch posts');
      }
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch posts');
    }
  }
)

export const PatchUserProfile = createAsyncThunk(
  'user/patchUserProfile',
  async (profileData: any, { rejectWithValue }) => {   // 객체형식 = any로 퉁침
    try {
      const response = await changeUserProfile(profileData);
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
    } catch (error) {
      return rejectWithValue('Failed to update profile');
    }
  }
);



const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;   //extraReducer를 통해 상태관리
    });
    builder.addCase(fetchProfile.rejected, (state, action: PayloadAction<any>) => {
      state.error = action.payload as string;
    });
    builder.addCase(createMoim.fulfilled, (state, action: PayloadAction<any>) => { //그냥 객체 타입 -> any로 지정해줌
      state.posts.push(action.payload);
    });
    builder.addCase(MyInterestedMoim.fulfilled, (state, action: PayloadAction<Post[]>) => {
      state.MyInterestedMoim = action.payload;
    })
    builder.addCase(MyInterestedMoim.rejected, (state, action: PayloadAction<any>) => {
      state.error = action.payload as string;
    });
    builder.addCase(MyInterestedBungae.fulfilled, (state, action: PayloadAction<Post[]>) => {
      state.MyInterestedBungae = action.payload;
    })
    builder.addCase(MyInterestedBungae.rejected, (state, action: PayloadAction<any>) => {
      state.error = action.payload as string;
    });
    builder.addCase(MyCreatedMoim.fulfilled, (state, action: PayloadAction<Post[]>) => {
      state.MyCreatedMoim = action.payload;
    })
    builder.addCase(MyCreatedMoim.rejected, (state, action: PayloadAction<any>) => {
      state.error = action.payload as string;
    });
    builder.addCase(MyCreatedBungae.fulfilled, (state, action: PayloadAction<Post[]>) => {
      state.MyCreatedBungae = action.payload;
    })
    builder.addCase(MyCreatedBungae.rejected, (state, action: PayloadAction<any>) => {
      state.error = action.payload as string;
    });
    builder.addCase(PatchUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    })
    builder.addCase(PatchUserProfile.rejected, (state, action: PayloadAction<any>) => {
      state.error = action.payload as string;
    });
  },
});

export const selectUserProfile = (state: RootState) => state.user.profile;
export default userSlice.reducer;

//selectUserProfile 은 UserProfile 배열을 가져온다
