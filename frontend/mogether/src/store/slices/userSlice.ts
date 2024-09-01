import { createSlice, PayloadAction, createAsyncThunk, AsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { api, createMoimApi, userApi, createBungaeApi } from '../../utils/api';
import { MoimInterestApi, BungaeInterestApi, MyCreateMoimListApi, MyCreateBungaeListApi, changeUserProfile, EditMoimApi, EditBungaeApi } from "../../utils/api";
import { create } from 'domain';


export interface Post {
  id: number;   //post의 고유 숫자
  title: string;
  content: string;
  imageUrls?: string[];  // 단건조회시 서버로부터 받는 이미지
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


interface CurrentUserState {
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

const initialState: CurrentUserState = {
  posts: [],  // 내가 작성한 소모임 목록
  error: null,
  bungaes: [],  // 내가 작성한 번개 목록
  MyInterestedMoim: [],  // 아래는 api 별로 세분화한것 -> 차라리 내 게시글 안에서 따로 분류를 해서 불러내는건 어떨까?
  MyInterestedBungae: [],
  MyCreatedMoim: [],
  MyCreatedBungae: [],
};



export const createMoim = createAsyncThunk(
  'user/createPost',
  async (postData: any, { rejectWithValue }) => {
    try {
      const response = await createMoimApi(postData);
      if (response.status === 200 || response.status === 201) {
        console.log(response.data);
        return response.data;
      }
    } catch (error) {
      console.log(error);
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

export const EditMoim = createAsyncThunk(
  'user/EditMoim',
  async (moimFormDataMoimId: { moimId: number, moimFormData: FormData }, { rejectWithValue }) => {
    try {
      const response = await EditMoimApi(moimFormDataMoimId.moimId, moimFormDataMoimId.moimFormData);
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
    } catch (error) {
      return rejectWithValue('Failed to edit post');
    }
  }
)

export const EditBungae = createAsyncThunk(
  'user/EditBungae',
  async (editData: any, { rejectWithValue }) => {
    try {
      const response = await EditBungaeApi(editData.bungaeId, editData);
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
    } catch (error) {
      return rejectWithValue('Failed to edit post');
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

export const MyCreatedMoim = createAsyncThunk(  //내가 만든 소모임 리스트
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

export const MyCreatedBungae = createAsyncThunk(  //내가 만든 번개모임 리스트
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







const userSlice = createSlice({  //store와 action의 역할을 동시에 함
  name: 'user',
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder.addCase(createMoim.fulfilled, (state, action: PayloadAction<any>) => { //그냥 객체 타입 -> any로 지정해줌
      state.posts.push(action.payload);
    });
    builder.addCase(createMoim.rejected, (state, action: PayloadAction<any>) => {
      state.error = action.payload as string;
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
    builder.addCase(EditMoim.fulfilled, (state, action: PayloadAction<Post>) => {
      // state.EditMoim = action.payload;   //EditMoim 액션이 성공적으로 이루어졌다면 store의 상태 갱신
    })
    builder.addCase(EditMoim.rejected, (state, action: PayloadAction<any>) => {
      state.error = action.payload as string;
    });
    builder.addCase(EditBungae.fulfilled, (state, action: PayloadAction<Post>) => {
      // state.profile = action.payload;  //EditBungae 액션이 성공적으로 이루어졌다면 store의 상태 갱신
    })
    builder.addCase(EditBungae.rejected, (state, action: PayloadAction<any>) => {
      state.error = action.payload as string;
    });
  },
});

export default userSlice.reducer;

//selectUserProfile 은 UserProfile 배열을 가져온다
