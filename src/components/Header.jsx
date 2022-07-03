import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext, themes } from '../ThemeContext';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { LightModeOutlined } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import logoBlack from '../assets/logo/logoBlack.png';
import logoBlack2 from '../assets/logo/logoBlack2.png';
import logoWhite from '../assets/logo/logoWhite.png';
import logoWhite2 from '../assets/logo/logoWhite2.png';
import Notifications from './Notifications';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

function Header({ setActive, active }) {

    const { theme, changeTheme } = useContext(ThemeContext);
    const [darkMode, setDarkMode] = useState(theme === themes.dark ? true : false);
    const [showNotification, setShowNotification] = useState(false)
    const { currentUser, users } = useSelector((state) => state.users);
    const [text, setText] = useState("");
    const navigate = useNavigate();

    const onHandleSearch = ({ key }) => {
        if (key === "Enter") {
            if (text === "") {
                return;
            }
            users.filter(({ user }) => {
                if (currentUser?.currentUser.isBlocked.length !== 0) {
                    for (let i = 0; i < currentUser?.currentUser.isBlocked.length; i++) {
                        if (user.uid !== currentUser?.currentUser.isBlocked[i].uid) {
                            return user
                        }
                    }
                } else {
                    return user
                }
            }).some(({ user }) => {
                if (user.firstName.toLowerCase().replace(/\s+/g, '') === text.toLowerCase().replace(/\s+/g, '')) {
                    navigate(`/profile/${user.uid}`)
                }

            })

            if (!users.filter(({ user }) => {
                if (currentUser?.currentUser.isBlocked.length !== 0) {
                    for (let i = 0; i < currentUser?.currentUser.isBlocked.length; i++) {
                        if (user.uid !== currentUser?.currentUser.isBlocked[i].uid) {
                            return user
                        }
                    }
                } else {
                    return user
                }
            }).some(({ user }) => user.firstName.toLowerCase().replace(/\s+/g, '') === text.toLowerCase().replace(/\s+/g, ''))) {
                return toast.info('Никого не найдено!');
            }
        }
    }

    useEffect(() => {
        document.body.addEventListener('keydown', (mouse) => {
            if (mouse.key === "Escape") {
                setShowNotification(false);
            }
        })

    }, [])

    useEffect(() => {
        changeTheme(darkMode ? themes.dark : themes.light)

    }, [darkMode])

    return (
        <nav style={{ zIndex: '150' }} className={`navbar has-shadows is-spaced py-2 is-fixed-top ${darkMode ? 'is-darkness-container' : 'is-white'}`} role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <NavLink className="navbar-item is-size-3 has-text-weight-semibold p-0" to="/">
                    <img src={darkMode ? logoWhite2 : logoBlack2} alt="" width={150} height={150} />
                </NavLink>

                <a role="button" className={`navbar-burger ${active ? 'is-active' : ''}`} aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" onClick={() => setActive(!active)}>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarBasicExample" className={`navbar-menu`}>
                <div className="navbar-end">
                    <div className="control has-icons-left">
                        <input className={`input is-rounded ${darkMode ? 'is-darkness-bg' : 'has-background-link-light'}`}
                            type="text"
                            placeholder="...Искать друзей"
                            onKeyDown={onHandleSearch}
                            value={text} onChange={(e) => setText(e.target.value)} />
                        <span className="icon is-small is-left">
                            <i className="fa fa-search" aria-hidden="true"></i>
                        </span>
                    </div>
                </div>
                <div className="navbar-end">
                    <div className="navbar-item ">
                        <span className={`icon ${darkMode ? '' : 'has-background-blue'} p-4 is-radius`}
                            style={{ position: 'relative' }}
                            onClick={() => setShowNotification(!showNotification)}>
                            <NotificationsNoneIcon fontSize='small' sx={{ fontSize: 22 }} className="has-text-blue"
                            />
                            <div style={currentUser?.currentUser.newNotification === true ? {
                                position: 'absolute',
                                top: 6, right: 4, width: '2px', height: '2px', background: 'var(--color-new-message)',
                                borderRadius: '50%', boxShadow: '0px 0px 3px 4px var(--color-new-message)',
                            } : {}}>
                            </div>
                        </span>
                    </div>
                    <div className="navbar-item ">
                        <NavLink to="/chat">
                            <span className={`icon ${darkMode ? '' : 'has-background-blue'} p-4 is-radius`}>
                                <MailOutlineIcon fontSize='small' sx={{ fontSize: 22 }} className="has-text-blue" />
                            </span>
                        </NavLink>
                    </div>
                    <div className="navbar-item ">
                        <span className={`icon ${darkMode ? '' : 'has-background-blue'} p-4 is-radius`}
                            onClick={() => {
                                setDarkMode(!darkMode);
                            }}>
                            {darkMode ? <DarkModeOutlinedIcon fontSize='small' sx={{ fontSize: 22 }} className="has-text-blue" /> : <LightModeOutlined fontSize='small' sx={{ fontSize: 22 }} className="has-text-blue" />}
                        </span>
                    </div>
                    <div className="navbar-item">
                        <NavLink to="/settings">
                            <Avatar src={currentUser?.currentUser.photoURL} alt="photo" />
                        </NavLink>
                    </div>
                </div>
            </div >
            {showNotification ? <Notifications show={showNotification} setShowNotification={setShowNotification} />
                : <Notifications show={showNotification} setShowNotification={setShowNotification} />
            }
        </nav >
    )
}

export default Header
