import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrCellParams } from '../../../store/slicers/gameSlicer';
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
    ref.current.addEventListener('mouseenter', handleMouseOver);
    return () => {
      ref.current.removeEventListener('mouseenter', handleMouseOver);
    };
  }, []);

  return (
    <li
      ref={ref}
      className={`${[
        styles.cell,
        // styles[props.state],
        props.sequenceNumber === 1 && styles.mainCell,
        props.color === 'none' && styles.emptyCell,
        props.color !== 'none' && !props.step && styles[props.color],
        props.color !== 'none' && !props.step && styles.filledCell,
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
    </li>
  );
});

export default Cell;
