import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from "../store";
import { userApi, registerApi, changeUserProfile, socialRegisterApi, changePasswordApi, DeleteUserApi } from '../../utils/api';

interface Address {
    city: string;
    gu: string;
    details?: string;
}

interface UserProfile {
    userId: number;
    email: string;
    password: string;
    socialType?: string;
    providerId?: string;
    nickname: string;
    imageUrl?: string;
    address?: Address;
    age?: number;
    gender?: string;
    intro?: string;
    phoneNumber?: string;
    image?: File;
}

interface UserProfileState {
    userProfiles: { [userId: number]: UserProfile }; // 사용자 ID별 프로필 관리
    error: string | null;
    loading: boolean;
}

const initialState: UserProfileState = {
    userProfiles: {},
    error: null,
    loading: false,
};

export const fetchProfile = createAsyncThunk(
    'userProfile/fetchProfile',
    async (userId: number, thunkAPI) => {
        try {
            const response = await userApi(userId);
            if (response.status === 200 || response.status === 201) {
                console.log(response.data)
                return response.data;
            } else {
                return thunkAPI.rejectWithValue('Failed to fetch profile');
            }
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to fetch profile');
        }
    }
);

export const PatchUserProfile = createAsyncThunk(
    'user/patchUserProfile',
    async (profileData: any, { rejectWithValue }) => {
        try {
            const response = await changeUserProfile(profileData);
            if (response.status === 200 || response.status === 201) {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue('Failed to update profile');
        }
    }
);

export const PatchUserPassword = createAsyncThunk(
    'user/patchUserPassword',
    async (passwordData: { userId: number; oldPassword: string; newPassword: string }, { rejectWithValue }) => {
        try {
            const response = await changePasswordApi(passwordData);
            if (response.status === 200 || response.status === 201) {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue('Failed to update password');
        }
    }
);

export const registerUser = createAsyncThunk(
    'userProfile/registerUser',
    async (registerFormData: FormData, thunkAPI) => {
        try {
            const response = await registerApi(registerFormData);
            if (response.status === 200 || response.status === 201) {
                console.log(response.status);
                console.log(response.data);
                return response.data;
            } else {
                return thunkAPI.rejectWithValue('Failed to register');
            }
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to register');
        }
    }
);

export const socialRegisterUser = createAsyncThunk(
    'userProfile/socialRegisterUser',
    async ({ socialRegisterFormData, userId }: any, thunkAPI) => {
        try {
            const response = await socialRegisterApi({ socialRegisterFormData, userId });
            if (response.status === 200 || response.status === 201) {
                return response.data;
            } else {
                return thunkAPI.rejectWithValue('Failed to register');
            }
        } catch (error) {
            return thunkAPI.rejectWithValue('Failed to register');
        }
    }
);

export const DeleteUser = createAsyncThunk(
    'user/DeleteUser',
    async (userId: number, { rejectWithValue }) => {
      try {
        const response = await DeleteUserApi(userId);
        if (response.status === 204) {
          return response.data;
        }
      } catch (error) {
        return rejectWithValue('Failed to delete user');
      }
    }
  ) 

const userProfileSlice = createSlice({
    name: 'userProfile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
            state.userProfiles[action.payload.userId] = action.payload;
        });
        builder.addCase(fetchProfile.rejected, (state, action: PayloadAction<any>) => {
            state.error = action.payload as string;
        });
        builder.addCase(registerUser.fulfilled, (state, action: PayloadAction<UserProfile>) => {
            state.userProfiles[action.payload.userId] = action.payload;
            console.log('register success' + action.payload);
            console.log(action.payload);
            console.log(action.payload.userId);
            console.log(action.payload.nickname);
            console.log(action.payload.email);
            console.log(state.userProfiles[action.payload.userId])
            console.log(state.userProfiles);
            console.log(selectAllUserProfiles)
        });
        builder.addCase(registerUser.rejected, (state, action: PayloadAction<any>) => {
            state.error = action.payload as string;
            console.log('register failed' + action.payload);
        });
        builder.addCase(socialRegisterUser.fulfilled, (state, action: PayloadAction<UserProfile>) => {
            state.userProfiles[action.payload.userId] = action.payload;
        });
        builder.addCase(socialRegisterUser.rejected, (state, action: PayloadAction<any>) => {
            state.error = action.payload as string;
        });
        builder.addCase(PatchUserProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
            state.userProfiles[action.payload.userId] = action.payload;
        });
        builder.addCase(PatchUserProfile.rejected, (state, action: PayloadAction<any>) => {
            state.error = action.payload as string;
        });
        builder.addCase(PatchUserPassword.rejected, (state, action: PayloadAction<any>) => {
            state.error = action.payload as string;
        });
        builder.addCase(DeleteUser.fulfilled, (state, action: PayloadAction<any>) => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userId');
            state.error = null;
        })
        builder.addCase(DeleteUser.rejected, (state, action: PayloadAction<any>) => {
            state.error = action.payload as string;
        });
    },
});

export const selectUserProfile = (state: RootState, userId: number) => state.userProfile.userProfiles[userId]; // 특정 사용자의 프로필 불러오기
export const selectAllUserProfiles = (state: RootState) => state.userProfile.userProfiles;
export default userProfileSlice.reducer;
