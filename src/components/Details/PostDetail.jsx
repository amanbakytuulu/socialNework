import React from 'react'
import { firestore } from '../../firebase'
import { useState, memo } from 'react';
import { getAuth } from 'firebase/auth';
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from 'react-image-gallery';
import firebase from './../../firebase';
import { Avatar } from '@mui/material';
import { useSelector } from 'react-redux';

function PostDetail({ doc, postik, comments, active, setActive }) {

    const auth = getAuth();
    const user = auth?.currentUser;
    const [comment, setComment] = useState("");
    const { currentUser, users } = useSelector((state) => state.users);
    const [postUser] = useState(users.filter((user) => user.user.uid === postik.uid));

    const onSendComment = ({ key }) => {

        if (comment == "" || comment.length == 0) {
            return;
        }
        if (key == "Enter") {
            firestore.collection('posts').doc(doc).collection('comments').add({
                text: comment,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                uid: currentUser?.currentUser.uid
            });
            setComment("");
        }

    }

    return (
        <div id="modal" className={`modal postDetail ${active ? 'is-active' : ''}`} style={{ zIndex: 999 }}>
            <div className="modal-background" onClick={() => setActive(false)}></div>
            <div className="modal-content container is-fullhd is-flex is-align-items-center">
                <div className="modal__src">
                    <ImageGallery items={postik.img.map((item) => ({ original: item, thumbnail: item }))}
                        lazyLoad={true} showThumbnails={false} showIndex={true} showPlayButton={false}
                        showFullscreenButton={false} />
                </div>
                <div className="box modal__content pt-0 pb-0">
                    <div className="content" style={{ position: 'relative', height: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10, padding: '15px 0px', backgroundColor: 'var(--container-color)' }}>
                            <div className="modal__image image is-32x32 mr-3">
                                <img src={postUser[0]?.user.photoURL} className="is-rounded" alt="" />
                            </div>
                            <a href=""><strong>{postUser[0]?.user.firstName} </strong> </a>
                            <button type='button' className="button is-success is-outlined is-small">Подписаться</button>
                        </div>
                        <p style={{ marginTop: '2rem' }}>
                            <strong>{postUser[0]?.user.firstName} - </strong>
                            <span> {postik.text || '.'}</span>
                        </p>
                        <div className="modal__time">
                            {new Date(postik.createdAt?.toDate()).toUTCString()}
                        </div>
                        {/* <AddCircleOutlineOutlinedIcon fontSize='large' className="modal__icon mt-5 mb-0" /> */}
                        <div className="modal__comments ">
                            {
                                comments &&
                                comments.filter(({ comment }) => {
                                    if (currentUser?.currentUser.isBlocked.length !== 0) {
                                        for (let i = 0; i < currentUser?.currentUser.isBlocked.length; i++) {
                                            if (comment.uid !== currentUser?.currentUser.isBlocked[i].uid) {
                                                return comment
                                            }
                                        }
                                    } else {
                                        return comment
                                    }
                                }).map(({ comment }, index) => {
                                    return (
                                        <div key={index + Math.random()} className="modal__comment">
                                            <div className="modal__image image is-32x32">
                                                <Avatar src={postUser[0]?.user.photoURL} sx={{ width: 35, height: 35 }} />
                                            </div>
                                            <div className="modal__description">
                                                <p className="mb-2">
                                                    <a href="#" className="mr-0"><strong>{postUser[0]?.user.firstName} - </strong></a>
                                                    {comment.text}
                                                </p>
                                                <p className="is-size-7 mt-0 modal__time">
                                                    {new Date(comment.timestamp?.toDate()).toUTCString()}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="p-3" style={{
                            background: 'var(--container-color)',
                            position: 'absolute', bottom: '0px', width: '100%'
                        }}>
                            <input type="text" placeholder="Написать комментарий..."
                                className="input is-size-6 p-4"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                onKeyDown={onSendComment} />
                        </div>
                    </div>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={() => setActive(false)}></button>
        </div>
    )
}

export default memo(PostDetail)