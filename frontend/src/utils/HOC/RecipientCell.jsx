import React from 'react';
import { useDrop } from 'react-dnd';
import Cell from '../../components/Game/Cell/Cell';
import { useDispatch } from 'react-redux';
import { setCellState } from '../../store/slicers/gameSlicer';


export default function RecipientCell(props) {
  const dispatch = useDispatch();

  const [{ isOver }, dropRef] = useDrop({
    accept: 'cell',
    drop: (item) => {
      if (item.isInner) {
        console.log('isInner');
        dispatch(setCellState({
          address: item.address,
          data: {
            color: null,
            sequenceNumber: null,
          }
        }));
      }
      dispatch(setCellState({
        address: props.address,
        data: {
          color: item.color,
          sequenceNumber: 1,
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
