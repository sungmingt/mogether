import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { AppDispatch, RootState } from "../../store/store";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { selectAuthLoading, selectIsAuthenticated } from '../../store/slices/authSlice';
import {socialRegisterUser} from "../../store/slices/userProfileSlice";
import { FaCamera } from "react-icons/fa";


const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
  background-color: #fff;

  @media (max-width: 768px) {
    max-width: 80%;
  }
`;

const RegisterBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const InputWrapper = styled.div`
  width: 100%;
  margin: 10px;
  position: relative;
  display: flex;
`;

const Input = styled.input<{ isValid?: boolean }>`
  padding: 10px;
  width: 100%;
  border: 1px solid
    ${({ isValid }) =>
      isValid !== undefined ? (isValid ? "#ccc" : "red") : "#ccc"};
  border-radius: 5px;
  justify-content: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #7848f4;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SocialButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
  width: 100%;
  padding: 10px;
`;

const orImage = styled.div`
  img {
    margin-right: 8px;
    width: 20px;
    height: 20px;
  }
`;

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background-color: #fff;
  color: #000;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  width: 48%;
  img {
    margin-right: 8px;
    width: 20px;
    height: 20px;
  }
`;

const KakaoButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background-color: #ffe812;
  color: #000;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  width: 48%;
  img {
    margin-right: 8px;
    width: 20px;
    height: 20px;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 2px;
  font-size: 0.8em; /* 경고문을 작게 설정 */
  position: absolute;
  top: 100%; /* 입력 필드 바로 아래에 위치 */
  left: 0;
`;

const ImageWrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const UserImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
`;

const CameraIcon = styled(FaCamera)`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #fff;
  border-radius: 50%;
  padding: 5px;
  cursor: pointer;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ImageWrapper2 = styled.img`
  display: flex;
  width: 100%;
  margin-top: 10px;
`;

const SocialRegister: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>("");
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [address, setAddress] = useState<{
    city: string;
    gu: string;
    details: string;
  }>({ city: "", gu: "", details: "" });
  const [age, setAge] = useState<number>();
  const [gender, setGender] = useState<string>("");
  const [intro, setIntro] = useState<string>("");
  const [phoneNumber, setphoneNumber] = useState<string>("");
  const error = useSelector((state: RootState) => state.auth.error);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch<AppDispatch>();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const { id } = useParams<{ id: string }>();
  const userId = id ? parseInt(id, 10) : 0;

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  // const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   setNickname(value.trim());
  //   if (value.length >= 2) {
  //     setNicknameError(null);
  //   } else {
  //     setNicknameError("Nickname must be at least 2 characters");
  //   }
  // };


  const handleSocialRegister = async () => {
    const socialRegisterForm = {
      address: address,
      age: age,
      gender: gender,
      intro: intro,
      phoneNumber: phoneNumber
    };
    const socialRegisterFormData = new FormData();
    socialRegisterFormData.append('dto', new Blob([JSON.stringify(socialRegisterForm)], { type: 'application/json' }));
    if (profileImage) {
      socialRegisterFormData.append('images', profileImage);
    }
    else {
      socialRegisterFormData.append('images', null as any);
    };
    try {
      const response = await dispatch(socialRegisterUser({socialRegisterFormData, userId})).unwrap();
      navigate("/login");
    }
    catch (error) {
      Swal.fire('error', '잘못된 요청입니다', 'error');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
    }
  };

  return (
    <RegisterContainer>
      <h2>Register</h2>
      <RegisterBox>
      <ImageWrapper>
          <UserImage
            src={
              profileImage
                ? URL.createObjectURL(profileImage)
                : "https://via.placeholder.com/100?text=User+Image"
            }
            alt="User Profile"
            onClick={() => document.getElementById("fileInput")?.click()}
          />
          <CameraIcon
            onClick={() => document.getElementById("fileInput")?.click()}
          />
          <HiddenFileInput
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </ImageWrapper>
        <InputWrapper>
          <Input
            type="text"
            placeholder="city"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            isValid={true}
          />
        </InputWrapper>
        <InputWrapper>
          <Input
            type="text"
            placeholder="gu"
            value={address.gu}
            onChange={(e) => setAddress({ ...address, gu: e.target.value })}
            isValid={true}
          />
        </InputWrapper>
        <InputWrapper>
          <Input
            type="text"
            placeholder="details"
            value={address.details}
            onChange={(e) =>
              setAddress({ ...address, details: e.target.value })
            }
            isValid={true}
          />
        </InputWrapper>
        <InputWrapper>
          <Input
            type="number"
            placeholder="age"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value))}
            isValid={true}
          />
        </InputWrapper>
        <InputWrapper>
          <Input
            type="text"
            placeholder="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            isValid={true}
          />
        </InputWrapper>
        <InputWrapper>
          <Input
            type="text"
            placeholder="intro"
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            isValid={true}
          />
        </InputWrapper>
        <InputWrapper>
          <Input
            type="text"
            placeholder="010-xxxx-xxxx 형식으로 입력해 주세요"
            value={phoneNumber}
            onChange={(e) => setphoneNumber(e.target.value)}
            isValid={true}
          />
        </InputWrapper>
        <Button
          onClick={handleSocialRegister}
        >
          Register
        </Button>
      </RegisterBox>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </RegisterContainer>
  );
};

export default SocialRegister;
