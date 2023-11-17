import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentCellParams } from '../../../store/slicers/gameSlicer';
import styles from './cell.module.css';


const Cell = React.memo((props) => {
  const dispatch = useDispatch();
  const ref = useRef();

  useEffect(() => {
    console.log('Cell render');
    const handleMouseOver = () => {
      dispatch(setCurrentCellParams({
        row: props.row,
        col: props.col,
        color: props.color,
      }));
    }
    ref.current.addEventListener('mouseover', handleMouseOver);
    return () => {
      ref.current.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <li
      ref={ref}
      className={`
        ${[
          styles.cell,
          styles[props.state],
          props.color !== 'none' && styles[props.color],
          props.color !== 'none' && styles.filledCell,
        ].filter(Boolean).join(' ')}
      `}
    >
      { }
    </li>
  );
});

export default Cell;
