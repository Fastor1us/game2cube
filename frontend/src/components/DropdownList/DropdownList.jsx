import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './DropdownList.module.css';


export default function DropdownList(prop) {
  const [shouldShowDropdownList, setShouldShowDropdownList] = React.useState(false);

  const handleClick = () => {
    setShouldShowDropdownList(!shouldShowDropdownList);
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
          <NavLink to='/profile' className={styles.link}>
            <li className={styles.navItem}>
              3
            </li>
          </NavLink>
        </ul>
      )}
    </section>
  );
}



