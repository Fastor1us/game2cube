import React from 'react';
import { useSelector } from 'react-redux';
import { isCompletedSelector } from '../../../store/selectors/gameSelectors';


export default function GameStatus() {
  const isComplited = useSelector(isCompletedSelector);

  return (
    <>
      {!isComplited && <div>Играем...</div>}
      {isComplited && <div>Победа</div>}
    </>
  );
}
