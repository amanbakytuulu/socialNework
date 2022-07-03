import React, { useState } from 'react'
import { Avatar } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSubscribe } from '../../redux/userSlice';

function Explore() {

    const { currentUser, users } = useSelector((state) => state.users);
    const dispatch = useDispatch();
    const [topUsers] = useState(users.filter(({ user }) => user.followers.length > 0));

    const onHandleSubscribe = (postId) => {
        dispatch(toggleSubscribe({ userId: currentUser?.currentUser.uid, postId, method: 'subscribe' }));
    }
    const onHandleUnSubscribe = (postId) => {
        dispatch(toggleSubscribe({ userId: currentUser?.currentUser.uid, postId, method: 'unsubscribe' }));
    }

    return (
        <div className="explore container is-max-desktop">
            <div className="explore__title is-size-4 has-text-weight-bold p-5 my-3">
                Топ
            </div>
            <div className="explore__items ">
                {
                    topUsers.filter(({ user }) => {
                        if (currentUser?.currentUser.isBlocked.length !== 0) {
                            for (let i = 0; i < currentUser?.currentUser.isBlocked.length; i++) {
                                if (user.uid !== currentUser?.currentUser.isBlocked[i].uid) {
                                    return user
                                }
                            }
                        } else {
                            return user
                        }

                    }).map(({ user }) => {
                        return (
                            <div key={user.uid} className="explore__item">
                                <div className="explore__top">
                                    <Avatar src={user.photoURL} sx={{ width: 88, height: 88 }}
                                        className="explore__avatar" />
                                    <div>
                                        <h2>{user.firstName}</h2>
                                        <p>{user.email}</p>
                                    </div>
                                </div>
                                <div className="explore__middle">
                                    <p>
                                        {user.followers.length > 1000 ?
                                            `${user.followers.length}k` :
                                            user.followers.length}
                                        <span> Подписчики</span>
                                    </p>
                                    <p>
                                        {user.following.length > 1000 ?
                                            `${user.following.length}k` :
                                            user.following.length}
                                        <span> Подписки</span>
                                    </p>
                                </div>
                                {
                                    currentUser?.currentUser.following.some((follow) => follow.uid === user.uid) ?
                                        <button type="button" className="button is-danger is-rounded" onClick={() => onHandleUnSubscribe(user.uid)}>
                                            <p>Отписаться</p>
                                        </button>
                                        :
                                        <button type="button" className="button is-link is-rounded" onClick={() => onHandleSubscribe(user.uid)}>
                                            <p>Подписаться</p>
                                        </button>
                                }
                            </div>
                        )
                    })
                }

                {/* <div className="explore__item">
                    <div className="explore__top">
                        <Avatar sx={{ width: 88, height: 88 }}
                            className="explore__avatar" />
                        <div>
                            <h2>Aliqa Macale</h2>
                            <p>support@gmail.com</p>
                        </div>
                    </div>
                    <div className="explore__middle">
                        <p>
                            55.7k
                            <span> Посты</span>
                        </p>
                        <p>
                            105k
                            <span> Подписчики</span>
                        </p>
                        <p>
                            71k
                            <span> Подписки</span>
                        </p>
                    </div>

                    <button type="button" className="button is-link">Подписаться</button>
                </div>
                <div className="explore__item">
                    <div className="explore__top">
                        <Avatar sx={{ width: 88, height: 88 }}
                            className="explore__avatar" />
                        <div>
                            <h2>Aliqa Macale</h2>
                            <p>support@gmail.com</p>
                        </div>
                    </div>
                    <div className="explore__middle">
                        <p>
                            55.7k
                            <span> Посты</span>
                        </p>
                        <p>
                            105k
                            <span> Подписчики</span>
                        </p>
                        <p>
                            71k
                            <span> Подписки</span>
                        </p>
                    </div>

                    <button type="button" className="button is-link">Подписаться</button>
                </div>
                <div className="explore__item">
                    <div className="explore__top">
                        <Avatar sx={{ width: 88, height: 88 }}
                            className="explore__avatar" />
                        <div>
                            <h2>Aliqa Macale</h2>
                            <p>support@gmail.com</p>
                        </div>
                    </div>
                    <div className="explore__middle">
                        <p>
                            55.7k
                            <span> Посты</span>
                        </p>
                        <p>
                            105k
                            <span> Подписчики</span>
                        </p>
                        <p>
                            71k
                            <span> Подписки</span>
                        </p>
                    </div>

                    <button type="button" className="button is-link">Подписаться</button>
                </div>
                <div className="explore__item">
                    <div className="explore__top">
                        <Avatar sx={{ width: 88, height: 88 }}
                            className="explore__avatar" />
                        <div>
                            <h2>Aliqa Macale</h2>
                            <p>support@gmail.com</p>
                        </div>
                    </div>
                    <div className="explore__middle">
                        <p>
                            55.7k
                            <span> Посты</span>
                        </p>
                        <p>
                            105k
                            <span> Подписчики</span>
                        </p>
                        <p>
                            71k
                            <span> Подписки</span>
                        </p>
                    </div>

                    <button type="button" className="button is-link">Подписаться</button>
                </div> */}
            </div>
        </div>
    )
}

export default Explore