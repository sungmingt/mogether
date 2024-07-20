import { configureStore } from "@reduxjs/toolkit";
import authReucer from './slices/authSlice';
import userReducer from './slices/userSlice';
import feedReducer from './slices/feedSlice';
import groupReducer from './slices/groupSlice';
import App from '../App';

const store = configureStore({
    reducer: {
        auth: authReucer,
        user: userReducer,
        feed: feedReducer,
        group: groupReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;