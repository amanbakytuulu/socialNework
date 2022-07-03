import React, { useState } from 'react';

function SidebarRow({ Icon, title, color, bg_gradient, active }) {

    return (
        <div className={`sidebarRow ${active && 'is-active'}`}>
            <Icon style={{ color, borderRadius: '50px' }} className={`sidebarRow__icon ${bg_gradient}`} />
            <p className="sidebarRow__title">{title}</p>
        </div>
    )
}

export default SidebarRow
