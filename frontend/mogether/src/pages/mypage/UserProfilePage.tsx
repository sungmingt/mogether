import React from "react";
import styled from "styled-components";
import UserProfile from "../../components/profile/userProfile";
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
      <UserProfile />
      <Footer />
    </PageContainer>
  );
};

export default UserProfilePage;
