import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  isWatchingSelector,
  currCoordsSelector,
} from '../../../store/selectors/gameSelectors';
import { setCellState } from '../../../store/slicers/gameSlicer';


export default function Engine() {
  const dispatch = useDispatch();
  const isWatching = useSelector(isWatchingSelector);
  const currCellCoords = useSelector(currCoordsSelector);

  console.log('engine rerender');

  useEffect(() => {
    if (isWatching) {
      console.log('engine start working');
      // проверыяем было ли движение - смотрим previousCell
      // if (prevCellColor) {
      //   console.log('было движение с захватом цвета');
      //   // если попали в ячейку без цвета, то закрашиваем её
      //   if (!currCellColor) {
      //     // делаем диспатч setCellState, агрументы address и state
      //     const address = {
      //       row: currCellCoords.row,
      //       col: currCellCoords.col
      //     };
      //     const data = {
      //       color: prevCellColor,
      //       state: 'emptyCell',
      //       belong: '0',
      //       extra1: 'none',
      //       extra2: 'none'
      //     }
      //     dispatch(setCellState({ address, data }));
      //     // dispatch(setCellState());
      //     console.log('красим!');
      //   }
      // }
    } else {
      console.log('engine: isWatching === false');
    }
    // }, [isWatching, currCellColor, prevCellColor]);
  }, [isWatching]);
  // если произошёл клик мыши по ячейки поля

  return (<></>);
}



// const cellPattern = {
//   color: 'none',
//   state: 'emptyCell',
//   belong: '0',
//   extra1: 'none',
//   extra2: 'none'
// }


