import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, selectAuthLoading, selectAuthError } from '../../store/slices/authSlice';
import styled from 'styled-components';
import { RootState, AppDispatch } from '../../store/store';

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
  padding: 20px;
`;

const RegisterBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input<{ isValid: boolean }>`
  margin: 10px;
  padding: 10px;
  width: 250px;
  border: 1px solid ${({ isValid }) => (isValid ? '#ccc' : 'red')};
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #7848f4;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  width: 250px;
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SocialButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const SocialButton = styled.button`
  padding: 10px 20px;
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  width: 120px;
  margin: 0 5px;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 5px;
  height: 1.2em; /* 고정 높이를 설정하여 배치 변동을 방지 */
`;

const Register: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const error = useSelector(selectAuthError);
  const loading = useSelector(selectAuthLoading);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value.trim());
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError(null);
    } else {
      setEmailError('Invalid email format');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value.trim());
    if (value.length >= 8) {
      setPasswordError(null);
    } else {
      setPasswordError('Password must be at least 8 characters');
    }
  };

  const handleRegister = () => {
    if (emailError === null && passwordError === null && email !== '' && password !== '') {
      dispatch(register({ name, email, password }));
    }
  };

  return (
    <RegisterContainer>
      <h2>Register</h2>
      <RegisterBox>
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          isValid={true}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          isValid={emailError === null}
        />
        <ErrorMessage>{emailError}</ErrorMessage>
        <Input
          type="password"
          placeholder="Password (at least 8 characters)"
          value={password}
          onChange={handlePasswordChange}
          isValid={passwordError === null}
        />
        <ErrorMessage>{passwordError}</ErrorMessage>
        <Button onClick={handleRegister} disabled={emailError !== null || passwordError !== null || email === '' || password === ''}>
          Register
        </Button>
      </RegisterBox>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <SocialButtonsContainer>
        <SocialButton>Google로 회원가입</SocialButton>
        <SocialButton>Kakao로 회원가입</SocialButton>
      </SocialButtonsContainer>
    </RegisterContainer>
  );
};

export default Register;
