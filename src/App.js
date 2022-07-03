import React, { useState, useEffect, memo, useContext } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SidebarChat from './components/SidebarChat';
import { auth, firestore } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Outlet, useNavigate } from 'react-router-dom';
import { fetchUsers, getCurrentUser } from './redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from './redux/postSlice';
import { fetchStories } from './redux/storySlice';
import logoBlack from './assets/logo/logoBlack.png';
import logoWhite from './assets/logo/logoWhite.png';
import { ThemeContext, themes } from './ThemeContext';

function App() {

  const [user] = useAuthState(auth);
  const [active, setActive] = useState(true);
  const navigate = useNavigate();
  const { theme, changeTheme } = useContext(ThemeContext);

  const { users } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers())
  }, [])

  useEffect(() => {
    dispatch(fetchPosts())
  }, [])

  useEffect(() => {
    dispatch(fetchStories())
  }, [])


  useEffect(() => {
    dispatch(getCurrentUser(user?.uid));
  }, [user, users])

  return (
    <>
      {
        user ? (
          <div className="app">
            {
              users.length === 0 ?
                (
                  <div
                    style={{
                      zIndex: 999,
                      position: 'absolute', top: 0, left: 0,
                      width: '100%', height: '100%',
                      background: 'var(--bg-color)',
                      display: 'flex', justifyContent: 'center',
                      alignItems: 'center'
                    }}><img src={theme === themes.dark ? logoWhite : logoBlack} alt="logo" width={1000} height={1000}
                      style={{ objectFit: 'contain' }} />
                  </div>
                ) : null
            }
            <Header setActive={setActive} active={active} />
            <div className="app__body">
              <Sidebar />
              <Outlet />
              <SidebarChat />
            </div>
          </div>
        ) : (
          navigate('login/signIn', { replace: true })
        )
      }
    </>
  )
}

export default memo(App);
