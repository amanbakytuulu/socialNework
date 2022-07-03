import React, { useEffect, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { getAuth } from 'firebase/auth';
import { firestore } from '../../firebase';
import AddPost from '../../components/AddPost';
import { useLoading } from './../../hooks/useLoading';
import Post from '../../components/Post';
import { NavLink } from 'react-router-dom';
import Loader from './../../components/Loader/Loader';
import { Avatar } from '@mui/material';
import { useSelector } from 'react-redux';
import ShowFollowers from '../../components/ShowFollowers';
import ShowFollowings from '../../components/ShowFollowings';

function Profile() {

    const auth = getAuth();
    const user = auth.currentUser;
    const { currentUser, users } = useSelector((state) => state.users);
    const { posts, status } = useSelector((state) => state.posts);
    const [myPosts] = useState(posts?.filter((post) => post.post.uid == user?.uid));

    // showModal
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    // showModal

    // story
    const { stories } = useSelector((state) => state.stories);
    const [isStory] = useState(stories.some(({ story }) => story.uid === user?.uid));
    // story

    return (
        <div className="container is-max-desktop mx-auto mt-6 profile">
            <div className="columns is-align-items-center mb-5 profile__top">
                <div className="column is-3 profile__left">
                    {
                        isStory == true ?
                            <NavLink to={`/stories/${user?.displayName}/${user?.uid}`}>
                                <figure class="image">
                                    <Avatar src={user.photoURL} alt="logo" className="is-rounded"
                                        style={{ width: '215px', height: '215px', boxShadow: '0px 0px 1px 4px rgb(228, 25, 25)' }}
                                    />
                                </figure>
                            </NavLink>
                            :
                            <figure class="image">
                                <Avatar src={user.photoURL} alt="logo" className="is-rounded" style={{ width: '215px', height: '215px' }} />
                            </figure>
                    }

                </div>
                <div className="column is-9 profile__right">
                    <h3 className="is-size-4 has-text-weight-semibold">{user.displayName}</h3>
                    <p className="my-2">{currentUser?.currentUser.about}</p>
                    <p className="has-text-weight-semibold">{`${currentUser?.currentUser.location.country}, ${currentUser?.currentUser.location.city}`} </p>
                    <div className="is-flex my-5">
                        <NavLink to="/settings/info-account">
                            <button className="button px-5 has-text-weight-semibold is-success is-outlined">Редактировать профиль</button>
                        </NavLink>
                        {/* <button className="button p-2 ml-4" style={{ borderRadius: '50%' }}><KeyboardArrowDownIcon /></button> */}
                    </div>
                    <div className="is-flex is-justify-content-space-between">
                        <p className="is-size-5">{myPosts.length > 1000 ? `${myPosts.length}k` : myPosts.length} <span className="has-text-weight-semibold">Посты</span></p>
                        <p className="is-size-5 pl-3" style={{ borderLeft: '1px solid #ddd' }}>
                            {currentUser?.currentUser.followers.length > 1000
                                ?
                                `${currentUser?.currentUser.followers.length}k`
                                :
                                currentUser?.currentUser.followers.length
                            } <span className="has-text-weight-semibold"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setShow1(true)}>
                                Подписчики
                            </span>
                        </p>
                        <p className="is-size-5 pl-3" style={{ borderLeft: '1px solid #ddd' }}>
                            {currentUser?.currentUser.following.length > 1000
                                ?
                                `${currentUser?.currentUser.following.length}k`
                                :
                                currentUser?.currentUser.following.length
                            } <span className="has-text-weight-semibold"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setShow2(true)}>
                                Подписки
                            </span>
                        </p>
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
                                currentUser?.currentUser.followers.filter((follow) => {
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
                                        <NavLink to={`/profile/${follow.uid}`}>
                                            <img src={follow.photoURL} alt="" style={{ objectFit: 'contain' }} />
                                            <p>{follow.firstName}</p>
                                        </NavLink>
                                    ) : (null)
                                })
                            }
                        </div>
                        <NavLink to='/'>
                            <button type="button" className="button is-rounded mt-4 is-fullwidth has-background-blue" style={{ border: 'none' }}>Узнать больше</button>
                        </NavLink>
                    </div>
                </div>

                <div className="profile__bottom-right">
                    <AddPost />
                    {status === 'loading' && <Loader />}
                    {myPosts &&
                        myPosts.map((post, index) => {
                            return (
                                <Post key={index} {...post} index={index} />
                            )
                        })
                    }
                </div>
            </div>
            <ShowFollowers show={show1} setShow={setShow1} />
            <ShowFollowings show={show2} setShow={setShow2} />
        </div>
    )
}

export default Profile