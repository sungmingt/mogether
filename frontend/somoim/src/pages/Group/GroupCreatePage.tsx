import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createGroup, selectGroupLoading, selectGroupError } from '../../store/slices/groupSlice';
import { RootState, AppDispatch } from '../../store/store';
import styled from 'styled-components';

const GroupCreateContainer = styled.div`
  padding: 30px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin-bottom: 15px;
  padding: 12px;
  border: 2px solid #7848F4;
  border-radius: 10px;
  font-size: 1rem;
`;

const Textarea = styled.textarea`
  margin-bottom: 15px;
  padding: 12px;
  border: 2px solid #7848F4;
  border-radius: 10px;
  font-size: 1rem;
`;

const Select = styled.select`
  margin-bottom: 15px;
  padding: 12px;
  border: 2px solid #7848F4;
  border-radius: 10px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: #7848f4;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #5630c6;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 10px;
`;

const GroupCreatePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const loading = useSelector((state: RootState) => state.group.loading);
  const error = useSelector((state: RootState) => state.group.error);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeywords((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', date);
    formData.append('location', location);
    formData.append('keywords', JSON.stringify(keywords));
    formData.append('category', category);
    if (image) {
      formData.append('image', image);
    }
    formData.append('likes', '0'); // 초기 좋아요 수를 0으로 설정
    dispatch(createGroup(formData) as any);
    setTitle('');
    setDescription('');
    setDate('');
    setLocation('');
    setKeywords([]);
    setCategory('');
    setImage(null);
  };

  return (
    <GroupCreateContainer>
      <h2 style={{ color: '#7848F4', marginBottom: '20px' }}>Create Group</h2>
      <Form onSubmit={handleCreateEvent}>
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          type="date"
          placeholder="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Input
          type="text"
          placeholder="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <Select value={category} onChange={handleCategoryChange}>
          <option value="">Select Category</option>
          <option value="bungae">Bungae</option>
          <option value="gathering">Gathering</option>
          <option value="study">Study</option>
        </Select>
        <div>
          <label>
            <input
              type="checkbox"
              value="Art"
              onChange={handleKeywordChange}
            />
            Art
          </label>
          <label>
            <input
              type="checkbox"
              value="Music"
              onChange={handleKeywordChange}
            />
            Music
          </label>
          <label>
            <input
              type="checkbox"
              value="Travel"
              onChange={handleKeywordChange}
            />
            Travel
          </label>
          <label>
            <input
              type="checkbox"
              value="Sports"
              onChange={handleKeywordChange}
            />
            Sports
          </label>
        </div>
        <Input type="file" onChange={handleFileChange} />
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Group'}
        </Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Form>
    </GroupCreateContainer>
  );
};

export default GroupCreatePage;
