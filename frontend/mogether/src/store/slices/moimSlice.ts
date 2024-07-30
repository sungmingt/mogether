import { createSlice, createAsyncThunk, PayloadAction, AsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchPostsApi, MoimCardApi, interestMoimApi, searchMoimApi, joinMoimApi, interestMoimDeleteApi, joinQuitMoimApi } from '../../utils/api';

export interface Post {  //여기서의 post는....moim의 형식을 의미한다....
  id: number;   // 서버에서 id를 줄 때 -> id 이렇게 준다...
  title: string;
  content: string;
  imageUrls?: string[];
  thumbnailUrl?: string;
  hostId: number;
  hostName: string;
  hostProfileImageUrl: string;
  hostIntro?: string;
  participantsImageUrls?: string[];
  participantsCount: number;
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
  joined?: boolean;
}

interface PostState {
  allPosts: Post[];   //모든 게시글
  visiblePosts: Post[];  //load more로 선별된 보여줄 게시글
  loading: boolean;
  error: string | null;
  idPost: Post | null; //post의 배열 1개 요구
}

const initialState: PostState = {
  allPosts: [],
  visiblePosts: [],
  loading: false,
  error: null,
  idPost: null,
};

export const fetchPosts = createAsyncThunk(  //처음 게시글 리스트 소환
  'posts/fetchPosts',
  async (_, thunkAPI) => { //인자 2개는 필요한데 1개만 필요하므로 _를 사용해서 인자를 무시함
    try {
      const response = await fetchPostsApi();
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
      else {
        return thunkAPI.rejectWithValue('Failed to fetch posts');
      }
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch posts');
    }
  }
);

export const clickPosts = createAsyncThunk(
  'posts/clickPosts',
  async (moimId: number, thunkAPI) => {
    try {
      const response = await MoimCardApi(moimId);  //애초에 api.ts에서 response.data를 값으로 넘겨줌
      if (response.status === 200) {
        return response.data;
      }
      else {
        return thunkAPI.rejectWithValue('Failed to fetch posts');
      }
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch posts');
    }
  }
);

export const clickInterest = createAsyncThunk(
  'posts/clickInterest',
  async (interest: any, thunkAPI) => {
    try {
      const response = await interestMoimApi(interest);
      if (response.status === 200) {
        return {moimId: interest.moimId};
      }
      else {
        return thunkAPI.rejectWithValue('Failed to fetch posts');
      }
    }
    catch (error) {
      return thunkAPI.rejectWithValue('Failed to toggle interest');
    }
  }
)

export const deleteInterest = createAsyncThunk(
  'posts/deleteInterest',
  async (interest: any, thunkAPI) => {
    try {
      const response = await interestMoimDeleteApi(interest);
      if (response.status === 200) {
        return {moimId: interest.moimId};
      }
      else {
        return thunkAPI.rejectWithValue('Failed to delete');
      }
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to delete Interest');
    }
  }
)

export const clickJoin = createAsyncThunk(
  'posts/clickJoin',
  async (join: any, thunkAPI) => {
    try {
      const response = await joinMoimApi(join);
      if (response.status === 200) {
        return {moimId: join.moimId};
      }
      else {
        return thunkAPI.rejectWithValue('Failed to fetch posts');
      }
    }
    catch (error) {
      return thunkAPI.rejectWithValue('Failed to toggle interest');
    }
  }
)

export const quitJoin = createAsyncThunk(
  'posts/quitJoin',
  async (join: any, thunkAPI) => {
    try {
      const response = await joinQuitMoimApi(join);  // {userId: userId, moimId: moimId}
      if (response.status === 200) {
        return {moimId: join.moimId};
      }
      else {
        return thunkAPI.rejectWithValue('Failed to fetch posts');
      }
    }
    catch (error) {
      return thunkAPI.rejectWithValue('Failed to toggle interest');
    }
  }
)
 
export const searchPosts = createAsyncThunk(
  'posts/searchPosts',
  async ({ name, city, gu }: { name: string; city: string; gu: string }, thunkAPI) => {
    try {
      let searchData = {name: name, city:city, gu: gu};
      const response = await searchMoimApi(searchData);
      if (response.status === 200 || response.status === 201) {
        return response.data;
      } else {
        return thunkAPI.rejectWithValue('Failed to search posts');
      }
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to search posts');
    }
  }
);


const postSlice = createSlice({   // 게시글 리스트의 상태와 액션을 관리하는 리듀서
  name: 'posts',
  initialState,
  reducers: {   //동기 작업 처리
    loadMorePosts(state) {
      const morePosts = state.allPosts.slice(state.visiblePosts.length, state.visiblePosts.length + 12);
      state.visiblePosts = [...state.visiblePosts, ...morePosts];
    },
    sortPostsByLatest(state) {
      state.allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      state.visiblePosts = state.allPosts.slice(0, 12);
    },
    sortPostsByLikes(state) {
      state.allPosts.sort((a, b) => b.interestsCount - a.interestsCount);
      state.visiblePosts = state.allPosts.slice(0, 12);
    },
    filterPostsByKeywords(state, action: PayloadAction<string[]>) {
      const filteredPosts = state.allPosts.filter(post => 
        action.payload.some(keyword => post.keyword.includes(keyword))
      );
      state.visiblePosts = filteredPosts.slice(0, 12);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {  //action의 페이로드 타입 정의
        state.allPosts = action.payload;   //여기서 state란 위에서 정의한 initialState로 가져온 Post[],...
        state.visiblePosts = state.allPosts.slice(0, 12);
        state.loading = false;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(clickPosts.pending, (state) => {  // 클릭 시 결과값?
        state.loading = true;
        state.error = null;
      })
      .addCase(clickPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.idPost = action.payload;   // Post 객체 하나 -> 저장하는 공간이 idPost라는 의미
      })
      .addCase(clickPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;  //action.payload는 반환된 response.data 값
      })
      .addCase(clickInterest.fulfilled, (state, action) => {
        const { moimId } = action.payload;
        const post = state.allPosts.find(post => post.id === moimId);
        if (post) {
          post.interested = !post.interested;
          post.interestsCount += post.interested ? 1 : -1;
        }
        const visiblePost = state.visiblePosts.find(post => post.id === moimId);
        if (visiblePost) {
          visiblePost.interested = !visiblePost.interested;
          visiblePost.interestsCount += visiblePost.interested ? 1 : -1;
        }
      })
      .addCase(searchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.allPosts = action.payload;
        state.visiblePosts = state.allPosts.slice(0, 12);
        state.loading = false;
      })
      .addCase(searchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(clickJoin.fulfilled, (state, action) => {
        const {moimId} = action.payload;
        const post = state.allPosts.find(post => post.id === moimId);
        if (post) {
          post.joined = !post.joined;
          post.interestsCount += post.interested ? 1 : -1;
        }
        const visiblePost = state.visiblePosts.find(post => post.id === moimId);
        if (visiblePost) {
          visiblePost.joined = !visiblePost.joined;
          visiblePost.participantsCount += visiblePost.joined ? 1 : -1;
        }
        state.loading = false;
      })
      .addCase(clickJoin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(quitJoin.fulfilled, (state, action) => {
        const {moimId} = action.payload;
        const post = state.allPosts.find(post => post.id === moimId);
        if (post) {
          post.joined = !post.joined;
          post.interestsCount += post.interested ? 1 : -1;
        }
        const visiblePost = state.visiblePosts.find(post => post.id === moimId);
        if (visiblePost) {
          visiblePost.joined = !visiblePost.joined;
          visiblePost.participantsCount += visiblePost.joined ? 1 : -1;
        }
        state.loading = false;
      })
      .addCase(quitJoin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
      
  },
});

export const selectMoimPost = (state: RootState) => state.moim.idPost;   // postSlice는 store에 post라는 이름의 리듀서로 저장이 되어 있음
export const selectAllPosts = (state: RootState) => state.moim.allPosts;
export const selectVisiblePosts = (state: RootState) => state.moim.visiblePosts;
export const { loadMorePosts, sortPostsByLatest, sortPostsByLikes, filterPostsByKeywords } = postSlice.actions;
export default postSlice.reducer;
