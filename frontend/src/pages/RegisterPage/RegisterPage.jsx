import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from '../../utils/hooks/use-form';
import { userAPI } from '../../utils/api/user-api';
import styles from './RegisterPage.module.css';
import { setAvatarList, setUserData } from '../../store/slicers/userSlicer';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import AvatarList from '../../components/AvatarList/AvatarList';
import Modal from '../../components/Modal/Modal';
import { BACKEND_URL } from '../../utils/constants';
import { defaultAvatar } from '../../utils/constants';
import { EmailInput, PasswordInput, TextInput } from '../../utils/HOC/inputs';
import CustomButton from '../../components/CustomButton/CustomButton';
import { isFormValidSelector } from '../../store/selectors/validationSelector';


export default function RegisterPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [showAvaModal, setShowAvaModal] = useState(false);
  const [arePassordsDifferent, setArePassordsDifferent] = useState(false);
  const { values, handleChange } = useForm({
    username: 'admin',
    email: 'fewgwer3@ya.ru',
    password: '1234',
    passwordConfirmation: '1234',
    confirmationCode: '',
  });
  const isFormValid = useSelector(isFormValidSelector);
  const [shouldShowError, setShouldShowError] = useState(false);

  const onChange = (event) => {
    setShouldShowError(false);
    handleChange(event);
  }

  useEffect(() => {
    // проверка на соответствие паролей в onRegisterSubmit
    setArePassordsDifferent(false);
  }, [values]);

  const [register, { error: regError, data: regData,
    isLoading: regIsLoading, isSuccess: regIsSuccess,
    isError: regIsError }] = userAPI.useRegisterMutation();
  const onRegisterSubmit = useCallback((e) => {
    e.preventDefault();
    if (values.password === values.passwordConfirmation) {
      register({
        username: values.username,
        email: values.email,
        password: values.password,
      });
    } else {
      setArePassordsDifferent(true);
    }
  }, [values]);
  useEffect(() => {
    regError && console.log('error data:', regError.data);
  }, [regData, regIsError]);

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
      avatar: selectedAvatar || defaultAvatar,
    });
  }, [values]);
  useEffect(() => {
    if (confirmData) {
      confirmData && localStorage.setItem('token', confirmData.token);
      confirmData && dispatch(setUserData({
        username: confirmData.username,
        email: confirmData.email,
        avatar: confirmData.avatar,
        isAuth: true
      }));
      location.state?.from ? navigate(location.state.from) : navigate(-1);
    }
  }, [confirmData, confirmIsSuccess, confirmIsError]);

  const { data: getAvatarListData, error: getAvatarListError,
    isLoading: getAvatarListIsLoading, isSuccess: getAvatarListIsSuccess } =
    userAPI.useGetAvatarListQuery();

  useEffect(() => {
    getAvatarListIsSuccess && getAvatarListData &&
      dispatch(setAvatarList(getAvatarListData));
  }, [getAvatarListData, getAvatarListIsSuccess]);

  useEffect(() => {
    setShouldShowError(true);
  }, [regError, confirmError]);

  return (<>
    {!regIsSuccess && (<>
      <h2 className={styles.title}>
        Форма регистрации
      </h2>

      {selectedAvatar ? (
        <img src={`${BACKEND_URL}/user/avatars/${selectedAvatar}`}
          alt={`Аватар ${selectedAvatar}`} className={styles.avatar}
          onClick={() => setShowAvaModal(true)}
        />
      ) : (
        <img src={`${BACKEND_URL}/user/avatars/${defaultAvatar}`}
          alt='дефолтная аватарка' className={styles.avatar}
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

      <form className={styles.registerForm} onSubmit={onRegisterSubmit}>
        <label htmlFor='username'> Никнейм: </label>
        <TextInput
          id='username'
          name='username'
          onChange={onChange}
          value={values.username}
          shouldSetFocusOnLoad={true}
        />

        <label htmlFor='email'> Email: </label>
        <EmailInput
          onChange={onChange}
          value={values.email}
        />

        <label htmlFor='password'> Пароль: </label>
        <PasswordInput
          onChange={handleChange}
          value={values.password}
        />

        <label htmlFor='passwordConfirmation'>
          Повторите пароль:
        </label>
        <PasswordInput
          id='passwordConfirmation'
          name='passwordConfirmation'
          onChange={handleChange}
          value={values.passwordConfirmation}
        />

        <CustomButton
          type='submit'
          extraStyles={styles.registerButton}
          disabled={regIsLoading || !isFormValid}
        >
          Зарегистрироваться
        </CustomButton>
      </form>
    </>)}
    {regIsError && shouldShowError && (
      <p className={styles.error}>
        {regError.data.error}
      </p>
    )}
    {arePassordsDifferent && (
      <p className={styles.error}>
        Пароли не совпадают
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
        <label htmlFor='confirmationCode'> Код из письма: </label>
        <TextInput
          id='confirmationCode'
          name='confirmationCode'
          onChange={onChange}
          value={values.confirmationCode}
          shouldSetFocusOnLoad={true}
          minLength={6}
          maxLength={6}
        />
        <CustomButton
          type='submit'
          extraStyles={styles.registerButton}
          disabled={confirmIsLoading}
        >
          Отправить код
        </CustomButton>
      </form>
      {confirmIsError && shouldShowError && (
        <p className={styles.error}>
          {confirmError.data.error}
        </p>
      )}
    </>)}
  </>);
}
