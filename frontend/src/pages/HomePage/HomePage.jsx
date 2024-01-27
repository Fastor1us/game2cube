import React, { useCallback, useEffect, useState } from 'react';
import { gameAPI } from '../../utils/api/game-api.js';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrLevelIndex, setLevels } from '../../store/slicers/managerSlicer.js';
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
  const [isRandomLevels, setIsRandomLevels] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [isRules, setIsRules] = useState(false);
  const [isAboutProject, setIsAboutProject] = useState(false);
  const [currTitleTab, setCurrTitleTab] = useState(null);
  const [get, { data, isSuccess: getIsSuccess,
    error: getError, isLoading: getIsLoading }] =
    gameAPI.useGetMutation();

  useEffect(() => {
    data && dispatch(setLevels(data.levels));
  }, [data]);

  const reset = useCallback(() => {
    setIsMyLevels(false);
    setIsRandomLevels(false);
    setIsSearch(false);
    setIsRules(false);
    setIsAboutProject(false);
    dispatch(setLevels([]));
    dispatch(setCurrLevelIndex(0));
  }, []);

  const onNavPanelClick = (strNavItem, callback) => {
    if (strNavItem !== currTitleTab) {
      reset();
      setCurrTitleTab(strNavItem);
      callback();
    }
  }
  const onMainLevelsClick = () => {
    get({ main: true });
  }
  const onRandomLevelsClick = () => {
    setIsRandomLevels(true);
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
    ['уровни от админа', onMainLevelsClick],
    ['10 случайных уровней', onRandomLevelsClick],
    ['мои уровни', onMyLevelsClick],
    ['поиск по фильтру', onSearchClick],
    ['правила игры', onRulesClick],
    ['о проекте', onAboutClick]
  ];

  useEffect(() => {
    setCurrTitleTab(navPanelData[0][0]);
    get({ main: true });
  }, [isAuth]);

  useEffect(() => {
    get({ main: true });
    setCurrTitleTab(navPanelData[0][0]);
    return () => {
      dispatch(setLevels([]));
      dispatch(setGridData([]));
      dispatch(setCurrLevelIndex(null));
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
          <li
            key={index}
            onClick={() => onNavPanelClick(item[0], item[1])}
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
        {currTitleTab &&
          (currTitleTab?.charAt(0).toUpperCase() + currTitleTab?.slice(1))
        }
      </h1>
      {isSearch && <GameFilter />}
      {!isAboutProject && !isRules &&
        <Manager
          isLoading={getIsLoading}
          error={getError}
          isMyLevels={isMyLevels}
          isRandomLevels={isRandomLevels}
          getRandomLevels={onRandomLevelsClick}
        />
      }
      {isRules && <GameRules />}
      {isAboutProject && <AboutProject />}
    </section>
  );
}
