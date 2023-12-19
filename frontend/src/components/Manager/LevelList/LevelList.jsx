import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { currLevelSelector, levelsSelector } from '../../../store/selectors/managerSelectors';
import styles from './LevelList.module.css';
import { setGridData, setIsCompleted, setLinkedColors } from '../../../store/slicers/gameSlicer';
import { cellPattern } from '../../../utils/constants';
import { setCurrLevel } from '../../../store/slicers/managerSlicer';


export default function LevelList() {
  const dispatch = useDispatch();
  const levels = useSelector(levelsSelector);
  const currLevel = useSelector(currLevelSelector);

  useEffect(() => {
    if (currLevel.index === null) {
      dispatch(setCurrLevel({ index: 0 }));
    }
  }, []);

  useEffect(() => {
    if (levels && levels.length > 0) {
      const index = currLevel.index || 0;
      const size = levels[index].size;
      // tech - технический стороковый массив координат цветных ячеек
      const tech = levels[index].cells.map(item => {
        return item.row + '' + item.col;
      });
      const belongSet = new Set();
      dispatch(setGridData(
        new Array(size).fill(0).map(() => new Array(size).fill(0))
          .map((row, rowIndex) => {
            return row.map((_, colIndex) => {
              const matchIndex = tech.indexOf(rowIndex + '' + colIndex);
              if (matchIndex > -1) {
                const number = levels[index].cells[matchIndex].number;
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

  const onClick = (index) => {
    // TODO заблокировать выбор текущего уровня
    if (true) {
      dispatch(setCurrLevel({
        index: index,
        // id: levels[level].id
      }));
      dispatch(setLinkedColors({}));
      dispatch(setIsCompleted(false));
    }
  }

  return (
    <section className={styles.levelList}>
      {levels && levels.map((_, index) => (
        <div key={index}
          onClick={() => { onClick(index) }}
          className={`
            ${styles.levelItem} ${currLevel.index === index ? styles.active : ''}
          `}
        >
          {index + 1}
        </div>
      ))}
    </section>
  );
}
