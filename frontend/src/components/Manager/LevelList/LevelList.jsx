import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { levelsSelector } from '../../../store/selectors/gameSelectors';
import styles from './LevelList.module.css';
import { setGridData, setIsCompleted, setLinkedColors } from '../../../store/slicers/gameSlicer';
import { cellPattern } from '../../../utils/constants';


export default function LevelList() {
  const dispatch = useDispatch();
  const levels = useSelector(levelsSelector);
  const [currLevel, setCurrLevel] = React.useState(0);

  useEffect(() => {
    if (levels && levels.length > 0) {
      const size = levels[currLevel].size;
      // tech - технический стороковый массив координат цветных ячеек
      const tech = levels[currLevel].cells.map(item => {
        return item.row + '' + item.col;
      });
      const belongSet = new Set();
      dispatch(setGridData(
        new Array(size).fill(0).map(() => new Array(size).fill(0))
          .map((row, rowIndex) => {
            return row.map((_, colIndex) => {
              const matchIndex = tech.indexOf(rowIndex + '' + colIndex);
              if (matchIndex > -1) {
                const number = levels[currLevel].cells[matchIndex].number;
                let belong = 1;
                if (belongSet.has(number)) {
                  belong = 2;
                } else {
                  belongSet.add(number);
                }
                return {
                  ...cellPattern,
                  color: number,
                  sequenceNumber: 1,
                  belong
                }
              }
              return cellPattern;
            })
          })
      ));
    }
  }, [levels, currLevel]);

  const onClick = (level) => {
    // TODO заблокировать выбор текущего уровня
    if (true) {
      setCurrLevel(level);
      dispatch(setLinkedColors({}));
      dispatch(setIsCompleted(false));
    }
  }

  return (
    <section className={styles.levelList}>
      {levels && levels.map((level, index) => (
        <div key={index} onClick={() => { onClick(index) }} className={styles.levelItem}>
          {index + 1}
        </div>
      ))}
    </section>
  );
}
