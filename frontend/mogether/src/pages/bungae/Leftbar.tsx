import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { filterPostsByKeywords } from "../../store/slices/moimSlice";
import { FaBars, FaTimes } from "react-icons/fa";
import styled from "styled-components";

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
  const [isOpen, setIsOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    keywords.reduce((acc, keyword) => ({ ...acc, [keyword]: false }), {})
  );
  const dispatch = useDispatch();

  useEffect(() => {
    handleKeywordChange();
  }, [checkedItems]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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

  return (
    <>
      <MenuIcon onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </MenuIcon>
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
const MenuIcon = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  z-index: 1000;
`;

const LeftBarContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: ${({ isOpen }) => (isOpen ? "0" : "-250px")};
  width: 250px;
  height: 100%;
  background-color: #ffffff;
  border-right: 2px solid #e0e0e0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  box-sizing: border-box;
  transition: left 0.3s ease;
  z-index: 999;

  @media (max-width: 768px) {
    width: 80%;
  }
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
