import React from "react";
import BungaeEdit from "../../components/bungae/BungaeEdit"; // 컴포넌트 경로 수정
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

const BungaeEditPage: React.FC = () => {
  return (
    <PageContainer>
      <Header />
      <BungaeEdit />
      <Footer />
    </PageContainer>
  );
};

export default BungaeEditPage;
