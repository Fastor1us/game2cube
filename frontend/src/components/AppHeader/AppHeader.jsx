import React from 'react';
import { NavLink } from 'react-router-dom';

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
              LOGO
            </NavLink>
          </li>
          <li className={styles.navItem}>
            <NavLink to='/profile' className={styles.link}>
              Профиль
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
