import React, { useState } from 'react';
import Story from './Story';
import StoryAdd from './StoryAdd';
import ModalStoryAdd from './ModalStoryAdd';
import { useSelector } from 'react-redux';

function StoryWheel() {

    const { currentUser } = useSelector((state) => state.users);
    const [show, setShow] = useState(false);

    return (
        <div className="storyWheel" >
            <StoryAdd title="Add Story" setShow={setShow} />
            {
                currentUser?.currentUser.following.filter((follow) => {
                    if (currentUser?.currentUser.isBlocked.length !== 0) {
                        for (let i = 0; i < currentUser?.currentUser.isBlocked.length; i++) {
                            if (follow.uid !== currentUser?.currentUser.isBlocked[i].uid) {
                                return follow
                            }
                        }
                    } else {
                        return follow
                    }

                }).map((follow) => {
                    return (
                        <Story firstName={follow.firstName} photoURL={follow.photoURL} uid={follow.uid} />
                    )
                })
            }

            <ModalStoryAdd show={show} setShow={setShow} />
        </div>
    )
}

export default StoryWheel
