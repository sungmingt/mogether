import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectMoimPost, clickPosts, clickInterest } from '../../store/slices/postSlice';
import { RootState, AppDispatch } from '../../store/store';
import { Post } from '../../store/slices/postSlice';
// import { interestApi, joinApi } from '../../utils/api';
import { stat } from 'fs';
import {selectUserProfile} from '../../store/slices/userSlice';






const Card = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  display: flex;
`;


const PostCard = () => {
    const [eventInfo, setEventInfo] = useState<Post | null>(null);  //가져온 배열정보 저장
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id: string }>(); // URL에서 moimId를 가져옴
    const moimId = id ? parseInt(id, 10) : 0; // id가 존재하면 숫자로 변환하고, 그렇지 않으면 0으로 설정
    const error = useSelector((state: RootState) => state.post.error);
    const loading = useSelector((state: RootState) => state.post.loading);
    const userProfile = useSelector(selectUserProfile);
    const userId = userProfile ? userProfile.userId : 0;
    


    
    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await dispatch(clickPosts(moimId)).unwrap();
                setEventInfo(response);
            }
            catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [dispatch, moimId]);  //dispatch 또는 moimdId가 변경될 때마다 hook 실행

    const handleInterest = async () => {
        if (eventInfo) {  //eventInfo가 존재할 경우
            try {
              const response = await dispatch(clickInterest({ moimId: eventInfo.id, userId: userId })).unwrap();
              const updatedEventInfo = {
                ...eventInfo,
                isInterested: !eventInfo.isInterested,
                interestsCount: eventInfo.isInterested ? eventInfo.interestsCount - 1 : eventInfo.interestsCount + 1,
              };  
              setEventInfo(updatedEventInfo);
            } catch (error) {
              alert('Failed to toggle interest');
            }  //sweetal2를 이용해서 꾸며주기!
        }
    }

    const handleParticipant = async () => {
        // const response = await dispatch(clickParticipant({ moimId: eventInfo.id, userId: userId })).unwrap();
    }


    return(
        <Card>
            {eventInfo ? (
                <>
                    <h2>{eventInfo.title}</h2>
                    <p>{eventInfo.content}</p>
                    <p>Host: {eventInfo.hostName}</p>
                    <img src={eventInfo.hostProfileImageUrl} alt="Host Profile" />
                    <p>Participants: {eventInfo.participantsCount}</p>
                    <p>Address: {eventInfo.address.city}, {eventInfo.address.gu}, {eventInfo.address.details}</p>
                    <p>Created At: {eventInfo.createdAt}</p>
                    <p>Expire At: {eventInfo.expireAt}</p>
                    <p>{eventInfo.interestsCount}</p>
                </>
            ) : (
                error ? (
                    <p>Error</p>
                ) : (
                    <p>Loading...</p>
                )
            )}
        </Card>
    );
}

export default PostCard;