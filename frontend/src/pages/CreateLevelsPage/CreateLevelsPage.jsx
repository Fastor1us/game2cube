import React, { useCallback, useEffect, useState } from 'react';
import Game from '../../components/Game/Game.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCellState,
  setGridData,
} from '../../store/slicers/gameSlicer.js';
import GridSizeController
  from '../../components/GridSizeController/GridSizeController.jsx';
import { isAuthSelector } from '../../store/selectors/userSelectors.js';
import {
  gridDataSelector,
  isCompletedSelector
} from '../../store/selectors/gameSelectors.js';
import OuterDonorCell from '../../utils/HOC/cells/OuterDonorCell.jsx';
import InnerDonorCell from '../../utils/HOC/cells/InnerDonorCell.jsx';
import RecipientCell from '../../utils/HOC/cells/RecipientCell.jsx';
import styles from './CreateLevelsPage.module.css';
import { Link, useLocation } from 'react-router-dom';
import { useDrop } from 'react-dnd';
import { cellPattern } from '../../utils/constants.js';
import { gameAPI } from '../../utils/api/game-api.js';
import CustomButton from '../../components/CustomButton/CustomButton.jsx';


export default function CreatingLevelsPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [gridSize, setGridSize] = useState(4);
  const [isCreatingMode, setIsCreatingMode] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const isAuth = useSelector(isAuthSelector);
  const fields = useSelector(gridDataSelector);
  const isCompleted = useSelector(isCompletedSelector);

  const resetGrid = () => {
    const fields = Array.from(Array(gridSize),
      () => Array(gridSize).fill(cellPattern));
    dispatch(setGridData(fields));
  };

  const handleReset = useCallback(() => {
    setIsSaved(false);
    setIsCreatingMode(true);
    resetGrid();
  }, [gridSize]);

  useEffect(() => { handleReset(); }, [gridSize]);

  const handleSave = () => {
    add({
      token: localStorage.getItem('token'),
      data: {
        size: gridSize,
        cells: fields.reduce((acc, row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            if (cell.sequenceNumber === 1) {
              acc.push({
                address: { row: rowIndex, col: colIndex },
                number: cell.color
              });
            }
          });
          return acc;
        }, [])
      }
    });
  }

  useEffect(() => {
    if (isCreatingMode) {
      isMounted &&
        fields.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            if (cell.color && cell.sequenceNumber > 1) {
              dispatch(setCellState({
                address: { row: rowIndex, col: colIndex },
                data: cellPattern
              }));
            }
          });
        });
      setIsMounted(true);
    }
  }, [isCreatingMode]);

  const [add, { error, data, isLoading, isSuccess, isError }] =
    gameAPI.useAddMutation();

  useEffect(() => {
    isSuccess && setIsSaved(true);
    error && console.log('error', error);
  }, [error, isSuccess]);

  const [, dropRef] = useDrop({
    accept: 'cell',
    drop: (item, monitor) => {
      if (!monitor.didDrop() && item.isInner) {
        dispatch(setCellState({
          address: item.address,
          data: {
            color: null,
            sequenceNumber: null,
            belong: null,
          }
        }));
      }
    },
  });

  return (
    <section className={styles.container} ref={dropRef}>
      <h1 style={{ marginBottom: 0 }}>Страница создания уровней</h1>
      {!isAuth && (<>
        <p className={styles.info} style={{ margin: 0 }}>
          Что бы сохранить уровень вы должны быть авторизированны.
        </p>
        <p className={styles.info} style={{ margin: '0 0 5px' }}>
          <Link to='/login' state={{ from: location.pathname }}>
            Войти
          </Link>
        </p>
      </>)
      }
      {
        isAuth && <p className={styles.info}>
          Что бы сохраненить уровнь, сперва необходимо его пройти,
          затем кнопка "сохранить" станет активна
        </p>
      }

      <section className={styles.controlContainer}>
        <GridSizeController
          {...{ gridSize, setGridSize }}
          disabled={isLoading || isError}
        />
        <CustomButton onClick={handleReset} disabled={isLoading || isError}>
          очистить поле
        </CustomButton>
        <CustomButton
          disabled={isLoading || isError || isSaved}
          onClick={() => setIsCreatingMode(!isCreatingMode)}
        >
          включение/выключение режима прохождения уровня
        </CustomButton>
        <CustomButton
          onClick={handleSave}
          disabled={!isAuth || !isCompleted || isLoading || isError || isSaved}
        >
          кнопка сохранения уровня
        </CustomButton>
        {isSaved &&
          <div style={{ color: 'green' }}>
            Уровень успешно сохранен
          </div>}
        {isError &&
          <div style={{ color: 'red' }}>
            {`${error?.data?.error ||
              'Произошла ошибка. Перезагрузите страницу'}`}
          </div>}
      </section>
      <div className={styles.gridContainer}>
        <ul className={styles.creatingCellsList}>
          {new Array(gridSize).fill(0).map((_, index) => {
            return <OuterDonorCell size={gridSize}
              key={index} color={index + 1} sequenceNumber={1}
              {...{ isCreatingMode, isCellOutsideGame: true }} />
          })}
        </ul>

        <div className={styles.break}></div>

        <section className={styles.gameContainer}>
          {
            isCreatingMode &&
            <ul
              className={`${[
                styles.gameField,
                styles[`gameGrid${fields.length}`],
              ].join(' ')}`}
            >
              {fields.map((_, row) => {
                return _.map((item, col) => {
                  const Cell = item.sequenceNumber ?
                    InnerDonorCell : RecipientCell;
                  return <Cell
                    {...item} size={fields.length}
                    key={row + '' + col}
                    address={{ row, col }}
                    isCreatingMode={true}
                  />
                });
              })}
            </ul>
          }

          {!isCreatingMode && <Game />}
          {!isCreatingMode && !isCompleted ?
            <div>Режим прохождения</div> :
            <div>Режим расстановки</div>
          }
        </section>
      </div>
    </section >
  );
}
