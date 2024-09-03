import React from "react";
import styled from "styled-components";
import CreatedMoims from "../../components/profile/CreatedMoims";
import Leftbar from "./Leftbar_myprofile";
import Header from "../Header";
import Footer from "../Footer";

const PageContainer = styled.div`

  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MyCreatedMoimPage: React.FC = () => {
  return (
    <PageContainer>
      <Header />
      <CreatedMoims />
      <Leftbar />
      <Footer />
    </PageContainer>
  );
};

export default MyCreatedMoimPage;
