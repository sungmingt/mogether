import { configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import moimReducer from './slices/moimSlice';
import bungaeReducer from './slices/bungaeSlice';
import userProfileReducer from './slices/userProfileSlice';

import App from '../App';

const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        moim: moimReducer,
        bungae: bungaeReducer,
        userProfile: userProfileReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// export type AppThunkDispatch = ThunkDispatch<ReducerType, any, Action<string>>;

export default store;