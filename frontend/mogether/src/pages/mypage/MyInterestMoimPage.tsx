import React from "react";
import styled from "styled-components";
import InterestingMoim from "../../components/profile/InterestMoims";
import Leftbar from "./Leftbar_myprofile";
import Header from "../Header"
import Footer from "../Footer"

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MyInterestMoimPage: React.FC = () => {
  return (
    <PageContainer>
      <Header />
      <InterestingMoim />
      <Leftbar />
      <Footer />
    </PageContainer>
  );
};

export default MyInterestMoimPage;
