import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import { ChatListApi, ChatRoomApi } from '../../utils/api';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

interface ChatMessage {
  id?: string;
  roomId: number;
  senderId: number;
  nickname: string;
  senderImageUrl: string;
  message: string;
  createdAt: string;
}

interface ChatRoom {
  latestMessage?: string;
  gatherType: string;
  gatherId: number;
  roomId: number;
  roomName: string;
  userCount: number;
}

interface ChatRoomDetail {
  gatherType: string;
  gatherId: number;
  roomId: number;
  roomName: string;
  chatMessageList: ChatMessage[];
  userCount: number;
  participants: Participant[];
}

interface Participant {
  userId: number;
  nickname: string;
  imageUrl: string;
}

interface ChatState {
  roomList: ChatRoom[];
  roomDetail: ChatRoomDetail | null;
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  stompClient: Stomp.Client | null;
}

const initialState: ChatState = {
  roomList: [],
  roomDetail: null,
  messages: [],
  loading: false,
  error: null,
  stompClient: null,
};

// 채팅방 리스트 가져오기
export const fetchChatRooms = createAsyncThunk('chat/fetchChatRooms', async (userId: number, { rejectWithValue }) => {
  try {
    const response = await ChatListApi(userId);
    return response.data;
  } catch (error) {
    return rejectWithValue('Failed to fetch chat rooms');
  }
});

// 채팅방 상세 조회
export const fetchChatRoomDetail = createAsyncThunk('chat/fetchChatRoomDetail', async (roomId: number, { rejectWithValue }) => {
  try {
    const response = await ChatRoomApi(roomId);
    return response.data;
  } catch (error) {
    return rejectWithValue('Failed to fetch chat room details');
  }
});

// 날짜와 시간을 'YYYY-MM-DD HH:mm' 형식으로 변환하는 함수
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    sendMessage: (state, action: PayloadAction<{ roomId: number; senderId: number; nickname: string; message: string; senderImageUrl: string; }>) => {
      const { roomId, senderId, nickname, message, senderImageUrl } = action.payload;
      const createdAt = formatDate(new Date()); // 시간 포맷 적용
      const newMessage = {
        roomId,
        senderId,
        nickname,
        senderImageUrl,
        message,
        createdAt,
      };
      state.messages.push(newMessage);

      // 메시지 전송
      if (state.stompClient && state.stompClient.connected) {
        state.stompClient.send(
          '/pub/chat/message',
          {},
          JSON.stringify({
            roomId: roomId,
            senderId: senderId,
            message: message,
            createdAt: createdAt,
          })
        );
      }
    },
    connectWebSocket: (state, action: PayloadAction<number>) => {
      const roomId = action.payload;
      const socket = new SockJS('ws://api.mo-gether.site/ws');
      const stompClient = Stomp.over(socket);

      stompClient.connect({}, () => {
        stompClient.subscribe(`/sub/chat/room/${roomId}`, (message) => {
          const receivedMessage: ChatMessage = JSON.parse(message.body);
          state.messages.push(receivedMessage);
        });
      });

      state.stompClient = stompClient;
    },
    disconnectWebSocket: (state) => {
      if (state.stompClient) {
        state.stompClient.disconnect(() => {});
        state.stompClient = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatRooms.fulfilled, (state, action: PayloadAction<ChatRoom[]>) => {
        state.roomList = action.payload;
        state.loading = false;
      })
      .addCase(fetchChatRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchChatRoomDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatRoomDetail.fulfilled, (state, action: PayloadAction<ChatRoomDetail>) => {
        state.roomDetail = action.payload;
        state.messages = action.payload.chatMessageList;
        state.loading = false;
      })
      .addCase(fetchChatRoomDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { sendMessage, connectWebSocket, disconnectWebSocket } = chatSlice.actions;

export const selectChat = (state: RootState) => state.chat;

export default chatSlice.reducer;
