import React, { useEffect, useState } from 'react';
import { useDrag } from 'react-dnd';
import Cell from '../../../components/Game/Cell/Cell';
import { useSelector } from 'react-redux';
import { gridDataSelector } from '../../../store/selectors/gameSelectors';


export default function OuterDonorCell(props) {
  const gridData = useSelector(gridDataSelector);

  const [isTwoColorsPresent, setIsTwoColorsPresent] = useState(false);

  useEffect(() => {
    setIsTwoColorsPresent(gridData.reduce((acc, row) => {
      row.forEach(item => {
        if (item.color === props.color && item.sequenceNumber === 1) {
          acc = acc + 1
        }
      })
      return acc
    }, 0) === 2);
  }, [gridData]);


  const [{ isDragging }, dragRef] = useDrag({
    type: 'cell',
    item: {
      color: props.color,
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    }),
  });

  return <Cell {...props} ref={isTwoColorsPresent ? null : dragRef}
    styles={{
      opacity: isTwoColorsPresent ? .5 : (isDragging ? .75 : 1),
    }}
  />
};
