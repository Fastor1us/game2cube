import React, { useEffect, useState } from 'react';
import Game from '../Game/Game';
import styles from './Manager.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { currLevelSelector, levelsSelector } from '../../store/selectors/managerSelectors';
import heartFilledSVG from '../../image/heart-filled.svg';
import heartOutlineSVG from '../../image/heart-outline.svg';
import heartDisabledSVG from '../../image/heart-disabled.svg';
import { isAuthSelector } from '../../store/selectors/userSelectors';
import { gameAPI } from '../../utils/api/game-api';
import { setCurrLevel, setLevels, toggleLevelReduxLike } from '../../store/slicers/managerSlicer';
import LevelList from './LevelList/LevelList';
import Modal from '../Modal/Modal';
import svgArrowLeft from '../../image/arrow-left.svg';
import svgArrowRight from '../../image/arrow-right.svg';
import { setIsCompleted, setLinkedColors } from '../../store/slicers/gameSlicer';
import CustomButton from '../CustomButton/CustomButton';


export default function Manager(props) {
  const dispatch = useDispatch();
  const isAuth = useSelector(isAuthSelector);
  const levels = useSelector(levelsSelector);
  const currLevel = useSelector(currLevelSelector);
  const [showDelModal, setShowDelModal] = useState(false);

  const [toggleLike, { data: toggleLikeData, error: toggleLikeError,
    isSuccess: toggleLikeIsSuccess, isLoading: toggleLikeIsLoading }] =
    gameAPI.useToggleLikeMutation();
  const [deleteLevel, { data: deleteLevelData, error: deleteLevelError,
    isSuccess: deleteLevelIsSuccess, isLoading: deleteLevelIsLoading }] =
    gameAPI.useDeleteMutation();

  const level = levels?.length > 0 && levels[currLevel.index];

  const handleLike = async () => {
    if (isAuth && !toggleLikeIsLoading) {
      const levelId = level.levelId;
      toggleLike({ token: localStorage.getItem('token'), levelId });
    }
    dispatch(setLevels([...levels]));
  }

  useEffect(() => {
    toggleLikeIsSuccess && dispatch(
      toggleLevelReduxLike({ index: currLevel.index }));
  }, [toggleLikeIsSuccess]);

  useEffect(() => {
    dispatch(setLinkedColors({}));
    dispatch(setIsCompleted(false));
  }, [currLevel]);

  const handleDelete = () => {
    setShowDelModal(false);
    if (isAuth && !deleteLevelIsLoading) {
      deleteLevel({
        token: localStorage.getItem('token'),
        levelId: levels[currLevel.index].levelId
      });
    }
    if (levels.length === 1) {
      dispatch(setCurrLevel({ index: null }));
      dispatch(setLevels([]));
      return;
    }
    dispatch(setCurrLevel({ index: currLevel.index - 1 }));
    dispatch(setLevels(
      levels.filter((_, index) => index !== currLevel.index)
    ));
  }

  const handleLefArrow = () => {
    currLevel.index > 0 &&
      dispatch(setCurrLevel({ index: currLevel.index - 1 }));
  }

  const handleRightArrow = () => {
    currLevel.index < levels.length - 1 &&
      dispatch(setCurrLevel({ index: currLevel.index + 1 }));
  }

  return (<>
    {levels && levels.length > 0 &&
      (<section className={styles.manager}>
        <div className={styles.header}>
          <div className={styles.headerItem}>
            <div style={{ userSelect: 'none' }}>
              автор:
            </div>
            <b>
              {level?.author || ''}
            </b>
          </div>
          <p className={styles.headerItem}>
            <img alt="" onClick={handleLike}
              className={`${[
                styles.like,
                isAuth ? styles.isAbleToLike : styles.likeDisabled
              ].filter(Boolean).join(' ')}`}
              style={{ userSelect: 'none' }}
              src={
                isAuth ? (levels?.length > 0 &&
                  levels[currLevel.index]?.isAbleToLike ?
                  heartOutlineSVG : heartFilledSVG
                ) : heartDisabledSVG
              }
            />
            <b>
              {level?.likes || ''}
            </b>
          </p>
        </div>

        {props?.isMyLevels && (<>
          <form className={styles.myLevelsform}
            onSubmit={(e) => e.preventDefault()}
          >
            <CustomButton onClick={() => setShowDelModal(true)}>
              удалить уровень
            </CustomButton>
            {showDelModal &&
              <Modal useTimer={false} title='Удалить уровень?'
                setVisible={setShowDelModal}
              >
                <section style={{ textAlign: 'center' }}>
                  <h2 style={{ color: 'black' }}>
                    Внимание! Данное действие безвозвратное!
                  </h2>
                  <CustomButton
                    onClick={handleDelete}
                    style={{ width: '250px', margin: '10px 0 12px' }}
                  >
                    Подтвердить
                  </CustomButton>
                </section>
              </Modal>
            }
          </form>
        </>)}

        <section className={styles.gameContainer}>
          <Game />
        </section>

        <div className={styles.arrowContainer}>
          <img src={svgArrowLeft} alt='стрелка влево'
            className={`
              ${styles.svgArrow}
              ${currLevel.index > 0 ?
                styles.enabledArrow : styles.disabledArrow}
            `}
            onClick={handleLefArrow}
          />
          <img src={svgArrowRight} alt='стрелка вправо'
            className={`
              ${styles.svgArrow}
              ${currLevel.index < levels.length - 1 ?
                styles.enabledArrow : styles.disabledArrow}
            `}
            onClick={handleRightArrow}
          />
        </div>

        <LevelList />
      </section>)}
  </>);
}
