import React from "react";
import styled from "styled-components";
import UserCreatedBungaes from "../../components/profile/UserCreateBungae";
import Footer from "../Footer";
import Header from "../Header";

const PageContainer = styled.div`

  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const UserCreatedBungaePage: React.FC = () => {
  return (
    <PageContainer>
      <Header />
      <UserCreatedBungaes />
      <Footer />
    </PageContainer>
  );
};

export default UserCreatedBungaePage;
