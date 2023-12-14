import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '../../store/selectors/userSelectors';
import { useForm } from '../../utils/hooks/use-form';
import { shallowEqual } from '../../utils/utils';
import { userAPI } from '../../utils/api/user-api';
import { setUserData } from '../../store/slicers/userSlicer';
import styles from './ProfilePage.module.css';


export default function ProfilePage() {
  const dispatch = useDispatch();
  const userData = useSelector(userSelector);
  const [isInputChanged, setIsInputChanged] = useState(false);

  const { values, setValues, handleChange } = useForm({
    username: 'admin',
    email: 'fewgwer3@ya.ru',
    password: '12345',
    passwordConfirmation: '12345',
    confirmationCode: '',
  });

  useEffect(() => {
    setValues({
      username: userData.username,
      email: userData.email,
      password: '',
    })
  }, [userData]);

  const [change, { error, data, isLoading, isSuccess }] =
    userAPI.useChangeMutation();

  useEffect(() => {
    isSuccess && data.username && dispatch(setUserData({
      username: data.username
    }));
  }, [data, error, isSuccess]);

  const onSubmit = (e) => {
    e.preventDefault();
    change({
      token: localStorage.getItem('token'),
      username: userData.username !== values.username ? values.username : null,
      password: values.password.length > 0 ? values.password : null,
    });
  }

  useEffect(() => {
    if (!shallowEqual(values, {
      username: userData.username,
      email: userData.email,
      password: '',
    })) {
      // TODO
      // добавить проверку на длинну пароля и username
      setIsInputChanged(true);
    } else {
      setIsInputChanged(false);
    }
  }, [values]);

  return (
    <>
      <h2>
        Профиль
      </h2>
      <form
        className={styles.registerForm}
        onSubmit={onSubmit}
      >
        <label htmlFor="username">
          Никнейм:
        </label>
        <input type="text" id="username" name='username'
          onChange={handleChange} value={values.username} />

        <label htmlFor="email">
          Email:
        </label>
        <input type="email" id="email" name='email'
          onChange={handleChange} value={values.email}
          disabled={true} />

        <label htmlFor="password">
          Пароль:
        </label>
        <input type="password" id="password" name='password'
          onChange={handleChange} value={values.password} />

        <button type="submit"
          // className={styles.registerButton}
          // disabled={regIsLoading}
          disabled={!isInputChanged || isLoading}
        >
          Сохранить
        </button>
        {error && (
          <div style={{ color: 'red' }}>
            Ошибка: {error.data.error}
          </div>
        )}
        {isSuccess && (
          <div style={{ color: 'green' }}>
            Данные успешно обновлены
          </div>
        )}
      </form>
    </>
  );
}
