import React, { useCallback, useEffect } from 'react';
import { useForm } from '../../utils/hooks/use-form';
import { userAPI } from '../../utils/api/user-api';
import styles from './RegisterPage.module.css';
import { setUserData } from '../../store/slicers/userSlicer';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';


export default function RegisterPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { values, handleChange } = useForm({
    username: 'test2',
    email: 'test2@test.ru',
    password: '12345',
    passwordConfirmation: '12345',
    confirmationCode: '',
  });

  const [register, { error: regError, data: regData,
    isLoading: regIsLoading, isSuccess: regIsSuccess,
    isError: regIsError }] = userAPI.useRegisterMutation();
  const onRegisterSubmit = useCallback((e) => {
    e.preventDefault();
    register({
      username: values.username,
      email: values.email,
      password: values.password,
    });
  }, [values]);
  useEffect(() => {
    // success
    regData && console.log('data:', regData);
    // error
    regError && console.log('error status:', regError.status);
    regError && console.log('error data:', regError.data);
  }, [regData, regIsSuccess, regIsError]);

  const [confirmRegistration, { error: confirmError,
    data: confirmData, isLoading: confirmIsLoading,
    isSuccess: confirmIsSuccess, isError: confirmIsError }] =
    userAPI.useConfirmRegistrationMutation();
  const onConfirmationSubmit = useCallback((e) => {
    e.preventDefault();
    confirmRegistration({
      username: values.username,
      email: values.email,
      password: values.password,
      confirmationCode: values.confirmationCode,
    });
  }, [values]);
  useEffect(() => {
    if (confirmData) {
      confirmData && localStorage.setItem('token', confirmData.token);
      confirmData && dispatch(setUserData({
        username: confirmData.username,
        email: confirmData.email,
        isAuth: true
      }));
      location.state?.from ? navigate(location.state.from) : navigate(-1);
    }
  }, [confirmData, confirmIsSuccess, confirmIsError]);

  return (<>
    {!regIsSuccess && (<>
      <h2 className={styles.title}>
        Форма регистрации
      </h2>
      <form
        className={styles.registerForm}
        onSubmit={onRegisterSubmit}
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
          onChange={handleChange} value={values.email} />

        <label htmlFor="password">
          Пароль:
        </label>
        <input type="password" id="password" name='password'
          onChange={handleChange} value={values.password} />

        <label htmlFor="passwordConfirmation">
          Повторите пароль:
        </label>
        <input type="password" id="passwordConfirmation"
          name='passwordConfirmation' onChange={handleChange}
          value={values.passwordConfirmation} />

        <button type="submit"
          className={styles.registerButton}
          disabled={regIsLoading}
        >
          Зарегистрироваться
        </button>
      </form>
    </>)}
    {regIsError && (
      <p>
        Ошибка: {regError.data.error}
      </p>
    )}
    {regIsSuccess && (<>
      <h2 className={styles.title}>
        Код подтверждения
      </h2>
      <form
        className={styles.registerForm}
        onSubmit={onConfirmationSubmit}
      >
        <label htmlFor="confirmationCode">
          Код из письма:
        </label>
        <input type="text" id="confirmationCode"
          name='confirmationCode' onChange={handleChange}
          value={values.confirmationCode} />
        <button type="submit"
          className={styles.registerButton}
          disabled={confirmIsLoading}
        >
          Отправить код
        </button>
      </form>
      {confirmIsError && (
        <p>
          Ошибка: {confirmError.data.error}
        </p>
      )}
    </>)}
  </>);
}
