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
    const fetchToken = async () => {
      try {
        // OAuth 인증 페이지로 리디렉션
        const response = await axios.get('https://api.mo-gether.site/oauth2/authorization/kakao');

        // 응답 헤더에서 토큰과 사용자 ID를 추출
        const accessToken = response.headers['accessToken'].split(' ')[1];
        const refreshToken = response.headers['refreshToken'].split(' ')[1];
        const userId = response.headers['userId'];

        if (accessToken && refreshToken && userId) {
          // 받은 토큰을 저장
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('userId', userId);

          // 로그인 성공 알림
          Swal.fire('Success', '로그인 성공!', 'success').then(() => {
            navigate('/');
          });
        } else {
          throw new Error("Failed to retrieve tokens");
        }
      } catch (error) {
        Swal.fire('Error', '로그인 실패: ', 'error').then(() => {
          navigate('/login', { replace: true });
        });
      }
    };

    fetchToken();
  }, [navigate]);

  return (
    <SpinnerOverlay>
      <Spinner />
    </SpinnerOverlay>
  );
};

export default KakaoRedirectUrlPage;
