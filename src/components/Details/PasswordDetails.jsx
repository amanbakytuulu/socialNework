import React from 'react'
import SettingLayout from '../SettingLayout'
import { getAuth, updatePassword } from 'firebase/auth';
import { passwordResolver } from './../../validates/passwordResolver';
import { useForm } from 'react-hook-form';
import { useLoading } from './../../hooks/useLoading';
import { toast } from 'react-toastify';
import firebase from './../../firebase';
import { useNavigate } from 'react-router-dom';

function PasswordDetails() {

  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const { loading, setLoading } = useLoading();
  const { formOptions } = passwordResolver();
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  const onSend = (data) => {
    setLoading(true);
    const emailCred = firebase.auth.EmailAuthProvider
      .credential(user.email, data.currentPassword);
    firebase.auth().currentUser.reauthenticateWithCredential(emailCred)
      .then(() => {
        updatePassword(user, data.password).then(() => {
          setLoading(false);
          navigate('/');
          return toast.success('Пароль успешно обновлен!');
        })
      }).catch((error) => {
        navigate('/');
        return toast.error('Ошибка данных!')
      })
  }

  return (
    <SettingLayout title="Изменить пароль">
      <form onSubmit={handleSubmit(onSend)}>
        <div className="columns is-block">
          <div className="column">
            <div class="field">
              <label class="label">Текущий пароль</label>
              <div class="control">
                <input className={`input ${errors.currentPassword ? 'is-danger' : ''}`} type="password" placeholder="Новый пароль..."
                  {...register('currentPassword')} autocomplete="on" />
              </div>
              <p className="help has-text-danger-dark">{errors.currentPassword?.message}</p>
            </div>
          </div>
          <div className="column">
            <div class="field">
              <label class="label">Новый пароль</label>
              <div class="control">
                <input className={`input ${errors.password ? 'is-danger' : ''}`} type="password" placeholder="Новый пароль..."
                  {...register('password')} autocomplete="on" />
              </div>
              <p className="help has-text-danger-dark">{errors.password?.message}</p>
            </div>
          </div>
          <div className="column">
            <div class="field">
              <label class="label">Повторите пароль</label>
              <div class="control">
                <input className={`input ${errors.rePassword ? 'is-danger' : ''}`} type="password" placeholder="Новый пароль..."
                  {...register('rePassword')} autocomplete="on" />
              </div>
              <p className="help has-text-danger-dark">{errors.rePassword?.message}</p>
            </div>
          </div>
        </div>

        {loading ?
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

export default PasswordDetails