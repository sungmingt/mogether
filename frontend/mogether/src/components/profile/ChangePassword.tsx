import React, {useEffect, useState} from "react";
import styled from "styled-components";
import { useDispatch, UseDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { selectIsAuthenticated } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { selectUserId } from "../../store/slices/authSlice";
import { selectUserProfile, selectAllUserProfiles, PatchUserPassword } from "../../store/slices/userProfileSlice";
import { createAsyncThunk, current } from '@reduxjs/toolkit';
// import { changePasswordApi } from "../../utils/api";
import Swal from "sweetalert2";

const ChangePasswordContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 500px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 10px;
    max-width: 90%;
  }
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

const InputContainer = styled.div`
  width: 100%;
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #555;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #7848f4;
  }
`;

const StyledButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #7848f4;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #5c3bbf;
  }
`;




const ChangePassword: React.FC = () => {
    const userId = Number(localStorage.getItem('userId')) || 0;
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
    const dispatch = useDispatch<AppDispatch>();
    const currentUserProfile = useSelector(
      (state: RootState) => state.userProfile.userProfiles[userId]
    );
    const allProfile = useSelector(selectAllUserProfiles);   
    const accessToken = localStorage.getItem('accessToken'); 
    const navigate = useNavigate();

    useEffect(() => {
        if (!accessToken) {
            navigate('/login');
        }
    }, [accessToken, userId]);
 

    const handlePasswordChange = async () => {
        if (newPassword !== confirmNewPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Password Change Failed',
                text: 'New password and confirm new password do not match',
            });
            return;
        }
        else if (newPassword === "" || confirmNewPassword === "" || oldPassword === "") {
            Swal.fire({
                icon: 'error',
                title: 'Password Change Failed',
                text: 'Please fill in all fields',
            });
            return
        }
        else if (newPassword.length < 8 || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(newPassword) === false) {
            Swal.fire({
                icon: 'error',
                title: 'Password Change Failed',
                text: 'Password must be at least 8 characters long',
            });
            return;
        }
        const passwordData = {userId: userId, oldPassword: oldPassword, newPassword: newPassword};
        try {
            const response = await dispatch(PatchUserPassword(passwordData)).unwrap();
            console.log(response);
            if (currentUserProfile) {
              currentUserProfile.password = newPassword;
              Swal.fire('success', '비밀번호가 성공적으로 변경되었습니다', 'success');  
            } else {
                Swal.fire('error', '프로필을 찾을 수 없습니다', 'error');
            }
            allProfile[userId].password = newPassword;
            
        }
        catch (error) {
            Swal.fire('error', error as string, 'error');
        }
    }

    return (
      <ChangePasswordContainer>
      <Title>Change Password</Title>
      <InputContainer>
        <Label htmlFor="old-password">현재 비밀번호</Label>
        <StyledInput
          id="old-password"
          type="password"
          placeholder="Enter your old password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </InputContainer>
      <InputContainer>
        <Label htmlFor="new-password">새 비밀번호</Label>
        <StyledInput
          id="new-password"
          type="password"
          placeholder="Enter your new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </InputContainer>
      <InputContainer>
        <Label htmlFor="confirm-new-password">비밀번호 확인</Label>
        <StyledInput
          id="confirm-new-password"
          type="password"
          placeholder="Confirm your new password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
      </InputContainer>
      <StyledButton onClick={handlePasswordChange}>
        Change Password
      </StyledButton>
    </ChangePasswordContainer>
    );
}

export default ChangePassword;