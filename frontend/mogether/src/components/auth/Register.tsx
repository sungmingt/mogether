import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { AppDispatch, RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { selectAuthLoading, selectIsAuthenticated, kakaoRegister, googleRegister } from '../../store/slices/authSlice';
import {registerUser} from "../../store/slices/userProfileSlice";
import { FaCamera } from "react-icons/fa";
import GoogleRedirectUrlPage from "./GoogleRedirectUrlPage";
import KakaoRedirectUrlPage from "./KakaoRedirectUrlPage";


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

const Register: React.FC = () => {
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
  const [age, setAge] = useState<number>(0);
  const [gender, setGender] = useState<string>("");
  const [intro, setIntro] = useState<string>("");
  const [phoneNumber, setphoneNumber] = useState<string>("");
  const error = useSelector((state: RootState) => state.auth.error);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch<AppDispatch>();
  const [profileImage, setProfileImage] = useState<File | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value.trim());
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError(null);
    } else {
      setEmailError("올바르지 않은 이메일 형식입니다");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value.trim());
    if (/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)) {
      setPasswordError(null);
    } else {
      setPasswordError("비밀번호는 8자 영문자와 특수문자, 숫자의 조합으로 이루어져야 합니다");
    }
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value.trim());
    if (value.length >= 2) {
      setNicknameError(null);
    } else {
      setNicknameError("두 글자 이상 입력해주세요");
    }
  };


  const handleRegister = async () => {
    if (   // 아래의 모든 조건을 만족해야 회원가입 가능
      emailError === null &&
      passwordError === null &&
      email !== "" &&
      password !== ""
    ) {
      const registerForm = {
        email: email,
        password: password,
        name: name,
        nickname: nickname,
        address: address,
        age: age,
        gender: gender,
        intro: intro,
        phoneNumber: phoneNumber
      };
      const registerFormData = new FormData();
      registerFormData.append('dto', new Blob([JSON.stringify(registerForm)], { type: 'application/json' }));

      if (profileImage) {
        registerFormData.append('image', profileImage);
	    }
	    else {
	      registerFormData.append('image', null as any);
	    };
      try {
        const response = await dispatch(registerUser(registerFormData)).unwrap();
        navigate("/Login");
      } catch (error: any) {
        if (error.response && error.response.status === 409) {
          Swal.fire('Conflict', '이미 존재하는 계정입니다.', 'error');
        }
        else {
          Swal.fire('error', '회원가입에 실패했습니다.', 'error'); 
        }
      }
    }
    else {
      Swal.fire('error', '필수 요청 사항을 모두 입력해 주세요', 'error');
      return;
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleKakaoRegister = async () => {
    window.location.href='https://api.mo-gether.site/oauth2/authorization/kakao';
  }

  const handleGoogleRegister = async () => {
    window.location.href='https://api.mo-gether.site/oauth2/authorization/google';
  }

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
            placeholder="Nickname"
            value={nickname}
            onChange={handleNicknameChange}
            isValid={nicknameError === null}
          />
          <ErrorMessage>{nicknameError}</ErrorMessage>
        </InputWrapper>
        <InputWrapper>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            isValid={emailError === null}
          />
          <ErrorMessage>{emailError}</ErrorMessage>
        </InputWrapper>
        <InputWrapper>
          <Input
            type="password"
            placeholder="Password (at least 8 characters)"
            value={password}
            onChange={handlePasswordChange}
            isValid={passwordError === null}
          />
          <ErrorMessage>{passwordError}</ErrorMessage>
        </InputWrapper>
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
          onClick={handleRegister}
        >
          Register
        </Button>
        <ImageWrapper2 src={require("../../assets/OR.png")} />
        <SocialButtonsContainer>
          <SocialButton onClick={handleGoogleRegister}>
            <img src={require("../../assets/Google__G__logo 1.png")} />
            Google로 회원가입
          </SocialButton>
          <KakaoButton onClick={handleKakaoRegister}><img src={require("../../assets/KakaoTalk_logo 1.png")}/>Kakao로 회원가입</KakaoButton>
        </SocialButtonsContainer>
      </RegisterBox>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </RegisterContainer>
  );
};

export default Register;
