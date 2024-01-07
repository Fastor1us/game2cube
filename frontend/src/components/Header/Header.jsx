import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import DropdownList from '../DropdownList/DropdownList';
import svgLogo from '../../images/logo.svg';
import styles from './Header.module.css';


export default function Header() {
  const { link, active } = styles;
  return (
    <header className={styles.header}>
      <nav className={styles.navPanel}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <NavLink to='/create-level' className={
              ({ isActive }) => isActive ? `${link} ${active}` : link
            }>
              Создать<br />уровень
            </NavLink>
          </li>
          <li className={styles.menuLogo}>
            <Link to='/' className={styles.link}>
              <img src={svgLogo} alt="Logo" className={styles.logo} />
            </Link>
          </li>
          <li className={styles.navItem}>
            <DropdownList />
          </li>
        </ul>
      </nav>
    </header >
  );
}
