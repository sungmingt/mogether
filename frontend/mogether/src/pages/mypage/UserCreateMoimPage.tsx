import React from "react";
import styled from "styled-components";
import UserCreatedMoims from "../../components/profile/UserCreateMoim";
import Footer from "../Footer";
import Header from "../Header";

const PageContainer = styled.div`

  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const UserCreatedMoimPage: React.FC = () => {
  return (
    <PageContainer>
      <Header />
      <UserCreatedMoims />
      <Footer />
    </PageContainer>
  );
};

export default UserCreatedMoimPage;
