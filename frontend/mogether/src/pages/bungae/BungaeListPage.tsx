import React from "react";
import styled from "styled-components";
import BungaeList from "../../components/bungae/BungaeList"; // MoimList 경로를 맞게 설정하세요
import Header from "../Header";
import Leftbar from "./Leftbar";
import Footer from "../Footer";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const BungaeListPage: React.FC = () => {
  return (
    <PageContainer>
      <Header />
      <BungaeList />
      <Footer />
    </PageContainer>
  );
};

export default BungaeListPage;
