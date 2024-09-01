import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, logoutApi, kakaoRegisterApi, GoogleRegisterApi, forgotPasswordApi } from '../../utils/api';
import { RootState } from '../store';
import { log } from 'console';

interface User {
    email: string;
    password: string;
    nickname: string;
    gender: string;
    age: number;
    phoneNumber: string;
    address: {
        city: string;
        gu: string;
        details: string;
    };
    intro: string;
    image?: File;
    imageUrl?: string;
    userId: number;
}

//지금 현재 접속 시도자가 인증된 유저인지 확인하고 관리하는? 슬라이스
interface AuthState {
    isAuthenticated: boolean;   // 토큰 존재 여부에 따른 접근 허용 및 차단
    user?: User | null;
    error: string | null;
    loading: boolean;
    userId: number;
}

const initialState: AuthState = {
    isAuthenticated: !!localStorage.getItem('accessToken'),
    user: null,
    loading: false,
    error: null,
    userId: Number(localStorage.getItem('userId')) || 0,
};

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }, thunkAPI) => {
        try {
            const response = await loginApi(email, password);
            if (response.status === 200 || response.status === 201) {
                console.log(response.status);
                // localStorage.setItem('accessToken', response.headers["AccessToken"]);
                // localStorage.setItem('refreshToken', response.headers["RefreshToken"]);
                // localStorage.setItem('userId', response.headers["UserId"]);
                return response;  //아래 extrareducers에서 action.payload로 들어감
            }
        } catch (error) {
            return thunkAPI.rejectWithValue('Login failed');
        }
    }
);


export const logout = createAsyncThunk(
    'auth/logout',
    async (_, thunkAPI) => {
        try {
            const response = await logoutApi();
            if (response.status === 200 || response.status === 201) {
                // localStorage.removeItem('accessToken');
                // localStorage.removeItem('refreshToken');
                // localStorage.removeItem('userId');
                console.log(response.data);
                return response.data;
            }
        } catch (error) {
            console.log(error);
            return thunkAPI.rejectWithValue('Logout failed');
        }
    }
);

export const kakaoRegister = createAsyncThunk(
    'auth/kakaoRegister',
    async (_, thunkAPI) => {
        try {
            const response = await kakaoRegisterApi();
            if (response.status === 200 || response.status === 201) {
                return response.data;
            }
        } catch (error) {
            return thunkAPI.rejectWithValue('Kakao registration failed');
        }
    }
);

export const googleRegister = createAsyncThunk(
    'auth/googleRegister',
    async (_, thunkAPI) => {
        try {
            const response = await GoogleRegisterApi();
            if (response.status === 200 || response.status === 201) {
                return response.data;
            }
        } catch (error) {
            return thunkAPI.rejectWithValue('Kakao registration failed');
        }
    }
); 

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async ({ email, nickname }: { email: string; nickname: string }, thunkAPI) => {
        try {
            const response = await forgotPasswordApi(email, nickname);
            if (response.status === 200 || response.status === 201) {
                return response.data;
            }
        } catch (error) {
            return thunkAPI.rejectWithValue('Forgot password failed');
        }
    }
);





const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // logout(state) {
        //     state.isAuthenticated = false;
        //     state.user = null;
        //     state.error = null;
        //     localStorage.removeItem('accessToken');
        //     localStorage.removeItem('refreshToken');
        //     localStorage.removeItem('userId');
        //     state.userId = 0;
        // },
        setAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                console.log('login success' + action.payload);
                state.isAuthenticated = true;
                state.loading = false;
                state.error = null;
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.user = null;
                state.loading = false;
                state.error = action.payload as string;  //action payload에 타입 지정
                console.log('login failed' + action.payload);
            })
            
            .addCase(logout.fulfilled, (state, action) => {
                state.isAuthenticated = false;
                state.user = null;
                state.error = null;
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('userId');
                state.userId = 0;
                state.loading = false;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;  //action payload에 타입 지정
            })
            // .addCase(register.pending, (state) => {
            //     state.loading = true;
            //     state.error = null;
            // })
            // .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
            //     state.isAuthenticated = true;
            //     state.user = action.payload;
            //     state.loading = false;
            //     state.error = null;
            //     state.user.userId = action.payload.userId;
            //     console.log('register success' + action.payload);
            // })   //auth부분은 더 연구해야함
            // .addCase(register.rejected, (state, action) => {
            //     state.isAuthenticated = false;
            //     state.user = null;
            //     state.loading = false;
            //     state.error = action.payload as string;
            //     console.log('register failed' + action.payload);
            // })
            .addCase(kakaoRegister.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
                // console.log(state);
                // state.isAuthenticated = true;
            })
            .addCase(kakaoRegister.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(googleRegister.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(googleRegister.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                console.log('response success' + action.payload);
                state.loading = false;
                state.error = null;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});

export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated; //slice의 name을 통해 접근
export const selectUserId = (state: RootState) => state.auth.userId;
export const { setAuthenticated } = authSlice.actions;
export default authSlice.reducer;
