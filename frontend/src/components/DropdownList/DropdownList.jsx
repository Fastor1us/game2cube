import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './DropdownList.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { resetUserData } from '../../store/slicers/userSlicer';


export default function DropdownList(prop) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [shouldShowDropdownList, setShouldShowDropdownList] = useState(false);

  const isAuth = useSelector(state => state.user.auth);

  const handleClick = () => {
    setShouldShowDropdownList(!shouldShowDropdownList);
  }

  const logout = () => {
    localStorage.removeItem('token');
    dispatch(resetUserData());
    navigate('/');
  }

  const login = () => {
    navigate('/login');
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
      {prop.children}
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



