import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { isCompletedSelector } from '../../../store/selectors/gameSelectors';
import styles from './GameStatus.module.css';


export default function GameStatus() {
  const isCompleted = useSelector(isCompletedSelector);

  return (<> {isCompleted &&
    <section className={styles.container}>
      <h2>
        Уровень пройден!
      </h2>
    </section>
  }</>);
}
