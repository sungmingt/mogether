import React from "react";
import styled from "styled-components";
import CreatedBungaes from "../../components/profile/CreatedBungaes";
import Leftbar from "./Leftbar_myprofile";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MyCreatedBungaePage: React.FC = () => {
  return (
    <PageContainer>
      <CreatedBungaes />
      <Leftbar />
    </PageContainer>
  );
};

export default MyCreatedBungaePage;
