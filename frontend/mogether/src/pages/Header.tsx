import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaBell, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { selectIsAuthenticated, logout, selectUserId } from "../store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import Swal from "sweetalert2";
import icon from "../assets/somoim_icon.svg";
import { setAuthenticated } from "../store/slices/authSlice";

const HeaderContainer = styled.header`
  top: 0;
  width: 100%;
  height: 60px;
  background-color: transparent;
  color: #000000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #7848f4;
  z-index: 1000;
  margin-bottom: 30px;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none; /* 작은 화면에서는 기본 네비게이션 숨김 */
  }
`;

const NavLink = styled(Link)`
  margin: 0 15px;
  color: #000000;
  text-decoration: none;
  font-size: 18px;
  position: relative;

  &:hover {
    color: #7848f4;
  }

  &::after {
    content: "";
    display: block;
    width: 0;
    height: 2px;
    background: #7848f4;
    transition: width 0.3s;
    position: absolute;
    bottom: -5px;
    left: 0;
  }

  &:hover::after {
    width: 100%;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none; /* 작은 화면에서는 버튼 숨김 */
  }
`;

const Button = styled.button`
  background-color: #ffffff;
  color: #7848f4;
  border: 1px solid #7848f4;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  margin: 10px;

  &:hover {
    background-color: #7848f4;
    color: #ffffff;
  }
`;

const MenuIcon = styled.div`
  display: none;
  cursor: pointer;
  font-size: 24px;
  margin: 0 10px;
  transition: transform 0.3s ease-in-out;

  @media (max-width: 768px) {
    display: block; /* 작은 화면에서는 메뉴 아이콘 표시 */
  }

  &.open {
    transform: rotate(90deg);
  }
`;

const slideDown = keyframes`
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-20px);
    opacity: 0;
  }
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  position: absolute;
  top: 60px;
  right: 0;
  width: 200px;
  background-color: #ffffff;
  border: 2px solid #7848f4;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 999;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  animation: ${({ isOpen }) => (isOpen ? slideDown : slideUp)} 0.3s ease-in-out;
  transition: opacity 0.3s ease-in-out;
  border-radius: 8px;

  a {
    display: block;
    padding: 10px 20px;
    color: #000;
    text-decoration: none;
    font-size: 16px;

    &:hover {
      background-color: #f0f0f0;
      color: #7848f4;
    }
  }
`;

const ReactIconDropdownMenu = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  position: absolute;
  top: 60px;
  left: 0;
  width: 200px;
  background-color: #ffffff;
  border: 2px solid #7848f4;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 999;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  animation: ${({ isOpen }) => (isOpen ? slideDown : slideUp)} 0.3s ease-in-out;
  transition: opacity 0.3s ease-in-out;
  border-radius: 8px;

  a {
    display: block;
    padding: 10px 20px;
    color: #000;
    text-decoration: none;
    font-size: 16px;

    &:hover {
      background-color: #f0f0f0;
      color: #7848f4;
    }
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 12px;
  position: relative;
  gap: 5px;
`;

const DropdownButton = styled.div`
  display: flex;
  flex-direction: column;
`;


const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));  // store에서 state 값을 가져옴
  const dispatch = useDispatch<AppDispatch>();
  const accessToken = localStorage.getItem("accessToken");
  const userId = Number(localStorage.getItem("userId")) || 0;  

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    if (isNotificationMenuOpen) {
      setIsNotificationMenuOpen(false);
    }
  };

  const toggleNotificationMenu = () => {
    setIsNotificationMenuOpen(!isNotificationMenuOpen);
    if (isProfileMenuOpen) {
      setIsProfileMenuOpen(false);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  useEffect(() => {
    if (userId > 0 && accessToken) {
      dispatch(setAuthenticated(true));
    }
    else {
      dispatch(setAuthenticated(false));
    }
  }, [dispatch, accessToken, userId]); 

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      dispatch(setAuthenticated(false));
      navigate("/");
    } catch (error) {
      Swal.fire("error", "로그아웃에 실패했습니다", "error");
    }
  };

  return (
    <HeaderContainer>
      <MenuIcon className={isOpen ? "open" : ""} onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </MenuIcon>
      <Nav>
        <NavLink to="/"><img src={require("../assets/somoim_icon.png")} alt="icon"/></NavLink>
        <NavLink to="/moim/list">소모임</NavLink>
        <NavLink to="/bungae/list">번개</NavLink>
        <NavLink to="/mypage">마이페이지</NavLink>
        <NavLink to="/ChatList">그룹 채팅방</NavLink>
        
      </Nav>
      <ButtonContainer>
        {isAuthenticated ? (
          <>
            <Button onClick={() => handleNavigation("/createPost")}>Create</Button>
            <Button onClick={handleLogout}>Logout</Button>
            {/* <IconWrapper onClick={toggleNotificationMenu}>
              <FaBell size={24} />
              <DropdownMenu isOpen={isNotificationMenuOpen}>
                <NavLink to="/notifications" onClick={toggleNotificationMenu}>
                  알림1
                </NavLink>
                <NavLink to="/notifications" onClick={toggleNotificationMenu}>
                  알림2
                </NavLink>
              </DropdownMenu>
            </IconWrapper> */}
            <IconWrapper onClick={toggleProfileMenu}>
              <FaUserCircle size={24} />
              <DropdownMenu isOpen={isProfileMenuOpen}>
                <NavLink to="/mypage" onClick={toggleProfileMenu}>
                  프로필
                </NavLink>
                <NavLink to="/createdMoim" onClick={toggleProfileMenu}>
                  작성 글
                </NavLink>
                <NavLink to="/interestedMoim" onClick={toggleProfileMenu}>
                  관심 글
                </NavLink>
              </DropdownMenu>
            </IconWrapper>
          </>
        ) : (
          <>
            <Button onClick={() => handleNavigation("/login")}>Login</Button>
            <Button onClick={() => handleNavigation("/register")}>Register</Button>
          </>
        )}
      </ButtonContainer>
      <ReactIconDropdownMenu isOpen={isOpen}>
        <NavLink to="/moim/list" onClick={toggleMenu}>
          소모임
        </NavLink>
        <NavLink to="/bungae/list" onClick={toggleMenu}>
          번개
        </NavLink>
        <NavLink to="/mypage" onClick={toggleMenu}>
          마이페이지
        </NavLink>
        <NavLink to="/ChatList" onClick={toggleMenu}>
          그룹 모임방
        </NavLink>
        <DropdownButton>
          {isAuthenticated ? (
            <>
              <Button onClick={() => handleNavigation("/createPost")}>Create Post</Button>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button onClick={() => handleNavigation("/login")}>Login</Button>
              <Button onClick={() => handleNavigation("/register")}>Register</Button>
            </>
          )}
        </DropdownButton>
      </ReactIconDropdownMenu>
    </HeaderContainer>
  );
};

export default Header;
