import React, { useEffect, useState } from "react";
import styled from "styled-components";
// import { MoimInterestApi, BungaeInterestApi } from "../../utils/api"; 여기는 slice에서 관리
import { RootState, AppDispatch } from "../../store/store";
import {MyInterestedBungae, MyInterestedMoim, selectUserProfile} from "../../store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectUserId } from "../../store/slices/authSlice";
import { Post } from "../../store/slices/userSlice";  //userSlice의 Post 기준! 왜냐면 여기서 내가 작성한 글을 관리하니까!




const MyInterestPost: React.FC = () => {
    const userId = useSelector(selectUserId);
    const dispatch = useDispatch<AppDispatch>();
    const [interestCategory, setInterestCategory] = useState<string>("moim");
    const [myInterestMoim, setMyInterestMoim] = useState<Post[]>([]); 
    const [myInterestBungae, setMyInterestBungae] = useState<Post[]>([]); 

    useEffect(() => {
        const myInterestMoimList = async () => {
            try {
                const response = await dispatch(MyInterestedMoim(userId)).unwrap();
                setMyInterestMoim(response);    
            }
            catch (error) {
                console.error(error);
            }
        };
        myInterestMoimList();
    }, [userId]);

    useEffect(() => {
        const myInterestBungaeList = async () => {
            try {
                const response = await dispatch(MyInterestedBungae(userId)).unwrap();
                setMyInterestBungae(response);    
            }
            catch (error) {
                console.error(error);
            }
        };
        myInterestBungaeList();
    }, [userId]);

    
    
    return (
        <div>
            <h1>My Create Post</h1>
        </div>
    );
};

export default MyInterestPost;