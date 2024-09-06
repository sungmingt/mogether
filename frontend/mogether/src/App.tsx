import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MoimList from './pages/moim/MoimListPage';
import MoimCard from './pages/moim/MoimCardPage';
import CreateMoim from './pages/moim/MoimCreatePage';
import EditMoim from './pages/moim/MoimEditPage';
import BungaeList from './pages/bungae/BungaeListPage';
import BungaeCard from './pages/bungae/BungaeCardPage';
import EditBungae from './pages/bungae/BungaeEditPage';
import ForgotPassword from './pages/auth/ForgotPasswordPage';
import Login from './pages/auth/LoginPage';
import Register from './pages/auth/RegisterPage';
import SocialRegister from './pages/auth/SocialRegisterPage';
import MyPage from './pages/mypage/MyProfilePage';
import MyCreatedMoim from './pages/mypage/MyCreatedMoimPage';
import MyCreatedBungae from './pages/mypage/MyCreatedBungaePage';
import MyInterestedMoim from './pages/mypage/MyInterestMoimPage';
import MyInterestedBungae from './pages/mypage/MyInterestBungaePage';
import UserCreateMoim from './pages/mypage/UserCreateMoimPage';
import UserCreateBungae from './pages/mypage/UserCreateBungaePage';
import GlobalStyle from './GlobalStyle';
import KakaoRedirectUrlPage from './components/auth/KakaoRedirectUrlPage';
import GoogleRedirectUrlPage from './components/auth/GoogleRedirectUrlPage';
import PrivacyLaw from './pages/auth/PrivacyLaw';
import SocialRegisterUrl from './components/auth/SocialRegisterRedirection';
import ChangePasswordPage from './pages/mypage/ChangePasswordPage';
import FindPasswordSuccessPage from './pages/auth/FindPasswordSuccessPage';
import UserProfilePage from './pages/mypage/UserProfilePage';
// import GroupChatListPage from './pages/chat/GroupChatListPage';
// import GroupChatPage from './pages/chat/GroupChatPage';



const App = () => {
  return (
    <>
    <GlobalStyle />
    <Router>
      <Routes>
        {/* <Route path = "/login" element = {<Login />} />
        <Route path="/register" element={<Register />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/moim/list" element={<MoimList />} />
        <Route path="/moim/:id" element={<MoimCard />} />
        <Route path="/createPost" element={<CreateMoim />} />
        <Route path="/moim/edit/:id" element={<EditMoim />} />
        <Route path="/bungae/list" element={<BungaeList />} />
        <Route path="/bungae/:id" element={<BungaeCard />} />
        <Route path="/bungae/edit/:id" element={<EditBungae />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user/:id/oauth2/info" element={<SocialRegister />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/createdMoim" element={<MyCreatedMoim />} />
        <Route path="/createdBungae" element={<MyCreatedBungae />} />
        <Route path="/interestedMoim" element={<MyInterestedMoim />} />
        <Route path="/interestedBungae" element={<MyInterestedBungae />} />
        <Route path="/usercreatedMoim/:id" element={<UserCreateMoim />} />
        <Route path="/usercreatedBungae/:id" element={<UserCreateBungae />} />
        <Route path="/social/login/kakao" element={<KakaoRedirectUrlPage />} />
        <Route path="/social/login/google" element={<GoogleRedirectUrlPage />} />
        <Route path="/law/privacy" element={<PrivacyLaw />} />
        <Route path="/social/register" element={<SocialRegisterUrl />} />
        <Route path="/changePassword" element={<ChangePasswordPage />} /> 
        <Route path="/forgot-password/success" element={<FindPasswordSuccessPage />} />
        <Route path="/user/:id" element={<UserProfilePage />} />
        {/* <Route path="/groupChatList" element={<GroupChatListPage />} />
        <Route path="/groupChat/:id" element={<GroupChatPage />} />  */}
      </Routes>
    </Router>
    </>
  )
}

export default App;