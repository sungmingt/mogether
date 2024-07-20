import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginApi, register as registerApi } from '../../utils/api';
import { RootState } from '../store';


interface AuthState {
    isAuthenticated: boolean;
    user: { email: string, password: string } | null;
    error: string | null;
    loading: boolean;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async ({email, password}: {email: string; password:string}, thunkAPI) => {
        try {
            const user = await loginApi(email, password);
            return user;
        }
        catch (error) {
            return thunkAPI.rejectWithValue('Login failed');
        }
    }
)

export const register = createAsyncThunk(
    'auth/register',
    async ({ name, email, password }: { name: string; email: string; password: string }, thunkAPI) => {
      try {
        const user = await registerApi(name, email, password);
        return user;
      } 
      catch (error) {
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
          state.error = action.payload as string;
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
  

export const { logout } = authSlice.actions;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

export default authSlice.reducer;