import React from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 800px;
  margin: 40px auto;
  background-color: #ffffff;
  padding: 40px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  line-height: 1.6;
  font-family: "Arial", sans-serif;
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 20px;
  text-align: center;
  color: #7848f4;
`;

const Intro = styled.p`
  font-size: 18px;
  margin-bottom: 30px;
  text-align: justify;
  color: #555;
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  margin-bottom: 15px;
  color: #7848f4;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
`;

const TableHead = styled.thead`
  background-color: #f4f4f4;
  color: #333;
`;

const TableHeaderCell = styled.th`
  padding: 15px;
  border: 1px solid #ddd;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 15px;
  border: 1px solid #ddd;
  text-align: left;
  vertical-align: top;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const PrivacyLaw: React.FC = () => {
  return (
    <Container>
      <Title>개인정보처리방침</Title>
      <Intro>
        모게더는 정보주체의 자유와 권리 보호를 위해 개인정보를 처리하고 안전하게
        관리하고 있습니다. 이에 따라 정보주체에게 개인정보 처리에 관한 절차 및
        기준을 안내하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록
        하기 위하여 다음과 같이 개인정보 처리방침을 수립∙공개합니다.
      </Intro>

      <SectionTitle>
        개인정보의 처리목적, 수집항목, 보유 및 이용기간
      </SectionTitle>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>서비스</TableHeaderCell>
            <TableHeaderCell>수집 목적</TableHeaderCell>
            <TableHeaderCell>수집 항목</TableHeaderCell>
            <TableHeaderCell>보유 및 이용기간</TableHeaderCell>
          </TableRow>
        </TableHead>
        <tbody>
          <TableRow>
            <TableCell>회원가입 및 관리</TableCell>
            <TableCell>회원가입∙탈퇴 의사 확인, 회원자격 유지∙관리</TableCell>
            <TableCell>
              [필수] 닉네임, 이메일, 비밀번호
              <br />
              [선택] 프로필사진, 성별, 주소, 나이, 자기소개, 휴대폰 번호
              <br />
              &lt;SNS 로그인_ 구글&gt;
              <br />
              [필수] 이름, 이메일
              <br />
              &lt;SNS 로그인_카카오&gt;
              <br />
              [필수] 이름, 이메일
            </TableCell>
            <TableCell>동의 철회 혹은 회원 탈퇴 시까지</TableCell>
          </TableRow>
        </tbody>
      </Table>
    </Container>
  );
};

export default PrivacyLaw;
