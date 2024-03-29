import React, { forwardRef, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCellCoords,
  setCellState,
  setPrevCellCoords,
  setIsWatching
} from '../../../store/slicers/gameSlicer';
import { linkedColorSelector } from '../../../store/selectors/gameSelectors';
import { getGameState, getGridData } from '../../../utils/utils';
import styles from './Cell.module.css';


const Cell = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const innerRef = useRef();
  const isMainCellLinked = useSelector(linkedColorSelector(props.color));
  const isTouchInside = useRef(false);

  useEffect(() => {
    if (!props.isCellOutsideGame && !props.isCreatingMode) {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const handleMouseEnter = () => {
        dispatch(setCellCoords({
          row: props.row,
          col: props.col,
        }));
        // вернулись на поле в ячейку с фокусом при зажатой ЛКМ
        if (!getGameState().isWatching && getGameState().isFocus) {
          // если адрес ячейки с фокусом равен адресу текущей ячейки, то
          // включаем setIsWatching и прерываем функцию
          const focusedCellCoords = findFocusedCellCoords(getGridData());
          if (
            focusedCellCoords &&
            focusedCellCoords.row === props.row &&
            focusedCellCoords.col === props.col
          ) {
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
            dispatch(setIsWatching(true));
          } else {
            dispatch(setCellState({
              address: focusedCellCoords,
              data: { focus: false },
            }));
          }
        }
      }
      const handleTouchStart = (e) => {
        if (isMobile && getGridData()[props.row][props.col].color !== null) {
          e.preventDefault();
        }
        handleMouseEnter();
        isTouchInside.current = true;
      }
      const handleTouchMove = (e) => {
        const rect = innerRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        if (
          touch.clientX >= rect.left &&
          touch.clientX <= rect.right &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom
        ) {
          if (isTouchInside.current) {
            return;
          }
          handleMouseEnter();
          isTouchInside.current = true;
        } else {
          isTouchInside.current = false;
        }
      };
      const handleTouchEnd = () => {
        isTouchInside.current = false;
      };
      if (!isMobile) {
        innerRef.current.addEventListener('mouseenter', handleMouseEnter);
      } else {
        innerRef.current.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
        document.addEventListener('touchcancel', handleTouchEnd);
      }
      return () => {
        if (!isMobile) {
          innerRef.current &&
            innerRef.current.removeEventListener('mouseenter', handleMouseEnter);
        } else {
          innerRef.current &&
            innerRef.current.removeEventListener('touchstart', handleTouchStart);
          document.removeEventListener('touchmove', handleTouchMove);
          document.removeEventListener('touchend', handleTouchEnd);
          document.removeEventListener('touchcancel', handleTouchEnd);
        }
      };
    }
  }, []);

  return (
    <li ref={innerRef} style={props.styles || null}>
      <div ref={ref || null}
        className={`${[
          styles.cell,
          props.sequenceNumber === 1 && !isMainCellLinked && styles.mainCell,
          props.sequenceNumber === 1 && styles[`main-${props.color}`],
          isMainCellLinked && styles.mainCellLinked,
          props.focus && styles.focus,
          !props.color && styles.emptyCell,
          props.isBlocked && styles.blockedCell,
          props.color && !props.step && styles[`color-${props.color}`],
          props.color && !props.step && styles.filledCell,
          props.step && styles.step,
          props.step && styles[`step-${props.color}`],
          props.size && styles[`field-size-${props.size}`],
        ].filter(Boolean).join(' ')}`}
      ></div>
    </li >
  );
});

Cell.defaultProps = {
  isCreatingMode: false,
  isCellOutsideGame: false,
}

export default Cell;


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
