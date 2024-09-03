import React from "react";
import styled from "styled-components";
import CreatedBungaes from "../../components/profile/CreatedBungaes";
import Leftbar from "./Leftbar_myprofile";
import Header from "../Header";
import Footer from "../Footer";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MyCreatedBungaePage: React.FC = () => {
  return (
    <PageContainer>
      <Header />
      <CreatedBungaes />
      <Leftbar />
      <Footer />
    </PageContainer>
  );
};

export default MyCreatedBungaePage;
