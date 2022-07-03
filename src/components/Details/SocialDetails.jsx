import React, { useEffect, useState } from 'react'
import SettingLayout from '../SettingLayout'
import { getAuth } from 'firebase/auth';
import { useLoading } from './../../hooks/useLoading';
import { useNavigate } from 'react-router-dom';
import { firestore } from '../../firebase';
import { toast } from 'react-toastify';
import { socialResolver } from './../../validates/socialResolver';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { updateSocial } from '../../redux/userSlice';

function SocialDetails() {

    const auth = getAuth();
    const user = auth.currentUser;
    const dispatch = useDispatch();
    const { currentUser, status } = useSelector((state) => state.users);

    const [facebook, setFacebook] = useState("");
    const [twitter, setTwitter] = useState("");
    const [linkedIn, setLinkedIn] = useState("");
    const [instagram, setInstagram] = useState("");
    const [vk, setVk] = useState("");
    const [skype, setSkype] = useState("");
    const [google, setGoogle] = useState("");
    const [github, setGitHub] = useState("");


    useEffect(() => {
        setFacebook(currentUser?.currentUser.socials.facebook);
        setTwitter(currentUser?.currentUser.socials.twitter);
        setLinkedIn(currentUser?.currentUser.socials.linkedIn);
        setInstagram(currentUser?.currentUser.socials.instagram);
        setVk(currentUser?.currentUser.socials.vk);
        setSkype(currentUser?.currentUser.socials.skype);
        setGoogle(currentUser?.currentUser.socials.google);
        setGitHub(currentUser?.currentUser.socials.github);
    }, [currentUser])

    const { formOptions } = socialResolver();
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    const onSend = (data) => {
        dispatch(updateSocial({ facebook, twitter, linkedIn, instagram, vk, github, skype, google, doc: currentUser?.doc }));
    }


    return (
        <SettingLayout title="Социальные сети">
            <form onSubmit={handleSubmit(onSend)}>
                <div className="columns">
                    <div className="column">
                        <div class="field">
                            <label class="label">Facebook</label>
                            <div class="control">
                                <input class={`input ${errors.facebook ? 'is-danger' : ''}`} type="text" placeholder="Facebook..."
                                    {...register('facebook')}
                                    value={facebook} onChange={(e) => setFacebook(e.target.value)} />
                            </div>
                            <p className="help has-text-danger-dark">{errors.facebook?.message}</p>
                        </div>
                    </div>
                    <div className="column">
                        <div class="field">
                            <label class="label">Twitter</label>
                            <div class="control">
                                <input className={`input ${errors.twitter ? 'is-danger' : ''}`} type="text" placeholder="Twitter..."
                                    {...register('twitter')}
                                    value={twitter} onChange={(e) => setTwitter(e.target.value)} />
                            </div>
                            <p className="help has-text-danger-dark">{errors.twitter?.message}</p>
                        </div>
                    </div>
                </div>
                <div className="columns">
                    <div className="column">
                        <div class="field">
                            <label class="label">Linkedin</label>
                            <div class="control">
                                <input className={`input ${errors.linkedIn ? 'is-danger' : ''}`} type="text" placeholder="Linkedin..."
                                    {...register('linkedIn')}
                                    value={linkedIn} onChange={(e) => setLinkedIn(e.target.value)} />
                            </div>
                            <p className="help has-text-danger-dark">{errors.linkedIn?.message}</p>
                        </div>
                    </div>
                    <div className="column">
                        <div class="field">
                            <label class="label">Instagram</label>
                            <div class="control">
                                <input className={`input ${errors.instagram ? 'is-danger' : ''}`} type="text" placeholder="Instagram..."
                                    {...register('instagram')}
                                    value={instagram} onChange={(e) => setInstagram(e.target.value)} />
                            </div>
                            <p className="help has-text-danger-dark">{errors.instagram?.message}</p>
                        </div>
                    </div>
                </div>
                <div className="columns">
                    <div className="column">
                        <div class="field">
                            <label class="label">Vk</label>
                            <div class="control">
                                <input className={`input ${errors.vk ? 'is-danger' : ''}`} type="text" placeholder="Vk..."
                                    {...register('vk')}
                                    value={vk} onChange={(e) => setVk(e.target.value)} />
                            </div>
                            <p className="help has-text-danger-dark">{errors.vk?.message}</p>
                        </div>
                    </div>
                    <div className="column">
                        <div class="field">
                            <label class="label">Github</label>
                            <div class="control">
                                <input className={`input ${errors.github ? 'is-danger' : ''}`} type="text" placeholder="Github..."
                                    {...register('github')}
                                    value={github} onChange={(e) => setGitHub(e.target.value)} />
                            </div>
                            <p className="help has-text-danger-dark">{errors.github?.message}</p>
                        </div>
                    </div>
                </div>
                <div className="columns">
                    <div className="column">
                        <div class="field">
                            <label class="label">Skype</label>
                            <div class="control">
                                <input className={`input ${errors.skype ? 'is-danger' : ''}`} type="text" placeholder="Skype..."
                                    {...register('skype')}
                                    value={skype} onChange={(e) => setSkype(e.target.value)} />
                            </div>
                            <p className="help has-text-danger-dark">{errors.skype?.message}</p>
                        </div>
                    </div>
                    <div className="column">
                        <div class="field">
                            <label class="label">Google</label>
                            <div class="control">
                                <input className={`input ${errors.google ? 'is-danger' : ''}`} type="text" placeholder="Google..."
                                    {...register('google')}
                                    value={google} onChange={(e) => setGoogle(e.target.value)} />
                            </div>
                            <p className="help has-text-danger-dark">{errors.google?.message}</p>
                        </div>
                    </div>
                </div>

                {status === 'loading' ?
                    <button type="submit" className="button is-link py-5 px-6 is-loading"
                        disabled>Подождите
                    </button>
                    :
                    <button type="submit" className="button is-link py-5 px-6 has-text-weight-semibold"
                    >Сохранить
                    </button>
                }
            </form>
        </SettingLayout>
    )
}

export default SocialDetails