import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import store from '../../store/store.js';
import { setIsWatching } from '../../store/slicers/gameSlicer.js';
import GameStatus from './GameStatus/GameStatus.jsx';
import Engine from './Engine/Engine.jsx';
import Cell from './Cell/Cell.jsx';
import styles from './Game.module.css';
import { gridDataSelector } from '../../store/selectors/gameSelectors.js';


function Game() {
  const ref = useRef();
  const dispatch = useDispatch();

  const fields = useSelector(gridDataSelector);

  const handleMouseDown = useCallback(() => {
    dispatch(setIsWatching(true));
  }, []);
  const handleMouseUp = useCallback(() => {
    dispatch(setIsWatching(false));
  }, []);
  const handleMouseLeave = () => {
    getGameState().isWatching && dispatch(setIsWatching(false));
  }

  useEffect(() => {
    ref.current.addEventListener('mousedown', handleMouseDown);
    ref.current.addEventListener('mouseup', handleMouseUp);
    ref.current.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('mousedown', handleMouseDown);
        ref.current.removeEventListener('mouseup', handleMouseUp);
        ref.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <section className={styles.gameSection}>
      {<Engine />}
      <ul
        ref={ref}
        className={`${[
          styles.gameField,
          styles[`gameGrid${fields.length}`],
        ].join(' ')}`}
      >
        {fields.map((_, row) => {
          return _.map((item, col) => {
            return <Cell key={row + '' + col}
              {...{ row, col }} {...item} />
          });
        })}
      </ul>
      {<GameStatus />}
    </section>
  );
}

export default Game;

function getGameState() {
  return store.getState().game;
}
