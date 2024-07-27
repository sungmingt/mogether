import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../store/store";


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

const ErrorMessage = styled.p`
  color: red;
  margin-top: 2px;
  font-size: 0.8em; /* 경고문을 작게 설정 */
  position: absolute;
  top: 100%; /* 입력 필드 바로 아래에 위치 */
  left: 0;
`;

const Register: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const error = useSelector((state: RootState) => state.auth.error);
  const loading = useSelector((state: RootState) => state.auth.loading);

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

  const handleRegister = () => {
    if (
      emailError === null &&
      passwordError === null &&
      email !== "" &&
      password !== ""
    ) {
      console.log("Register:", { name, email, password });
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
            onChange={(e) => setName(e.target.value)}
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
        <Button
          onClick={handleRegister}
          disabled={
            emailError !== null ||
            passwordError !== null ||
            email === "" ||
            password === ""
          }
        >
          Register
        </Button>
        <img src={require("../../assets/OR.png")} />
        <SocialButtonsContainer>
          <SocialButton>
            <img src={require("../../assets/Google__G__logo 1.png")} />
            Google로 회원가입
          </SocialButton>
          <SocialButton>Kakao로 회원가입</SocialButton>
        </SocialButtonsContainer>
      </RegisterBox>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </RegisterContainer>
  );
};

export default Register;
