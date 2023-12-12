import React from 'react';
import Game from '../Game/Game';
import styles from './Manager.module.css';
import LevelList from './LevelList/LevelList';


export default function Manager() {

  return (
    <section className={styles.manager}>
      <h1 className={styles.title}>Manager</h1>
      <div className={styles.header}>
        <p className={styles.headerItem}>
          имя автора
        </p>
        <p className={styles.headerItem}>
          лайки
        </p>
      </div>

      <section className={styles.gameContainer}>
        <Game />
      </section>

      <LevelList />
    </section>
  );
}
