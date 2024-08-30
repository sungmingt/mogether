import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import styled from 'styled-components';
import { access } from 'fs';
import { selectIsAuthenticated, setAuthenticated } from '../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';

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

const GoogleRedirectUrlPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state)); 

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');
    const refreshToken = urlParams.get('refreshToken');
    const userId = urlParams.get('userId') || '';
    // const strippedAccessToken = accessToken ? accessToken.split('Bearer%20')[1] || '' : '';
    // const strippedRefreshToken = refreshToken ? refreshToken.split('Bearer%20')[1] || '' : '';

    if (!accessToken || !refreshToken || !userId) {
      console.log(accessToken, refreshToken, userId);
      Swal.fire('Error', '유효하지 않은 접근입니다.', 'error').then(() => {
        navigate('/login', { replace: true });
      });
    } else {
      localStorage.setItem('accessToken', accessToken ?? '');
      localStorage.setItem('refreshToken', refreshToken ?? '');
      localStorage.setItem('userId', userId);
      console.log(userId);
      console.log(accessToken);
      console.log(refreshToken);

      dispatch(setAuthenticated(true)); 
      Swal.fire('Success', '로그인 성공!', 'success').then(() => {
        navigate('/');
      });
    }
  }, [dispatch, navigate]);

  return (
    <SpinnerOverlay>
      <Spinner />
    </SpinnerOverlay>
  );
};

export default GoogleRedirectUrlPage;
