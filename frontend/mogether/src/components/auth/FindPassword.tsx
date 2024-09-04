import {selectAllUserProfiles} from '../../store/slices/userProfileSlice';
import {useSelector, useDispatch} from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { selectIsAuthenticated, forgotPassword } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
// useSelector는 store에서 state를 가져오는 함수이지, 갱신하는 함수가 아님 -> 갱신은 dispatch를 이용해서 하기!



const ForgotPasswordContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  height: 100vh;
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
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>(); 
    let allProfiles = useSelector((state: RootState) => state.userProfile.userProfiles)
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated]);



    const handleFindPassword = async () => {
      try {
        const response = await dispatch(forgotPassword({email: email, nickname: nickname})).unwrap(); 
        console.log(response);
        const password = response.password;
  
        const templateParams = {
            to_email: email,
            nickname: nickname,
            password: password
        };
  
        emailjs.send(
            'service_3rz4xds',          // 서비스 ID
            'template_poluvh4',         // 템플릿 ID
            templateParams,
            'W76vSCKi3IpSoBN0I'         // Public Key
        )
        .then(() => {
          Swal.fire('Success', '이메일로 비밀번호가 전송되었습니다.', 'success');
          navigate('/forgot-password/success')
        }, 
        (error) => {
          console.error(error);
          Swal.fire('Error', '이메일 전송에 실패했습니다.', 'error');
        });
      } catch (error) {
        Swal.fire('Error', '일치하는 정보가 없습니다.', 'error');
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
