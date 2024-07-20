import React from 'react'
import Login from '../../components/Auth/Login';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #e9ecef;
`;

const LoginPage = () => {
  return (
    <PageContainer>
      <Login />
    </PageContainer>
  )
}

export default LoginPage;