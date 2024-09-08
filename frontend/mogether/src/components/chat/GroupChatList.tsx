// components/ChatListPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ChatListContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ChatRoom = styled.div`
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const GroupChatList: React.FC = () => {
  const navigate = useNavigate();

  const chatRooms = [
    { id: '1', name: 'Group Chat 1' },
    { id: '2', name: 'Group Chat 2' },
  ];

  const handleRoomClick = (roomId: string) => {
    navigate(`/chat/${roomId}`);
  };

  return (
    <ChatListContainer>
      {chatRooms.map((room) => (
        <ChatRoom key={room.id} onClick={() => handleRoomClick(room.id)}>
          {room.name}
        </ChatRoom>
      ))}
    </ChatListContainer>
  );
};

export default GroupChatList;
