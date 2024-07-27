// LoginPage.tsx
import React from "react";
import Login from "../../components/auth/Login";
import styled from "styled-components";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  padding: 20px;
  height: 100vh;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const LoginPage = () => {
  return (
    <PageContainer>
      <Login />
    </PageContainer>
  );
};

export default LoginPage;
