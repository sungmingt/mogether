import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, selectAuthLoading, selectAuthError, selectIsAuthenticated } from '../../store/slices/authSlice';
import styled from 'styled-components';
import { RootState, AppDispatch } from '../../store/store';
import { useNavigate } from 'react-router-dom';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
  padding: 20px;
`;

const Input = styled.input`
  margin: 10px;
  padding: 10px;
  width: 250px;
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
  margin-top: 10px;
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SocialButton = styled.button`
  padding: 10px 20px;
  margin: 5px;
  background-color: #fff;
  color: #000;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  width: 250px;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 10px;
`;

const Login: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const error = useSelector(selectAuthError);
  // const loading = useSelector(selectAuthLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleLogin = () => {
    if (email !== '' && password !== '') {
      dispatch(login({ email, password }));
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); // 리디렉션
    }
  }, [isAuthenticated, navigate]);

  return (
    <LoginContainer>
      <h2>Login</h2>
      <div>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleLogin} disabled={email === '' || password === ''}>
          Login
        </Button>
      </div>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <div>
        <SocialButton>Google로 로그인</SocialButton>
        <SocialButton>Kakao로 로그인</SocialButton>
      </div>
      <div>
        <a href="/forgot-password">Forgot your password?</a>
      </div>
    </LoginContainer>
  );
};

export default Login;
