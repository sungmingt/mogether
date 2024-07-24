import React from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
  width: 100%;
  height: 60px;
  margin-top: 5px;
  background-color: #7848f4;
  color: #ffffff;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  bottom: 0px;
  // position: relative;
  // position: relative;
  // transform: translateY(-100%);
  // @media (max-width: 768px) {
  //   justify-content: center;
  //   padding: 0 10px;
  //   height: auto;
  // }
`;

const FooterLeft = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    justify-content: center;
    // margin-bottom: 10px;
  }
`;

const FooterRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Logo = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 10px;
  border-radius: 50%;
`;

const SocialLinks = styled.div`
  display: flex;
  align-items: center;

  a {
    color: #ffffff;
    margin-left: 15px;
    text-decoration: none;
    font-size: 16px;
    transition: color 0.3s ease;

    &:hover {
      color: #ffcccb;
    }
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterLeft>
        <Logo src="./KakaoTalk_logo 1.png" alt="Logo" />
        <p>&copy; 2023 Your Website</p>
      </FooterLeft>
      <FooterRight>
        <SocialLinks>
          <a href="/">Home</a>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </SocialLinks>
      </FooterRight>
    </FooterContainer>
  );
};

export default Footer;
