import { Avatar } from '@mui/material';
import React from 'react';

function SidebarChatRow({ profile, name, newMessage }) {
    return (
        <div className="sidebarChatRow">
            <div className="sidebarChatRow__user">
                <Avatar src={profile ? profile : ''} className="sidebarChatRow__avatar" />
                <div className="sidebarChatRow__info">
                    <h6>{name}</h6>
                </div>
            </div>
            {newMessage ?
                <div className="sidebarChatRow__status">
                </div>
                : null}
        </div>
    )
}


export default SidebarChatRow
