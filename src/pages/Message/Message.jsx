import React, { useState, useEffect } from 'react';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import SendIcon from '@mui/icons-material/Send';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { getAuth } from 'firebase/auth';
import { Avatar } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { firestore } from '../../firebase';
import firebase from '../../firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { updateChatUsers, updateNotificationMessage, blockUser } from './../../redux/userSlice';
import Loader from './../../components/Loader/Loader';
import { toast } from 'react-toastify';
import AudioReactRecorder, { RecordState } from "audio-react-recorder";

function Message() {

  const { uid } = useParams();
  const auth = getAuth();
  const user = auth?.currentUser;
  const { currentUser, users } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const [getterUser, setGetterUser] = useState(users.find(({ user }) => user.uid === uid));
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  // recording message
  const [recordstate, setrecordstate] = useState("none");
  const [blobURL, setblobURL] = useState("");
  // recording message

  // recoding methods
  const start = () => {
    setrecordstate(RecordState.START);
  };

  const stop = () => {
    setrecordstate(RecordState.STOP);
  };

  const onStop = (audioData) => {
    setblobURL(audioData.url);
  };
  // recoding methods

  const [messages, loading] = useCollectionData(
    firestore.collection('users').doc(currentUser?.doc)
      .collection('messages').doc('chat').collection(uid).orderBy('createdAt')
  )

  const refScroll = React.createRef(null);

  useEffect(() => {
    setGetterUser(users.find(({ user }) => user.uid === uid));
  }, [uid])

  useEffect(() => {
    if (recordstate === "stop") {
      const isSend = window.confirm('Отправить?');
      if (isSend) {
        firestore.collection('users').doc(currentUser?.doc)
          .collection('messages').doc('chat').collection(uid).add({
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            photoURL: user.photoURL,
            firstName: user.displayName,
            uid: user.uid,
            message: blobURL,
          }).then((data) => data.get()
            .then((message) => {
              firestore.collection('users').doc(getterUser.doc)
                .collection('messages').doc('chat').collection(currentUser?.currentUser.uid)
                .add(message.data());
            }));
      }
    }
  }, [blobURL])


  useEffect(() => {
    refScroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages])

  useEffect(() => {
    dispatch(updateNotificationMessage({ currentUser, uid }))
  }, [])


  const onhandleDelete = () => {
    const isDelete = window.confirm('Вы хотите удалить переписку?');
    if (isDelete) {
      firestore.collection('users').doc(currentUser?.doc)
        .collection('messages').doc('chat').collection(uid).get()
        .then((snapshot) => {
          snapshot.docs.map((message) => {
            message.ref.delete();
          })
        }).then(() => {
          toast.success('Успешно очищено!');
        }).catch((error) => toast.error('Ошибка: ' + error.message))
    }
  }

  // blockUser
  const onHandleBlockUser = () => {
    dispatch(blockUser({ currentUser, getterUser }));
  }
  // blockUser

  const onSendMessage = (e) => {
    try {
      e.preventDefault();
      firestore.collection('users').doc(currentUser?.doc)
        .collection('messages').doc('chat').collection(uid).add({
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          photoURL: user.photoURL,
          firstName: user.displayName,
          uid: user.uid,
          message,
        }).then((data) => data.get()
          .then((message) => {
            firestore.collection('users').doc(getterUser.doc)
              .collection('messages').doc('chat').collection(currentUser?.currentUser.uid)
              .add(message.data());
          })).then(() => {
            dispatch(updateChatUsers({ currentUser, getterUser }))
          });

    } catch (error) {
      return alert('Ошибка: ' + error.message);
    }
    setMessage("");
  }

  return (
    <>
      <div style={{ display: 'none' }}>
        <AudioReactRecorder state={recordstate} onStop={onStop} style={{ display: 'none' }} />
      </div>
      <div className="message mt-3" style={{ borderRadius: '10px' }}>
        <div className="container">
          <div className="message__top">
            <div className="message__info">
              <Avatar src={getterUser.user.photoURL} alt="photo" />
              <NavLink to={`/profile/${uid}`} style={{ textDecoration: 'none' }}>
                <p>{getterUser.user.firstName}</p>
              </NavLink>
            </div>
            <div className="message__actions" onClick={() => setShow(!show)}>
              <div className={`options ${show && 'show'}`}>
                <div className="options__item" onClick={onhandleDelete}>
                  <DeleteOutlineIcon className="options__icon" style={{ color: 'red' }} />
                  <p style={{ color: 'red' }}>Удалить чат</p>
                </div>
                <div className="options__item" onClick={onHandleBlockUser}>
                  <AccessTimeIcon className="options__icon" style={{ color: 'orange' }} />
                  <p style={{ color: 'orange' }}>Заблокировать</p>
                </div>
              </div>
            </div>
          </div>

          <div className="message__items">
            {
              loading ? <div className="mx-auto"><Loader /></div> : null
            }
            {
              messages &&
              messages.map((message, index) => {
                return (
                  <>
                    <div className="has-text-centered" style={{ width: '100%' }}>
                      {
                        new Date(message.createdAt?.toDate()).toDateString() === new Date().toDateString() ? 'Сегодня'
                          :
                          new Date(message.createdAt?.toDate()).toDateString()
                      }
                    </div>
                    <div className="message__item" style={message.uid === user?.uid ? { alignSelf: 'flex-end' } : {}}>
                      <NavLink to={`/profile/${message.uid}`} style={{ textDecoration: 'none' }}>
                        <div className="message__user" style={message.uid === user?.uid ? { justifyContent: 'end' } : {}} >
                          <img src={message.photoURL} alt="" style={message.uid === user?.uid ? { order: '2', marginLeft: '10px' } : { marginRight: '10px' }} />
                          <div style={message.uid === user?.uid ? { order: 1 } : {}}>
                            <h5 className={`${message.uid === user?.uid ? 'has-text-right' : 'has-text-left'}`}>{message.firstName}</h5>
                            <div>{new Date(message.createdAt?.toDate()).toLocaleTimeString()}</div>
                          </div>
                        </div>
                      </NavLink>
                      {
                        message.message.startsWith("blob:") ?
                          <audio src={message.message} controls />
                          :
                          <div className="message__sms" style={message.uid === user?.uid ? { background: '#0055FF', color: 'white', marginLeft: 'auto' } : {}}>
                            {message.message}
                          </div>
                      }
                    </div>
                  </>
                )
              })
            }
            <div ref={refScroll}></div>
          </div>
          <form onSubmit={onSendMessage}>
            <div className="field">
              {
                recordstate === 'start' ?
                  <button type="button" className="message__voice mr-1 has-background-danger-dark" onClick={stop}><KeyboardVoiceIcon /></button>
                  :
                  <button type="button" className="message__voice mr-1" onDoubleClick={start}><KeyboardVoiceIcon /></button>
              }
              <input type="file" id="photo" style={{ display: 'none' }} />
              {/* <label htmlFor="photo">
                <IosShareIcon fontSize='small' />
              </label> */}

              <p className="control has-icons-right">
                <input className="input px-4" type="text" placeholder="Сообщение..."
                  value={message} onChange={(e) => setMessage(e.target.value)} />
              </p>
              <button type="submit" className={`message__send ${message == "" && 'has-background-link-dark'} mb-1`} disabled={message == "" && true}><SendIcon className="message__send-icon" /> </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Message