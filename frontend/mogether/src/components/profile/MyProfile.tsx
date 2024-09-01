import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { fetchProfile, selectUserProfile, PatchUserProfile, DeleteUser } from "../../store/slices/userProfileSlice";
import { RootState, AppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";
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

const FileInput = styled.input`
  margin-top: 10px;
`;

const MyProfile: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const userId = Number(localStorage.getItem('userId')) || 0;
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchProfileData = async () => {
        try {
            const response = await dispatch(fetchProfile(userId)).unwrap();  //dispatch로 인해 profile 변경 -> useSelector로 변경값 갱신 -> 그걸 가져옴
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleUserDelete = async () => {  // 인자로 받는게 없음
    try {
      const response = await dispatch(DeleteUser(userId));
      Swal.fire("Success", "성공적으로 탈퇴되었습니다.", "success");
      navigate("/");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", error as string, "error");
    }
  }

  const handleToggleEdit = async () => {
    if (editMode) {  //editMode가 true인 경우
      if (editMode) {
        if (!formData.nickname) {
          Swal.fire("error", "Nickname and Name are required", "error");
          return;
        }
  
        const patchData = new FormData();
        if (profileImage) {
          patchData.append("image", profileImage);
        }
        else {
          patchData.append("image", "null");
        }
        patchData.append(
          "dto",
          new Blob(
            [
              JSON.stringify({
                nickname: formData.nickname,
                address: formData.address,
                age: formData.age,
                gender: formData.gender,
                intro: formData.intro,
                phoneNumber: formData.phoneNumber,
              }),
            ],
            { type: "application/json" }
          )
        );
      try {
        const response = await dispatch(PatchUserProfile(patchData)).unwrap();
        // window.location.reload();  //useEffect를 한번 더 실행?
        Swal.fire('Success', '프로필이 수정되었습니다.', 'success'); 
      }
      catch (error) {
        console.error(error);
        Swal.fire('error', error as string, 'error');
      }
    }
    setEditMode(!editMode);
  }
};

  return (
    <ProfileContainer>
      <ProfileTitle>My Profile</ProfileTitle>
      <ProfileImage src={formData.imageUrl || "../../assets/user_default.png"} alt="Profile" />
      {editMode && (
        <FileInput type="file" accept="image/*" onChange={handleImageChange} />
      )}
      <ProfileItem>
        <Label>Nickname:</Label>
        {editMode ? (
          <Input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleInputChange}
          />
        ) : (
          <Value>{formData.nickname}</Value>
        )}
      </ProfileItem>
      <ProfileItem>
        <Label>Address:</Label>
        {editMode ? (
          <>
            <Input
              type="text"
              name="city"
              value={formData.address?.city}
              onChange={handleInputChange}
              placeholder="City"
            />
            <Input
              type="text"
              name="gu"
              value={formData.address?.gu}
              onChange={handleInputChange}
              placeholder="GU"
            />
            <Input
              type="text"
              name="details"
              value={formData.address?.details}
              onChange={handleInputChange}
              placeholder="Details"
            />
          </>
        ) : (
          <Value>
            {formData.address?.city} {formData.address?.gu}{" "}
            {formData.address?.details}
          </Value>
        )}
      </ProfileItem>
      <ProfileItem>
        <Label>Age:</Label>
        {editMode ? (
          <Input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
          />
        ) : (
          <Value>{formData.age}</Value>
        )}
      </ProfileItem>
      <ProfileItem>
        <Label>Gender:</Label>
        {editMode ? (
          <Input
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          />
        ) : (
          <Value>{formData.gender}</Value>
        )}
      </ProfileItem>
      <ProfileItem>
        <Label>Intro:</Label>
        {editMode ? (
          <Input
            type="text"
            name="intro"
            value={formData.intro}
            onChange={handleInputChange}
          />
        ) : (
          <Value>{formData.intro}</Value>
        )}
      </ProfileItem>
      <ProfileItem>
        <Label>Phone Number:</Label>
        {editMode ? (
          <Input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
        ) : (
          <Value>{formData.phoneNumber}</Value>
        )}
      </ProfileItem>
      <Button onClick={handleToggleEdit}>
        {editMode ? "Save Changes" : "Edit Profile"}
      </Button>
      <Button onClick={handleUserDelete}>탈퇴하기</Button>
    </ProfileContainer>
  );
};

export default MyProfile;


