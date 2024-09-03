import React from "react";
import ChangePassword from "../../components/profile/ChangePassword";
import styled from "styled-components";
import Header from "../Header";
import Footer from "../Footer";
import Leftbar from "./Leftbar_myprofile";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

// const ContentContainer = styled.div`
//   flex: 1;
// `;

const ChangePasswordPage = () => {
  return (
    <PageContainer>
      <Header />
      <ChangePassword />
      <Leftbar />
      <Footer />
    </PageContainer>
  );
};

export default ChangePasswordPage;
