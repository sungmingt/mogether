import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { filterPostsByKeywords } from "../../store/slices/bungaeSlice";
import styled, { keyframes } from "styled-components";
import somoimIcon from "../../assets/somoim_icon.png"; // Update the path to your icon file

const keywords = [
  "파티",
  "자기계발",
  "취미",
  "여행",
  "술",
  "음식",
  "스포츠",
  "액티비티",
  "게임",
  "문화",
  "스터디",
  "언어",
];

const LeftBar = () => {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    keywords.reduce((acc, keyword) => ({ ...acc, [keyword]: false }), {})
  );
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    handleKeywordChange();
  }, [checkedItems]);

  const handleToggleChange = (key: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleKeywordChange = () => {
    const selectedKeywords = Object.keys(checkedItems).filter(
      (key) => checkedItems[key]
    );
    dispatch(filterPostsByKeywords(selectedKeywords));
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {!isOpen && (
        <CircleIcon onClick={toggleMenu}>
          <IconImage src={somoimIcon} alt="somoim icon" />
        </CircleIcon>
      )}
      <LeftBarContainer isOpen={isOpen}>
        <FilterTitle>Filters</FilterTitle>
        <FilterItems>
          {keywords.map((key) => (
            <FilterItem key={key}>
              <input
                type="checkbox"
                checked={checkedItems[key]}
                onChange={() => handleToggleChange(key)}
              />
              <label>{key}</label>
            </FilterItem>
          ))}
        </FilterItems>
        <SearchButton onClick={handleKeywordChange}>키워드 검색</SearchButton>
      </LeftBarContainer>
    </>
  );
};

export default LeftBar;

// Styled Components
const slideIn = keyframes`
  from {
    left: -100%;
  }
  to {
    left: 0;
  }
`;

const slideOut = keyframes`
  from {
    left: 0;
  }
  to {
    left: -100%;
  }
`;

const CircleIcon = styled.div`
  position: fixed;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background-color: #fff;
  border: 2px solid #7848f4;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const IconImage = styled.img`
  width: 30px;
  height: 30px;
`;

const LeftBarContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 50%;
  left: ${({ isOpen }) => (isOpen ? "0" : "-100%")};
  transform: translateY(-50%);
  width: 250px;
  max-width: 90%;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  box-sizing: border-box;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: left 0.3s ease;
  animation: ${({ isOpen }) => (isOpen ? slideIn : slideOut)} 0.3s forwards;
`;

const FilterTitle = styled.h3`
  margin: 0 0 20px;
  font-size: 18px;
  color: #7848f4;
`;

const FilterItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const FilterItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #333;

  input {
    margin-right: 10px;
  }
`;

const SearchButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #7848f4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #5630c6;
  }
`;
