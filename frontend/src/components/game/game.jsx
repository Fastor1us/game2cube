import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import store from '../../store/store';
import {
  setGridData,
  setIsWatching,
  setCellState
} from '../../store/slicers/gameSlicer';
import data from './field.json';
import Engine from './engine/engine.jsx';
import Cell from './cell/cell.jsx';
import styles from './game.module.css';


export default function Game() {
  const ref = useRef();
  const dispatch = useDispatch();

  // сейчас происходит двойной перерендер т.к.
  // сперва читаем пустой массив из state.game.grid.data
  // и только затем заполняем его в useEffect
  // TODO переделаю когда буду заниматься сервером
  const fields = useSelector(state => state.game.grid.data);

  useEffect(() => {
    // TODO: Сейчас данные берем из .JSON, но
    // в дальнейшем будем получать от сервера с помощью CreateApi.
    // Записываем данные о поле в redux
    const { fields } = data;
    dispatch(setGridData(fields));

    const handleMouseDown = () => {
      dispatch(setIsWatching(true));
    }
    const handleMouseUp = () => {
      dispatch(setIsWatching(false));
      const currCoords = getReduxState().currCoords;
      dispatch(setCellState({
        address: { row: currCoords.row, col: currCoords.col },
        data: { focus: false },
      }))
    }
    const handleMouseLeave = () => {
      getReduxState().isWatching && dispatch(setIsWatching(false));
    }

    ref.current.addEventListener('mousedown', handleMouseDown);
    ref.current.addEventListener('mouseup', handleMouseUp);
    ref.current.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      ref.current.removeEventListener('mousedown', handleMouseDown);
      ref.current.removeEventListener('mouseup', handleMouseUp);
      ref.current.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section className={styles.gameSection}>
      <Engine />
      <ul
        ref={ref}
        className={`${[
          styles.gameField,
          styles[`gameGrid${fields.length}`],
        ].join(' ')}`}
      >
        {fields.map((_, row) => {
          return _.map((item, col) => {
            return <Cell key={row + col}
              {...{ row, col }} {...item} />
          })
        })}
      </ul>
    </section>
  );
}

function getReduxState() {
  return store.getState().game;
}
