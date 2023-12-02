import React, { useEffect } from 'react';

import Game from '../../components/Game/Game.jsx';
import data from './field.json';
import { useDispatch } from 'react-redux';
import { setGridData } from '../../store/slicers/gameSlicer.js';


export default function HomePage() {
  const dispatch = useDispatch();

  useEffect(() => {
    const { fields } = data;
    dispatch(setGridData(fields));
  }, []);

  return (
    <>
      <h1>Главная страница</h1>
      <Game />
    </>
  );
}
