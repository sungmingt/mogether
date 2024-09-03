import React from "react";
import styled from "styled-components";
import InterestingBungae from "../../components/profile/InterestBungaes";
import Leftbar from "./Leftbar_myprofile";
import Header from "../Header";
import Footer from "../Footer";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MyInterestBungaePage: React.FC = () => {
  return (
    <PageContainer>
      <Header />
      <InterestingBungae />
      <Leftbar />
      <Footer />
    </PageContainer>
  );
};

export default MyInterestBungaePage;
