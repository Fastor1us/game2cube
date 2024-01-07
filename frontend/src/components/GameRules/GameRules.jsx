import React from 'react';
import styles from './GameRules.module.css';
import gifShortestPath from '../../images/game-rules/shortest-path.gif';
import gifStepBack from '../../images/game-rules/step-back.gif';
import gifStepThru from '../../images/game-rules/step-thru.gif';


export default function GameRules() {
  return (
    <section className={styles.container}>
      <p>
        <b>Game2Cube</b> - логическая игра, цель которой заполнить каждую клетку поля соединив все пары одинаковых цифр цветной цепочкой.
      </p>
      <img src={gifShortestPath} alt='гифка поиск наикратчайшего пути' className={styles.gif} />
      <p>
        Цепочки не могут идти по диагонали и не могут пересекаться.
      </p>
      <img src={gifStepBack} alt='гифка шаг назад' className={styles.gif} />
      <p>
        При построении цепи, происходит подсчёт кратчайшего пути между стартовой и текущей позицией, лишние шаги очищаются.
      </p>
      <img src={gifStepThru} alt='гифка шаг через' className={styles.gif} />
      <p>
        Цепочка не может идти назад сама поверх себя, если так происходит, предыдущие шаги очищаются.
      </p>
    </section>
  );
}
