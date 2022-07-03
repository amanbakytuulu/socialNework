import React, { useState } from 'react';
import { Avatar } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Story({ photoURL, firstName, uid }) {

    const { stories } = useSelector((state) => state.stories);
    const [isStory] = useState(stories.some(({ story }) => story.uid === uid));

    return (
        <NavLink to={`stories/${firstName}/${uid}`} className="story" style={{ backgroundImage: `url(${photoURL})` }}>
            <Avatar src={photoURL} className="story__avatar"
                style={isStory == true ? { boxShadow: '0px 0px 1px 3px rgb(228, 25, 25)' }
                    : {}} />
            <h4>{firstName}</h4>
        </NavLink>

    )
}

export default Story
