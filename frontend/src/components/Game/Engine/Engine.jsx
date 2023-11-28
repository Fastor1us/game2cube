import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  isWatchingSelector,
  currCoordsSelector,
  prevCoordsSelector,
  linkedColorsSelector,
  isCompletedSelector
} from '../../../store/selectors/gameSelectors';
import {
  setIsWatching,
  setCellState,
  setLinkedColors,
  setIsComplited,
  setResetStateToInitial,
  setTest
} from '../../../store/slicers/gameSlicer';
import {
  checkMoveOverload,
  clearOverload,
  findFocusedCellCoords,
  findSteppedCellCoords,
  setBelongForLinkedCells,
  findShortestPathForLinkingColors
} from './engine-functions';
import store from '../../../store/store';


// TODO патерн будем получать от сервера
const cellPattern = {
  color: null,
  step: false,
  belong: null,
  sequenceNumber: null,
  focus: false
}


export default function Engine() {
  const dispatch = useDispatch();
  const isWatching = useSelector(isWatchingSelector);
  const currCellCoords = useSelector(currCoordsSelector);
  const prevCellCoords = useSelector(prevCoordsSelector);
  const linkedColors = useSelector(linkedColorsSelector);
  const isComplited = useSelector(isCompletedSelector);

  // console.log('engine rerender');

  // снимаем фокус с ячейки если вывели мышку за поле удерживая,
  // а затем отпустили ЛКМ
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
    if (isComplited) {
      return;
    }
    if (prevCellCoords.row !== null && isWatching) {
      const prevCellData = getGridData()[prevCellCoords.row][prevCellCoords.col];
      dispatch(setCellState({
        address: prevCellCoords, data: { ...prevCellData, focus: false },
      }));
    }
  }, [prevCellCoords, isWatching, isComplited]);

  // следим за прохождением уровня
  useEffect(() => {
    if (Object.keys(linkedColors).length === 0) {
      return;
    }
    for (let key in linkedColors) {
      if (linkedColors[key] === false) {
        return;
      }
    }
    if (
      !getGridData().every((row) => {
        return row.every((cell) => {
          return cell.color && (cell.sequenceNumber === 1 || !cell.step);
        });
      })
    ) {
      return;
    }
    dispatch(setIsComplited(true));
  }, [linkedColors])


  // ================================ основная логика ================================
  useEffect(() => {
    if (isComplited) {
      return;
    }

    if (!isWatching) {
      return;
    }

    let currCell = Object.assign({},
      getGridData()[currCellCoords.row][currCellCoords.col]);

    // выходим, если клик пришелся по пустой ячейке
    if (!currCell.color && prevCellCoords.row === null) {
      dispatch(setIsWatching(false));
      return;
    }

    // после клика по полю, но до движения мыши очищаем все ячейки того же цвета
    // с тем же belong, или с belong === 3 в случае соединённого цвета
    if (prevCellCoords.row === null) {
      // dispatch(setTest(2));
      if (currCell.belong !== 3) {
        if (getGameState().linkedColors[currCell.color]) {
          clearOverload(getGridData, dispatch, currCell.color, 3, 1);
          dispatch(setLinkedColors({ [currCell.color]: false }));
        } else {
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
      } else {
        // TODO
        // логика разбития соединённого цвета
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        // заглушка
        clearOverload(getGridData, dispatch, currCell.color, 3, 1);
        dispatch(setLinkedColors({ [currCell.color]: false }));
        dispatch(setIsWatching(false));
      }
    }


    // ===============================================================================
    if (prevCellCoords.row !== null) {
      const prevCell = getGridData()[prevCellCoords.row][prevCellCoords.col];
      // если подвинулись с цветной ячейки на главную другого цвета, то
      // выключаем isWatch = false, выходим
      if (
        currCell.color !== null &&
        currCell.color !== prevCell.color &&
        currCell.sequenceNumber === 1
      ) {
        dispatch(setIsWatching(false));
        return;
      }

      // если подвинулись с цветной ячейки на ячейку другого цвета, то
      // разрываем ячейку другого цвета. Два варианта: для соединённого и не соед. цветов
      if (
        currCell.color !== null &&
        currCell.color !== prevCell.color &&
        currCell.sequenceNumber > 1
      ) {
        // попали в соединённый цвет
        if (getGameState().linkedColors[currCell.color]) {
          clearOverload(getGridData, dispatch, currCell.color, 3, 1);
          dispatch(setLinkedColors({ [currCell.color]: false }));
        } else {
          // попали в не соединённый цвет  
          clearOverload(getGridData, dispatch, currCell.color,
            currCell.belong, currCell.sequenceNumber - 1);
          // делаем у отрезанного хвоста последнюю ячейку step (если не главная)
          if (currCell.sequenceNumber - 1 > 1) {
            getGridData().find((row, rowIndex) => {
              return row.find((cell, colIndex) => {
                if (
                  cell.color === currCell.color &&
                  cell.sequenceNumber === currCell.sequenceNumber - 1
                ) {
                  dispatch(setCellState({
                    address: { row: rowIndex, col: colIndex }, data: { step: true }
                  }));
                  return true;
                }
              })
            })
          }
        }
        // убираем цвет текущей ячейки для работы логики ниже (по покраске)
        currCell.color = null;
      }

      // если подвинулись с цветной ячейки на цветную с другим belong, но такого же цвета, то
      // выключаем isWatch = false, убираем лишние "хвосты", устанавливаем belong = 3, 
      // sequenceNumber = 999, для цветных ячеек того же цвета, у которых sequenceNumber > 1
      if (
        currCell.color === prevCell.color &&
        currCell.belong !== prevCell.belong
      ) {
        // запускаем функцию "нахождение наикрачайшего пути"
        // console.log('запуск нахождения наикрачайшего пути');
        const overload = findShortestPathForLinkingColors(getGridData, currCell.color);
        clearOverload(getGridData, dispatch, currCell.color, 1, overload[1]);
        clearOverload(getGridData, dispatch, currCell.color, 2, overload[2]);
        const isSteppedCell = findSteppedCellCoords(getGridData(), currCell.color);
        isSteppedCell && dispatch(setCellState({
          address: isSteppedCell,
          data: { step: false },
        }));
        dispatch(setLinkedColors({ [currCell.color]: true }));
        setBelongForLinkedCells(getGridData, dispatch, currCell.color);
        dispatch(setIsWatching(false));
        return;
      }

      // убираем возмонжость ходить наискосок с цветной на пустую
      // TODO
      // сценарий с цветной на свой (другой belong)/другой цвет наискосок
      // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      if (currCell.color) {
        const overload = checkMoveOverload(getGridData, currCellCoords, prevCell, 1);
        if (!overload) {
          dispatch(setIsWatching(false));
          return;
        }
      }

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

      // ===============================================================================
      // ============================  ПОКРАСКА ЯЧЕЙКИ =================================
      // ===============================================================================
      // если ячейка куда попали без цвета
      if (!currCell.color) {
        // console.log('ячейка куда попали без цвета');
        // перед покраской смотрим нет ли соседних ячеек такого же цвета и пренадлежности
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
        // -------------------------------------------------------------------------------
      }
    }
  }, [isWatching, currCellCoords, prevCellCoords, isComplited]);

  // Блок размонтирования. Сбрасываем изменяемые состояния
  useEffect(() => {
    return () => {
      dispatch(setResetStateToInitial());
    }
  }, []);

  return (<></>);
}

function getGameState() {
  return store.getState().game;
}

function getGridData() {
  return store.getState().game.grid.data;
}

// TODO:
// вынести check в отдельную функцию и передавать её в качестве колбека?
// оставить основную логику на проверку хода в четырёх нарправлениях
// добавить больше настроек для гибкости