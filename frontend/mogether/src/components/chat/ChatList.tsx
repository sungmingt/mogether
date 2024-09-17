// src/features/chat/ChatRoomList.tsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatRooms, selectChat } from '../../store/slices/chatSlice';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store/store';
import LoadingSpinner from './LoadingSpinner';
import { FaUser, FaCommentDots } from 'react-icons/fa';

const RoomListContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 0 10px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    max-width: 600px;
    padding: 10px;
  }
`;

const RoomCard = styled.div`
  background-color: #ffffff;
  padding: 20px;
  margin: 10px 0;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const RoomHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const RoomName = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
`;

const GatherTypeButton = styled.button`
  background-color: #7848f4;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 5px 10px;
  font-size: 12px;
  margin-bottom: 10px;
  cursor: default;

  &:hover {
    background-color: #6b40e0;
  }
`;

const RoomInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const RoomInfo = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #555;

  svg {
    margin-right: 5px;
    color: #7848f4;
  }
`;

const LeftItem = styled.div`
  display: flex;
  align-items: center;
  
`;

const ChatRoomList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { roomList, loading, error } = useSelector((state: RootState) => selectChat(state));
    const userId = Number(localStorage.getItem('userId'));
  
    useEffect(() => {
      if (userId) {
        dispatch(fetchChatRooms(userId));
      }
    }, [dispatch, userId]);
  
    if (loading) {
      return <LoadingSpinner />;
    }
  
    if (error) {
      return <div>Error: {error}</div>;
    }

  return (
    <RoomListContainer>
      {roomList.map((room) => (
        <Link to={`/Chat/${room.roomId}`} key={room.roomId} style={{ textDecoration: 'none' }}>
          <RoomCard>
            <RoomHeader>
            <RoomName>{room.roomName}</RoomName>
            <GatherTypeButton>{room.gatherType.toUpperCase()}</GatherTypeButton>
            </RoomHeader>
            <RoomInfoContainer>
              <RoomInfo>
                <FaUser />
                {room.userCount}명
              </RoomInfo>
              <RoomInfo>
                <FaCommentDots />
                {room.latestMessage}
              </RoomInfo>
            </RoomInfoContainer>
          </RoomCard>
        </Link>
      ))}
    </RoomListContainer>
  );
};

export default ChatRoomList;
