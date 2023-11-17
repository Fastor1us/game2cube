import React from 'react';
import { Outlet } from 'react-router-dom';

import styles from './layout.module.css';


export default function Layout() {
  return (
    <>
      <header>
        тут будет шапка
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer>
        тут будет футер
      </footer>
    </>
  );
}
