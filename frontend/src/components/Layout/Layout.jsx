import React from 'react';
import { Outlet } from 'react-router-dom';

import AppHeader from '../AppHeader/AppHeader';
import AppFooter from '../AppFooter/AppFooter';

import styles from './Layout.module.css';


export default function Layout() {
  return (
    <>
      <AppHeader />

      <main className={styles.main}>
        <Outlet />
      </main>

      <AppFooter />
    </>
  );
}
