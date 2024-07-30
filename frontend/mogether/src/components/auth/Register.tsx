import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../store/store";
import { registerApi } from '../../utils/api';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { selectAuthLoading, selectIsAuthenticated } from '../../store/slices/authSlice';


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

// 카카오 버튼의 배경색은 #ffe812

const ErrorMessage = styled.p`
  color: red;
  margin-top: 2px;
  font-size: 0.8em; /* 경고문을 작게 설정 */
  position: absolute;
  top: 100%; /* 입력 필드 바로 아래에 위치 */
  left: 0;
`;

const ImageWrapper = styled.img`
  // box-sizing: border-box;
  // justify-contents: center;
  // display: block;
  // padding: 10px;
  // width: auto;
  // margin: 10px;
  // display: flex;
  // width: 80%;
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
  const [age, setAge] = useState<number>();
  const [gender, setGender] = useState<string>("");
  const [intro, setIntro] = useState<string>("");
  const [phoneNumber, setphoneNumber] = useState<string>("");
  const error = useSelector((state: RootState) => state.auth.error);
  const loading = useSelector((state: RootState) => state.auth.loading);
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

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
      setEmailError("Invalid email format");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value.trim());
    if (value.length >= 8) {
      setPasswordError(null);
    } else {
      setPasswordError("Password must be at least 8 characters");
    }
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value.trim());
    if (value.length >= 2) {
      setNicknameError(null);
    } else {
      setNicknameError("Nickname must be at least 2 characters");
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {  //입력하자마자 함수가 바로 실행되면서 -> 입력값이 그대로 들어간다
    const value = e.target.value;
    setName(value.trim());
    if (value.length > 0) {
      setNameError(null);
    } else {
      setNameError("이름을 입력해 주세요");
    }
  };

  const handleRegister = async () => {
    if (
      emailError === null &&
      passwordError === null &&
      email !== "" &&
      password !== ""
    ) {
      const registerFormData = {
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
      const response = await registerApi(registerFormData);
      if (response.status === 200 || 201) {
        navigate("/login");
      }
      else {
        Swal.fire('error', 'Registration failed', 'error');
      }
    }
  };

  return (
    <RegisterContainer>
      <h2>Register</h2>
      <RegisterBox>
        <InputWrapper>
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={handleNameChange}
            isValid={true}
          />
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
            placeholder="Nickname"
            value={nickname}
            onChange={handleNicknameChange}
            isValid={passwordError === null}
          />
          <ErrorMessage>{nicknameError}</ErrorMessage>
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
          disabled={
            emailError !== null ||
            passwordError !== null ||
            email === "" ||
            password === "" ||
            nameError !== null ||
            nicknameError !== null ||
            name === ""||
            nickname === ""
          }
        >
          Register
        </Button>
        <ImageWrapper src={require("../../assets/OR.png")} />
        <SocialButtonsContainer>
          <SocialButton>
            <img src={require("../../assets/Google__G__logo 1.png")} />
            Google로 회원가입
          </SocialButton>
          <KakaoButton><img src={require("../../assets/KakaoTalk_logo 1.png")}/>Kakao로 회원가입</KakaoButton>
        </SocialButtonsContainer>
      </RegisterBox>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </RegisterContainer>
  );
};

export default Register;
