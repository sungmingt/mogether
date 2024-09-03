import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
`;

const LeftBarContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 30%;
  left: 0;
  width: 200px;
  height: 40%;
  background-color: rgba(255, 255, 255, 0.8);
  border-right: 2px solid #e0e0e0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  box-sizing: border-box;
  transform: translateX(${({ isOpen }) => (isOpen ? "0" : "-100%")});
  animation: ${({ isOpen }) => (isOpen ? slideIn : slideOut)} 0.5s forwards;
  box-sizing: border;

  @media (max-width: 768px) {
    width: 30%;
  }
`;

const MenuIcon = styled.div`
  cursor: pointer;
  font-size: 24px;
  position: fixed;
  top: 30%;
  left: 0px;
  z-index: 1000;
  display: flex;
`;

const MenuContainer = styled.div`
  margin-bottom: 20px;
`;

const MenuItem = styled.li`
  width: auto;
  margin-bottom: 10px;
  padding: 10px 20px;
  background-color: #fff;
  border-radius: 5px;
  // text-align: center;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #7848f4;
    color: #ffffff;
  }

  @media (max-width: 768px) {
    background-color: rgba(255, 255, 255, 0.8);
  }
`;

const LeftBar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMenuOpen(false); // 메뉴 선택 후 닫기
  };

  return (
    <>
      <MenuIcon onClick={handleMenuToggle}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </MenuIcon>
      <LeftBarContainer isOpen={menuOpen}>
        <MenuContainer>
          <MenuItem onClick={() => handleNavigation("/mypage")}>
            내 정보
          </MenuItem>
          <MenuItem onClick={() => handleNavigation("/interestedMoim")}>
            관심 글 목록
          </MenuItem>
          <MenuItem onClick={() => handleNavigation("/createdMoim")}>
            등록한 글 목록
          </MenuItem>
          <MenuItem
            onClick={() => handleNavigation("/changePassword")}
          >
            비밀번호 변경
          </MenuItem>
        </MenuContainer>
      </LeftBarContainer>
    </>
  );
};

export default LeftBar;
