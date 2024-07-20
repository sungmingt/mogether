import React from 'react';
import FeedForm from '../components/Feed/FeedForm';
import FeedList from '../components/Feed/FeedList';
import styled from 'styled-components';

const FeedPageContainer = styled.div`
  padding: 20px;
`;

const Feed = () => {
  return (
    <FeedPageContainer>
      <FeedForm />
      <FeedList />
    </FeedPageContainer>
  );
};

export default Feed;
