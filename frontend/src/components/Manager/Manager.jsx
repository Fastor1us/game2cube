import React, { useEffect } from 'react';
import Game from '../Game/Game';
import styles from './Manager.module.css';
import LevelList from './LevelList/LevelList';
import { useDispatch, useSelector } from 'react-redux';
import {
  currLevelSelector,
  levelsSelector
} from '../../store/selectors/managerSelectors';
import heartFilledSVG from '../../image/heart-filled.svg';
import heartOutlineSVG from '../../image/heart-outline.svg';
import heartDisabledSVG from '../../image/heart-disabled.svg';
import { isAuthSelector } from '../../store/selectors/userSelectors';
import { gameAPI } from '../../utils/api/game-api';
import { toggleLevelReduxLike } from '../../store/slicers/managerSlicer';


export default function Manager() {
  const dispatch = useDispatch();
  const isAuth = useSelector(isAuthSelector);
  const levels = useSelector(levelsSelector);
  const currLevel = useSelector(currLevelSelector);

  const [toggleLike, { data, isSuccess, isLoading }]
    = gameAPI.useToggleLikeMutation();

  const level = levels?.length > 0 && levels[currLevel.index];

  const handleLike = async () => {
    if (isAuth && !isLoading) {
      const levelId = level.levelId;
      toggleLike({ token: localStorage.getItem('token'), levelId });
    }
  }

  useEffect(() => {
    isSuccess && dispatch(
      toggleLevelReduxLike({ index: currLevel.index }));
  }, [isSuccess]);

  return (
    <section className={styles.manager}>
      <h1 className={styles.title}>Manager</h1>
      <div className={styles.header}>
        <p className={styles.headerItem}>
          автор: {level.author}
        </p>
        <p className={styles.headerItem}>
          <img alt="" className={styles.like} onClick={handleLike}
            src={
              isAuth ? (levels?.length > 0 &&
                levels[currLevel.index].isAbleToLike ?
                heartOutlineSVG : heartFilledSVG
              ) : heartDisabledSVG
            }
          />
          {level.likes}
        </p>
      </div>

      <section className={styles.gameContainer}>
        <Game />
      </section>

      <LevelList />
    </section>
  );
}
