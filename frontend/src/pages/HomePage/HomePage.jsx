import React, { useEffect } from 'react';
import { gameAPI } from '../../utils/api/game-api.js';
import { useDispatch } from 'react-redux';
import { setLevels } from '../../store/slicers/managerSlicer.js';
import Manager from '../../components/Manager/Manager.jsx';


export default function HomePage() {
  const dispatch = useDispatch();
  const [get, { data, isSuccess }] = gameAPI.useGetMutation();

  useEffect(() => {
    get({ main: true });
  }, []);

  useEffect(() => {
    data && dispatch(setLevels(data.levels));
  }, [data]);

  // TODO
  // перенести загрузку уровней, всю связанную логику в отдельный компонент

  return (
    <>
      {isSuccess && <Manager />}
    </>
  );
}
