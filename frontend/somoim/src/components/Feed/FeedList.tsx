import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeeds, selectFeeds, selectFeedLoading, selectFeedError } from '../../store/slices/feedSlice';
import { RootState, AppDispatch } from '../../store/store';
import styled from 'styled-components';
import FeedItem from './FeedItem';

const FeedListContainer = styled.div`
  padding: 20px;
`;

const FeedList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const feeds = useSelector(selectFeeds);
  const loading = useSelector(selectFeedLoading);
  const error = useSelector(selectFeedError);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  return (
    <FeedListContainer>
      <h2>Feed List</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {feeds.map(feed => (
        <FeedItem
          key={feed.id}
          id={feed.id}
          title={feed.title}
          author={feed.author}
          content={feed.content}
          createAt={feed.createAt}
          fileUrl={feed.fileUrl}
        />
      ))}
    </FeedListContainer>
  );
};

export default FeedList;
