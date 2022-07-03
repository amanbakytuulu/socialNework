import React, { useState, memo } from 'react'
import ImageGallery from 'react-image-gallery';
import { firestore, storage } from '../firebase';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useLoading } from './../hooks/useLoading';
import { addStory } from '../redux/storySlice';

function ModalStoryAdd({ setShow, show }) {

    const { currentUser, users } = useSelector((state) => state.users);
    const dispatch = useDispatch();
    const [file, setFile] = useState([]);
    const [preview, setPreview] = useState([]);
    const { loading, setLoading } = useLoading();

    const onHandleAddStory = (files) => {
        setPreview([]);
        for (let j = 0, f; f = files[j]; j++) {
            const FReader = new FileReader();

            FReader.onload = (function (theFile) {
                return function (e) {
                    setPreview((prev) => [...prev, e.target.result.split(' ')]);
                };
            })(f);
            FReader.readAsDataURL(f);

        }
        setFile(files);

    }

    const onHandleCancel = () => {
        if (file.length !== 0) {
            const isCancel = window.confirm('Отменить изменения?');
            if (isCancel) {
                setPreview([]);
                setFile([]);
                setShow(false);
            }
        } else {
            setShow(false);
        }

    }

    const onSend = async () => {

        if (!file) return;
        setLoading(true);
        const promises = [];
        const storageRef = storage.ref();
        for (let i = 0; i < file.length; i++) {
            const uploadTask = storageRef.child(`stories/${file[i].name}`).put(file[i]);
            promises.push(
                uploadTask.then(snapshot => {
                    return snapshot.ref.getDownloadURL();
                })
            )

        }

        const URLs = await Promise.all(promises);
        dispatch(addStory({ currentUser, URLs }));

        setLoading(false);
        toast.success('Успешно добавлено!');
        setFile([]);
        setPreview([]);
        setShow(false);
    }

    return (
        <div className={`modal ${show ? 'is-active' : ''}`} style={{ zIndex: 100 }}>
            <style>{`
                .image-gallery-content .image-gallery-slide .image-gallery-image {
                    max-height: calc(100vh - 450px);
                }
            `}</style>
            <div className="modal-background"></div>
            <div className="modal-content">
                <ImageGallery items={preview.map((item) => ({ original: item, thumbnail: item }))} showNav={false} showIndex={true} stopPropagation={true} showThumbnails={false} />
            </div>
            <div className="modal-card">
                <section className="modal-card-body" style={{ backgroundColor: 'var(--container-color)' }}>
                    <input type="file" id="pickAStory" accept='image/*, video/*'
                        style={{ display: 'none' }}
                        onChange={(e) => onHandleAddStory(e.target.files)} multiple />
                    <label htmlFor="pickAStory"><p className="button is-link">Открыть галерею</p></label>
                </section>
                <footer className="modal-card-foot" style={{ backgroundColor: 'var(--container-color)' }}>
                    <button className={`button is-success ${loading && 'is-loading'}`}
                        disabled={file.length === 0 ? true : false}
                        onClick={onSend}>
                        Сохранить
                    </button>
                    <button className="button" onClick={onHandleCancel}>Отмена</button>
                </footer>
            </div>
        </div>
    )
}

export default memo(ModalStoryAdd);