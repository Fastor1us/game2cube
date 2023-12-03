import React, { useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';
import Cell from '../../components/Game/Cell/Cell';


export default function InnerDonorCell(props) {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'cell',
    item: {
      color: props.color,
      address: {
        row: props.address.row,
        col: props.address.col
      },
      isInner: true
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    }),
  });

  return <Cell {...props} ref={dragRef}
    styles={{
      opacity: isDragging ? .75 : 1,
    }}
  />
};
