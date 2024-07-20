import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Group, toggleLikeGroup } from '../../store/slices/groupSlice';
import { AppDispatch } from '../../store/store';

const Card = styled.div`
  border: 2px solid #7848F4;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  background-color: #ffffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const Image = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 20px;
  margin-right: 20px;
  object-fit: cover;
  background-color: #f0f0f0;
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  margin: 0;
  color: #7848F4;
  font-size: 1.5rem;
  font-weight: bold;
`;

const Description = styled.p`
  margin: 10px 0;
  color: #555;
  font-size: 1rem;
`;

const Meta = styled.div`
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 10px;
`;

const Author = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 10px;
  background-color: #f0f0f0;
`;

const AuthorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const FollowButton = styled.button`
  padding: 5px 10px;
  margin-left: 10px;
  background-color: #7848f4;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #5630c6;
  }
`;

const LikeButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #7848f4;
  display: flex;
  align-items: center;
  margin-top: 10px;
  font-size: 1.2rem;
`;

const Likes = styled.span`
  margin-left: 5px;
  font-size: 1rem;
  color: #7848f4;
`;

interface PostCardProps {
    group: Group; //컴포넌트로 타입을 직접 가져와 사용하는 경우 -> export interface 해줬어야 함
}

const PostCard = ({ group }: PostCardProps) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleLike = () => {
        dispatch(toggleLikeGroup(group.id));
    };

    return (
        <Card>
            <Image src={group.imageUrl} alt={group.title} />
            <Content>
                <Title>{group.title}</Title>
                <Meta>
                    {group.category} • {group.address}
                </Meta>
                <Description>{group.description}</Description>
                <Author>
                    <Avatar src={group.author.avatarUrl} alt={group.author.nickname} />
                    <AuthorInfo>
                        <strong>{group.author.nickname}</strong>
                    </AuthorInfo>
                    <FollowButton>Follow</FollowButton>
                </Author>
                <LikeButton onClick={handleLike}>
                    <i className="fas fa-heart" />
                    <Likes>{group.likes}</Likes>
                </LikeButton>
            </Content>
        </Card>
    );
};

export default PostCard;