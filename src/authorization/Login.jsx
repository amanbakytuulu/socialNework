import React, { useContext, useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import logoWhite2 from '../assets/logo/logoWhite2.png';
import logoBlack2 from '../assets/logo/logoBlack2.png';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ThemeContext, themes } from '../ThemeContext';

function Login() {

    const [select, setSelect] = useState(0);
    const navigate = useNavigate();
    const { theme, changeTheme } = useContext(ThemeContext);

    const [user] = useAuthState(auth);

    useEffect(() => {
        if (user) {
            navigate('/', { replace: true });
        }
    }, [user])

    return (
        <div className="login">
            <header className="login__header">
                <div className="login__left">
                    {/* <AppleIcon fontSize="large" /> */}
                    <NavLink to="/"><h4 style={{ fontWeight: '600' }}>
                        <img src={theme === themes.dark ? logoWhite2 : logoBlack2} alt="" width={150} height={150} />
                    </h4></NavLink>
                </div>
                <div className="login__right">
                    <NavLink to="signIn" className={`login_sign ${!select ? 'bg' : ''}`}
                        onClick={() => setSelect(0)}>
                        Логин
                    </NavLink>
                    <NavLink to="signUp" className={`login__registration ${select ? 'bg' : ''}`}
                        onClick={() => setSelect(1)}>
                        Регистрация
                    </NavLink>
                </div>
            </header >
            <div>
                <Outlet />
            </div>
            <footer>
                &copy; Copyright 2022 By Amanchik
            </footer>
        </div >
    )
}

export default Login
