import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './ForgotPasswordPage.module.css';
import { useForm } from '../../utils/hooks/use-form';
import { userAPI } from '../../utils/api/user-api';


export default function ForgotPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const focusRefCode = useRef(null);
  const [token, setToken] = useState(null);
  const [isAttemptLimit, setIsAttemptLimit] = useState(false);

  const { values, handleChange } = useForm({
    email: 'test2@test.ru',
    code: '',
    password: '',
  });

  const [recoveryEmail, {
    error: recoveryEmailError,
    isSuccess: recoveryEmailIsSuccess,
    isLoading: recoveryEmailIsLoading
  }] = userAPI.useRecoveryEmailMutation();
  const [recoveryCode, {
    error: recoveryCodeError,
    data: recoveryCodeData,
    isSuccess: recoveryCodeIsSuccess,
    isLoading: recoveryCodeIsLoading
  }] = userAPI.useRecoveryCodeMutation();
  const [change, { error: changeError, data: changeData,
    isLoading: changeIsLoading, isSuccess: changeIsSuccess }] =
    userAPI.useChangeMutation();

  useEffect(() => {
    recoveryEmailIsSuccess && focusRefCode.current.focus();
  }, [recoveryEmailError, recoveryEmailIsSuccess]);

  useEffect(() => {
    if (recoveryCodeError) {
      /лимит/i.test(recoveryCodeError?.data?.error) &&
        setIsAttemptLimit(true);
      console.log('recoveryCodeError:', recoveryCodeError?.data);
    }
    // recoveryCodeIsSuccess && .current.focus();
    recoveryCodeIsSuccess && recoveryCodeData &&
      setToken(recoveryCodeData.token);
  }, [recoveryCodeData, recoveryCodeError, recoveryCodeIsSuccess]);

  useEffect(() => {
    changeError && console.log('changeError:', changeError);
    if (changeIsSuccess) {
      const from = location?.state?.from;
      from ? navigate(from.pathname) : navigate('/login');
    }
  }, [changeData, changeError, changeIsSuccess]);

  const onEmailSubmit = useCallback((e) => {
    e.preventDefault();
    recoveryEmail({ email: values.email });
  }, [values]);

  const onCodeSubmit = useCallback((e) => {
    e.preventDefault();
    recoveryCode({ email: values.email, code: values.code });
  }, [values]);

  const onPasswordSubmit = useCallback((e) => {
    e.preventDefault();
    // const from = location?.state?.from;
    // {from && <p>Пользователь пришел со страницы: {from.pathname}</p>}
    change({ token: token, password: values.password });
  }, [token, values]);

  return (
    <>
      <h2>Форма восстановления пароля</h2>
      {!recoveryEmailIsSuccess && (<>
        <p>
          Забыли пароль? Введите email, на который вы регистрировались
        </p>
        <form className={styles.form} onSubmit={onEmailSubmit}>
          <label htmlFor="email">
            Email:
          </label>
          <input type="email" id="email" name='email'
            value={values.email} onChange={handleChange}
          />
          <button
            className={styles.btn}
            type='submit' disabled={recoveryEmailIsLoading}
          >
            Отправить код на почту
          </button>
        </form>
      </>)}
      {recoveryEmailError && (
        <p>
          Ошибка: {recoveryEmailError?.data?.error}
        </p>
      )}
      {recoveryEmailIsSuccess && !token && (<>
        <p>
          Введите код из письма
        </p>
        <form className={styles.form} onSubmit={onCodeSubmit}>
          <label htmlFor="code">
            Код из письма:
          </label>
          <input type="text" id="code"
            name='code' onChange={handleChange}
            value={values.code}
            ref={focusRefCode} />
          <button type="submit"
            className={styles.registerButton}
            disabled={recoveryCodeIsLoading || isAttemptLimit}
          >
            Отправить код
          </button>
          {isAttemptLimit &&
            <button type='button'
              style={{ width: '100%' }} onClick={() => navigate('/')}
            >
              На главную
            </button>
          }
        </form>
        {recoveryCodeError && (
          <p>
            Ошибка: {recoveryCodeError?.data?.error}
          </p>
        )}
      </>)}
      {token && (<>
        <p>
          Введите новый пароль
        </p>
        <form className={styles.form} onSubmit={onPasswordSubmit}>
          <label htmlFor="password">
            Пароль:
          </label>
          <input type="password" id="password"
            name='password' onChange={handleChange}
            value={values.password}
            ref={focusRefCode} />
          <button type="submit"
            className={styles.registerButton}
            disabled={changeIsLoading}
          >
            Сохранить
          </button>
        </form>
        {changeError && (
          <p>
            Ошибка: {changeError?.data?.error}
          </p>
        )}
      </>)}
    </>
  );
}
