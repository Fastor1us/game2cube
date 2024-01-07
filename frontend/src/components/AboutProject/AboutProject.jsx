import React from 'react';
import styles from './AboutProject.module.css';


export default function AboutProject() {
  return (
    <section className={styles.container}>
      <p>
        <b>Game2Cube</b> - пет-проект, создатель - Олег Кирюшин.
      </p>
      <p>
        <a
          href="TODO"
          target="_blank"
          rel="noreferrer"
        >
          <b>Портфолио. TODO</b>
        </a>
      </p>
      <p style={{ marginBottom: 0 }}>
        Мои контакты:
      </p>
      <ul className={styles.list}>
        <li>
          <a href="mailto:fewgwer3@ya.ru">
            fewgwer3@ya.ru
          </a>
        </li>
        <li>
          <a
            href="https://vk.com/id16543317"
            target="_blank"
            rel="noreferrer"
          >
            вконтакте
          </a>
        </li>
      </ul>
      <p>
        {`Больше проектов: `}
        <a
          href="https://github.com/Fastor1us"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </p>
    </section>
  );
}
