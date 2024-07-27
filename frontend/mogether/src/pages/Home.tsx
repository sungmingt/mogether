import React from "react";
import HomePage from "../components/HomePage";
import styled from "styled-components";
import Header from "./Header";
import Footer from "./Footer";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  flex: 1;
`;

const HomePageContainer = () => {
  return (
    <PageContainer>
      <Header />
      <ContentContainer>
        <HomePage />
      </ContentContainer>
      <Footer />
    </PageContainer>
  );
};

export default HomePageContainer;
