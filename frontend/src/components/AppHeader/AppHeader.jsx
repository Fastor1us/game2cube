import React from 'react';
import { NavLink } from 'react-router-dom';

import DropdownList from '../DropdownList/DropdownList';
import svgLogo from '../../image/logo.svg';
// import svgLogo from '../../image/puzzle-toy.svg';
import svgAvatar from '../../image/avatar.svg';
import svgArrowDown from '../../image/arrow-down.svg';

import styles from './AppHeader.module.css'


export default function AppHeader() {
  return (
    <header className={styles.header}>
      <nav className={styles.navPanel}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <NavLink to='/create-level' className={styles.link}>
              Создать<br />уровень
            </NavLink>
          </li>
          <li className={styles.menuLogo}>
            <NavLink to='/' className={styles.link}>
              <img src={svgLogo} alt="Logo" className={styles.logo} />
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <DropdownList>
              <img src={svgAvatar} alt="Profile" className={styles.avatar} />
              <img src={svgArrowDown} alt="Profile" className={styles.arrowDown} />
            </DropdownList>
          </li>
        </ul>
      </nav>
    </header >
  );
}
