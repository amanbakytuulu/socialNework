import { Avatar } from '@mui/material';
import React, { useEffect, useState, memo } from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import MapsUgcOutlinedIcon from '@mui/icons-material/MapsUgcOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import { firestore } from '../firebase';
import { getAuth } from 'firebase/auth';
import PostDetail from './Details/PostDetail';
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import { useSelector, useDispatch } from 'react-redux';
import { deletePost, updateLike } from './../redux/postSlice';
import { toggleSubscribe } from '../redux/userSlice';
import PostEdit from './PostEdit';
import { NavLink } from 'react-router-dom';

function Post({ post, doc }) {

    const auth = getAuth();
    const user = auth.currentUser;
    const dispatch = useDispatch();

    const { createdAt, img, text, uid, likes } = post;

    const { currentUser, users } = useSelector((state) => state.users);
    const [postUser] = useState(users.filter((user) => user.user.uid === uid));

    // story
    const { stories } = useSelector((state) => state.stories);
    const [isStory] = useState(stories.some(({ story }) => story.uid === uid));
    // story

    const [show, setShow] = useState(false);
    const [active, setActive] = useState(false);
    const [postEditActive, setPostEdit] = useState(false);
    const [comments, setComments] = useState([]);
    const [like, setLikes] = useState(likes);
    const [isLike, setIsLike] = useState(likes.includes(user.uid));

    useEffect(() => {
        let unsubscribe;

        unsubscribe = firestore.collection('posts').doc(doc)
            .collection('comments').orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => {
                if (!snapshot.empty) {
                    setComments(snapshot.docs.map((doc) => ({
                        doc: doc.id,
                        comment: doc.data()
                    })))
                }
            })

        return () => unsubscribe();
    }, [])


    useEffect(() => {
        dispatch(updateLike({ doc, like }));
    }, [isLike])

    const onHandleClickLike = () => {
        setIsLike(!isLike);
        setLikes((prev) => !isLike ? prev.concat(user.uid) : prev.filter((num) => num != user.uid));
    }
    const onHandleSubscribe = (postId) => {
        dispatch(toggleSubscribe({ userId: currentUser?.currentUser.uid, postId, method: 'subscribe' }));
    }
    const onHandleUnSubscribe = (postId) => {
        dispatch(toggleSubscribe({ userId: currentUser?.currentUser.uid, postId, method: 'unsubscribe' }));
    }

    document.addEventListener('keydown', ({ key }) => {
        if (key == 'Escape') {
            setActive(false);
        }
    })

    const onDelete = (docId) => {
        const isTrue = window.confirm('Вы хотите удалить?');
        if (isTrue) {
            dispatch(deletePost(docId));
        }
    }

    return (
        <div className="post">
            <div className="post__top">
                <div className="post__top-left">
                    {
                        isStory == true ?
                            <NavLink to={`stories/${postUser[0]?.user.firstName}/${uid}`}>
                                <Avatar src={postUser[0]?.user.photoURL} className="post__avatar"
                                    style={{ boxShadow: '0px 0px 1px 3px rgb(228, 25, 25)' }} />
                            </NavLink>
                            :
                            <Avatar src={postUser[0]?.user.photoURL} className="post__avatar" />
                    }

                    <div className="post__info">
                        {
                            user.uid === uid ?
                                <NavLink to="/profile" className="has-text-weight-semibold">{postUser[0]?.user.firstName}</NavLink>

                                : <NavLink to={`/profile/${uid}`} className="has-text-weight-semibold">{postUser[0]?.user.firstName}</NavLink>

                        }
                        <p>{new Date(createdAt?.toDate()).toUTCString()}</p>
                    </div>
                </div>
                {
                    currentUser?.currentUser.uid === uid ?
                        <div className="post__top-right" onClick={() => setShow(!show)}>
                            <div className={`options ${show && 'show'}`}>
                                <div className="options__item options__edit" onClick={() => setPostEdit(true)}>
                                    <EditIcon className="options__icon" />
                                    <p>Редактировать</p>
                                </div>
                                <div className="options__item options__delete" onClick={() => onDelete(doc)}>
                                    <DeleteOutlineIcon className="options__icon" />
                                    <p>Удалить</p>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="post__top-right" onClick={() => setShow(!show)}>
                            <div className={`options ${show && 'show'}`}>
                                {
                                    currentUser?.currentUser.following.some((follow) => follow.uid === uid) ?
                                        <div className="options__item options__unsubscribe" onClick={() => onHandleUnSubscribe(uid)}>
                                            <GroupRemoveIcon className="options__icon" />
                                            <p>Отписаться</p>
                                        </div>
                                        :
                                        <div className="options__item options__subscribe" onClick={() => onHandleSubscribe(uid)}>
                                            <GroupAddIcon className="options__icon" />
                                            <p>Подписаться</p>
                                        </div>
                                }
                                <div className="options__item options__share" >
                                    <ShareOutlinedIcon className="options__icon" />
                                    <p>Поделиться</p>
                                </div>
                            </div>
                        </div>
                }
            </div>
            <div className="post__img">
                {
                    typeof img == 'object' && img.length > 1 ?
                        <ImageGallery items={img.map((item) => ({ original: item, thumbnail: item }))} showNav={false} showIndex={true} stopPropagation={true} />
                        :
                        <ImageGallery items={img.map((item) => ({ original: item, thumbnail: item }))} showNav={false} showThumbnails={false} showPlayButton={false} />

                    //     img && img.includes('.mp4', 'mp3') ?
                    // <video controls className="post__video">
                    //     <source src={img} />
                    // </video> :
                    // <img src={strImg} alt="img__post" className={`${scale ? 'scale' : ''}`}
                    //     onClick={() => setScale(!scale)} />
                }
            </div>
            {text.length !== 0 &&
                <div className="post__text">
                    <p>{text}</p>
                </div>
            }
            <div className="post__bottom mt-2">
                <div className="post__left">
                    <div className="post__option">
                        <div onClick={onHandleClickLike}>
                            <ThumbUpIcon className="post__icon" fontSize="small" style={isLike ? { color: '#df3434' } : {}} /> <strong style={isLike ? { color: 'var(--title-color' }
                                : {}}>Лайк <span>({like.length})</span></strong>
                        </div>
                        <div onClick={() => setActive(true)}>
                            <MapsUgcOutlinedIcon className="post__icon" fontSize="medium" /> <strong>Коммент <span>({comments.length})</span></strong>
                        </div>
                    </div>
                    <div className="post__option">
                        <div>
                            {/* <ShareOutlinedIcon className="post__icon" fontSize="medium" /> <strong style={{ margin: '0px 0px 0px 10px' }}>Share <span>(3)</span></strong> */}
                        </div>
                    </div>
                </div>  
            </div>

            <PostDetail doc={doc} postik={post} comments={comments} active={active} setActive={setActive} />
            <PostEdit doc={doc} postik={post} setPostEdit={setPostEdit} postEditActive={postEditActive} />

        </div>
    )
}

export default memo(Post)
