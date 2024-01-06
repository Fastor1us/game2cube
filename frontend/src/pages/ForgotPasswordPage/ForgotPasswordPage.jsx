import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './ForgotPasswordPage.module.css';
import { useForm } from '../../utils/hooks/use-form';
import { userAPI } from '../../utils/api/user-api';
import { EmailInput, PasswordInput, TextInput } from '../../utils/HOC/inputs';
import CustomButton from '../../components/CustomButton/CustomButton';


export default function ForgotPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
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
          <label htmlFor='email'> Email: </label>
          <EmailInput
            onChange={handleChange}
            value={values.email}
            shouldSetFocusOnLoad={true}
          />
          <CustomButton
            type='submit'
            extraStyles={styles.btn}
            disabled={recoveryEmailIsLoading}
          >
            Отправить код на почту
          </CustomButton>
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
          <label htmlFor='code'> Код из письма: </label>
          <TextInput
            minLength={6}
            maxLength={6}
            id='code'
            name='code'
            onChange={handleChange}
            value={values.code}
            shouldSetFocusOnLoad={true}
          />
          <CustomButton
            type='submit'
            extraStyles={styles.registerButton}
            disabled={recoveryCodeIsLoading || isAttemptLimit}
          >
            Отправить код
          </CustomButton>
          {isAttemptLimit &&
            <CustomButton
              onClick={() => navigate('/')}
            >
              На главную
            </CustomButton>
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
          <label htmlFor='password'> Пароль: </label>
          <PasswordInput
            onChange={handleChange}
            value={values.password}
            shouldSetFocusOnLoad={true}
          />
          <CustomButton
            type='submit'
            extraStyles={styles.registerButton}
            disabled={changeIsLoading}
          >
            Сохранить
          </CustomButton>
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
