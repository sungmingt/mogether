import React from "react";
import styled from "styled-components";
import ChatList from "../../components/chat/ChatList"; // MoimList 경로를 맞게 설정하세요
import Header from "../Header";
import Footer from "../Footer";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ChatListPage: React.FC = () => {
  return (
    <PageContainer>
      <Header />
      <ChatList />
      <Footer />
    </PageContainer>
  );
};

export default ChatListPage;
