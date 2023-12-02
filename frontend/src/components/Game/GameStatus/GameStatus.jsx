import React from 'react';
import { useSelector } from 'react-redux';
import { isCompletedSelector } from '../../../store/selectors/gameSelectors';


export default function GameStatus() {
  const isCompleted = useSelector(isCompletedSelector);

  return (
    <>
      {!isCompleted && <div>Играем...</div>}
      {isCompleted && <div>Победа</div>}
    </>
  );
}
