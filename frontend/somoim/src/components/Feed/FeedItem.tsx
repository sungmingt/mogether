import React from 'react';
import styled from 'styled-components';

const FeedItemContainer = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

interface FeedItemProps {
  id: number;
  title: string;
  author: string;
  content: string;
  createAt: string;
  fileUrl?: string;
}

const FeedItem = ({ id, title, author, content, createAt, fileUrl }: FeedItemProps) => {
  return (
    <FeedItemContainer>
      <h3>{title}</h3>
      <p>{content}</p>
      {fileUrl && (
        <div>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            View Attachment
          </a>
        </div>
      )}
      <small>By {author}</small>
      <br />
      <small>{createAt}</small>
    </FeedItemContainer>
  );
};

export default FeedItem;
