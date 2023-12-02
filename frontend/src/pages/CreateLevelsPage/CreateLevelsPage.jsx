import React, { useEffect, useState } from 'react';
import Game from '../../components/Game/Game.jsx';
import data from './field.json';
import { useDispatch, useSelector } from 'react-redux';
import { setGridData } from '../../store/slicers/gameSlicer.js';
import GridSizeController
  from '../../components/GridSizeController/GridSizeController.jsx';
import { isAuthSelector } from '../../store/selectors/userSelectors.js';
import Cell from '../../components/Game/Cell/Cell.jsx';
import styles from './CreateLevelsPage.module.css';

const cellPattern = {
  color: null,
  step: false,
  belong: null,
  sequenceNumber: null,
  focus: false
}

const arrMainCellsColors = [
  'blue', 'green', 'gray', 'red', 'purple'
]


export default function CreatingLevelsPage() {
  const dispatch = useDispatch();
  const [gridSize, setGridSize] = useState(4);
  const [isCreatingMode, setIsCreatingMode] = useState(true);

  const isAuth = useSelector(isAuthSelector);

  useEffect(() => {
    // const { fields } = data;
    const fields = Array.from(Array(gridSize),
      () => Array(gridSize).fill(cellPattern));
    dispatch(setGridData(fields));
  }, [gridSize]);

  return (
    <>
      <h1>Страница создания уровней</h1>
      {!isAuth && <p>
        Что бы сохранить уровень вы должны быть авторизированны
      </p>}
      {isAuth && <p>
        Для сохранения уровеня, после его создания, уровень необходимо пройти,
        тогда кнопка "сохранить" станет активна
      </p>}
      <ul className={styles.creatingCellsList}>
        {arrMainCellsColors.slice(0, gridSize - 1).map((strColor, index) => {
          return <Cell key={index} color={strColor}
            {...{ isCreatingMode, isCellOutsideGame: true }} />
        })}
      </ul>
      <section style={{ display: 'flex', flexDirection: 'column' }}>
        <GridSizeController {...{ gridSize, setGridSize }} />
        <button>
          кнопка рефреша уровня
        </button>
        <button onClick={() => setIsCreatingMode(!isCreatingMode)}>
          включение/выключение режима прохождения уровня
        </button>
        <button disabled>
          кнопка сохранения уровня
        </button>
      </section>
      <Game isCreatingMode={isCreatingMode} />
    </>
  );
}
