import React, { useState } from 'react';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import SendIcon from '@mui/icons-material/Send';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import IosShareIcon from '@mui/icons-material/IosShare';
import { getAuth } from 'firebase/auth';
import { Avatar } from '@mui/material';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

function MessageEmpty() {

    const auth = getAuth();
    const user = auth?.currentUser;
    const { currentUser, users } = useSelector((state) => state.users);
    const [message, setMessage] = useState("");

    return (
        <>
            <div className="message mt-3" style={{ borderRadius: '10px' }}>
                <div className="container">
                    <div className="message__top">
                        <div className="message__info">
                            <Avatar src={user.photoURL} alt="photo" />
                            <p>{user.displayName}</p>
                        </div>
                    </div>
                    <div className="is-flex is-justify-content-center is-align-items-center" style={{ height: '85vh' }}>
                        <div className="is-flex is-flex-direction-column is-align-items-center is-size-5 " style={{ maxWidth: '550px', overflowX: 'scroll' }}>
                            <SmsOutlinedIcon style={{ fontSize: '60px', marginBottom: '5px' }} />
                            Начать разговор
                            <div className="is-flex mb-6 mt-5">
                                {
                                    currentUser?.currentUser.chatUsers.length !== 0 ?
                                        currentUser?.currentUser.chatUsers.filter((user) => {
                                            if (currentUser?.currentUser.isBlocked.length !== 0) {
                                                for (let i = 0; i < currentUser?.currentUser.isBlocked.length; i++) {
                                                    if (user.uid !== currentUser?.currentUser.isBlocked[i].uid) {
                                                        return user
                                                    }
                                                }
                                            } else {
                                                return user

                                            }

                                        }).map((user) => {
                                            return (
                                                <NavLink to={`/chat/${user.uid}`} className="mt-5 mx-3">
                                                    <Avatar src={user.photoURL} alt="avatarUser" sx={{ width: 150, height: 150 }} />
                                                    <p className="has-text-centered is-size-5 mt-3">{user.firstName}</p>
                                                </NavLink>
                                            )
                                        })
                                        :
                                        users.map(({ user }) => {
                                            return (
                                                <NavLink to={`/chat/${user.uid}`} className="mt-5 mx-3" style={{ textDecoration: 'none' }} >
                                                    <Avatar src={user.photoURL} alt="avatarUser" sx={{ width: 150, height: 150 }} />
                                                    <p className="has-text-centered is-size-5 mt-3">{user.firstName}</p>
                                                </NavLink>
                                            )
                                        })
                                }
                            </div>
                        </div>
                    </div>
                    <form>
                        <div className="field">
                            <button className="message__voice mr-1"><KeyboardVoiceIcon /></button>
                            <input type="file" id="photo" style={{ display: 'none' }} />
                            {/* <label htmlFor="photo">
                                <IosShareIcon fontSize='small'/>
                            </label> */}

                            <p className="control has-icons-right">
                                <input className="input px-4" type="text" placeholder="Сообщение..."
                                    disabled />
                            </p>
                            <button type="submit" className={`message__send ${message == "" && 'has-background-link-dark'}`} disabled={message == "" && true}><SendIcon className="message__send-icon" /> </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default MessageEmpty