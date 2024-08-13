import React from "react";
import styled from "styled-components";
import CreatedMoims from "../../components/profile/CreatedMoims";
import Leftbar from "./Leftbar_myprofile";

const PageContainer = styled.div`

  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MyCreatedMoimPage: React.FC = () => {
  return (
    <PageContainer>
      <CreatedMoims />
      <Leftbar />
    </PageContainer>
  );
};

export default MyCreatedMoimPage;
