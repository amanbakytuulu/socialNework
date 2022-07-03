import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
} from "firebase/firestore";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import firebase, { firestore } from './../firebase';
import { addNewUser } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import { signUpResolver } from './../validates/signUpResolver';
import { useForm } from 'react-hook-form';

function SignUp() {

    const auth = getAuth();

    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const { formOptions } = signUpResolver();
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    const onSend = async ({ email, userName, password }) => {
        setLoading(true);
        await createUserWithEmailAndPassword(auth, email, password)
            .then((res) => {
                const user = firebase.auth().currentUser;
                setLoading(false);
                return user.updateProfile({
                    displayName: userName
                })

            }).then(() => {
                const user = firebase.auth().currentUser;
                dispatch(addNewUser(user));
            })
    }

    return (
        <form className="signUp" onSubmit={handleSubmit(onSend)}>
            <h1>Регистрация</h1>
            <div className="signUp__input">
                <MailOutlineIcon className={`signUp__icon ${errors.email && 'has-text-danger-dark'}`}  />
                <input type="text" placeholder="Электронный адрес"
                className={`${errors.email && 'is-danger'}`}
                    {...register("email")} />
            </div>
            <p className="help has-text-danger-dark mt-0 is-size-6 has-text-left">{errors.email?.message}</p>
            <div className="signUp__input">
                <PersonOutlineIcon className={`signUp__icon ${errors.userName && 'has-text-danger-dark'}`} />
                <input type="text" placeholder="Имя пользователя"
                className={`${errors.userName && 'is-danger'}`}
                    {...register("userName")} />
            </div>
            <p className="help has-text-danger-dark mt-0 is-size-6 has-text-left">{errors.userName?.message}</p>
            <div className="signUp__input">
                <LockOpenIcon className={`signUp__icon ${errors.password && 'has-text-danger-dark'}`} />
                <input type="password" placeholder="Пароль"
                className={`${errors.password && 'is-danger'}`}
                    {...register("password")} /><br />
            </div>
            <p className="help has-text-danger-dark mt-0 is-size-6 has-text-left">{errors.password?.message}</p>
            <div className="signUp__input">
                <LockOpenIcon className={`signUp__icon ${errors.rePassword && 'has-text-danger-dark'}`} />
                <input type="password" placeholder="Повторите пароль"
                className={`${errors.rePassword && 'is-danger'}`}
                    {...register("rePassword")} /><br />
            </div>
            <p className="help has-text-danger-dark mt-0 is-size-6 has-text-left">{errors.rePassword?.message}</p>

            {/* <label>
                <input type="checkbox" />Запомнить
            </label> */}
            {
                loading ?
                    <button type="submit" style={{ marginTop: '10px', background: 'black' }} disabled>Обработка...</button>
                    :
                    <button type="submit" style={{ marginTop: '10px' }}>Зарегистрироваться</button>
            }
            <p>У вас есть аккаунт? <NavLink to="/login/signIn">Войти</NavLink> </p>
        </form>
    )
}

export default SignUp
