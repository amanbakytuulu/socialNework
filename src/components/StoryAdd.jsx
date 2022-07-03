import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';

function StoryAdd({ setShow, title }) {

    return (
        <div className="storyAdd">
            <div className="storyAdd__icon" onClick={() => setShow(true)} >
                <AddIcon fontSize="medium" />
            </div>
            <h4>{title}</h4>
        </div>
    )
}

export default StoryAdd
