import React from 'react';
import Register from '../../components/Auth/Register';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #e9ecef;
`;

const RegisterPage = () => {
  return (
    <PageContainer>
      <Register />
    </PageContainer>
  );
};

export default RegisterPage;
