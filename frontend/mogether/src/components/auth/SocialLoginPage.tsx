import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import styled from 'styled-components';
import axios from 'axios';
import { googleLogin, kakaoLogin } from '../../store/slices/authSlice';

const SpinnerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Spinner = styled.div`
  border: 16px solid #f3f3f3;
  border-top: 16px solid #3498db;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SocialLoginPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isGoogle = urlParams.get('google') === 'true';
    const isKakao = urlParams.get('kakao') === 'true';

    const apiEndpoint = isGoogle 
      ? 'https://api.mo-gether.site/oauth2/authorization/google'
      : isKakao 
        ? 'https://api.mo-gether.site/oauth2/authorization/kakao'
        : null;

    if (apiEndpoint) {
      axios.get(apiEndpoint, { withCredentials: true })
        .then((response) => {
          const { accessToken, refreshToken, userId } = response.data;

          const strippedAccessToken = accessToken.replace('Bearer ', '');
          const strippedRefreshToken = refreshToken.replace('Bearer ', '');

          localStorage.setItem('accessToken', strippedAccessToken);
          localStorage.setItem('refreshToken', strippedRefreshToken);
          localStorage.setItem('userId', userId.toString());

          Swal.fire('Success', '로그인 성공!', 'success').then(() => {
            navigate('/');
          });
        })
        .catch((error) => {
          Swal.fire('Error', '로그인 실패: ' + error.message, 'error').then(() => {
            navigate('/login', {replace: true});
          });
        });
    } else {
      Swal.fire('Error', '유효하지 않은 접근입니다.', 'error')
    }
  }, [navigate]);

  return (
    <SpinnerOverlay>
      <Spinner />
    </SpinnerOverlay>
  );
};

export default SocialLoginPage;
