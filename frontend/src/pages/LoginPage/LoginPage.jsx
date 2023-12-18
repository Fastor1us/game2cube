import React, { useCallback, useEffect, useRef } from 'react';
import { useForm } from '../../utils/hooks/use-form';
import styles from './LoginPage.module.css';
import { userAPI } from '../../utils/api/user-api';
import { useDispatch } from 'react-redux';
import { setUserData } from '../../store/slicers/userSlicer';
import { useNavigate, Link, useLocation } from 'react-router-dom';


export default function LoginPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const focusRef = useRef(null);
  const { values, handleChange } = useForm({
    email: 'test2@test.ru',
    password: '12345',
  });

  useEffect(() => {
    focusRef.current.focus();
  }, []);

  const [login, { error, data, isLoading }] =
    userAPI.useLoginMutation();
  const onSubmit = useCallback((e) => {
    e.preventDefault();
    login({
      email: values.email,
      password: values.password,
    });
  }, [values]);
  useEffect(() => {
    data && localStorage.setItem('token', data.token);
    data && dispatch(setUserData({
      username: data.username,
      email: data.email,
      avatar: data.avatar,
      isAuth: true
    }));
    data && navigate(-1);
    error && console.log('error:', error);
  }, [data, error]);

  return (<>
    <h2 className={styles.title}>
      Форма входа
    </h2>
    <form className={styles.registerForm} onSubmit={onSubmit}>
      <label htmlFor="email">
        Email:
      </label>
      <input type="email" id="email" name='email' ref={focusRef}
        onChange={handleChange} value={values.email} />

      <label htmlFor="password">
        Пароль:
      </label>
      <input type="password" id="password" name='password'
        onChange={handleChange} value={values.password} />

      <button
        className={styles.registerButton}
        type="submit" disabled={isLoading}
      >
        Войти
      </button>
    </form>
    {error && (
      <p>
        Ошибка: {error.data.error}
      </p>
    )}
    <p>
      {'Нет аккаунта? '}
      <Link className={styles.link}
        to='/registration'
        state={{ from: location.state?.from || '/' }}
        replace={location.state?.from ? true : false}
      >
        Зарегистрироваться
      </Link>
    </p >
    <p style={{ marginTop: 0 }}>
      {'Забыли пароль? '}
      <Link className={styles.link}
        to='/reset-password' state={{ from: location }}
      >
        Восстановить
      </Link>
    </p>
  </>);
}
