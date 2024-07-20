import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 200px;
  padding: 10px;
`;

const TitleContainer = styled.div`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;

const FilterContainer = styled.div`
  margin-bottom: 20px;
`;

const FilterTitle = styled.h3`
  margin-bottom: 10px;
`;

const FilterItem = styled.div`
  margin-bottom: 5px;
`;

interface LeftBarProps {
  search: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filters: string[];
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LeftBar = ({ search, onSearchChange, filters, onFilterChange }: LeftBarProps) => {
  return (
    <Container>
      <TitleContainer>Category</TitleContainer>
      <FilterContainer>
        <FilterTitle>Filters</FilterTitle>
        <FilterItem>
          <input
            type="checkbox"
            value="Art"
            checked={filters.includes('Art')}
            onChange={onFilterChange}
          />
          Art
        </FilterItem>
        <FilterItem>
          <input
            type="checkbox"
            value="Music"
            checked={filters.includes('Music')}
            onChange={onFilterChange}
          />
          Music
        </FilterItem>
        <FilterItem>
          <input
            type="checkbox"
            value="Travel"
            checked={filters.includes('Travel')}
            onChange={onFilterChange}
          />
          Travel
        </FilterItem>
        <FilterItem>
          <input
            type="checkbox"
            value="Sports"
            checked={filters.includes('Sports')}
            onChange={onFilterChange}
          />
          Sports
        </FilterItem>
      </FilterContainer>
    </Container>
  );
};

export default LeftBar;
