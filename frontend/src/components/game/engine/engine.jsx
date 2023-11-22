import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  isWatchingSelector,
  currCoordsSelector,
  prevCoordsSelector
} from '../../../store/selectors/gameSelectors';
import {
  setIsWatching,
  setCellState,
  setPrevCellCoords,
  setTest
} from '../../../store/slicers/gameSlicer';
import store from '../../../store/store';


// TODO патерн будем получать от сервера
const cellPattern = {
  color: null,
  step: false,
  belong: '0',
  sequenceNumber: null,
  focus: false
}


export default function Engine() {
  const dispatch = useDispatch();
  const isWatching = useSelector(isWatchingSelector);
  const currCellCoords = useSelector(currCoordsSelector);
  const prevCellCoords = useSelector(prevCoordsSelector);

  // console.log('engine rerender');

  // снимаем фокус с ячейки если вывели мышку за поле удерживая,
  // а затем отпустив ЛКМ
  useEffect(() => {
    const handleMouseUp = () => {
      if (getGameState().isFocus) {
        // dispatch(setTest(8));
        dispatch(setCellState({
          address: findFocusedCellCoords(getGridData()),
          data: { focus: false },
        }));
      }
    };
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // выключаем фокус с prevCell
  useEffect(() => {
    if (prevCellCoords.row !== null) {
      const prevCellData = getGridData()[prevCellCoords.row][prevCellCoords.col];
      dispatch(setCellState({
        address: prevCellCoords, data: { ...prevCellData, focus: false },
      }));
    }
  }, [prevCellCoords]);


  // основная логика
  useEffect(() => {
    if (!isWatching) {
      return;
    }

    const currCell = getGridData()[currCellCoords.row][currCellCoords.col];

    // выходим, если клик пришелся по пустой ячейке
    if (!currCell.color && prevCellCoords.row === null) {
      dispatch(setIsWatching(false));
      return;
    }

    // после клика по полю, но до движения мыши
    // очищаем все ячейки того же цвета с тем же belong 
    if (prevCellCoords.row === null) {
      // dispatch(setTest(2));
      clearOverload(getGridData, dispatch, currCell.color, currCell.belong,
        currCell.sequenceNumber);
      let data = { focus: true };
      if (currCell.sequenceNumber > 1) {
        data.step = true;
      }
      // dispatch(setTest(3));
      dispatch(setCellState({
        address: currCellCoords, data: data
      }));
    }

    // если след и пред ячейка разных цветов, то выключаем
    // if (prevCellCoords.row !== null && currCell.color !== prevCell.color) {
    //   console.log('yes')
    //   dispatch(setIsWatching(false));
    //   return;
    // }

    // когда было движение мыши, в этом блоке 2 сценария
    if (prevCellCoords.row !== null) {
      const prevCell = getGridData()[prevCellCoords.row][prevCellCoords.col];
      // 1.
      // убираем возмонжость ходить наискосок
      const overload = checkMoveOverload(getGridData, currCellCoords, prevCell, 1);
      if (!overload) {
        dispatch(setIsWatching(false));
        return;
      }
      // 2.
      // если двигались "назад" с того же цвета и принадлежности, то чистим пред. ячейку
      if (currCell.color === prevCell.color && currCell.belong === prevCell.belong) {
        // dispatch(setTest(1));
        dispatch(setCellState({
          address: prevCellCoords, data: cellPattern
        }));
        if (currCell.sequenceNumber > 1) {
          // dispatch(setTest(9));
          dispatch(setCellState({
            address: currCellCoords, data: { step: true, focus: true }
          }));
        }
      }
    }


    // после клика по цветной ячейки и движения мыши
    if (prevCellCoords.row !== null) {
      // если двигались с "цветной" ячейки
      const prevCell = getGridData()[prevCellCoords.row][prevCellCoords.col];
      // если ячейка куда попали без цвета
      if (!currCell.color) {
        // перед покраской смотрим нет ли сосодних ячеек такого же цвета и пренадлежности
        // если нет, то просто красим
        // смотрим четыре напрвления - сверху, справа, снизу, слева
        // находим минимальный sequenceNumber, след ячейка будет sequenceNumber + 1
        // перед тем как её покрасить очищаем все ячейки на поле того же цвета,
        // принадлежности и sequenceNumber > чем текущий sequenceNumber
        // затем красим, но не забываем обновить sequenceNumber
        // checkMoveOverload(getGridData, currCellCoords, prevCell)
        // функция должна вернуть минимальный sequenceNumber если их больше одного рядом
        // с currCell и вернуть false если найдена только одно совподение

        // при перегрузке очищаем все ячейки того же color и belong, но
        // с sequenceNumber выше переданного
        const overload = checkMoveOverload(getGridData, currCellCoords, prevCell);
        // 
        if (overload) {
          clearOverload(getGridData, dispatch, prevCell.color, prevCell.belong, overload);
        }
        const nextSequenceNumber = overload ? overload + 1 : prevCell.sequenceNumber + 1;
        // делаем предыдущую ячейку нормального размера
        if (!overload && prevCell.sequenceNumber > 1) {
          // dispatch(setTest(4));
          dispatch(setCellState({
            address: prevCellCoords, data: { step: false, }
          }));
        }
        // красим след. ячейку с размером "шаг" 
        // dispatch(setTest(5));
        dispatch(setCellState({
          address: currCellCoords,
          data: { ...prevCell, step: true, sequenceNumber: nextSequenceNumber, focus: true }
        }));
      } else {
        // после клика по цветной ячейки и движения мыши
        // если попали по цветной ячейке
        // -------------------------------------------------------------------------------
        // ВАЖНО! выше в коде уже реализован функционал: (поиск по setTest(1)) -----------
        // если двигались "назад" с того же цвета и принадлежности, то чистим пред. ячейку
        // -------------------------------------------------------------------------------
      }

    }
  }, [isWatching, currCellCoords, prevCellCoords]);

  return (<></>);
}

function getGameState() {
  return store.getState().game;
}

function getGridData() {
  return store.getState().game.grid.data;
}

function findFocusedCellCoords(grid) {
  let result = null;
  grid.some((row, rowIndex) => {
    return row.some((cell, colIndex) => {
      if (cell.focus === true) {
        result = { row: rowIndex, col: colIndex };
        return true;
      } else { return false }
    });
  });
  return result;
}

function isNextMoveNearFocusedCell(focusedCellCoords, currCellCoords) {
  if (
    (
      currCellCoords.row === focusedCellCoords.row &&
      currCellCoords.col === focusedCellCoords.col + 1
    ) || (
      currCellCoords.row === focusedCellCoords.row &&
      currCellCoords.col === focusedCellCoords.col - 1
    ) || (
      currCellCoords.row === focusedCellCoords.row + 1 &&
      currCellCoords.col === focusedCellCoords.col
    ) || (
      currCellCoords.row === focusedCellCoords.row - 1 &&
      currCellCoords.col === focusedCellCoords.col
    )
  ) {
    return true;
  } else {
    return false;
  }
}

function checkMoveOverload(getGridData, currCellCoords, prevCell, minOverloadSize = 2) {
  // функция должна вернуть минимальный sequenceNumber если их больше одного рядом
  // с currCell и вернуть false если найдена только одно совподение
  const gridData = getGridData();
  const gridSize = gridData.length;
  const { row, col } = currCellCoords;
  const currColor = prevCell.color;
  const currBelong = prevCell.belong;
  const sequenceNumberWillBe = prevCell.sequenceNumber + 1;
  const suitableCells = [];
  function check(checkingCell) {
    if (checkingCell.color === currColor &&
      checkingCell.belong === currBelong &&
      checkingCell.sequenceNumber < sequenceNumberWillBe
    ) {
      suitableCells.push(checkingCell.sequenceNumber);
    }
  }
  // смотрим вверх
  row - 1 >= 0 && check(gridData[row - 1][col]);
  // смотрим вправо
  col + 1 !== gridSize && check(gridData[row][col + 1]);
  // смотрим вниз
  row + 1 !== gridSize && check(gridData[row + 1][col]);
  // смотрим влево
  col - 1 >= 0 && check(gridData[row][col - 1]);

  if (suitableCells.length >= minOverloadSize) {
    return suitableCells.sort((a, b) => a - b)[0];
  } else { return false }
}

function clearOverload(getGridData, dispatch, color, belong, sequenceNumber) {
  getGridData().forEach((row, rowIndex) => row.forEach((cell, colIndex) => {
    if (
      cell.color === color &&
      cell.belong === belong &&
      cell.sequenceNumber > sequenceNumber
    ) {
      // dispatch(setTest(7));
      dispatch(setCellState({
        address: { row: rowIndex, col: colIndex }, data: cellPattern
      }));
    }
  }));
}
