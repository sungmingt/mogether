import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createFeed, selectFeedLoading, selectFeedError } from '../../store/slices/feedSlice';
import { RootState, AppDispatch } from '../../store/store';
import styled from 'styled-components';

const FeedFormContainer = styled.div`
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Textarea = styled.textarea`
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #7848f4;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 10px;
`;

const FeedForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const loading = useSelector(selectFeedLoading);
  const error = useSelector(selectFeedError);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
    else {
      // error: 'Failed to read file';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (file) {
      formData.append('file', file);
    }
    dispatch(createFeed(formData));
    setTitle('');
    setContent('');
    setFile(null);
  };

  return (
    <FeedFormContainer>
      <h2>Create Feed</h2>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Input type="file" onChange={handleFileChange} />
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Feed'}
        </Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Form>
    </FeedFormContainer>
  );
};

export default FeedForm;