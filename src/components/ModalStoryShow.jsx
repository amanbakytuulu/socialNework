import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import Stories from 'react-insta-stories';
import { useParams, useNavigate } from 'react-router-dom';

function ModalStoryShow() {

    const { uid } = useParams();
    const { stories } = useSelector((state) => state.stories);
    const navigate = useNavigate();

    const history = stories.filter((story) => story.story.uid === uid).map(({ story }) => ({
        url: story.story,
        header: {
            heading: story.firstName,
            subheading: new Date(story.createdAt?.toDate()).toUTCString(),
            profileImage: story.photoURL
        }
    }))

    useEffect(() => {
        history.length === 0 && navigate(`/profile/${uid}`)
    }, [])

    return (
        <div className={`modal is-active `} style={{ zIndex: 500 }}>
            <div className="modal-background" onClick={() => navigate(-1)}></div>
            <div className="modal-card">
                <section className="modal-card-body p-0 mx-auto" style={{ backgroundColor: 'var(--container-color)' }}>
                    {
                        history.length !== 0
                        &&
                        (
                            < Stories
                                stories={history}
                                loop={true}
                                onAllStoriesEnd={() => navigate(-1)}
                                defaultInterval={1500}
                                width={600}
                                height={800}
                            />
                        )
                    }
                </section>
            </div>
            <button className="modal-close is-large" aria-label="close"
                onClick={() => navigate(-1)}></button>

        </div>
    )
}

export default ModalStoryShow