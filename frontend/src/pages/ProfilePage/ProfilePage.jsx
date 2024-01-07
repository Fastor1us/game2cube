import React, { useEffect, useState } from 'react';
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
import DeleteModal from '../../utils/HOC/DeleteModal';
import { EmailInput, PasswordInput, TextInput } from '../../utils/HOC/inputs';
import CustomButton from '../../components/CustomButton/CustomButton';
import { isFormValidSelector } from '../../store/selectors/validationSelector';


export default function ProfilePage() {
  const dispatch = useDispatch();
  const avatar = useSelector(avatarSelector);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const { username, email } = useSelector(userSelector);
  const [isInputChanged, setIsInputChanged] = useState(false);
  const [showAvaModal, setShowAvaModal] = useState(false);
  const [showDelModal, setShowDelModal] = useState(false);
  const [showNotificationStatus, setShowNotificationStatus] = useState(false);
  const { values, setValues, handleChange } = useForm({
    username: username,
    email: email,
    password: '',
  });
  const isFormValid = useSelector(isFormValidSelector);

  useEffect(() => {
    avatar && setSelectedAvatar(avatar);
  }, [avatar]);

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
  };

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

  useEffect(() => {
    changeIsSuccess && dispatch(setUserData({ ...changeData }));
    (changeIsSuccess || changeError) && setShowNotificationStatus(true);
    changeIsSuccess && setValues({
      username: username,
      email: email,
      password: '',
    });
  }, [changeData, changeError, changeIsSuccess]);

  useEffect(() => {
    if (selectedAvatar !== avatar) {
      setShowNotificationStatus(false);
    }
  }, [selectedAvatar]);

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
        <label htmlFor="username"> Никнейм: </label>
        <TextInput
          id="username"
          name='username'
          onChange={handleChange}
          value={values.username}
        />

        <label htmlFor="email"> Email: </label>
        <EmailInput
          value={values.email}
          disabled={true}
        />

        <label htmlFor="password"> Пароль: </label>
        <PasswordInput
          onChange={handleChange}
          value={values.password}
          required={false}
        />

        <CustomButton
          type="submit"
          extraStyles={styles.registerButton}
          disabled={
            !isFormValid ||
            (!isInputChanged || changeIsLoading) && selectedAvatar === avatar
          }
        >
          Сохранить
        </CustomButton>
        {changeError && (
          <div style={{ color: 'red' }}>
            {changeError.data.error}
          </div>
        )}
        {changeIsSuccess && showNotificationStatus &&
          ((!isInputChanged || changeIsLoading) && selectedAvatar === avatar) &&
          (
            <div style={{ color: 'DarkGreen' }}>
              Данные успешно обновлены
            </div>
          )}
        <CustomButton
          extraStyles={styles.deleteButton}
          onClick={handleDelete}
          disabled={deleteIsLoading}
        >
          Удалить Профиль
        </CustomButton>
        {showDelModal && (
          <DeleteModal setVisible={setShowDelModal} title='Удалить Профиль?'
            onHandleClick={
              () => deleteAccount({ token: localStorage.getItem('token') })
            } />
        )}
      </form>
    </>
  );
}
