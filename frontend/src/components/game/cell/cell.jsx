import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrCellParams, setCellState } from '../../../store/slicers/gameSlicer';
import store from '../../../store/store';
import styles from './cell.module.css';


const Cell = React.memo((props) => {
  const dispatch = useDispatch();
  const ref = useRef();

  useEffect(() => {
    const handleMouseOver = () => {
      dispatch(setCurrCellParams({
        row: props.row,
        col: props.col,
      }));
    }
    const handleMouseLeave = () => {

      const cellData = getGridData()[props.row][props.col];
      dispatch(setCellState({
        address: { row: props.row, col: props.col },
        data: { ...cellData, focus: false }
      }));
    }
    ref.current.addEventListener('mouseenter', handleMouseOver);
    ref.current.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      ref.current.removeEventListener('mouseenter', handleMouseOver);
      ref.current.addEventListener('mouseleave', handleMouseLeave);
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


function getGridData() {
  return store.getState().game.grid.data;
}
