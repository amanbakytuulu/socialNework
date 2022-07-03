import React from 'react'
import { toggleSubscribe } from '../redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from '@mui/material';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

function ShowFollowings({ show, setShow }) {

    const { currentUser, users } = useSelector((state) => state.users);
    const dispatch = useDispatch();

    const [uid] = useState(users.map(({ user }) => user.uid));

    const onHandleSubscribe = (postId) => {
        dispatch(toggleSubscribe({ userId: currentUser?.currentUser.uid, postId, method: 'subscribe' }));
    }
    const onHandleUnSubscribe = (postId) => {
        dispatch(toggleSubscribe({ userId: currentUser?.currentUser.uid, postId, method: 'unsubscribe' }));
    }

    return (
        <div className={`modal ${show ? 'is-active' : ''} `} style={{ zIndex: 500 }}>
            <div className="modal-background" onClick={() => setShow(false)}></div>
            <div className="modal-card" style={{ maxWidth: '450px' }}>
                <header class="modal-card-head" style={{ backgroundColor: 'var(--container-color)' }}>
                    <p class="modal-card-title has-text-centered is-size-5" style={{ color: 'var(--title-color)' }}>Подписки</p>
                    <button class="delete" aria-label="close" onClick={() => setShow(false)}></button>
                </header>
                <section className="modal-card-body px-4 mx-auto"
                    style={{
                        backgroundColor: 'var(--container-color)', width: '100%',
                        maxHeight: '385px', height: '100%', overfLowY: 'scroll'
                    }}>
                    {
                        currentUser?.currentUser.following.filter((follow) => {
                            if (currentUser?.currentUser.isBlocked.length !== 0) {
                                for (let i = 0; i < currentUser?.currentUser.isBlocked.length; i++) {
                                    if (follow.uid !== currentUser?.currentUser.isBlocked[i].uid) {
                                        return follow
                                    }
                                }
                            } else {
                                return follow

                            }
                        }).map((follow) => {
                            return (
                                <div className="is-flex is-justify-content-space-between is-align-items-center mb-3">
                                    <NavLink to={`/profile/${follow.uid}`} className="is-flex is-align-items-center">
                                        <Avatar src={follow.photoURL} sx={{ width: 40, height: 40 }} />
                                        <p className="ml-3"
                                            style={{ color: 'var(--title-color)' }}>
                                            {follow.firstName}
                                        </p>
                                    </NavLink>
                                    {
                                        currentUser?.currentUser.following.some((following) => {
                                            for (let i = 0; i < uid.length; i++) {
                                                if (following.uid === uid[i]) {
                                                    return true;
                                                }
                                            }
                                        }) &&
                                        <button className="button is-danger" onClick={() => onHandleUnSubscribe(follow.uid)}>
                                            <p>Отписаться</p>
                                        </button>
                                    }
                                </div>
                            )
                        })
                    }
                </section>
            </div >
        </div >
    )
}

export default ShowFollowings