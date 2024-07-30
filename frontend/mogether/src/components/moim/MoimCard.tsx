import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectMoimPost, clickPosts, clickInterest, clickJoin, deleteInterest } from '../../store/slices/moimSlice';
import { RootState, AppDispatch } from '../../store/store';
import { Post } from '../../store/slices/moimSlice';
// import { interestApi, joinApi } from '../../utils/api';
import { stat } from 'fs';
import {selectUserProfile} from '../../store/slices/userSlice';
import Swal from "sweetalert2";






const Card = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  display: flex;
`;


const MoimCard = () => {
    const [eventInfo, setEventInfo] = useState<Post | null>(null);  //가져온 객체 저장
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id: string }>(); // URL에서 moimId를 가져옴 -> 여기서 url은 내가 설정한 url
    const moimId = id ? parseInt(id, 10) : 0; // id가 존재하면 숫자로 변환하고, 그렇지 않으면 0으로 설정
    const error = useSelector((state: RootState) => state.moim.error);
    const loading = useSelector((state: RootState) => state.moim.loading);
    const userProfile = useSelector(selectUserProfile);
    const userId = userProfile ? userProfile.userId : 0;
    const joined = useSelector(selectMoimPost)?.joined;  //null or defined값이 들어올 수도 있기 때문에...
    const interested = useSelector(selectMoimPost)?.interested;
    


    
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

    const handleInterest = async () => {  //단건 조회
        if (eventInfo) {  //eventInfo가 존재할 경우
            try {
            const response = await dispatch(clickInterest({ moimId: eventInfo.id, userId: userId })).unwrap();  //반환값인 response.data(action.payload만 반환하게 함)
            const updatedEventInfo = {
              ...eventInfo,
              interested: true,
              interestsCount: eventInfo.interestsCount + 1,
            };  
            setEventInfo(updatedEventInfo);
            } catch (error) {
              Swal.fire('error','Failed to toggle interest', 'error');
            }  //sweetal2를 이용해서 꾸며주기!
        }
    }

    const handleDeleteInterest = async () => {
        if (eventInfo) {
            try{
                const response = await dispatch(deleteInterest({moimId: eventInfo.id, userId: userId})).unwrap();
                const updatedEventInfo = {
                    ...eventInfo,
                    interested: false,
                    interestsCount: eventInfo.interestsCount - 1,
                  };  
                  setEventInfo(updatedEventInfo);            
                } catch (error) {
                Swal.fire("error","failed","error");
            }
        }
    }

    const handleJoin = async () => {
        if (eventInfo) {  //eventInfo가 존재할 경우
            try {
              const response = await dispatch(clickJoin({ moimId: eventInfo.id, userId: userId })).unwrap();
              const updatedEventInfo = {
                ...eventInfo,
                joined: true,
                participantsCount: eventInfo.participantsCount + 1,
              };  
              setEventInfo(updatedEventInfo);
            } catch (error) {
              alert('Failed to toggle join');
            }  //sweetal2를 이용해서 꾸며주기!
        }
    }

    const handleQuitJoin = async () => {
        if (eventInfo) {  //eventInfo가 존재할 경우
            try {
              const response = await dispatch(clickJoin({ moimId: eventInfo.id, userId: userId })).unwrap();
              const updatedEventInfo = {
                ...eventInfo,
                joined: false,
                participantsCount: eventInfo.participantsCount - 1,
              };  
              setEventInfo(updatedEventInfo);
            } catch (error) {
              alert('Failed to toggle join');
            }  //sweetal2를 이용해서 꾸며주기!
        }
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
                    {joined? (<button onClick ={() => {handleJoin}}>join</button>) : (<button onClick ={() => {handleJoin}}>cancel</button>)}
                    {interested? (<button onClick ={() => {handleInterest}}>Interest</button>): (<button onClick ={() => {handleDeleteInterest}}>Cancel Interest</button>)}
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

export default MoimCard;