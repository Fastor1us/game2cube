import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setIsCompleted,
  setIsWatching,
  setLinkedColors
} from '../../store/slicers/gameSlicer.js';
import GameStatus from './GameStatus/GameStatus.jsx';
import Engine from './Engine/Engine.jsx';
import Cell from './Cell/Cell.jsx';
import styles from './Game.module.css';
import { currCoordsSelector, gridDataSelector } from '../../store/selectors/gameSelectors.js';
import { getGameState, getGridData } from '../../utils/utils.js';


export default function Game() {
  const ref = useRef();
  const dispatch = useDispatch();
  const currCellCoords = useSelector(currCoordsSelector);
  const fields = useSelector(gridDataSelector);

  const handleMouseDown = useCallback((e) => {
    if (
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) &&
      currCellCoords?.row !== null &&
      getGridData()[currCellCoords.row][currCellCoords?.col].color !== null
    ) {
      e.preventDefault();
    }
    dispatch(setIsWatching(true));
  }, [currCellCoords]);
  const handleMouseUp = useCallback(() => {
    dispatch(setIsWatching(false));
  }, []);
  const handleMouseLeave = () => {
    getGameState().isWatching && dispatch(setIsWatching(false));
  }

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) {
      ref.current.addEventListener('mousedown', handleMouseDown);
      ref.current.addEventListener('mouseup', handleMouseUp);
      ref.current.addEventListener('mouseleave', handleMouseLeave);
    } else {
      ref.current.addEventListener('touchstart', handleMouseDown);
      document.addEventListener('touchend', handleMouseUp);
      document.addEventListener('touchcancel', handleMouseLeave);
    }
    return () => {
      if (!isMobile) {
        if (ref.current) {
          ref.current.removeEventListener('mousedown', handleMouseDown);
          ref.current.removeEventListener('mouseup', handleMouseUp);
          ref.current.removeEventListener('mouseleave', handleMouseLeave);
        }
      } else {
        ref.current &&
          ref.current.removeEventListener('touchstart', handleMouseDown);
        document.removeEventListener('touchend', handleMouseUp);
        document.removeEventListener('touchcancel', handleMouseLeave);
      }
    }
  }, []);

  useEffect(() => {
    dispatch(setIsCompleted(false));
    dispatch(setLinkedColors({}));
    return () => {
      dispatch(setIsCompleted(false));
      dispatch(setLinkedColors({}));
    }
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
            return <Cell
              key={row + '' + col}
              {...{ row, col }}
              {...item}
              size={fields.length}
            />
          });
        })}
      </ul>
      {<GameStatus />}
    </section>
  );
}
