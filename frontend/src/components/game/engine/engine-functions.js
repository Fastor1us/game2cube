import { setCellState } from '../../../store/slicers/gameSlicer.js';

// TODO: cellPattern
const cellPattern = {
  color: null,
  step: false,
  belong: null,
  sequenceNumber: null,
  focus: false
}


// функция смотрим четыре напрвления - сверху, справа, снизу, слева от currCellCoords
// проверяет на соответствие цвета, belong и sequenceNumber < sequenceNumberWillBe
export function checkMoveOverload(
  getGridData, currCellCoords, cellData, minOverloadSize = 2
) {
  // функция должна вернуть минимальный sequenceNumber если их больше одного рядом
  // с currCell и вернуть false если найдена только одно совпадение
  function check(checkingCell) {
    if (checkingCell.color === cellData.color &&
      checkingCell.belong === cellData.belong &&
      checkingCell.sequenceNumber < cellData.sequenceNumber + 1
    ) {
      return checkingCell.sequenceNumber;
    }
  }
  const suitableCells = checkAdjucentCells(getGridData, currCellCoords, check);
  if (suitableCells.length >= minOverloadSize) {
    return suitableCells.sort((a, b) => a - b)[0];
  } else { return false }
}

// цветная входит в главную ячейку, очищаем "хвосты" у вливающегося belong'a
// export function checkMainCellEntryOveload(getGridData, currCellCoords, cellData) {
//   function check(checkingCell) {
//     if (checkingCell.color === cellData.color) {
//       return checkingCell.sequenceNumber;
//     }
//   }
//   const suitableCells = checkAdjucentCells(getGridData, currCellCoords, check);
//   if (suitableCells.length > 1) {
//     return suitableCells.sort((a, b) => a - b)[0];
//   } else { return false }
// }

// находим наикрачайший путь для соединения двух концов одного цвета
// возвращает объект вида {belong: sequenceNumber}
export function findShortestPathForLinkingColors(getGridData, color) {
  // находим все ячейки данного цвета, кладем в двумерный массив
  // [[belong === 1], [belong ===2]]
  const gridData = getGridData();
  const colorBelongsData = gridData
    .reduce((acc, row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell.color === color) {
          acc[cell.belong - 1].push({
            sequenceNumber: cell.sequenceNumber,
            row: rowIndex,
            col: colIndex
          });
        }
      });
      return acc;
    }, [[], []])
    .map(i => i.sort((a, b) => a.sequenceNumber - b.sequenceNumber));
  // теперь решаем по какому belong'у будем двигаться в поисках наикрачайшего пути
  const shortestBelong = colorBelongsData[0].length <= colorBelongsData[1].length ? 0 : 1;
  console.log(colorBelongsData[shortestBelong]);
  function check(checkingCell) {
    // console.log('check');
    // console.log(checkingCell);
    if (checkingCell.color === color && checkingCell.belong !== shortestBelong + 1) {
      return checkingCell.sequenceNumber;
    }
  }
  const encounters = [];
  for (let i = 0; i < colorBelongsData[shortestBelong].length; i++) {
    const checkingCellCoords = {
      row: colorBelongsData[shortestBelong][i].row,
      col: colorBelongsData[shortestBelong][i].col
    };
    const encounter = checkAdjucentCells(getGridData, checkingCellCoords, check);
    if (encounter.length > 0) {
      encounters.push({
        [shortestBelong + 1]:
          gridData[checkingCellCoords.row][checkingCellCoords.col].sequenceNumber,
        [shortestBelong === 0 ? 2 : 1]: encounter.sort((a, b) => a - b)[0]
      });
    }
  }
  console.log(encounters);
  // encounters - массив из двух объектов вида: {belong: sequenceNumber}
  const indexMinPath = encounters.reduce((minIndex, item, currIndex, array) => {
    const currentSum = item[1] + item[2];
    const minSum = array[minIndex][1] + array[minIndex][2];
    return currentSum < minSum ? currIndex : minIndex;
  }, 0);
  console.log(indexMinPath);
  console.log(encounters[indexMinPath]);
  return encounters[indexMinPath];
}

function checkAdjucentCells(getGridData, currCellCoords, check) {
  const suitableCells = [];
  const gridData = getGridData();
  const gridSize = gridData.length;
  const { row, col } = currCellCoords;
  // смотрим вверх
  suitableCells.push(row - 1 >= 0 && check(gridData[row - 1][col]));
  // смотрим вправо
  suitableCells.push(col + 1 < gridSize && check(gridData[row][col + 1]));
  // смотрим вниз
  suitableCells.push(row + 1 < gridSize && check(gridData[row + 1][col]));
  // смотрим влево
  suitableCells.push(col - 1 >= 0 && check(gridData[row][col - 1]));
  return suitableCells.filter(Boolean);
}


export function clearOverload(getGridData, dispatch, color, belong, sequenceNumber) {
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

export function setBelongForLinkedCells(getGridData, dispatch, color) {
  getGridData().forEach((row, rowIndex) => row.forEach((cell, colIndex) => {
    if (cell.color === color && cell.sequenceNumber > 1) {
      dispatch(setCellState({
        address: { row: rowIndex, col: colIndex },
        data: { ...cellPattern, sequenceNumber: 999, color: cell.color, belong: 3 }
      }));
    }
  }));
}

export function findFocusedCellCoords(grid) {
  return findSpecificCellCoords(grid, 'focus');
}

export function findSteppedCellCoords(grid, color) {
  return findSpecificCellCoords(grid, 'step', color);
}

function findSpecificCellCoords(grid, property, color = false) {
  let result = null;
  grid.some((row, rowIndex) => {
    return row.some((cell, colIndex) => {
      if (color && cell.color && cell.color !== color) {
        return false;
      }
      if (cell[property] === true) {
        result = { row: rowIndex, col: colIndex };
        return true;
      } else { return false }
    });
  });
  return result;
}
