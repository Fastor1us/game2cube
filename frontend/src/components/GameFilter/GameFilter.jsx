import React, { useEffect } from 'react';
import styles from './GameFilter.module.css';
import { TextInput } from '../../utils/HOC/inputs';
import { useForm } from '../../utils/hooks/use-form';
import { useDispatch, useSelector } from 'react-redux';
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

  const [get, {
    data, isSuccess, error, isLoading
  }] = gameAPI.useGetMutation();

  useEffect(() => {
    data && dispatch(setLevels(data.levels));
    error && dispatch(setLevels([]));
  }, [data, error]);

  useEffect(() => {
    get({
      user: values.username,
      minSize: values.slider.min,
      maxSize: values.slider.max,
      byFilter: true
    });
  }, [values]);

  return (<>
    <section className={styles.container}>
      <form className={styles.searchForm}>
        <div className={styles.inputContainer}>
          <label htmlFor="username">
            Имя пользователя:
          </label>
          <TextInput
            id='username'
            name='username'
            onChange={handleChange}
            value={values.username}
            required={false}
            minLength={1}
            validate={false}
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
      </form>
    </section>
    {error &&
      <p className={styles.error + ' ' + styles.info}>
        нет данных
      </p>
    }
  </>);
}
