import React from 'react';
import { useForm } from '../../utils/hooks/use-form';
import { userAPI } from '../../utils/api/user-api';
import styles from './RegisterPage.module.css';


export default function RegisterPage() {
  const { values, handleChange } = useForm({
    username: 'fastorius',
    email: 'fewgwer3@ya.ru',
    password: '12345',
    passwordConfirmation: '12345',
  });

  // const [register, { data, isLoading, isSuccess, isError }] =
  // userAPI.endpoints.postOrderInfo.useMutation();

  const onSubmit = (e) => {
    e.preventDefault();
    // тут будет отправка формы на сервер
    // {... email: values.email, password: values.password ...}


  }

  return (
    <form onSubmit={onSubmit} className={styles.registerForm}>
      <label htmlFor="username">
        Никнейм:
      </label>
      <input type="text" id="username"
        onChange={handleChange} value={values.username} />

      <label htmlFor="email">
        Email:
      </label>
      <input type="email" id="email"
        onChange={handleChange} value={values.email} />

      <label htmlFor="password">
        Пароль:
      </label>
      <input type="password" id="password"
        onChange={handleChange} value={values.password} />

      <label htmlFor="repeat-password">
        Повторите пароль:
      </label>
      <input type="password" id="repeat-password"
        onChange={handleChange} value={values.passwordConfirmation} />


      <button type="submit" className={styles.registerButton}>
        Register
      </button>
    </form>
  );
}
