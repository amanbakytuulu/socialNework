import React, { useState } from 'react';
import { getAuth, signInWithPopup, signInWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
} from "firebase/firestore";
import { Navigate, NavLink, useLocation } from 'react-router-dom';
import Google from "../assets/images/google.png";
import Facebook from "../assets/images/facebook.png";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useError } from './../hooks/useError';
import { firestore } from '../firebase';
import { addNewUser } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import { signInResolver } from './../validates/signInResolver';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

function SignIn() {

    const auth = getAuth();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const { formOptions } = signInResolver();
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    const onSubmit = async ({ email, password }) => {
        setLoading(true);

        await signInWithEmailAndPassword(auth, email, password).then((user) => {
            setLoading(false);

        }).catch((error) => {
            const errorCode = error.code;
            setLoading(false);;
            switch (errorCode) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    toast.error('Неверный логин или пароль!');
                    break;
                default:
                    toast.error('Неверный логин или пароль!');
            }

        })
    }

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const res = await signInWithPopup(auth, provider);
            const user = res.user;
            const q = query(collection(firestore, "users"), where("uid", "==", user.uid));
            const docs = await getDocs(q);
            if (docs.docs.length === 0) {
                dispatch(addNewUser(user));
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    const onAuthFacebook = async () => {
        try {
            const provider = new FacebookAuthProvider();
            const res = await signInWithPopup(auth, provider);
            const user = res.user;
            const q = query(collection(firestore, "users"), where("uid", "==", user.uid));
            const docs = await getDocs(q);
            if (docs.docs.length === 0) {
                dispatch(addNewUser(user));
            }
        } catch (err) {
            console.error(err.message);
        }
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="signIn">
            <h1>Авторизация</h1>
            <div className="signIn__input">
                <MailOutlineIcon
                    className={`signIn__icon ${errors.email && 'has-text-danger-dark'}`} />
                <input type="text" id="email"
                    placeholder="Your email address"
                    className={`${errors.email && 'is-danger'}`}
                    {...register('email')} />
            </div>
            <p className="help has-text-danger-dark mt-0 has-text-left is-size-6">{errors.email?.message}</p>
            <div className="signIn__input">
                <LockOpenIcon
                    className={`signIn__icon ${errors.password && 'has-text-danger-dark'}`} />
                <input type="password" id="password"
                    placeholder="Password"
                    className={`${errors.password && 'is-danger'}`}
                    {...register('password')} />
            </div>
            <p className="help has-text-danger-dark mt-0 has-text-left is-size-6">{errors.password?.message}</p>
            <div className="signIn__save" style={{ marginBottom: '5px' }}>
                <label>
                    <input type="checkbox" />Запомнить
                    <span className="checkmark"></span>
                </label>
                <NavLink to="/login/resetPassword">
                    <p>Забыли пароль?</p>
                </NavLink>
            </div>
            {
                loading ?
                    <button type="submit" style={{ marginTop: '10px', background: 'black' }} disabled>Подождите...</button>
                    :
                    <button type="submit" style={{ marginTop: '10px' }}>Войти</button>
            }
            <p>Не зарегистрированы? <NavLink to="/login/signUp">Создать аккаунт</NavLink><br />
                или авторизуйтесь через другие соц.сети</p>
            <div style={{ marginTop: '15px' }}></div>
            <button type="button" className="btn__google" onClick={signInWithGoogle}><img src={Google} alt="google" /> Войдите в систему с помощью Google</button>
            <button type="button" className="btn__facebook" onClick={onAuthFacebook}><img src={Facebook} alt="facebook" /> Войдите в систему с помощью Facebook</button>
        </form>

    )
}

export default SignIn
