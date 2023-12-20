import React from 'react';

import styles from './GridSizeController.module.css';


export default function GridSizeController({
  gridSize, setGridSize, disabled
}) {
  const onButtonClick = (e) => {
    e.target.name === 'increment' ?
      (gridSize + 1 < 8 && setGridSize(gridSize + 1)) :
      (gridSize - 1 > 3 && setGridSize(gridSize - 1));
  }

  const onInputChange = (e) => {
    (e.target.value > 3 && e.target.value < 8) ?
      setGridSize(Number(e.target.value)) : setGridSize(gridSize);
  }

  return (
    <section className={styles.container}>
      <button type='button'
        className={`${styles.button} ${styles.buttonDecrement}`}
        name='decrement' onClick={onButtonClick}
        disabled={gridSize === 4 || disabled}
      >
        -
      </button>
      <input type='number' value={gridSize}
        name='field-size' className={styles.input}
        onChange={onInputChange} />
      <button type='button'
        className={`${styles.button} ${styles.buttonIncrement}`}
        name='increment' onClick={onButtonClick}
        disabled={gridSize === 7 || disabled}
      >
        +
      </button>
    </section>
  );
}
