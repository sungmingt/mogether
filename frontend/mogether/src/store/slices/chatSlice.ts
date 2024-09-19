import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store/store';
import { ChatListApi, ChatRoomApi } from '../../utils/api';
import SockJS from 'sockjs-client';
import { Client, Frame } from '@stomp/stompjs';

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
  stompClient: Client | null;
}

const initialState: ChatState = {
  roomList: [],
  roomDetail: null,
  messages: [],
  loading: false,
  error: null,
  stompClient: null,
};

// Function to format date to 'YYYY-MM-DD HH:mm'
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// Async thunk to fetch chat rooms
export const fetchChatRooms = createAsyncThunk('chat/fetchChatRooms', async (userId: number, { rejectWithValue }) => {
  try {
    const response = await ChatListApi(userId);
    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      return rejectWithValue('Failed to fetch chat rooms');
    }
  } catch (error) {
    return rejectWithValue('Failed to fetch chat rooms');
  }
});

export const fetchChatRoomDetail = createAsyncThunk('chat/fetchChatRoomDetail', async (roomId: number, { rejectWithValue }) => {
  try {
    const response = await ChatRoomApi(roomId);
    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      return rejectWithValue('Failed to fetch chat room details');
    }
  } catch (error) {
    return rejectWithValue('Failed to fetch chat room details');
  }
});

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    sendMessage: (state, action: PayloadAction<{ roomId: number; senderId: number; nickname: string; message: string; senderImageUrl: string; }>) => {
      const { roomId, senderId, nickname, message, senderImageUrl } = action.payload;
      const createdAt = formatDate(new Date());
      const newMessage = {
        roomId: roomId,
        senderId: senderId,
        nickname: nickname,
        senderImageUrl: senderImageUrl,
        message: message,
        createdAt: createdAt,
      };
      state.messages.push(newMessage);

      // Send the message if connected
      if (state.stompClient && state.stompClient.connected) {
        state.stompClient.publish({
          destination: '/pub/chat/message',
          body: JSON.stringify({
            roomId: roomId,
            senderId: senderId,
            message: message,
            createdAt: createdAt,
          }),
        });
      }
    },
    connectWebSocket: (state, action: PayloadAction<number>) => {
      const roomId = action.payload;
      const socket = new SockJS('https://api.mo-gether.site/ws');
      const accessToken = localStorage.getItem('accessToken');
      const stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000, // Reconnect every 5 seconds
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        connectHeaders: {
          accessToken: `${accessToken}`, 
        },
        onConnect: () => {
          stompClient.subscribe(`/sub/chat/room/${roomId}`, (message) => {
            const receivedMessage: ChatMessage = JSON.parse(message.body);
            state.messages.push(receivedMessage);
            state.messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          });
        },
        onStompError: (frame: Frame) => {
          console.error(`Broker reported error: ${frame.headers['message']}`);
          console.error(`Additional details: ${frame.body}`);
        },
      });

      stompClient.activate();
      state.stompClient = stompClient;
    },
    disconnectWebSocket: (state) => {
      if (state.stompClient) {
        state.stompClient.deactivate();
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
        const uniqueParticipants = Array.from(new Set(action.payload.participants.map(p => p.userId)))
          .map(id => action.payload.participants.find(p => p.userId === id))
          .filter((participant): participant is Participant => participant !== undefined);
        
        state.roomDetail.participants = uniqueParticipants;
        state.messages = action.payload.chatMessageList;
        state.messages = action.payload.chatMessageList.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
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
