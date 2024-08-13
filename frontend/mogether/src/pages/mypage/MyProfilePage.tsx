import React from "react";
import styled from "styled-components";
import MyProfile from "../../components/profile/MyProfile";
import Leftbar from "./Leftbar_myprofile";
import Header from "../Header";
import Footer from "../Footer";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;


const MyProfilePage: React.FC = () => {
  return (
    <PageContainer>
      <Header />
      <MyProfile />
      <Leftbar />
      <Footer />
    </PageContainer>
  );
};

export default MyProfilePage;
