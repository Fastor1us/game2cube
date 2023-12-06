import React, { useCallback, useEffect, useState } from 'react';
import Game from '../../components/Game/Game.jsx';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCellState,
  setGridData,
  setIsCompleted,
  setLinkedColors,
  setResetStateToInitial
} from '../../store/slicers/gameSlicer.js';
import GridSizeController
  from '../../components/GridSizeController/GridSizeController.jsx';
import { isAuthSelector } from '../../store/selectors/userSelectors.js';
import { gridDataSelector, isCompletedSelector } from '../../store/selectors/gameSelectors.js';
import OuterDonorCell from '../../utils/HOC/OuterDonorCell.jsx';
import InnerDonorCell from '../../utils/HOC/InnerDonorCell.jsx';
import RecipientCell from '../../utils/HOC/RecipientCell.jsx';
import styles from './CreateLevelsPage.module.css';
import { NavLink } from 'react-router-dom';
import { useDrop } from 'react-dnd';
import { cellPattern } from '../../utils/constants.js';


const arrCellsColors =
  ['blue', 'green', 'gray', 'red', 'purple', 'yellow', 'orange'];


export default function CreatingLevelsPage() {
  const dispatch = useDispatch();
  const [gridSize, setGridSize] = useState(4);
  const [isCreatingMode, setIsCreatingMode] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const isAuth = useSelector(isAuthSelector);
  const fields = useSelector(gridDataSelector);
  const isCompleted = useSelector(isCompletedSelector);

  const resetGrid = useCallback(() => {
    const fields = Array.from(Array(gridSize),
      () => Array(gridSize).fill(cellPattern));
    dispatch(setGridData(fields));
  }, [gridSize]);

  const handleResetBtn = useCallback(() => {
    resetGrid();
    setIsCreatingMode(true);
  }, []);

  useEffect(() => {
    resetGrid();
  }, [gridSize]);

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

  useEffect(() => {
    dispatch(setLinkedColors({}));
    dispatch(setIsCompleted(false));
  }, [gridSize]);

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
      <h1>Страница создания уровней</h1>
      {!isAuth && (<>
        <p>
          Что бы сохранить уровень вы должны быть авторизированны.
        </p>
        <p>
          <NavLink to='/login'>Войти</NavLink>
        </p>
      </>)}
      {isAuth && <p>
        Для сохранения уровеня, после его создания, уровень необходимо пройти,
        тогда кнопка "сохранить" станет активна
      </p>}
      <ul className={styles.creatingCellsList}>
        {arrCellsColors.slice(0, gridSize).map((strColor, index) => {
          return <OuterDonorCell
            key={index} color={strColor} sequenceNumber={1}
            {...{ isCreatingMode, isCellOutsideGame: true }} />
        })}
      </ul>
      <section style={{ display: 'flex', flexDirection: 'column' }}>
        <GridSizeController {...{ gridSize, setGridSize }} />
        <button onClick={handleResetBtn}>
          очистить поле
        </button>
        <button onClick={() => setIsCreatingMode(!isCreatingMode)}>
          включение/выключение режима прохождения уровня
        </button>
        <button disabled={isAuth && !isCompleted}>
          кнопка сохранения уровня
        </button>
      </section>

      {isCreatingMode &&
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
                {...item}
                key={row + '' + col}
                address={{ row, col }}
                isCreatingMode={true}
              />
            });
          })}
        </ul>
      }

      {!isCreatingMode &&
        <Game isCreatingMode={isCreatingMode} />
      }
    </section>
  );
}
