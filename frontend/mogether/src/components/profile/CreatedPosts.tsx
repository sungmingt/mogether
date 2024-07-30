import React, {useEffect, useState} from "react";
import styled from "styled-components";
import { AppDispatch, RootState } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import { selectUserId } from "../../store/slices/authSlice";
import { MyCreatedMoim, MyCreatedBungae } from "../../store/slices/userSlice";
import {Post} from "../../store/slices/userSlice";


const MyCreatePost: React.FC = () => {
    const userId = useSelector(selectUserId);   //authSlice에서 가져온 userId -> login 후 userProfile에 요청을 보냄
    const [createdCategory, setCreatedCategory] = useState<string>("moim");  //모임과 붕개 중 선택
    const [myCreatedMoimList, setMyCreatedMoimList] = useState<Post []>([]); //export interface Post
    const [myCreatedBungaeList, setMyCreatedBungaeList] = useState<Post []>([]); //export interface Post
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const myCreateMoimList = async () => {
            try {
                const response = await dispatch(MyCreatedMoim(userId)).unwrap();  //userId를 통해 해당 유저가 작성한 post를 가져옴
                setMyCreatedMoimList(response);  //가져온 post를(참고로 Post 자체가 아니라 Post 배열!) setCreatePostList에 저장
            }
            catch (error) {
                console.error(error);
            }
        };
        myCreateMoimList();
    }, [userId]);  //userId가 바뀔 때마다 렌더링 및 useEffect 실행

    useEffect(() => {
        const myCreateBungaeList = async () => {
            try {
                const response = await dispatch(MyCreatedBungae(userId)).unwrap();  //userId를 통해 해당 유저가 작성한 post를 가져옴
                setMyCreatedBungaeList(response);  //가져온 post를(참고로 Post 자체가 아니라 Post 배열!) setCreatePostList에 저장
            }
            catch (error) {
                console.error(error);
            }
        };
        myCreateBungaeList();
    }, [userId]);  //userId가 바뀔 때마다 렌더링 및 useEffect 실행
    
    return (
        <div>
            <h1>My Create Post</h1>
        </div>
    );
};

export default MyCreatePost;
