import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { fetchProfile, selectUserProfile, PatchUserProfile } from "../../store/slices/userProfileSlice";
import { RootState, AppDispatch } from "../../store/store";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { selectUserId, selectIsAuthenticated } from "../../store/slices/authSlice";

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 900px;
  margin: auto;
`;

const ProfileTitle = styled.h2`
  margin-bottom: 20px;
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  width: 150px;
  height: 150px;
  object-fit: cover;
  margin-bottom: 20px;
`;

const ProfileItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  width: 100%;
  max-width: 600px;
`;

const Label = styled.label`
  font-weight: bold;
  margin-right: 10px;
  width: 120px;
`;

const Value = styled.div`
  flex: 1;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #7848f4;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const userProfile: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams<{ id: string }>(); // URL에서 moimId를 가져옴 -> 여기서 url은 내가 설정한 url
  const userId = id ? parseInt(id, 10) : 0;
  const [formData, setFormData] = useState<any>({});
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchProfileData = async () => {
        try {
            console.log(userId);
            const response = await dispatch(fetchProfile(userId)).unwrap();  //dispatch로 인해 profile 변경 -> useSelector로 변경값 갱신 -> 그걸 가져옴
            console.log(response);
            setFormData(response);
            console.log(response);
        }
        catch (error) {
            console.error(error);
            Swal.fire('error', error as string, 'error');
        }
    }
    fetchProfileData();
  }, [dispatch, userId])

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
  }, [accessToken, navigate]);


// 여기서 이미지는 오로지 url로만
  return (
    <ProfileContainer>
      <ProfileTitle>My Profile</ProfileTitle> 
      <ProfileImage src={formData.imageUrl || "../../assets/user_default.png"} alt="Profile" />
      <ProfileItem>
        <Label>Nickname:</Label>
        <Value>{formData.nickname}</Value>
      </ProfileItem>
      <ProfileItem>
        <Label>Name:</Label>
        <Value>{formData.name}</Value>
      </ProfileItem>
      <ProfileItem>
        <Label>Address:</Label>
        <Value>
            {formData.address?.city} {formData.address?.gu}{" "}
            {formData.address?.details}
          </Value>
      </ProfileItem>
      <ProfileItem>
        <Label>Age:</Label>
        <Value>{formData.age}</Value>
      </ProfileItem>
      <ProfileItem>
        <Label>Gender:</Label>
        <Value>{formData.gender}</Value>
      </ProfileItem>
      <ProfileItem>
        <Label>Intro:</Label>
        <Value>{formData.intro}</Value>
      </ProfileItem>
      <ProfileItem>
        <Label>Phone Number:</Label>
        <Value>{formData.phoneNumber}</Value>
      </ProfileItem>
    </ProfileContainer>
  );
};

export default userProfile;


