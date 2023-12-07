import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styles from './DropdownList.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { resetUserData } from '../../store/slicers/userSlicer';
import { isAuthSelector } from '../../store/selectors/userSelectors';
import svgAvatar from '../../image/avatar.svg';
import svgAvatarActive from '../../image/avatar-active.svg';
import svgArrowDown from '../../image/arrow-down.svg';
import svgArrowDownActive from '../../image/arrow-down-active.svg';


export default function DropdownList() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [shouldShowDropdownList, setShouldShowDropdownList] = useState(false);

  const isAuth = useSelector(isAuthSelector);

  const handleClick = () => {
    setShouldShowDropdownList(!shouldShowDropdownList);
  }

  const logout = () => {
    localStorage.removeItem('token');
    dispatch(resetUserData());
  }

  const login = () => {
    navigate('/login', { state: { from: location } });
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest(`.${styles.dropdownList}`) === null) {
        setShouldShowDropdownList(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.keyCode === 27) {
        setShouldShowDropdownList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  return (
    <section onClick={handleClick} className={styles.dropdownList}>
      <img src={
        shouldShowDropdownList ? svgAvatarActive : svgAvatar
      } alt="Profile" className={styles.avatar} />
      <img src={
        shouldShowDropdownList ? svgArrowDownActive : svgArrowDown
      } alt="Profile" className={styles.arrowDown} />
      {shouldShowDropdownList && (
        // <ul style={{ position: 'absolute', top: '100%', right: 0 }}>
        <ul className={styles.navList}>
          <NavLink to='/profile' className={styles.link}>
            <li className={styles.navItem}>
              1
            </li>
          </NavLink>
          <NavLink to='/profile' className={styles.link}>
            <li className={styles.navItem}>
              2
            </li>
          </NavLink>
          <li className={styles.navItem}
            onClick={isAuth ? logout : login}
          >
            {isAuth ? 'Выйти' : 'Войти'}
          </li>
        </ul>
      )}
    </section>
  );
}



