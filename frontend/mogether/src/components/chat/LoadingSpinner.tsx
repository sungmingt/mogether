import React from 'react';
import styled, { keyframes } from 'styled-components';

// 스피너 애니메이션 정의
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// 스피너 스타일 정의
const Spinner = styled.div`
  border: 8px solid #f3f3f3;
  border-top: 8px solid #7848f4; /* 스피너 색상 */
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${spin} 1s linear infinite;
`;

// 로딩 컨테이너 스타일 정의
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 화면 전체에 걸쳐 중앙에 위치 */
  background-color: rgba(255, 255, 255, 0.7);
`;

const LoadingSpinner: React.FC = () => {
  return (
    <LoadingContainer>
      <Spinner />
    </LoadingContainer>
  );
};

export default LoadingSpinner;
