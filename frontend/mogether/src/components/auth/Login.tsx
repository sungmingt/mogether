import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, selectAuthError, selectIsAuthenticated, setAuthenticated } from '../../store/slices/authSlice';
import styled from 'styled-components';
import { RootState, AppDispatch } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import {selectAllUserProfiles } from '../../store/slices/userProfileSlice';
import Swal from 'sweetalert2';


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
  const allProfiles = useSelector((state: RootState) => selectAllUserProfiles(state));
  // const [userId, setUserId] = useState<number>(0);
  // const userId = useSelector(selectCurrentUserProfile)?.userId;


  const handleLogin = async () => {
    if (email !== '' && password !== '') {
      try {
        const response = await dispatch(login({ email: email, password: password })).unwrap();
        // response.status === 200일때 dispatch로 인해 isAuthenticated 값이 갱신된다(useSelector에 의해서)
        console.log(response);
        const accessToken = response.headers['accessToken'];
        const refreshToken = response.headers['refreshToken'];
        const userId = response.headers['userId'];
        console.log(accessToken, refreshToken, userId);
        if (accessToken !== undefined && refreshToken !== undefined && userId !== undefined) {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('userId', userId);
          dispatch(setAuthenticated(true));  //reducer에서 액션 등록 후 동기적으로 액션을 수행할 수 있다.
        }
        else {
          dispatch(setAuthenticated(false));
        }
        navigate('/');
      }
      catch (error) {
        console.log(error);
        Swal.fire('error', '잘못된 요청입니다', 'error');
      }
    }
    else if (email === '') {
      Swal.fire('error', '이메일을 입력해주세요', 'error');
    }
    else if (password === '') {
      Swal.fire('error', '비밀번호를 입력해주세요', 'error');
    }
  };

  const handleKakao = () => {

    window.location.href='https://api.mo-gether.site/oauth2/authorization/kakao';
  };

  const handleGoogle = () => {
    
    window.location.href='https://api.mo-gether.site/oauth2/authorization/google';
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated]);

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
        <GoogleButton onClick={handleGoogle}>
              <img src={require("../../assets/Google__G__logo 1.png")} alt="Google logo" />
              구글로 로그인하기
        </GoogleButton>
        <KakaoButton onClick={handleKakao}>
              <img src={require("../../assets/KakaoTalk_logo 1.png")} alt="Kakao logo" />
              Kakao로 로그인하기
        </KakaoButton>
      </SocialButtonContainer>
      <div>
        <a href="/forgotpassword">Forgot your password?</a>
      </div>
    </LoginContainer>
  );
};

export default Login;
