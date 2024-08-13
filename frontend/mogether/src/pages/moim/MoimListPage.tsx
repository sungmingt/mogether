import React from "react";
import styled from "styled-components";
import MoimList from "../../components/moim/MoimList"; // MoimList 경로를 맞게 설정하세요
import Header from "../Header";
import Leftbar from "./Leftbar";
import Footer from "../Footer";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MoimListPage: React.FC = () => {
  return (
    <PageContainer>
      <Header />
      <MoimList />
      <Leftbar />
      <Footer />
    </PageContainer>
  );
};

export default MoimListPage;
