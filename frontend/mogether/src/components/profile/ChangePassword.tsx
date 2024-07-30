import React, {useState} from "react";
import styled from "styled-components";
import { UseDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { selectIsAuthenticated } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { selectUserId } from "../../store/slices/authSlice";
import { selectUserProfile } from "../../store/slices/userSlice";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { changePasswordApi } from "../../utils/api";
import Swal from "sweetalert2";

const ChangePassword: React.FC = () => {

    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');

    const handlePasswordChange = async () => {
        if (newPassword !== confirmNewPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Password Change Failed',
                text: 'New password and confirm new password do not match',
            });
            return;
        }
        const response = await changePasswordApi(oldPassword, newPassword);
        if (response.status === 200) {
            window.location.reload(); // 새로고침
        }
        else {
            Swal.fire('error', 'Server Fail', 'error');
        }
    }

    return (
        <div>
            <h1>Change Password</h1>
            <form>
                <div>
                    <label>Old Password</label>
                    <input type="password" onChange={(e) => setOldPassword(e.target.value)}/>
                </div>
                <div>
                    <label>New Password</label>
                    <input type="password" onChange={(e) => setNewPassword(e.target.value)}/>
                </div>
                <div>
                    <label>Confirm New Password</label>
                    <input type="password" onChange={(e) => setConfirmNewPassword(e.target.value)}/>
                </div>
                <button onClick={() => {handlePasswordChange}}>Change Password</button>
            </form>
        </div>
    );
}

export default ChangePassword;