import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';

export interface Group {
  id: number;
  title: string;
  description: string;
  date: string;
  address: string;
  imageUrl: string;
  author: {
    nickname: string;
    bio: string;
    avatarUrl: string;
  };
  keywords: string[];
  category: 'bungae' | 'gathering' | 'study';
  likes: number;
}

interface GroupState {
  groups: Group[];
  loading: boolean;
  error: string | null;
}

const initialState: GroupState = {
  groups: [],
  loading: false,
  error: null,
};

// 소모임 목록 조회 Thunk
export const fetchGroups = createAsyncThunk(
  'group/fetchGroups',
  async (_, {rejectWithValue}) => {
    try {
      const response = await axios.get('/api/groups');
      return response.data;
    } 
    catch (error) {
      return rejectWithValue('Failed to fetch groups');
    }
  }
)

// 소모임 생성 Thunk
export const createGroup = createAsyncThunk(
  'group/createGroup',
  async (groupData: FormData, {rejectWithValue}) => {
    try {
      const response = await axios.post('/api/groups', groupData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }
    catch (error) {
      return rejectWithValue('Failed to create a group');
    }
  }
);

// 좋아요 증가 Thunk
export const toggleLikeGroup = createAsyncThunk(
  'group/likeGroup',
  async (groupId: number, {rejectWithValue}) => {
    try {
      const response = await axios.post(`/api/groups/${groupId}/like`);
      return response.data;
    }
    catch (error) {
      return rejectWithValue('Failed to like the group');
    }
  }
);

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.groups = action.payload;
        state.loading = false;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;  //payload의 타입을 string으로 정의
      })
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action: PayloadAction<Group>) => {
        state.groups.push(action.payload);
        state.loading = false;
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; //여기서 string 타입 지정
      })
      .addCase(toggleLikeGroup.fulfilled, (state, action: PayloadAction<Group>) => {
        const index = state.groups.findIndex((group) => group.id === action.payload.id);
        if (index !== -1) {
          state.groups[index] = action.payload;
        }
      });
  },
});

export const selectGroups = (state: RootState) => state.group.groups;
export const selectGroupLoading = (state: RootState) => state.group.loading;
export const selectGroupError = (state: RootState) => state.group.error;

export default groupSlice.reducer;