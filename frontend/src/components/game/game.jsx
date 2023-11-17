import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import store from '../../store/store';
import { setIsWatching, setPaintColor } from '../../store/slicers/gameSlicer';
import data from './field.json';
import Cell from './cell/cell.jsx';
import styles from './game.module.css';


export default function Game() {
  const ref = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    const getReduxState = () => {
      return store.getState().game;
    }
    const handleMouseDown = () => {
      dispatch(setIsWatching(true));
      dispatch(setPaintColor(getReduxState().currentCell.color));
    }
    const handleMouseUp = () => {
      dispatch(setIsWatching(false));
      dispatch(setPaintColor(null));
    }
    const handleMouseLeave = () => {
      getReduxState().isWatching && dispatch(setIsWatching(false));
      dispatch(setPaintColor(null));
    }
    ref.current.addEventListener('mousedown', handleMouseDown);
    ref.current.addEventListener('mouseup', handleMouseUp);
    ref.current.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      ref.current.removeEventListener('mousedown', handleMouseDown);
      ref.current.removeEventListener('mouseup', handleMouseUp);
      ref.current.addEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // TODO: получаем дату с сервера с помощью CreateApi
  const { fields } = data;

  // записываем всю дату в Redux
  // TODO

  // отрисовывать поле будем через маппинг по редакс дате
  // при изменении Cell в Redux перерисовываем измененную ячейку
  // без перерендера всех ячеек (обёренуты в HOC React.memo)
  // TODO

  return (
    <section className={styles.gameSection}>
      <ul
        ref={ref}
        className={styles.gameField}
      >
        {fields.map((_, x) => {
          return _.map((item, y) => {
            const row = x + 1;
            const col = y + 1;
            return <Cell key={row + col}
              {...{ row, col }} {...item} />
          })
        })}
      </ul>
    </section>
  );
}
