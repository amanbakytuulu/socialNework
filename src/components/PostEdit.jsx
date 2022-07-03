import React, { useState, memo } from 'react'
import ReactImageGallery from 'react-image-gallery';
import { Avatar } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import Picker from 'emoji-picker-react';
import { editPost } from '../redux/postSlice';


function PostEdit({ doc, postik, setPostEdit, postEditActive }) {
    const dispatch = useDispatch();
    const { users } = useSelector((state) => state.users);
    const { status } = useSelector((state) => state.posts);
    const [postUser] = useState(users.filter((user) => user.user.uid === postik.uid));

    const [showSmile, setShowSmile] = useState(false);
    const [text, setText] = useState(postik.text);

    const handleChangeActive = () => {
        if (text !== postik.text) {
            const isInvisible = window.confirm('Отменить изменение?');
            if (isInvisible) {
                setPostEdit(false);
                setShowSmile(false);
            }
        } else {
            setPostEdit(false);
            setShowSmile(false);
        }
    }

    const onEmojiClick = (event, emojiObject) => {
        setText((prev) => (prev.concat(emojiObject.emoji)));
    };

    const onSend = (e) => {
        e.preventDefault();
        if (text === postik.text) {
            setPostEdit(false);
            setShowSmile(false);
        } else {
            dispatch(editPost({ text, doc }));
        }


    }

    return (
        <div id="modal" className={`modal ${postEditActive ? 'is-active' : ''}`} style={{ zIndex: 999 }}>
            <div className="modal-background" onClick={handleChangeActive}></div>
            <div className="container is-fullhd is-flex is-flex-direction-column is-justify-content-center" style={{ maxWidth: '800px', width: '100%' }}>
                <div className="">
                    <ReactImageGallery items={postik.img.map((item) => ({ original: item, thumbnail: item }))}
                        lazyLoad={true} showThumbnails={false} showIndex={true} showPlayButton={false}
                        showFullscreenButton={false} />
                </div>
                <div className="box  pt-0 pb-5">
                    <div className="content" style={{ position: 'relative', height: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10, padding: '15px 0px', backgroundColor: 'var(--container-color)' }}>
                            <div className="modal__image image is-32x32 mr-3">
                                <Avatar src={postUser[0]?.user.photoURL} className="is-rounded" alt="" sx={{ width: 35, height: 35 }} />
                            </div>
                            <a href=""><strong style={{ color: 'var(--first-color)' }}>{postUser[0]?.user.firstName} </strong> </a>
                        </div>
                        <div style={{ color: 'var(--second-color)', fontSize: "0.85rem", marginTop: '-5px', marginBottom: '1rem' }}>
                            {new Date(postik.createdAt?.toDate()).toUTCString()}
                        </div>
                        <form className="mt-2 is-flex is-flex-direction-column" onSubmit={onSend}>
                            <input type="text" className="input has-background-link" style={{ color: 'var(--text-color)' }} value={text} onChange={(e) => setText(e.target.value)} />
                            <div className="is-flex is-justify-content-space-between is-align-items-center mt-4" style={{ position: 'relative' }}>
                                <p className="is-flex mb-0" style={{ color: 'var(--first-color)', cursor: 'pointer' }} onClick={() => setShowSmile(!showSmile)}><SentimentVerySatisfiedIcon style={{ color: 'orange', marginRight: '5px' }} />Смайлики</p>
                                <div style={{ position: 'absolute', top: '-300px', left: '-300px', zIndex: 50 }}>
                                    {showSmile ?
                                        <Picker
                                            onEmojiClick={onEmojiClick}
                                            disableAutoFocus={true}
                                            pickerStyle={{ boxShadow: 'none' }}
                                            groupNames={{ smileys_people: 'PEOPLE' }}
                                        /> : null
                                    }
                                </div>
                                {
                                    status === 'loading' ?
                                        <button type="submit" className="button is-link is-loading" disabled>Обработка...</button>
                                        :
                                        <button type="submit" className="button is-link">Сохранить изменение</button>
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <button className="modal-close is-large" aria-label="close" onClick={handleChangeActive}></button>
        </div>
    )
}

export default memo(PostEdit)