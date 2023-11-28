import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCellCoords,
  setCellState,
  setPrevCellCoords,
  setIsWatching
} from '../../../store/slicers/gameSlicer';
import { linkedColorSelector } from '../../../store/selectors/gameSelectors';
import store from '../../../store/store';
import styles from './Cell.module.css';


const Cell = React.memo((props) => {
  const dispatch = useDispatch();
  const ref = useRef();

  const isMainCellLinked = useSelector(linkedColorSelector(props.color));

  useEffect(() => {
    const handleMouseEnter = () => {
      // console.log('handleMouseEnter');
      dispatch(setCellCoords({
        row: props.row,
        col: props.col,
      }));
      // вернулись на поле в ячейку с фокусом при зажатой ЛКМ
      if (!getGameState().isWatching && getGameState().isFocus) {
        // console.log('вернулись на поле в ячейку с фокусом при зажатой ЛКМ');
        // если адрес ячейки с фокусом равен адресу текущей ячейки, то
        // включаем setIsWatching и прерываем функцию
        const focusedCellCoords = findFocusedCellCoords(getGridData());
        if (
          focusedCellCoords &&
          focusedCellCoords.row === props.row &&
          focusedCellCoords.col === props.col
        ) {
          // console.log('1');
          dispatch(setIsWatching(true));
          return;
        }
        // если цвет ячейки с фокусом не равен цвету текущей ячейки, то
        // выключаем фокус и прерываем функцию
        if (
          getGridData()[props.row][props.col].color &&
          getGridData()[focusedCellCoords.row][focusedCellCoords.col].color !==
          getGridData()[props.row][props.col].color
        ) {
          // console.log('2');
          dispatch(setCellState({
            address: focusedCellCoords,
            data: { focus: false },
          }));
          return;
        }
        // если адрес ячейки с фокусом не равен адресу текущей ячейки, то
        const currCellCoords = { row: props.row, col: props.col };
        if (isNextMoveNearFocusedCell(focusedCellCoords, currCellCoords)) {
          dispatch(setPrevCellCoords(focusedCellCoords));
          // console.log('3');
          dispatch(setIsWatching(true));
        } else {
          dispatch(setCellState({
            address: focusedCellCoords,
            data: { focus: false },
          }));
        }
      }
    }
    ref.current.addEventListener('mouseenter', handleMouseEnter);
    return () => {
      ref.current && ref.current.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <li ref={ref} >
      <div
        className={`${[
          styles.cell,
          // styles[props.state],
          props.sequenceNumber === 1 && !isMainCellLinked && styles.mainCell,
          props.sequenceNumber === 1 && styles[`main-${props.color}`],
          isMainCellLinked && styles.mainCellLinked,
          props.focus && styles.focus,
          !props.color && styles.emptyCell,
          props.color && !props.step && styles[props.color],
          props.color && !props.step && styles.filledCell,
          props.step && styles.emptyCell,
        ].filter(Boolean).join(' ')}`}
      >
        {props.step &&
          <div
            className={`${[
              styles.cell,
              styles.step,
              styles.filledCell,
              styles[props.color],
            ].filter(Boolean).join(' ')}`}
          >
          </div>
        }
      </div>
    </li>
  );
});

export default Cell;


function getGameState() {
  return store.getState().game;
}

function getGridData() {
  return store.getState().game.grid.data;
}

function findFocusedCellCoords(grid) {
  let result = null;
  grid.some((row, rowIndex) => {
    return row.some((cell, colIndex) => {
      if (cell.focus === true) {
        result = { row: rowIndex, col: colIndex };
        return true;
      } else { return false }
    });
  });
  return result;
}

function isNextMoveNearFocusedCell(focusedCellCoords, currCellCoords) {
  if (
    (
      currCellCoords.row === focusedCellCoords.row &&
      currCellCoords.col === focusedCellCoords.col + 1
    ) || (
      currCellCoords.row === focusedCellCoords.row &&
      currCellCoords.col === focusedCellCoords.col - 1
    ) || (
      currCellCoords.row === focusedCellCoords.row + 1 &&
      currCellCoords.col === focusedCellCoords.col
    ) || (
      currCellCoords.row === focusedCellCoords.row - 1 &&
      currCellCoords.col === focusedCellCoords.col
    )
  ) {
    return true;
  } else {
    return false;
  }
}
