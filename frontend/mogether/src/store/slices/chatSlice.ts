// pseudocode
// store/slices/chatSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

interface ChatState {
  messages: ChatMessage[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: ChatState = {
  messages: [],
  status: 'idle',
};

// Mock API to fetch chat messages
export const fetchChatMessages = createAsyncThunk('chat/fetchMessages', async () => {
  // Replace this with a real API call
  const response = await new Promise<{ data: ChatMessage[] }>((resolve) =>
    setTimeout(
      () =>
        resolve({
          data: [
            { id: '1', sender: 'User1', content: 'Hello!', timestamp: '2024-08-31T12:00:00Z' },
            { id: '2', sender: 'Me', content: 'Hi there!', timestamp: '2024-08-31T12:01:00Z' },
          ],
        }),
      1000
    )
  );
  return response.data;
});

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.status = 'idle';
        state.messages = action.payload;
      })
      .addCase(fetchChatMessages.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { addMessage } = chatSlice.actions;

export const selectMessages = (state: RootState) => state.chat.messages;

export default chatSlice.reducer;
