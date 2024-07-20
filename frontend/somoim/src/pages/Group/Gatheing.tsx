import React from 'react';
import PostList from '../../components/Group/PostList';
import styled from 'styled-components';

const PageContainer = styled.div`
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const GatheringPage = () => {
  return (
    <PageContainer>
      <PostList category="gathering" />
    </PageContainer>
  );
};

export default GatheringPage;
