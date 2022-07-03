import React, { useEffect, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Post from '../../components/Post';
import { NavLink, Navigate } from 'react-router-dom';
import Loader from './../../components/Loader/Loader';
import { Avatar } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toggleSubscribe } from '../../redux/userSlice';
import { useNavigate } from 'react-router-dom';

function ProfileUser() {

    const { uid } = useParams();
    const navigate = useNavigate();
    const { currentUser, users } = useSelector((state) => state.users);
    const [profileUser] = useState(users.filter(({ user }) => user.uid === uid))[0];
    const { posts, status } = useSelector((state) => state.posts);
    const [myPosts] = useState(posts?.filter((post) => post.post.uid == uid));
    const dispatch = useDispatch();

    // story
    const { stories } = useSelector((state) => state.stories);
    const [isStory] = useState(stories.some(({ story }) => story.uid === uid));
    // story

    const onHandleSubscribe = (postId) => {
        dispatch(toggleSubscribe({ userId: currentUser?.currentUser.uid, postId, method: 'subscribe' }));
    }
    const onHandleUnSubscribe = (postId) => {
        dispatch(toggleSubscribe({ userId: currentUser?.currentUser.uid, postId, method: 'unsubscribe' }));
    }

    useEffect(() => {
        if (currentUser?.currentUser.uid === uid) {
            navigate('/profile');
        }
    }, [])

    return (
        <div className="container is-max-desktop mx-auto mt-6 profile">
            <div className="columns is-align-items-center mb-5 profile__top">
                <div className="column is-3 profile__left">
                    {
                        isStory == true ?
                            <NavLink to={`/stories/${profileUser.user.firstName}/${uid}`}>
                                <figure class="image">
                                    <Avatar src={profileUser.user.photoURL} alt="logo" className="is-rounded"
                                        style={{ width: '215px', height: '215px', boxShadow: '0px 0px 1px 4px rgb(228, 25, 25)' }}
                                    />
                                </figure>
                            </NavLink>
                            :
                            <figure class="image">
                                <Avatar src={profileUser.user.photoURL} alt="logo" className="is-rounded" style={{ width: '215px', height: '215px' }} />
                            </figure>
                    }
                </div>
                <div className="column is-9 profile__right">
                    <h3 className="is-size-4 has-text-weight-semibold">{profileUser.user.firstName}</h3>
                    <p className="my-2">{profileUser.user.about}</p>
                    <p className="has-text-weight-semibold">{`${profileUser.user.location.country}, ${profileUser.user.location.city}`} </p>
                    <div className="is-flex my-5">
                        {
                            currentUser?.currentUser.following.some((follow) => follow.uid === uid) ?
                                <button className="button px-5 has-text-weight-semibold is-danger is-outlined" onClick={() => onHandleUnSubscribe(uid)}>Удалить из друзей</button>
                                :
                                <button className="button px-5 has-text-weight-semibold is-success is-outlined" onClick={() => onHandleSubscribe(uid)}>Добавить в друзья</button>
                        }
                        <NavLink to={`/chat/${uid}`}><button className="button px-5 has-text-weight-semibold mx-3 is-link ">Отправить сообщение</button></NavLink>
                        {/* <button className="button p-2" style={{ borderRadius: '50%' }}><KeyboardArrowDownIcon /></button> */}
                    </div>
                    <div className="is-flex is-justify-content-space-between">
                        <p className="is-size-5">{myPosts.length > 1000 ? `${myPosts.length}k` : myPosts.length} <span className="has-text-weight-semibold">Посты</span></p>
                        <p className="is-size-5 pl-3" style={{ borderLeft: '1px solid #ddd' }}>
                            {profileUser.user.followers.length > 1000
                                ?
                                `${profileUser.user.followers.length}k`
                                :
                                profileUser.user.followers.length
                            } <span className="has-text-weight-semibold">Подписчики</span></p>
                        <p className="is-size-5 pl-3" style={{ borderLeft: '1px solid #ddd' }}>
                            {profileUser.user.following.length > 1000
                                ?
                                `${profileUser.user.following.length}k`
                                :
                                profileUser.user.following.length
                            } <span className="has-text-weight-semibold">Подписки</span></p>
                    </div>
                </div>
            </div>
            <div className="profile__bottom">
                <div className="profile__bottom-left">
                    <div className="profile__sidebar">
                        <h2 className="is-size-5 mb-3 has-text-weight-bold">Посты</h2>
                        <div className="is-flex is-flex-wrap-wrap is-clipped">
                            {status === 'loading' && <Loader />}
                            {posts &&
                                posts.filter(({ post }) => {
                                    if (currentUser?.currentUser.isBlocked.length !== 0) {
                                        for (let i = 0; i < currentUser?.currentUser.isBlocked.length; i++) {
                                            if (post.uid !== currentUser?.currentUser.isBlocked[i].uid) {
                                                return post
                                            }
                                        }
                                    } else {
                                        return post

                                    }
                                }).map(({ post }, index) => {
                                    return index < 6 ? < img src={post.img} alt="" /> : null
                                })
                            }
                        </div>
                        <NavLink to='/'>
                            <button type="button" className="button is-rounded mt-4 is-fullwidth has-background-blue" style={{ border: 'none' }}>Узнать больше</button>
                        </NavLink>
                    </div>
                    <div className="profile__sidebar">
                        <h2 className="is-size-5 mb-3 has-text-weight-bold">Друзья</h2>
                        <div className="is-flex is-flex-wrap-wrap is-clipped">
                            {status === 'loading' && <Loader />}
                            {
                                profileUser.user.followers.filter((follow) => {
                                    if (currentUser?.currentUser.isBlocked.length !== 0) {
                                        for (let i = 0; i < currentUser?.currentUser.isBlocked.length; i++) {
                                            if (follow.uid !== currentUser?.currentUser.isBlocked[i].uid) {
                                                return follow
                                            }
                                        }
                                    } else {
                                        return follow

                                    }
                                }).map((follow, index) => {
                                    return index < 6 ? (
                                        <div>
                                            <img src={follow.photoURL} alt="" style={{ objectFit: 'contain' }} />
                                            <p>{follow.firstName}</p>
                                        </div>
                                    ) : (null)
                                })
                            }
                        </div>
                        <NavLink to='/'>
                            <button type="button" className="button is-rounded mt-4 is-fullwidth has-background-blue" style={{ border: 'none' }}>Узнать больше</button>
                        </NavLink>
                    </div>
                </div>

                <div className="profile__bottom-right mt-2">
                    {status === 'loading' && <Loader />}
                    {myPosts &&
                        myPosts.map((post, index) => {
                            return (
                                <Post key={index} {...post} />
                            )
                        })
                    }
                </div>
            </div>

        </div>
    )
}

export default ProfileUser