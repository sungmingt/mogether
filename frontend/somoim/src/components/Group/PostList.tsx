import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups, selectGroups, selectGroupLoading, selectGroupError } from '../../store/slices/groupSlice';
import styled from 'styled-components';
import { RootState, AppDispatch } from '../../store/store';
import PostCard from './PostCard';

const GroupListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Content = styled.div`
  flex: 1;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #7848F4;
  margin-bottom: 20px;
`;

const PostList = ({ category }: { category: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const groups = useSelector(selectGroups);
  const loading = useSelector(selectGroupLoading);
  const error = useSelector(selectGroupError);

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  const filteredGroups = groups.filter(group => group.category === category);

  return (
    <GroupListContainer>
      <Title>{category.charAt(0).toUpperCase() + category.slice(1)}</Title>
      <Content>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {filteredGroups.map((group) => (
          <PostCard key={group.id} group={group} />
        ))}
      </Content>
    </GroupListContainer>
  );
};

export default PostList;
