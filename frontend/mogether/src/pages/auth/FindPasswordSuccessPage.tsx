import React from "react";
import FindPasswordSuccess from "../../components/auth/FindPasswordSuccess";
import styled from "styled-components";
import Header from "../Header";
import Footer from "../Footer";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

// const ContentContainer = styled.div`
//   flex: 1;
// `;

const FindPasswordSuccessContainer = () => {
  return (
    <PageContainer>
      <Header />
      <FindPasswordSuccess />
      <Footer />
    </PageContainer>
  );
};

export default FindPasswordSuccessContainer;
