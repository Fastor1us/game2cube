import React, { useEffect, useState } from 'react';
import Game from '../../components/Game/Game.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { setCellState, setGridData } from '../../store/slicers/gameSlicer.js';
import GridSizeController
  from '../../components/GridSizeController/GridSizeController.jsx';
import { isAuthSelector } from '../../store/selectors/userSelectors.js';
import { gridDataSelector } from '../../store/selectors/gameSelectors.js';
import OuterDonorCell from '../../utils/HOC/OuterDonorCell.jsx';
import InnerDonorCell from '../../utils/HOC/InnerDonorCell.jsx';
import RecipientCell from '../../utils/HOC/RecipientCell.jsx';
import styles from './CreateLevelsPage.module.css';
import { NavLink } from 'react-router-dom';
import { useDrop } from 'react-dnd';


const cellPattern = {
  color: null,
  step: false,
  belong: null,
  sequenceNumber: null,
  focus: false
}

const arrCellsColors =
  ['blue', 'green', 'gray', 'red', 'purple', 'yellow'];


export default function CreatingLevelsPage() {
  const dispatch = useDispatch();
  const [gridSize, setGridSize] = useState(4);
  const [isCreatingMode, setIsCreatingMode] = useState(true);

  const isAuth = useSelector(isAuthSelector);

  const fields = useSelector(gridDataSelector);

  useEffect(() => {
    const fields = Array.from(Array(gridSize),
      () => Array(gridSize).fill(cellPattern));
    dispatch(setGridData(fields));
  }, [gridSize]);

  const [, dropRef] = useDrop({
    accept: 'cell',
    drop: (item) => {
      if (item.isInner) {
        dispatch(setCellState({
          address: item.address,
          data: {
            color: null,
            sequenceNumber: null,
          }
        }));
      }
    },
  });

  return (
    <section className={styles.container} ref={dropRef}>
      <h1>Страница создания уровней</h1>
      {!isAuth && (<>
        <p>
          Что бы сохранить уровень вы должны быть авторизированны.
        </p>
        <p>
          <NavLink to='/login'>Войти</NavLink>
        </p>
      </>)}
      {isAuth && <p>
        Для сохранения уровеня, после его создания, уровень необходимо пройти,
        тогда кнопка "сохранить" станет активна
      </p>}
      <ul className={styles.creatingCellsList}>
        {arrCellsColors.slice(0, gridSize).map((strColor, index) => {
          return <OuterDonorCell
            key={index} color={strColor} sequenceNumber={1}
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

      {isCreatingMode &&
        <ul
          className={`${[
            styles.gameField,
            styles[`gameGrid${fields.length}`],
          ].join(' ')}`}
        >
          {fields.map((_, row) => {
            return _.map((item, col) => {
              const Cell = item.sequenceNumber ?
                InnerDonorCell : RecipientCell;
              return <Cell
                {...item}
                key={row + '' + col}
                address={{ row, col }}
                isCreatingMode={true}
              />
            });
          })}
        </ul>
      }

      {!isCreatingMode &&
        <Game isCreatingMode={isCreatingMode} />
      }
    </section>
  );
}
