import React from "react";
import BungaeCard from "../../components/bungae/BungaeCard"; // 컴포넌트 경로 수정
import styled from "styled-components";
import Header from "../Header"; // 헤더 컴포넌트 경로 수정
import Footer from "../Footer";

const PageContainer = styled.div`
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // justify-content: center;
  // padding: 20px;
  // background-color: #f9f9f9;
  min-height: 100vh;
  width: 100%;
`;

const BungaeCardPage: React.FC = () => {
  return (
    <PageContainer>
      <Header />
      <BungaeCard />
      <Footer />
    </PageContainer>
  );
};

export default BungaeCardPage;
