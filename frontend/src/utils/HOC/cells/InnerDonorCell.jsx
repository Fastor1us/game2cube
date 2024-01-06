import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import Cell from '../../../components/Game/Cell/Cell';

//TODO
// доабвить возможность менять цветные ячейки местами

export default function InnerDonorCell(props) {
  const ref = useRef(null);

  const [{ isDragging }, dragRef] = useDrag({
    type: 'cell',
    item: {
      color: props.color,
      belong: props.belong,
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

  const [{ isOver }, dropRef] = useDrop({
    accept: 'cell',
    drop: (item) => {

    },
    collect: monitor => ({
      // collect: (monitor) => ({
      //   isOver: monitor.isOver(),
      // })
    })
  });

  dragRef(dropRef(ref));

  return <Cell {...props} ref={ref}
    styles={{
      opacity: isDragging ? 0.5 : 1,
    }}
  />
};
