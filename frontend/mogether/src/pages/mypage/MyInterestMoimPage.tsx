import React from "react";
import styled from "styled-components";
import InterestingMoim from "../../components/profile/InterestMoims";
import Leftbar from "./Leftbar_myprofile";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MyInterestMoimPage: React.FC = () => {
  return (
    <PageContainer>
      <InterestingMoim />
      <Leftbar />
    </PageContainer>
  );
};

export default MyInterestMoimPage;
