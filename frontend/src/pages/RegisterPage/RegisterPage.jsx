import React from 'react';
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
  });

  // const [register, { data, isLoading, isSuccess, isError }] =
  // userAPI.endpoints.postOrderInfo.useMutation();

  const onSubmit = (e) => {
    e.preventDefault();

    if (values.password === values.passwordConfirmation) {
      axios
        .post('http://localhost:3001/register', {
          username: values.username,
          email: values.email,
          password: values.password,
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((e) => {
          if (e.response.status === 409) {
            console.error('Error:', e.response.data.error);
          } else {
            console.log('Упс, что-то пошло не так...');
            console.error('Error:', e);
          }
        });
    }

    // axios
    //   .get('http://localhost:3001/users')
    //   .then((response) => {
    //     console.log(response.data);
    //   });
  }

  return (
    <form onSubmit={onSubmit} className={styles.registerForm}>
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
  );
}
