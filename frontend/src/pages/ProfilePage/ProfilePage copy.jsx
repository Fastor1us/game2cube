import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { avatarSelector, userSelector } from '../../store/selectors/userSelectors';
import { useForm } from '../../utils/hooks/use-form';
import { shallowEqual } from '../../utils/utils';
import { userAPI } from '../../utils/api/user-api';
import { resetUserData, setUserData, setAvatarList } from '../../store/slicers/userSlicer';
import styles from './ProfilePage.module.css';
import Modal from '../../components/Modal/Modal';
import AvatarList from '../../components/AvatarList/AvatarList';
import { BACKEND_URL } from '../../utils/constants';


export default function ProfilePage() {
  const dispatch = useDispatch();
  const avatar = useSelector(avatarSelector);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const ref = useRef(null);
  const { username, email } = useSelector(userSelector);
  const [isInputChanged, setIsInputChanged] = useState(false);
  const [showAvaModal, setShowAvaModal] = useState(false);
  const [showDelModal, setShowDelModal] = useState(false);
  const [showNotificationStatus, setShowNotificationStatus] = useState(false);
  const [timer, setTimer] = useState(5);

  const { values, setValues, handleChange } = useForm({
    username: username,
    email: email,
    password: '',
  });

  useEffect(() => {
    avatar && setSelectedAvatar(avatar);
  }, [])

  useEffect(() => {
    setValues({
      username: username,
      email: email,
      password: '',
    })
  }, [username, email]);

  const [change, { error: changeError, data: changeData,
    isLoading: changeIsLoading, isSuccess: changeIsSuccess }] =
    userAPI.useChangeMutation();

  const [deleteAccount, { error: deleteError, data: deleteData,
    isLoading: deleteIsLoading, isSuccess: deleteIsSuccess }] =
    userAPI.useDeleteMutation();

  const { data: getAvatarListData, error: getAvatarListError,
    isLoading: getAvatarListIsLoading, isSuccess: getAvatarListIsSuccess } =
    userAPI.useGetAvatarListQuery();

  useEffect(() => {
    changeIsSuccess && dispatch(setUserData({
      ...changeData
    }));
    (changeIsSuccess || changeError) && setShowNotificationStatus(true);
  }, [changeData, changeError, changeIsSuccess]);

  useEffect(() => {
    if (selectedAvatar !== avatar) {
      setShowNotificationStatus(false);
    }
  }, [selectedAvatar]);

  useEffect(() => {
    if (deleteIsSuccess) {
      localStorage.removeItem('token');
      dispatch(resetUserData());
    }
    deleteError && console.log('error status:', deleteError.status);
  }, [deleteData, deleteError, deleteIsSuccess]);

  useEffect(() => {
    getAvatarListIsSuccess && getAvatarListData &&
      dispatch(setAvatarList(getAvatarListData));
  }, [getAvatarListData, getAvatarListIsSuccess]);

  const onSubmit = (e) => {
    e.preventDefault();
    change({
      token: localStorage.getItem('token'),
      username: username !== values.username ? values.username : null,
      password: values.password.length > 0 ? values.password : null,
      avatar: selectedAvatar !== avatar ? selectedAvatar : null
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
    if (!shallowEqual(values, {
      username: username,
      email: email,
      password: '',
    })) {
      // TODO
      // добавить проверку на длинну пароля и username
      setIsInputChanged(true);
      (changeIsSuccess) && setShowNotificationStatus(false);
    } else {
      setIsInputChanged(false);
    }
  }, [values]);

  return (
    <>
      <h2>
        Профиль
      </h2>

      {selectedAvatar ? (
        <img src={`${BACKEND_URL}/user/avatars/${selectedAvatar}`}
          alt={`Аватар ${selectedAvatar}`} className={styles.avatar}
          onClick={() => setShowAvaModal(true)}
        />
      ) : (
        <img src={`${BACKEND_URL}/user/avatars/avatar001.svg`}
          alt="дефолтная аватарка" className={styles.avatar}
          onClick={() => setShowAvaModal(true)}
        />
      )}
      {showAvaModal && (
        <Modal setVisible={setShowAvaModal} title='Выбор Аватарки'>
          <AvatarList
            setVisible={setShowAvaModal} setSelectedAvatar={setSelectedAvatar}
          />
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
          disabled={
            (!isInputChanged || changeIsLoading) && selectedAvatar === avatar
          }
        >
          Сохранить
        </button>
        {changeError && (
          <div style={{ color: 'red' }}>
            Ошибка: {changeError.data.error}
          </div>
        )}
        {changeIsSuccess && showNotificationStatus &&
          ((!isInputChanged || changeIsLoading) && selectedAvatar === avatar) &&
          (
            <div style={{ color: 'DarkGreen' }}>
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
                {'Подтвердить' + (timer !== 0 ? ` (${timer})` : '')}
              </button>
            </section>
          </Modal>
        )}
      </form>
    </>
  );
}
