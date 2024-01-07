import React, { useCallback, useEffect, useState } from 'react';
import { gameAPI } from '../../utils/api/game-api.js';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrLevel, setLevels } from '../../store/slicers/managerSlicer.js';
import { userSelector } from '../../store/selectors/userSelectors.js';
import Manager from '../../components/Manager/Manager.jsx';
import styles from './HomePage.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { setGridData } from '../../store/slicers/gameSlicer.js';
import GameRules from '../../components/GameRules/GameRules.jsx';
import AboutProject from '../../components/AboutProject/AboutProject.jsx';
import GameFilter from '../../components/GameFilter/GameFilter.jsx';


export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { username, isAuth } = useSelector(userSelector);
  const [isMyLevels, setIsMyLevels] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [isRules, setIsRules] = useState(false);
  const [isAboutProject, setIsAboutProject] = useState(false);
  const [currTab, setCurrTab] = useState(null);
  const [get, { data, isSuccess: getIsSuccess,
    error: getError, isLoading: getIsLoading }] =
    gameAPI.useGetMutation();

  useEffect(() => {
    data && dispatch(setLevels(data.levels));
  }, [data]);

  const reset = useCallback(() => {
    setIsMyLevels(false);
    setIsSearch(false);
    setIsRules(false);
    setIsAboutProject(false);
    dispatch(setLevels([]));
    dispatch(setGridData([]));
    dispatch(setCurrLevel({ index: null }));
  }, []);

  const onLiClick = (strNavItem, callback) => {
    reset();
    setCurrTab(strNavItem);
    callback();
  }
  const onMainLevelsClick = () => {
    get({ main: true });
  }
  const onRandomLevelsClick = () => {
    get({ random: true });
  }
  const onMyLevelsClick = () => {
    setIsMyLevels(true);
    isAuth ?
      get({ user: username }) :
      navigate('/login', { state: { from: location } });
  }
  const onSearchClick = () => {
    setIsSearch(true);
  }
  const onRulesClick = () => {
    setIsRules(true);
  }
  const onAboutClick = () => {
    setIsAboutProject(true);
  }

  const navPanelData = [
    ['основные уровни', onMainLevelsClick],
    ['случайные уровни', onRandomLevelsClick],
    ['мои уровни', onMyLevelsClick],
    ['поиск по фильтру', onSearchClick],
    ['правила игры', onRulesClick],
    ['о проекте', onAboutClick]
  ];

  useEffect(() => {
    setCurrTab(navPanelData[0][0]);
    get({ main: true });
  }, [isAuth]);

  useEffect(() => {
    get({ main: true });
    setCurrTab(navPanelData[0][0]);
    return () => {
      dispatch(setLevels([]));
      dispatch(setGridData([]));
      dispatch(setCurrLevel({ index: null }));
    }
  }, []);

  useEffect(() => {
    if (location?.search === '?about') {
      reset();
      setIsAboutProject(true);
      navigate('/');
    }
  }, [location]);

  return (
    <section className={styles.container}>
      <ul className={styles.list}>
        {navPanelData.map((item, index) => (
          <li key={index} onClick={() => onLiClick(item[0], item[1])}
            className={`${[
              styles.listItem,
              getIsLoading && styles.listItemDisabled
            ].filter(Boolean).join(' ')}`}
          >
            {item[0]}
          </li>
        ))}
      </ul>
      <h1 className={styles.title}>
        {currTab && (currTab?.charAt(0).toUpperCase() + currTab?.slice(1))}
      </h1>
      {isSearch && <GameFilter />}
      {!isAboutProject && !isRules && <Manager isMyLevels={isMyLevels} />}
      {isRules && <GameRules />}
      {isAboutProject && <AboutProject />}
    </section>
  );
}
