import React from 'react';
import { useDrop } from 'react-dnd';
import Cell from '../../components/Game/Cell/Cell';
import { useDispatch } from 'react-redux';
import { setCellState } from '../../store/slicers/gameSlicer';
import { getGameState } from '../utils';


export default function RecipientCell(props) {
  const dispatch = useDispatch();

  const [{ isOver }, dropRef] = useDrop({
    accept: 'cell',
    drop: (item) => {
      let belong;
      if (item.isInner) {
        console.log('isInner');
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
    collect: monitor => ({
      isOver: !!monitor.isOver()
    })
  });

  return <Cell {...props} ref={dropRef}
    styles={{
      opacity: isOver ? 0.5 : 1,
    }}
  />
};
