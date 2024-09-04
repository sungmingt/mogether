import React from "react";
import styled from "styled-components";
import UserIdProfile from "../../components/profile/UserIdProfile";
import Header from "../Header";
import Footer from "../Footer";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;


const UserProfilePage: React.FC = () => {
  return (
    <PageContainer>
      <Header />
      <UserIdProfile />
      <Footer />
    </PageContainer>
  );
};

export default UserProfilePage;
