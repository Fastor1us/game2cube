import React from 'react';
import styles from './GameFilter.module.css';
import { TextInput } from '../../utils/HOC/inputs';
import CustomButton from '../CustomButton/CustomButton';
import { useForm } from '../../utils/hooks/use-form';
import { useSelector } from 'react-redux';
import {
  isFormValidSelector
} from '../../store/selectors/validationSelector';


export default function GameFilter() {
  const { values, handleChange } = useForm({
    username: ''
  });

  const isFormValid = useSelector(isFormValidSelector);

  return (
    <>
      <form className={styles.searchForm}>
        <label htmlFor="username">
          Введите имя пользователя:
        </label>
        <TextInput
          id='username'
          name='username'
          onChange={handleChange}
          value={values.username}
          required={false}
        />
        <CustomButton
          disabled={values.username !== '' && !isFormValid}
        >
          Поиск
        </CustomButton>
      </form>
    </>
  );
}
