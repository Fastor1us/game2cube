import React, { useEffect } from 'react';
import styles from './GameFilter.module.css';
import { TextInput } from '../../utils/HOC/inputs';
import CustomButton from '../CustomButton/CustomButton';
import { useForm } from '../../utils/hooks/use-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  isFormValidSelector
} from '../../store/selectors/validationSelector';
import RangeSlider from '../RangeSlider/RangeSlider';
import { gameAPI } from '../../utils/api/game-api';
import { setLevels } from '../../store/slicers/managerSlicer';

const MIN = 4;
const MAX = 7;


export default function GameFilter() {
  const dispatch = useDispatch();
  const { values, handleChange } = useForm({
    username: '',
    slider: {
      min: MIN,
      max: MAX
    }
  });
  const isFormValid = useSelector(isFormValidSelector);

  const [get, {
    data, isSuccess, error, isLoading
  }] = gameAPI.useGetMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    get({
      user: values.username,
      minSize: values.slider.min,
      maxSize: values.slider.max
    });
  }

  useEffect(() => {
    data && dispatch(setLevels(data.levels));
  }, [data]);

  useEffect(() => {
    get({
      user: '',
      minSize: values.slider.min,
      maxSize: values.slider.max
    });
  }, []);

  return (<>
    <section className={styles.container}>
      <form className={styles.searchForm} onSubmit={handleSubmit}>
        <div className={styles.inputContainer}>
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
        </div>
        <RangeSlider
          handleChange={handleChange}
          {...{
            min: MIN,
            max: MAX,
            width: 250
          }}
        />

        <CustomButton
          type='submit'
          extraClass={styles.btn}
          disabled={isLoading || values.username !== '' && !isFormValid}
        >
          Поиск
        </CustomButton>
      </form>
    </section>
    {error &&
      <div className={styles.error + ' ' + styles.info}>
        {error?.data?.error}
      </div>
    }
    {data && !error &&
      <div className={styles.info}>
        Результат поиска ({values.username ?
          'имя пользователя: ' + values.username + ', ' : ''}
        размер: {values.slider.min} - {values.slider.max}):
      </div>
    }
  </>);
}
