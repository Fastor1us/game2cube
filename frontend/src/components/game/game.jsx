import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import store from '../../store/store.js';
import {
  setGridData,
  setIsWatching,
  setCellState
} from '../../store/slicers/gameSlicer.js';
import data from './field.json';
import GameStatus from './GameStatus/GameStatus.jsx';
import Engine from './Engine/Engine.jsx';
import Cell from './Cell/Cell.jsx';
import styles from './Game.module.css';


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
      // const currCoords = getGameState().currCoords;
      // dispatch(setCellState({
      //   address: { row: currCoords.row, col: currCoords.col },
      //   data: { focus: false },
      // }));
    }
    const handleMouseLeave = () => {
      getGameState().isWatching && dispatch(setIsWatching(false));
    }

    ref.current.addEventListener('mousedown', handleMouseDown);
    ref.current.addEventListener('mouseup', handleMouseUp);
    ref.current.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      ref.current && ref.current.removeEventListener('mousedown', handleMouseDown);
      ref.current && ref.current.removeEventListener('mouseup', handleMouseUp);
      ref.current && ref.current.removeEventListener('mouseleave', handleMouseLeave);
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
      <GameStatus />
    </section>
  );
}

function getGameState() {
  return store.getState().game;
}
