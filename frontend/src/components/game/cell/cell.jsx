import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setCellCoords, setIsWatching } from '../../../store/slicers/gameSlicer';
import store from '../../../store/store';
import styles from './cell.module.css';


const Cell = React.memo((props) => {
  const dispatch = useDispatch();
  const ref = useRef();

  useEffect(() => {
    const handleMouseEnter = () => {
      dispatch(setCellCoords({
        row: props.row,
        col: props.col,
      }));
      // вернулись на поле в ячейку с фокусом при зажатой ЛКМ
      if (getGameState().isFocus) {
        dispatch(setIsWatching(true));
      }
    }
    ref.current.addEventListener('mouseenter', handleMouseEnter);
    return () => {
      ref.current.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <li ref={ref} >
      <div
        className={`${[
          styles.cell,
          // styles[props.state],
          props.sequenceNumber === 1 && styles.mainCell,
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
