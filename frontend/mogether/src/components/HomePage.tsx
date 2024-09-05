import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { useNavigate } from "react-router-dom";
// import { animateScroll as scroll } from "react-scroll";
import { fetchProfile } from '../store/slices/userProfileSlice';
import { selectUserId } from "../store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from '../store/store';
import Swal from "sweetalert2";

const HomePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  width: 100%;
  box-sizing: border-box;
`;

const Section = styled.section`
  width: 100%;
  height: 80vh;
  padding: 60px 20px;
  margin: 0;
  background-color: ${({ color }) => color || "#ffffff"};
  display: flex;
  align-items: center;
  flex-direction: row;
  box-sizing: border-box;
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 1s ease-in-out, transform 1s ease-in-out;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;

  &.visible {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0px 20px 30px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    height: auto;
  }
`;

const TextContainer = styled.div`
  flex: 2;
  margin: 10px;
  padding: 10px;
  font-size: 24px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ImageWrapper = styled.div`
  flex: 1;
`;

const Image = styled.img`
  // flex: 1;
  // // max-width: 600px;
  height: 100%;
  width: 100%;
  animation: ${css`
    ${slideUp} 1s ease-in-out
  `};

  @media (max-width: 768px) {
    width: 80%;
    margin-top: 20px;
  }
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: bold;
  color: palevioletred;
  animation: ${css`
    ${slideUp} 1s ease-in-out
  `};
`;

const TypingText = styled.p`
  display: inline-block;
  animation: ${css`
    ${slideUp} 1s ease-in-out
  `};
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
`;

const SectionButton = styled.button`
  flex-direction: row;
  padding: 10px;
  margin: 10px;
  background-color: #7848f4;
  color: #ffffff;
  border: 2px solid #7848f4;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, color 0.3s, transform 0.3s;

  &:hover {
    background-color: #5630c6;
    color: #ffffff;
    transform: translateY(-5px);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 15px;
  margin-top: 10px;

  @media (max-width: 768px) {
    justify-content: center;
    margin-top: 10px;
  }
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem('userId')) | 0; 
  const dispatch = useDispatch<AppDispatch>(); 
  const [visibleSections, setVisibleSections] = useState<{
    [key: string]: boolean;
  }>({});

  const handleScroll = () => {
    const sections = document.querySelectorAll("section");
    const scrollPosition = window.scrollY + window.innerHeight;

    sections.forEach((section, index) => {
      if (scrollPosition > section.offsetTop + section.offsetHeight / 3) {
        setVisibleSections((prev) => ({ ...prev, [index]: true }));
      }
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    console.log(userId);
    console.log(localStorage.getItem('accessToken'));
    console.log(localStorage.getItem('refreshToken'));
    if (userId > 0 && localStorage.getItem('accessToken') && localStorage.getItem('refreshToken')) {
      try {
        const response = dispatch(fetchProfile(userId));  //userSlice의 fetchProfile로 정보가 들어감
        console.log(localStorage.getItem('accessToken'));
        console.log(localStorage.getItem('refreshToken'));
      }
      catch (error) {
        console.error(error);
      }
    }
  }, [userId])

  const handleImageClick = () => {
    navigate("/postCreate");
  };

  return (
    <HomePageContainer>
      <Section
        className={visibleSections[0] ? "visible" : ""}
        color="#ffffff"
      >
        <TextContainer>
          <Title>❤️모게더에 오신 것을 환영합니다❤️</Title>
          <TypingText>나의 취미를 찾는 첫 시도, 모게더</TypingText>
          <ButtonGroup>
            <SectionButton onClick={() => navigate("/moim/list")}>
              소모임 참여하기
            </SectionButton>
            <SectionButton onClick={() => navigate("/bungae/list")}>
              번개모임 참여하기
            </SectionButton>
          </ButtonGroup>
        </TextContainer>
        <ImageWrapper>
          <Image src={require("../assets/home2.png")} alt="Community" />
        </ImageWrapper>
      </Section>
      <Section
        className={visibleSections[1] ? "visible" : ""}
        color="#e6e6e6"
      >
        <TextContainer>
          <Title>모게더를 통해 스스로를 더욱 성장시켜 보세요!</Title>
          <TypingText>
            모임을 통해 다양한 경험을 하고, 스스로 성장시킬 기회를 잡아보세요. <br></br>
            <br></br>
            모게더를 통해 한층 더 발전된 나 자신을 만나보세요💕
          </TypingText>
        </TextContainer>
        <ImageWrapper>
          <Image src={require("../assets/somoim.png")} alt="Join a Group" />
        </ImageWrapper>
      </Section>
      <Section
        className={visibleSections[2] ? "visible" : ""}
        color="#e6e6e6"
      >
        <TextContainer>
          <Title>함께라서 더 즐거운 우리들의 모임</Title>
          <TypingText>
            취미도, 관심사도, 함께할 때 더 빛납니다. <br></br>
            <br></br>
            지금, 모게더에서 새로운 인연과 경험을 만나보세요💕
          </TypingText>
        </TextContainer>
        <ImageWrapper>
          <Image src={require("../assets/togetherliving.png")} alt="Join a Group" />
        </ImageWrapper>
      </Section>
    </HomePageContainer>
  );
};

export default HomePage;
