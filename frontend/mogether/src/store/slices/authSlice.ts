import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, registerApi } from '../../utils/api';
import { RootState } from '../store';

interface AuthState {
    isAuthenticated: boolean;   // 토큰 존재 여부에 따른 접근 허용 및 차단
    user: { email: string, password: string } | null;
    error: string | null;
    loading: boolean;
}

const initialState: AuthState = {
    isAuthenticated: !!localStorage.getItem('accessToken'),
    user: null,
    loading: false,
    error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }, thunkAPI) => {
        try {
            const user = await loginApi(email, password);
            return user;
        } catch (error) {
            return thunkAPI.rejectWithValue('Login failed');
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async ({ name, email, password }: { name: string; email: string; password: string }, thunkAPI) => {
        try {
            const user = await registerApi(name, email, password);
            return user;
        } catch (error) {
            return thunkAPI.rejectWithValue('Registration failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.error = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload;
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
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.user = null;
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { logout } = authSlice.actions;  //createSlice로 슬라이스를 생성하고, 해당 객체 안에 키값으로 reducers를 가진 값을 action으로 해서 가져옴
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated; //slice의 name을 통해 접근

export default authSlice.reducer;
