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
