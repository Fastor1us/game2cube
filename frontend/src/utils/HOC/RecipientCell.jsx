import React from 'react';
import { useDrop } from 'react-dnd';
import Cell from '../../components/Game/Cell/Cell';
import { useDispatch } from 'react-redux';
import { setCellState } from '../../store/slicers/gameSlicer';
import { getGameState, getGridData } from '../utils';


export default function RecipientCell(props) {
  const dispatch = useDispatch();

  const [{ isOver, isNotAbleToPlace }, dropRef] = useDrop({
    accept: 'cell',
    drop: (item) => {
      // console.log('item', item);
      // console.log('props', props);
      if (isNearCellWithSameColor(getGridData, props.address, item)) {
        return;
      }
      let belong;
      if (item.isInner) {
        // console.log('move from inner');
        belong = getGameState().grid.data
        [item.address.row][item.address.col].belong;
        dispatch(setCellState({
          address: item.address,
          data: {
            color: null,
            sequenceNumber: null,
            belong: null
          }
        }));
      } else {
        // console.log('move from outer');
        const T = getGameState().grid.data.reduce((acc, row) => {
          acc = acc || row.find(cell =>
            cell.color === item.color &&
            cell.sequenceNumber === 1);
          return acc;
        }, null);
        if (T) {
          belong = T.belong === 1 ? 2 : 1;
        } else {
          belong = 1;
        }
      }
      dispatch(setCellState({
        address: props.address,
        data: {
          color: item.color,
          sequenceNumber: 1,
          belong,
        }
      }));
    },
    collect: monitor => {
      const isOver = !!monitor.isOver();
      let isNotAbleToPlace = false;
      if (isOver) {
        const item = monitor.getItem();
        isNotAbleToPlace = isNearCellWithSameColor(
          getGridData, props.address, item);
      }
      return { isOver, isNotAbleToPlace }
    }
  });

  return <Cell {...props} ref={dropRef}
    styles={{
      opacity: isOver ? 0.5 : 1,
    }}
    isBlocked={isNotAbleToPlace}
  />
};


function isNearCellWithSameColor(
  getGridData, currCellCoords, cellData) {
  let check;
  if (cellData.isInner) {
    // console.log('move from inner');
    // console.log('cellData', cellData);
    check = (checkingCell) => {
      if ((checkingCell !== null && checkingCell.belong !== cellData.belong) &&
        checkingCell.color === cellData.color) { return 'true' }
    }
  } else {
    check = (checkingCell) => {
      if (checkingCell.color === cellData.color) { return 'true' }
    }
  }
  const suitableCells = checkAdjucentCells(getGridData, currCellCoords, check);
  if (suitableCells.length > 0) { return true } else { return false }
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
