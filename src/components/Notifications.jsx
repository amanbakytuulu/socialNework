import React from 'react'
import { useSelector } from 'react-redux';
import { Avatar } from '@mui/material';
import { NavLink } from 'react-router-dom';

function Notifications({ show, setShowNotification }) {
    
    const { currentUser } = useSelector((state) => state.users);

    return (
        <div className={`notification ${show ? 'show' : ''}`} style={{ color: 'black' }}>
            <h4 className="has-text-centered">Оповещения</h4>
            <ul>
                {
                    currentUser?.currentUser.notifications.length == 0 ?
                        <div className="has-text-centered" style={{ color: 'var(--title-color)' }}>Пусто</div>
                        :
                        currentUser?.currentUser.notifications.map((notification) => {
                            return (
                                <li>
                                    <div className="image">
                                        <Avatar src={notification.photoURL} alt="Placeholder image" className="mr-3 is-rounded" />
                                    </div>
                                    <div>
                                        <div>
                                            <NavLink to={`/profile/${notification.uid}`} onClick={() => setShowNotification(false)}>
                                                <a href="#"><strong>{notification.firstName} </strong> </a>
                                            </NavLink>{notification.message}
                                        </div>
                                        <span className="is-size-7 has-text-weight-light">{notification.createdAt}</span>
                                    </div>
                                </li>
                            )
                        })
                }
            </ul>
            <NavLink to={`/notifications`} onClick={() => setShowNotification(false)}>
                <div className="has-text-centered p-2 notification__all">
                    Посмотреть всё
                </div>
            </NavLink>
        </div>
    )
}

export default Notifications