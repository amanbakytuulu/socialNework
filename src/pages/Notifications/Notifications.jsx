import React, { useEffect } from 'react'
import { Avatar } from '@mui/material';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { deleteNotifications, updateNotification } from './../../redux/userSlice';

function Notifications() {

    const { currentUser } = useSelector((state) => state.users);
    const dispatch = useDispatch();

    const onHandleRemoveNotification = () => {
        if (currentUser?.currentUser.notifications.length !== 0) {
            const isDelete = window.confirm('Удалить оповещения?');
            if (isDelete) {
                dispatch(deleteNotifications(currentUser));
            }
        }
    }

    useEffect(() => {
        if (currentUser?.currentUser.newNotification === true) {
            dispatch(updateNotification(currentUser));
        }
    }, [])

    return (
        <div className="notifications container is-max-desktop">
            <div className="notitications__top is-size-4 has-text-weight-bold p-5 my-3">
                <div>
                    Оповещения
                    <span className="tag is-success ml-2">{currentUser?.currentUser.notifications.length}</span>
                </div>
                <div>
                    <span className="tag">
                        <DeleteOutlineOutlinedIcon className="notifications__icon"
                            onClick={onHandleRemoveNotification} />
                    </span>
                </div>
            </div>
            <div className="notifications__items px-5">
                {
                    currentUser?.currentUser.notifications.length === 0
                    && <div className="" style={{ color: "var(--title-color)" }}>Нету свежих оповещений</div>
                }
                {
                    currentUser?.currentUser.notifications.map((notification, index) => {
                        return (
                            <div key={notification.uid + index} className="notifications__item">
                                <div className="notifications__left">
                                    <Avatar className="mr-3"
                                        src={notification.photoURL}
                                        sx={{ width: 45, height: 45 }} />
                                    <div>
                                        <div>
                                            <NavLink to={`/profile/${notification.uid}`}>
                                                <h2>{notification.firstName}</h2>
                                            </NavLink>
                                            <p> {notification.message}</p>
                                        </div>
                                        <p>{notification.createdAt}</p>
                                    </div>
                                </div>
                                <div className="notifications__right">
                                    <RemoveRedEyeOutlinedIcon className="notifications__icon" />
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div >
    )
}

export default Notifications