import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '../../store/selectors/userSelectors';
import { useForm } from '../../utils/hooks/use-form';
import { shallowEqual } from '../../utils/utils';
import { userAPI } from '../../utils/api/user-api';
import { resetUserData, setUserData } from '../../store/slicers/userSlicer';
import styles from './ProfilePage.module.css';
import Modal from '../../components/Modal/Modal';
import AvatarList from '../../components/AvatarList/AvatarList';


export default function ProfilePage() {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const userData = useSelector(userSelector);
  const [isInputChanged, setIsInputChanged] = useState(false);
  const [showAvaModal, setShowAvaModal] = useState(false);
  const [showDelModal, setShowDelModal] = useState(false);
  const [timer, setTimer] = useState(5);

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

  const [change, { error: changeError, data: changeData,
    isLoading: changeIsLoading, isSuccess: changeIsSuccess }] =
    userAPI.useChangeMutation();

  const [deleteAccount, { error: deleteError, data: deleteData,
    isLoading: deleteIsLoading, isSuccess: deleteIsSuccess }] =
    userAPI.useDeleteMutation();

  useEffect(() => {
    changeIsSuccess && changeData.username && dispatch(setUserData({
      username: changeData.username
    }));
  }, [changeData, changeError, changeIsSuccess]);

  const onSubmit = (e) => {
    e.preventDefault();
    change({
      token: localStorage.getItem('token'),
      username: userData.username !== values.username ? values.username : null,
      password: values.password.length > 0 ? values.password : null,
    });
  };

  const handleDelete = () => {
    setShowDelModal(true);
    setTimer(5);
    clearInterval(ref.current);
    ref.current = setInterval(
      () => setTimer((prevTimer) => prevTimer - 1), 1000
    );
  };

  useEffect(() => {
    if (timer === 0) {
      clearInterval(ref.current);
    }
  }, [timer]);

  useEffect(() => {
    if (deleteIsSuccess) {
      console.log('data:', deleteData);
      localStorage.removeItem('token');
      dispatch(resetUserData());
    }
    deleteError && console.log('error status:', deleteError.status);
  }, [deleteData, deleteError, deleteIsSuccess]);

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

      <h2 onClick={() => setShowAvaModal(true)}>
        нажми на меня что бы поменять аватарку
      </h2>
      {showAvaModal && (
        <Modal setVisible={setShowAvaModal} title='Выбор Аватарки'>
          <AvatarList />
        </Modal>
      )}

      <form className={styles.registerForm} onSubmit={onSubmit}>
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
          disabled={!isInputChanged || changeIsLoading}
        >
          Сохранить
        </button>
        {changeError && (
          <div style={{ color: 'red' }}>
            Ошибка: {changeError.data.error}
          </div>
        )}
        {changeIsSuccess && (
          <div style={{ color: 'green' }}>
            Данные успешно обновлены
          </div>
        )}
        <button type="button" className={styles.deleteButton}
          onClick={handleDelete} disabled={deleteIsLoading}
        >
          Удалить Профиль
        </button>
        {showDelModal && (
          <Modal setVisible={setShowDelModal} title='Подтвердите удаление'>
            <section style={{ textAlign: 'center' }}>
              <h2 style={{ color: 'black' }}>
                Внимание! Данное действие безвозвратное!
              </h2>
              <button disabled={timer !== 0}
                onClick={() => deleteAccount({
                  token: localStorage.getItem('token')
                })}
              >
                {'Подтвердить' + (timer !== 0 ? ` ${timer}` : '')}
              </button>
            </section>
          </Modal>
        )}
      </form>
    </>
  );
}
