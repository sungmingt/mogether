import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { fetchProfile, PatchUserProfile, DeleteUser } from "../../store/slices/userProfileSlice";
import { AppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { locations } from "../../utils/location";
import { fetchChatRooms } from "../../store/slices/chatSlice";
import { FaUser } from "react-icons/fa";

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
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 15px;
  width: 100%;
  max-width: 600px;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
`;

const Value = styled.div`
  width: 100%;
  padding: 10px;
  background-color: #eee;
  border-radius: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
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

const DeleteButton = styled.button`
  padding: 10px 20px;
  background-color: #FF0000;
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

const FileInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;

const FileLabel = styled.label`
  padding: 10px 20px;
  background-color: #7848f4;
  color: #ffffff;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
  &:hover {
    background-color: #5c3bbf;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const Divider = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid #eee;
  margin: 20px 0;
`;

const AddressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MemoContainer = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: #fff9c4;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  border: 1px solid #f1e06f;
`;

const MemoTitle = styled.h3`
  margin-bottom: 10px;
  color: #7848f4;
  font-size: 1.5rem;
`;

const MemoList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const MemoListItem = styled.li`
  background-color: #ffffff;
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: #f1e06f;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const MemoNicknameContainer = styled.div`
  display: flex;
  align-items: center;
`;

const MemoRoomName = styled.span`
  font-weight: bold;
  margin-left: 6px;
`;

const MemoUserCount = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const MyProfile: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const userId = Number(localStorage.getItem('userId')) || 0;
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchProfileData = async () => {
        try {
            const response = await dispatch(fetchProfile(userId)).unwrap(); 
            setFormData(response);
            if (response.imageUrl) setPreviewImage(response.imageUrl);
            setSelectedCity(response.address?.city || '');
            setSelectedDistrict(response.address?.gu || '');
        }
        catch (error) {
            console.error(error);
            Swal.fire('error', 'Failed to fetch profile data', 'error');
        }
    }
    fetchProfileData();
  }, [dispatch, userId]);

  useEffect(() => {
    if (!accessToken) {
      navigate("/login");
    }
  }, [accessToken, navigate]);

  useEffect(() => {
    const fetchChatRoomsData = async () => {
      try {
        const chatRoomsData = await dispatch(fetchChatRooms(userId)).unwrap();
        setChatRooms(chatRoomsData);  //참여한 모임 리스트 저장
      } catch (error) {
        console.error("Failed to fetch chat rooms", error);
      }
    };

    fetchChatRoomsData();
  }, [dispatch, userId]);

  const handleRoomClick = (gatherType: string, roomId: number) => {
    navigate(`/${gatherType}/${roomId}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    setSelectedCity(city);
    setSelectedDistrict(''); // Reset district when city changes
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        city,
        gu: '',
      },
    });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const district = e.target.value;
    setSelectedDistrict(district);
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        gu: district,
      },
    });
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const details = e.target.value;
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        details,
      },
    });
  };

  const handleUserDelete = async () => {
    try {
      await dispatch(DeleteUser(userId)).unwrap();
      Swal.fire("Success", "성공적으로 탈퇴되었습니다.", "success");
      navigate("/");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", 'Failed to delete user', 'error');
    }
  }

  const handleToggleEdit = async () => {
    if (editMode) {
      if (!formData.nickname) {
        Swal.fire("error", "Nickname is required", "error");
        return;
      }
  
      const patchData = new FormData();
      if (profileImage) {
        patchData.append("image", profileImage);
      } else {
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
        const profileData = { patchData, userId };
        await dispatch(PatchUserProfile(profileData)).unwrap();
        Swal.fire('Success', '프로필이 수정되었습니다.', 'success'); 
      } catch (error) {
        console.error(error);
        Swal.fire('error', 'Failed to update profile', 'error');
      }
    }
    setEditMode(!editMode);
  };

  return (
    <ProfileContainer>
      <ProfileTitle>My Profile</ProfileTitle>
      <ProfileImage src={previewImage || "../../assets/user_default.png"} alt="Profile" />
      {editMode && (
        <FileInputContainer>
          <FileLabel htmlFor="fileInput">이미지 선택</FileLabel>
          <FileInput id="fileInput" type="file" accept="image/*" onChange={handleImageChange} />
        </FileInputContainer>
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
      <Divider />
      <ProfileItem>
        <Label>Address:</Label>
        {editMode ? (
          <AddressContainer>
            <Select
              value={selectedCity}
              onChange={handleCityChange}
            >
              <option value="">행정시를 선택하세요</option>
              {locations.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </Select>
            <Select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              disabled={!selectedCity}
            >
              <option value="">행정구를 선택하세요</option>
              {locations.find((loc) => loc.name === selectedCity)?.subArea.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </Select>
            <Input
              type="text"
              name="details"
              value={formData.address?.details}
              onChange={handleDetailsChange}
              placeholder="Details"
            />
          </AddressContainer>
        ) : (
          <Value>
            {formData.address?.city} {formData.address?.gu}{" "}
            {formData.address?.details}
          </Value>
        )}
      </ProfileItem>
      <Divider />
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
      <Divider />
      <ProfileItem>
        <Label>Gender:</Label>
        {editMode ? (
          <Select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          >
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
          </Select>
        ) : (
          <Value>{formData.gender}</Value>
        )}
      </ProfileItem>
      <Divider />
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
      <Divider />
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
      <Divider />
      <Button onClick={handleToggleEdit}>
        {editMode ? "Save Changes" : "Edit Profile"}
      </Button>
      <DeleteButton onClick={handleUserDelete}>탈퇴하기</DeleteButton>
      <MemoContainer>
        <MemoTitle>참여한 모임 리스트</MemoTitle>
        <MemoList>
          {chatRooms.length > 0 ? (
            chatRooms.map((room) => (
              <MemoListItem key={room.roomId} onClick={() => handleRoomClick(room.gatherType, room.gatherId)}>
                <MemoNicknameContainer><FaUser /><MemoRoomName>{room.roomName}</MemoRoomName></MemoNicknameContainer>
                <MemoUserCount>{room.userCount}명 참여 중</MemoUserCount>
              </MemoListItem>
            ))
          ) : (
            <p>참여한 모임이 없습니다.</p>
          )}
        </MemoList>
      </MemoContainer>
    </ProfileContainer>
  );
};

export default MyProfile;
