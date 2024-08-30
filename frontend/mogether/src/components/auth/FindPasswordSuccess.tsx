import React from 'react';
import styled from 'styled-components';

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: #f4f4f4;
`;

const Message = styled.h1`
  color: #7848f4;
  font-size: 2em;
  margin-bottom: 20px;
`;

const FindPasswordSuccess: React.FC = () => {
  return (
    <SuccessContainer>
      <Message>비밀번호가 입력하신 이메일로 전송되었습니다</Message>
    </SuccessContainer>
  );
};

export default FindPasswordSuccess;
