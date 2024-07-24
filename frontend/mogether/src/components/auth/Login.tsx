import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, socialLogin, selectAuthError, selectIsAuthenticated } from '../../store/slices/authSlice';
import styled from 'styled-components';
import { RootState, AppDispatch } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import KakaoLogin from 'react-kakao-login';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  background-color: #ffffff;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 20px;
  @media (max-width: 768px) {
    width: 90%;
	padding: 15px;
  }
`;

const Input = styled.input`
  margin: 10px;
  padding: 10px;
  width: 80%;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #7848f4;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  width: 50%;
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;
const GoogleButton = styled.button`
  display: flex;
  // flex-direcrion: row;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  margin: 5px;
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
  // flex-direcrion: row;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  margin: 5px;
  background-color: #ffe812;
  color: #000;
  border: 1px solid #ffe812;
  border-radius: 5px;
  cursor: pointer;
  width: 48%;
  img {
    margin-right: 8px;
    width: 20px;
    height: 20px;
  }
`;

const SocialButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 80%;
  margin: 20px;
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
  const error = useSelector((state: RootState) => selectAuthError(state));
  const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));

  const handleLogin = () => {
    if (email !== '' && password !== '') {
      dispatch(login({ email, password }));
    }
  };

  const responseGoogle = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if ('tokenId' in response) {
      dispatch(socialLogin({ provider: 'google', token: response.tokenId }));
    }
  };

  const responseKakao = (response: any) => {
    dispatch(socialLogin({ provider: 'kakao', token: response.response.access_token }));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <LoginContainer>
      <h2>Login</h2>
      
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
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <SocialButtonContainer>
        <GoogleLogin
          clientId="YOUR_GOOGLE_CLIENT_ID"
          buttonText="Google로 로그인하기"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
          render={(props: any) => (
            <GoogleButton onClick={props.onClick} disabled={props.disabled}>
              <img src="../../assets/googleLogo" alt="Google logo" />
              구글로 로그인하기
            </GoogleButton>
          )}
        />
        <KakaoLogin
          token="YOUR_KAKAO_APP_KEY"
          onSuccess={responseKakao}
          onFail={responseKakao}
          render={(props: any) => (
            <KakaoButton onClick={props.onClick}>
              <img src="../../assets/kakoLogo" alt="Kakao logo" />
              Kakao로 로그인하기
            </KakaoButton>
          )}
        />
      </SocialButtonContainer>
      <div>
        <a href="/forgot-password">Forgot your password?</a>
      </div>
    </LoginContainer>
  );
};

export default Login;
