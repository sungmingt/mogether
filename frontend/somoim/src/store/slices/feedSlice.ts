import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

interface Feed {
  id: number;
  author: string;   //user 닉네임
  title: string;
  content: string;
  createAt: string;  //만든 날짜 / 시간을 저장함
  fileUrl?: string; //첨부 파일 url
}

interface FeedState {
  feed: Feed[];
  loading: boolean;  //대기화면, 로딩 스피너 필요
  error: string | null;
}

//초기 상태
const initialState: FeedState = {
  feed: [],
  loading: false,
  error: null,
};

//피드 목록 조회 Thunk
export const fetchFeeds = createAsyncThunk(
  'feed/fetchFeeds',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Feed[]>('/api/feed');
      return response.data;
    } 
    catch (error) {
      return rejectWithValue('Failed to fetch feeds');
    }
  }
);

// 피드 작성 Thunk
export const createFeed = createAsyncThunk(
  'feed/createFeed',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/feed', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }); // 예시 URL, 실제 API 엔드포인트로 변경 필요
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to create feed');
    }
  }
);

//피드 삭제 Thunk
export const deleteFeed = createAsyncThunk(
  'feed/deleteFeed',
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/feed/${id}`);
      return id;
    } 
    catch (error) {
      return rejectWithValue('Failed to delete feed');
    }
  }
);




const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchFeeds.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchFeeds.fulfilled, (state, action: PayloadAction<Feed[]>) => {
      state.loading = false;
      state.feed = action.payload;
    })
    .addCase(fetchFeeds.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(createFeed.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createFeed.fulfilled, (state, action: PayloadAction<Feed>) => {
      state.loading = false;
      state.feed.push(action.payload);
    })
    .addCase(createFeed.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
    .addCase(deleteFeed.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteFeed.fulfilled, (state, action: PayloadAction<number>) => {
      state.loading = false;
      state.feed = state.feed.filter(feed => feed.id !== action.payload);
    })
    .addCase(deleteFeed.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  }
});

export const selectFeeds = (state: RootState) => state.feed.feed;
export const selectFeedLoading = (state: RootState) => state.feed.loading;
export const selectFeedError = (state: RootState) => state.feed.error;


export default feedSlice.reducer;
