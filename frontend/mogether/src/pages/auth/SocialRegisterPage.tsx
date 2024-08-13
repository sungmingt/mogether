import React from "react";
import SocialRegister from "../../components/auth/SocialRegister";
import styled from "styled-components";
import Header from "../Header";
import Footer from "../Footer";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // height: 100vh;
  // background-color: #e9ecef;
`;

const SocialRegisterPage = () => {
  return (
    <PageContainer>
      <Header />
      <SocialRegister />
      <Footer />
    </PageContainer>
  );
};

export default SocialRegisterPage;
