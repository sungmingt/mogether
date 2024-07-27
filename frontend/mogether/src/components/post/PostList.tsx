import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchPosts, loadMorePosts, sortPostsByLatest, sortPostsByLikes, clickInterest } from '../../store/slices/postSlice';
import styled from 'styled-components';
import { FaHeart } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { locations } from '../../utils/location';
import { searchPosts } from '../../store/slices/postSlice';
import { selectUserProfile } from '../../store/slices/userSlice';


const PostListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); // 한 줄에 최대 3개씩 배치
  gap: 20px;
  width: 100%;
  max-width: 1200px;
`;

const PostCard = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const PostImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
`;

const HeartIcon = styled(FaHeart)<{ isInterested: boolean }>`
  position: absolute;
  top: 10px;
  right: 10px;
  color: ${props => props.isInterested ? 'red' : 'white'};
  cursor: pointer;
  font-size: 24px;
`;

const PostInfo = styled.div`
  margin-top: 10px;
  width: 100%;
`;

const PostTitle = styled.h3`
  margin: 0;
  text-align: center;
`;

const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const PostMetaInfo = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 5px;
  }
`;

const ParticipantsImages = styled.div`
  display: flex;
  margin-top: 10px;

  img {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    margin-right: 5px;
  }
`;

const LoadMoreButton = styled.button`
  padding: 10px 20px;
  background-color: #7848f4;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SortSelect = styled.select`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const SearchContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
  flex: 1;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
`;

const PostList = () => {
  const dispatch: AppDispatch = useDispatch();
  const { visiblePosts, allPosts, loading, error } = useSelector((state: RootState) => state.post);
  const [sortOrder, setSortOrder] = useState('latest');
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [subLocation, setSubLocation] = useState('');
  const user = useSelector(selectUserProfile);
  const userId = user?.userId;
  
  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    if (sortOrder === 'latest') {
      dispatch(sortPostsByLatest());
    } else {
      dispatch(sortPostsByLikes());
    }
  }, [sortOrder, dispatch]);

  const handleLoadMore = () => {
    dispatch(loadMorePosts());
  };

  const handleToggleInterest = async (moimId: number, isInterested: boolean) => {
    try {
      await dispatch(clickInterest({ moimId, userId: userId })).unwrap();
      console.log(`Successfully toggled interest for post ${moimId}`);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to toggle interest',
        text: 'There was an error toggling interest.',
      });
    }
  };

  const handleSearch = async () => {
    if (!searchTerm && !location && !subLocation) {
      Swal.fire({
        icon: 'warning',
        title: '검색어를 입력하세요',
        text: '이름, 시, 구 중 하나 이상을 입력하세요.',
      });
      return;
    }

    try {
      await dispatch(searchPosts({ name: searchTerm, city: location, gu: subLocation })).unwrap();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: '검색 실패',
        text: '검색 중 오류가 발생했습니다. 다시 시도하세요.',
      });
    }
  };

  return (
    <PostListContainer>
      <SearchContainer>
        <SearchInput 
          type="text" 
          placeholder="검색어를 입력하세요" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <Select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">행정시를 선택하세요</option>
          {locations.map((loc) => (
            <option key={loc.name} value={loc.name}>
              {loc.name}
            </option>
          ))}
        </Select>
        <Select
          value={subLocation}
          onChange={(e) => setSubLocation(e.target.value)}
          disabled={!location}
        >
          <option value="">행정구를 선택하세요</option>
          {location &&
            locations
              .find((loc) => loc.name === location)
              ?.subArea.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
        </Select>
        <LoadMoreButton onClick={handleSearch}>검색</LoadMoreButton>
      </SearchContainer>
      <SortSelect value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
        <option value="latest">최신순</option>
        <option value="likes">좋아요순</option>
      </SortSelect>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <PostGrid>
            {visiblePosts.map((post) => (
              <PostCard key={post.id}>
                <PostImage src={post.thumbnailUrl || '/default-image.jpg'} alt={post.title} />
                <HeartIcon 
                  isInterested={post.isInterested || false} 
                  onClick={() => handleToggleInterest(post.id, post.isInterested || false)}
                />
                <PostInfo>
                  <PostTitle>{post.title}</PostTitle>
                  <PostMeta>
                    <PostMetaInfo>
                      <img src={post.hostProfileImageUrl || '/default-avatar.jpg'} alt={post.hostName} />
                      <span>{post.hostName}</span>
                    </PostMetaInfo>
                    <div>
                      <span>{post.createdAt} ~ {post.expireAt}</span>
                      <span>{post.address.city}, {post.address.gu}</span>
                    </div>
                  </PostMeta>
                  <PostMeta>
                    <div>❤️ {post.interestsCount}</div>
                    <div>👥 {post.participantsCount}</div>
                  </PostMeta>
                  <ParticipantsImages>
                    {post.participantsImageUrls && post.participantsImageUrls.slice(0, 6).map((url, index) => (
                      <img key={index} src={url} alt={`participant-${index}`} />
                    ))}
                  </ParticipantsImages>
                </PostInfo>
              </PostCard>
            ))}
          </PostGrid>
          {visiblePosts.length < allPosts.length && (
            <LoadMoreButton onClick={handleLoadMore}>Load more</LoadMoreButton>
          )}
        </>
      )}
    </PostListContainer>
  );
};

export default PostList;
