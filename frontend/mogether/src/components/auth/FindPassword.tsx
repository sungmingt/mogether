import {selectAllUserProfiles} from '../../store/slices/userProfileSlice';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../store/store';
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { selectIsAuthenticated } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';



const ForgotPasswordContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
  background-color: #fff;
  margin: 20px auto;
`;

const InputWrapper = styled.div`
  width: 100%;
  margin: 10px 0;
`;

const Input = styled.input`
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #7848f4;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
`;

const PasswordDisplay = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: #f4f4f4;
  border-radius: 5px;
  width: 100%;
  text-align: center;
`;

const FindPassword:React.FC = () => {
    const [nickname, setNickname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const navigate = useNavigate();

    let allProfiles = useSelector(selectAllUserProfiles); //갱신될 대마다 allProfiles에 들어가는 값이 달라짐
    // let allProfiles = useSelector((state: RootState) => state.userProfile.userProfiles)
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated]);

    useEffect(() => {
      // allProfiles가 비어 있지 않으면 로딩 완료로 간주
      if (Object.keys(allProfiles).length > 0) {
        setIsLoading(false);
      }
    }, [allProfiles]);

    const handleFindPassword = () => {
        if (isLoading) {
          Swal.fire('Info', '프로필을 로드 중입니다.', 'info');
          return;
        }
        console.log(allProfiles);
        const profile = Object.values(allProfiles).find(
          (profile) => profile.email == email && profile.nickname == nickname
        );
        
        if (profile) {
            setPassword(profile.password);
        }
        else {
            Swal.fire('error', '일치하는 정보가 없습니다', 'error');
            setPassword(null);
            return;
        }
    };


    return (
    <ForgotPasswordContainer>
      <h2>Forgot Password</h2>
      <InputWrapper>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </InputWrapper>
      <InputWrapper>
        <Input
          type="text"
          placeholder="Enter your nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </InputWrapper>
      <Button onClick={handleFindPassword}>Find</Button>
      {password && (
        <PasswordDisplay>
          <p>Password: <strong>{password}</strong></p>
        </PasswordDisplay>
      )}
    </ForgotPasswordContainer>
    )
}

export default FindPassword;
