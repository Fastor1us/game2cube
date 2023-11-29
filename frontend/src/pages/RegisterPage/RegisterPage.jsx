import React, { useCallback } from 'react';
import { useForm } from '../../utils/hooks/use-form';
import { userAPI } from '../../utils/api/user-api';
import styles from './RegisterPage.module.css';
import axios from 'axios';


export default function RegisterPage() {
  const { values, handleChange } = useForm({
    username: 'fastorius',
    email: 'fewgwer3@ya.ru',
    password: '12345',
    passwordConfirmation: '12345',
    confirmationCode: '',
  });

  const [register, { data, isLoading, isSuccess, isError }] =
    userAPI.endpoints.register.useMutation();


  // заблокировать кнопку "зарегистрироваться"
  // разблокировать её по условиям - корректная заполненность всех полей
  const onRegisterSubmit = useCallback((e) => {
    e.preventDefault();
    register({
      username: values.username,
      email: values.email,
      password: values.password,
    });
  }, [values]);

  const onConfirmationSubmit = useCallback((e) => {
    e.preventDefault();
    axios
      .post('http://localhost:3001/user/registrationConfirm', {
        username: values.username,
        email: values.email,
        confirmationCode: values.confirmationCode,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        console.error('Error:', e);
      });
  }, [values]);

  return (<>
    {!isSuccess && (
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


        <button type="submit" className={styles.registerButton}>
          Register
        </button>
      </form>
    )}
    {isSuccess && (
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
        <button type="submit" className={styles.registerButton}>
          Отправить код
        </button>
      </form>
    )}
    {isError && (
      <div>
        Ошибка регистрации
      </div>
    )}
  </>);
}
