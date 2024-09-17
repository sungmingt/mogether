import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatRoomDetail, sendMessage, selectChat, connectWebSocket, disconnectWebSocket } from '../../store/slices/chatSlice';
import styled from 'styled-components';
import { AppDispatch, RootState } from '../../store/store';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { fetchProfile, selectUserProfile } from '../../store/slices/userProfileSlice';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px;
  }
`;

const ParticipantListContainer = styled.div`
  margin-right: 20px; 
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  max-height: 90vh;
  overflow-y: auto;
  min-width: 200px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    display: none; 
  }
`;

const ParticipantItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 5px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;

  &:hover {
    background-color: #f9f9f9;
  }
`;

const ParticipantImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const ParticipantName = styled.span`
  font-size: 14px;
  color: #333;
`;

const ChatContainer = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 90vh;
  max-width: 600px;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 5px;
  }
`;

const ChatHeader = styled.div`
  background-color: #7848f4;
  color: #ffffff;
  padding: 15px;
  font-size: 20px;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px 10px 0 0;
`;

const ExitButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #d32f2f;
  }
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MessageContainer = styled.div<{ isOwnMessage: boolean }>`
  display: flex;
  align-items: flex-start;
  justify-content: ${({ isOwnMessage }) => (isOwnMessage ? 'flex-end' : 'flex-start')}; /* 작성자에 따라 위치 조정 */
  margin-bottom: 10px;
  flex-direction: ${({ isOwnMessage }) => (isOwnMessage ? 'row-reverse' : 'row')}; /* 본인 메시지는 오른쪽, 타인 메시지는 왼쪽 */
`;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 5px;
  min-width: 50px;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const Nickname = styled.span`
  font-size: 10px;
  color: #666;
  margin-top: 3px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 50px;
`;

const MessageBubble = styled.div<{ isOwnMessage: boolean }>`
  background-color: ${({ isOwnMessage }) => (isOwnMessage ? '#7848f4' : '#ffffff')};
  color: ${({ isOwnMessage }) => (isOwnMessage ? '#ffffff' : '#000')};
  padding: 10px 15px;
  border-radius: 15px;
  max-width: 60%;
  word-break: break-word;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;
  margin-left: ${({ isOwnMessage }) => (isOwnMessage ? '0' : '10px')};
  margin-right: ${({ isOwnMessage }) => (isOwnMessage ? '10px' : '0')};

  &::before {
    content: "";
    position: absolute;
    top: 10px;
    ${({ isOwnMessage }) =>
      isOwnMessage
        ? 'right: -8px; border: 8px solid transparent; border-left-color: #7848f4;'
        : 'left: -8px; border: 8px solid transparent; border-right-color: #ffffff;'};
  }
`;

const ChatInputContainer = styled.div`
  display: flex;
  padding: 10px 0;
  border-top: 1px solid #ddd;
  background-color: #fff;
`;

const ChatInput = styled.input`
  flex: 1;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 20px;
  margin-right: 10px;
  box-sizing: border-box;
  outline: none;
  font-size: 16px;
`;

const SendButton = styled.button`
  background-color: #7848f4;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 20px;
  cursor: pointer;
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ChatRoom: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, loading } = useSelector((state: RootState) => selectChat(state));
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const userId = Number(localStorage.getItem('userId')) || 0;
  const [profile, setProfile] = useState<any>({});
  const [roomDetail, setRoomDetail] = useState<any>({});

  useEffect(() => {
    if (userId > 0) {
      const response = dispatch(fetchProfile(userId)).unwrap();
      setProfile(response);
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (roomId) {
      const response = dispatch(fetchChatRoomDetail(Number(roomId))).unwrap();
      setRoomDetail(response);
      dispatch(connectWebSocket(Number(roomId))); // WebSocket 연결
    }

    return () => {
      dispatch(disconnectWebSocket()); // WebSocket 연결 해제
    };
  }, [roomId, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() !== '' && profile) {
      dispatch(sendMessage({ 
        roomId: Number(roomId), 
        senderId: userId, 
        nickname: profile.nickname, 
        message: message, 
        senderImageUrl: profile.imageUrl 
      }));
      setMessage('');
    }
  };

  const handleExitRoom = () => {
    navigate('/ChatList'); 
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer>
      <ParticipantListContainer>
        {roomDetail?.participants.map((participant: any) => (
          <ParticipantItem key={participant.userId} onClick={() => {}}>
            <ParticipantImage src={participant.imageUrl || '../../assets/default_profile.png'} alt={`${participant.nickname}의 프로필 이미지`} />
            <ParticipantName>{participant.nickname}</ParticipantName>
          </ParticipantItem>
        ))}
      </ParticipantListContainer>

      <ChatContainer>
        <ChatHeader>
          <span>{roomDetail?.roomName || 'Chat Room'}</span>
          <ExitButton onClick={handleExitRoom}>나가기</ExitButton>
        </ChatHeader>
        <ChatMessages>
          {messages.map((msg: any) => (
            <MessageContainer key={msg.id} isOwnMessage={msg.senderId === userId}>
              <ProfileContainer>
                <ProfileImage src={msg.senderImageUrl || '../../assets/default_image.png'} alt={`${msg.nickname}의 프로필 이미지`} />
                <Nickname>{msg.nickname}</Nickname>
              </ProfileContainer>
              <MessageBubble isOwnMessage={msg.senderId === userId}>{msg.message}</MessageBubble>
            </MessageContainer>
          ))}
          <div ref={messagesEndRef} />
        </ChatMessages>
        <ChatInputContainer>
          <ChatInput
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="메시지를 입력하세요..."
          />
          <SendButton onClick={handleSendMessage} disabled={!message.trim()}>
            전송
          </SendButton>
        </ChatInputContainer>
      </ChatContainer>
    </PageContainer>
  );
};

export default ChatRoom;
