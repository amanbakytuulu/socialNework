import React from 'react';
import ReactDOM from 'react-dom';
import 'bulma/css/bulma.css';
import 'font-awesome/css/font-awesome.min.css';
import './scss/styles.scss';
import './scss/global.scss';
import App from './App';
import ThemeContextWrapper from './ThemeContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Feed from './pages/Feed/Feed';
import Message from './pages/Message/Message';
import Login from './authorization/Login';
import SignIn from './authorization/SignIn';
import SignUp from './authorization/SignUp';
import ResetPassword from './authorization/ResetPassword';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Settings from './components/Settings';
import AccountDetails from './components/Details/AccountDetails';
import AddressDetails from './components/Details/AddressDetails';
import SocialDetails from './components/Details/SocialDetails';
import PasswordDetails from './components/Details/PasswordDetails';
import Profile from './pages/Profile/Profile';
import { Provider } from 'react-redux';
import store from './redux';
import ProfileUser from './pages/ProfileUser/ProfileUser';
import MessageEmpty from './pages/Message/MessageEmpty';
import ModalStoryShow from './components/ModalStoryShow';
import Explore from './pages/Explore/Explore';
import Notifications from './pages/Notifications/Notifications';

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <ThemeContextWrapper>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Feed />} />
            <Route path="explore" element={<Explore />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="chat" element={<MessageEmpty />} />
            <Route path="chat/:uid" element={<Message />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/:uid" element={<ProfileUser />} />
            <Route path="settings" element={<Settings />} />
            <Route path="settings/info-account" element={<AccountDetails />} />
            <Route path="settings/address-info" element={<AddressDetails />} />
            <Route path="settings/social-info" element={<SocialDetails />} />
            <Route path="settings/change-password" element={<PasswordDetails />} />
            <Route path="stories/:firstName/:uid" element={<ModalStoryShow />} />
          </Route>
          <Route path="/login" element={<Login />}>
            <Route path="signIn" element={<SignIn />} />
            <Route path="signUp" element={<SignUp />} />
            <Route path="resetPassword" element={<ResetPassword />} />
          </Route>
        </Routes>
        <ToastContainer />
      </ThemeContextWrapper>
    </Provider>
  </BrowserRouter >,
  document.getElementById('root')
);
