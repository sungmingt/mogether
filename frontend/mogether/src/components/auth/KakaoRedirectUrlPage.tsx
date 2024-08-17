import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import styled from 'styled-components';
import axios from 'axios';

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

const KakaoRedirectUrlPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.location.href = 'https://api.mo-gether.site/oauth2/authorization/kakao';



    // 서버에서 리디렉션된 후, 해당 페이지로 다시 돌아왔을 때 처리
    axios.get(window.location.href)
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
          navigate('/login', { replace: true });
        });
      });
  }, []);

  return (
    <SpinnerOverlay>
      <Spinner />
    </SpinnerOverlay>
  );
};

export default KakaoRedirectUrlPage;
